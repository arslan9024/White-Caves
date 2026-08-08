import { readFile } from 'fs/promises';
import path from 'path';
import { prisma } from '../../database.js';
import logger from '../../utils/logger.js';

const db = prisma as any;

const DEFAULT_REGISTRY_PATH = path.resolve(
	process.cwd(),
	'docs',
	'company_documents',
	'normalized',
	'company_documents_registry.json'
);

const EXPIRY_WARNING_DAYS = 60;

type DocumentStatus = 'active' | 'expiring_soon' | 'expired' | 'reference_stored' | 'archived';

interface RegistryDocumentRecord {
	id: string;
	title: string;
	authority: string;
	referenceNumber?: string;
	licenseNo?: string;
	establishmentNo?: string;
	registrationDate?: string;
	issueDate?: string;
	expiryDate?: string;
	startDate?: string;
	endDate?: string;
	status?: string;
	parsedTextFile?: string;
	pdfFile?: string;
}

interface RegistryPayload {
	documents: RegistryDocumentRecord[];
}

export interface CorporateDocumentFilters {
	status?: string;
	authority?: string;
	search?: string;
	limit?: number;
}

export interface CorporateDocumentCreateInput {
	title: string;
	authority: string;
	referenceNumber?: string;
	licenseNumber?: string;
	establishmentNumber?: string;
	issueDate?: string;
	expiryDate?: string;
	registrationDate?: string;
	startDate?: string;
	endDate?: string;
	parsedTextFile?: string;
	pdfFile?: string;
	metadata?: Record<string, unknown>;
}

export interface CorporateDocumentUpdateInput {
	title?: string;
	authority?: string;
	referenceNumber?: string;
	licenseNumber?: string;
	establishmentNumber?: string;
	issueDate?: string | null;
	expiryDate?: string | null;
	registrationDate?: string | null;
	startDate?: string | null;
	endDate?: string | null;
	parsedTextFile?: string | null;
	pdfFile?: string | null;
	status?: DocumentStatus;
	metadata?: Record<string, unknown>;
}

function parseDateOrNull(value?: string | null): Date | null {
	if (!value) return null;
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) {
		throw new Error(`Invalid date: ${value}`);
	}
	return parsed;
}

function deriveStatus(expiryDate: Date | null): DocumentStatus {
	if (!expiryDate) return 'active';
	const now = new Date();
	const msDiff = expiryDate.getTime() - now.getTime();
	const daysDiff = Math.ceil(msDiff / (1000 * 60 * 60 * 24));

	if (daysDiff < 0) return 'expired';
	if (daysDiff <= EXPIRY_WARNING_DAYS) return 'expiring_soon';
	return 'active';
}

function coerceStatus(rawStatus: string | undefined, expiryDate: Date | null): DocumentStatus {
	if (!rawStatus) {
		return deriveStatus(expiryDate);
	}

	const normalized = rawStatus.toLowerCase().replace(/\s+/g, '_');
	if (
		normalized === 'active' ||
		normalized === 'expiring_soon' ||
		normalized === 'expired' ||
		normalized === 'archived'
	) {
		return normalized;
	}

	if (normalized === 'reference-stored' || normalized === 'reference_stored') {
		return 'reference_stored';
	}

	return deriveStatus(expiryDate);
}

async function createDocumentAlertIfNeeded(documentId: string, status: DocumentStatus): Promise<void> {
	if (status !== 'expiring_soon' && status !== 'expired') {
		return;
	}

	const alertType = status === 'expired' ? 'expiry_expired' : 'expiry_warning';
	const existingOpen = await db.corporateDocumentAlert.findFirst({
		where: { documentId, alertType, status: 'open' },
	});

	if (existingOpen) {
		return;
	}

	await db.corporateDocumentAlert.create({
		data: {
			documentId,
			alertType,
			status: 'open',
			message:
				status === 'expired'
					? 'Corporate document has expired and requires immediate renewal.'
					: `Corporate document will expire within ${EXPIRY_WARNING_DAYS} days.`,
		},
	});
}

export async function listCorporateDocuments(filters: CorporateDocumentFilters = {}) {
	const where: Record<string, unknown> = {};
	if (filters.status && filters.status !== 'all') {
		where.status = filters.status;
	}

	if (filters.authority) {
		where.authority = { contains: filters.authority, mode: 'insensitive' };
	}

	if (filters.search) {
		where.OR = [
			{ title: { contains: filters.search, mode: 'insensitive' } },
			{ referenceNumber: { contains: filters.search, mode: 'insensitive' } },
			{ registryDocumentId: { contains: filters.search, mode: 'insensitive' } },
			{ licenseNumber: { contains: filters.search, mode: 'insensitive' } },
		];
	}

	const limit = Math.max(1, Math.min(500, Number(filters.limit) || 100));

	return db.corporateDocument.findMany({
		where,
		orderBy: [{ status: 'asc' }, { expiryDate: 'asc' }, { updatedAt: 'desc' }],
		take: limit,
	});
}

export async function getCorporateDocumentById(id: string) {
	return db.corporateDocument.findUnique({
		where: { id },
		include: {
			alerts: {
				where: { status: { in: ['open', 'acknowledged'] } },
				orderBy: { createdAt: 'desc' },
				take: 20,
			},
		},
	});
}

export async function createCorporateDocument(input: CorporateDocumentCreateInput, actorUserId?: string) {
	const expiryDate = parseDateOrNull(input.expiryDate);
	const status = deriveStatus(expiryDate);

	const created = await db.corporateDocument.create({
		data: {
			title: input.title,
			authority: input.authority,
			referenceNumber: input.referenceNumber || null,
			licenseNumber: input.licenseNumber || null,
			establishmentNumber: input.establishmentNumber || null,
			issueDate: parseDateOrNull(input.issueDate),
			expiryDate,
			registrationDate: parseDateOrNull(input.registrationDate),
			startDate: parseDateOrNull(input.startDate),
			endDate: parseDateOrNull(input.endDate),
			parsedTextFile: input.parsedTextFile || null,
			pdfFile: input.pdfFile || null,
			metadata: input.metadata || {},
			status,
		},
	});

	await createDocumentAlertIfNeeded(created.id, status);

	await db.corporateDocumentAuditLog.create({
		data: {
			documentId: created.id,
			action: 'created',
			message: `Corporate document created: ${created.title}`,
			actorUserId: actorUserId || null,
			metadata: { source: 'manual' },
		},
	});

	return created;
}

export async function updateCorporateDocument(
	id: string,
	input: CorporateDocumentUpdateInput,
	actorUserId?: string
) {
	const existing = await db.corporateDocument.findUnique({ where: { id } });
	if (!existing) {
		throw new Error('Corporate document not found');
	}

	const expiryDate =
		input.expiryDate === undefined ? existing.expiryDate : parseDateOrNull(input.expiryDate);
	const derivedStatus = deriveStatus(expiryDate);
	const finalStatus = input.status || derivedStatus;

	const updated = await db.corporateDocument.update({
		where: { id },
		data: {
			title: input.title ?? existing.title,
			authority: input.authority ?? existing.authority,
			referenceNumber: input.referenceNumber ?? existing.referenceNumber,
			licenseNumber: input.licenseNumber ?? existing.licenseNumber,
			establishmentNumber: input.establishmentNumber ?? existing.establishmentNumber,
			issueDate:
				input.issueDate === undefined ? existing.issueDate : parseDateOrNull(input.issueDate),
			expiryDate,
			registrationDate:
				input.registrationDate === undefined
					? existing.registrationDate
					: parseDateOrNull(input.registrationDate),
			startDate:
				input.startDate === undefined ? existing.startDate : parseDateOrNull(input.startDate),
			endDate: input.endDate === undefined ? existing.endDate : parseDateOrNull(input.endDate),
			parsedTextFile: input.parsedTextFile ?? existing.parsedTextFile,
			pdfFile: input.pdfFile ?? existing.pdfFile,
			metadata: input.metadata ?? existing.metadata,
			status: finalStatus,
		},
	});

	await createDocumentAlertIfNeeded(updated.id, finalStatus);

	await db.corporateDocumentAuditLog.create({
		data: {
			documentId: updated.id,
			action: 'updated',
			message: `Corporate document updated: ${updated.title}`,
			actorUserId: actorUserId || null,
			metadata: {
				source: 'manual',
			},
		},
	});

	return updated;
}

export async function archiveCorporateDocument(id: string, actorUserId?: string) {
	const existing = await db.corporateDocument.findUnique({ where: { id } });
	if (!existing) {
		throw new Error('Corporate document not found');
	}

	if (existing.status === 'archived') {
		return existing;
	}

	const archived = await db.corporateDocument.update({
		where: { id },
		data: {
			status: 'archived',
		},
	});

	await db.corporateDocumentAuditLog.create({
		data: {
			documentId: archived.id,
			action: 'archived',
			message: `Corporate document archived: ${archived.title}`,
			actorUserId: actorUserId || null,
			metadata: {
				previousStatus: existing.status,
				nextStatus: 'archived',
				source: 'manual',
			},
		},
	});

	return archived;
}

export async function listCorporateDocumentAlerts(limit = 100) {
	const safeLimit = Math.max(1, Math.min(500, Number(limit) || 100));

	return db.corporateDocumentAlert.findMany({
		where: { status: { in: ['open', 'acknowledged'] } },
		orderBy: [{ status: 'asc' }, { dueDate: 'asc' }, { createdAt: 'desc' }],
		take: safeLimit,
		include: {
			document: {
				select: {
					id: true,
					title: true,
					authority: true,
					expiryDate: true,
					status: true,
					referenceNumber: true,
				},
			},
		},
	});
}

export async function acknowledgeCorporateDocumentAlert(alertId: string, actorUserId?: string) {
	const alert = await db.corporateDocumentAlert.findUnique({ where: { id: alertId } });
	if (!alert) {
		throw new Error('Corporate document alert not found');
	}

	const updated = await db.corporateDocumentAlert.update({
		where: { id: alertId },
		data: {
			status: 'acknowledged',
			acknowledgedById: actorUserId || null,
			acknowledgedAt: new Date(),
		},
	});

	await db.corporateDocumentAuditLog.create({
		data: {
			documentId: alert.documentId,
			action: 'alert_acknowledged',
			message: `Corporate document alert acknowledged (${alert.alertType})`,
			actorUserId: actorUserId || null,
			metadata: { alertId },
		},
	});

	return updated;
}

export async function importCorporateDocumentsFromRegistry(options?: {
	filePath?: string;
	actorUserId?: string;
}) {
	const resolvedPath = options?.filePath
		? path.resolve(process.cwd(), options.filePath)
		: DEFAULT_REGISTRY_PATH;

	const raw = await readFile(resolvedPath, 'utf8');
	const parsed = JSON.parse(raw) as RegistryPayload;

	const records = Array.isArray(parsed.documents) ? parsed.documents : [];
	let created = 0;
	let updated = 0;

	for (const row of records) {
		const expiryDate = parseDateOrNull(row.expiryDate);
		const status = coerceStatus(row.status, expiryDate);

		const payload = {
			title: row.title,
			authority: row.authority,
			referenceNumber: row.referenceNumber || null,
			licenseNumber: row.licenseNo || null,
			establishmentNumber: row.establishmentNo || null,
			issueDate: parseDateOrNull(row.issueDate),
			expiryDate,
			registrationDate: parseDateOrNull(row.registrationDate),
			startDate: parseDateOrNull(row.startDate),
			endDate: parseDateOrNull(row.endDate),
			parsedTextFile: row.parsedTextFile || null,
			pdfFile: row.pdfFile || null,
			sourcePath: resolvedPath,
			lastImportedAt: new Date(),
			status,
			metadata: {
				registryId: row.id,
			},
		};

		const existing = await db.corporateDocument.findFirst({
			where: { registryDocumentId: row.id },
		});

		let saved;
		if (existing) {
			updated += 1;
			saved = await db.corporateDocument.update({
				where: { id: existing.id },
				data: payload,
			});
		} else {
			created += 1;
			saved = await db.corporateDocument.create({
				data: {
					...payload,
					registryDocumentId: row.id,
				},
			});
		}

		await createDocumentAlertIfNeeded(saved.id, status);
	}

	await db.corporateDocumentAuditLog.create({
		data: {
			action: 'imported',
			message: `Imported corporate documents from registry (${records.length} records)` ,
			actorUserId: options?.actorUserId || null,
			metadata: {
				filePath: resolvedPath,
				total: records.length,
				created,
				updated,
			},
		},
	});

	logger.info('Corporate document registry import completed', {
		filePath: resolvedPath,
		total: records.length,
		created,
		updated,
	});

	return {
		filePath: resolvedPath,
		total: records.length,
		created,
		updated,
	};
}
