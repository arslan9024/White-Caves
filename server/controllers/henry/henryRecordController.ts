import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { AuthRequest } from '../../middleware/auth.js';
import { HENRY_UPLOADS_PATH } from '../../config/env.js';
import {
  VALID_DEPARTMENTS,
  VALID_HENRY_STATUSES,
  getHenryRecordModel,
} from './henryCommon.js';

export const getHealth = (_req: Request, res: Response) => {
  res.json({ success: true, service: 'henry', timestamp: new Date() });
};

export const getRecords = async (req: Request, res: Response) => {
  try {
    const henryRecordModel = getHenryRecordModel();
    const page = parseInt(String(req.query.page ?? '1'), 10);
    const pageSize = Math.min(parseInt(String(req.query.pageSize ?? '50'), 10), 100);
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};
    const templateKey = req.query.templateKey ? String(req.query.templateKey) : undefined;
    const departmentTag = req.query.departmentTag ? String(req.query.departmentTag) : undefined;
    const ownerUserId = req.query.ownerUserId ? String(req.query.ownerUserId) : undefined;
    const ownerUserEmail = req.query.ownerUserEmail ? String(req.query.ownerUserEmail) : undefined;
    const status = req.query.status ? String(req.query.status) : undefined;
    const signedFrom = req.query.signedFrom ? String(req.query.signedFrom) : undefined;
    const signedTo = req.query.signedTo ? String(req.query.signedTo) : undefined;

    if (templateKey) where.templateKey = templateKey;
    if (departmentTag) where.departmentTag = departmentTag;
    if (ownerUserId) where.ownerUserId = ownerUserId;
    if (ownerUserEmail) where.ownerUserEmail = ownerUserEmail;
    if (status) where.status = status;
    if (signedFrom || signedTo) {
      where.signedAt = {
        ...(signedFrom ? { gte: new Date(signedFrom) } : {}),
        ...(signedTo ? { lte: new Date(signedTo) } : {}),
      };
    }

    const [records, total] = await Promise.all([
      henryRecordModel.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
        select: {
          id: true,
          templateKey: true,
          templateLabel: true,
          fileName: true,
          recordPath: true,
          departmentTag: true,
          ownerUserId: true,
          ownerUserEmail: true,
          unit: true,
          community: true,
          tenantName: true,
          isDraft: true,
          status: true,
          signedAt: true,
          archivedAt: true,
          copyNumber: true,
          createdAt: true,
          createdBy: true,
        },
      }),
      henryRecordModel.count(),
    ]);

    res.json({ success: true, data: { records, total, page, pageSize } });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

export const createRecord = async (req: AuthRequest, res: Response) => {
  try {
    const henryRecordModel = getHenryRecordModel();
    const {
      templateKey,
      templateLabel,
      fileName,
      recordPath,
      unit,
      community,
      tenantName,
      departmentTag,
      ownerUserId,
      ownerUserEmail,
      status,
      signedAt,
      archivedAt,
      isDraft,
      copyNumber,
    } = req.body;

    if (!templateKey || !fileName) {
      return res.status(400).json({ success: false, error: 'templateKey and fileName are required' });
    }

    if (departmentTag && !VALID_DEPARTMENTS.includes(departmentTag)) {
      return res.status(400).json({
        success: false,
        error: `departmentTag must be one of: ${VALID_DEPARTMENTS.join(', ')}`,
      });
    }

    if (status && !VALID_HENRY_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `status must be one of: ${VALID_HENRY_STATUSES.join(', ')}`,
      });
    }

    const record = await henryRecordModel.create({
      data: {
        templateKey,
        templateLabel: templateLabel ?? templateKey,
        fileName,
        recordPath: recordPath ?? null,
        unit: unit ?? null,
        community: community ?? null,
        tenantName: tenantName ?? null,
        departmentTag: departmentTag ?? null,
        ownerUserId: ownerUserId ?? req.user?.id ?? null,
        ownerUserEmail: ownerUserEmail ?? req.user?.email ?? null,
        status: status ?? 'draft',
        signedAt: signedAt ? new Date(signedAt) : null,
        archivedAt: archivedAt ? new Date(archivedAt) : null,
        isDraft: typeof isDraft === 'boolean' ? isDraft : true,
        copyNumber: typeof copyNumber === 'number' ? copyNumber : 1,
        createdBy: req.user?.id ?? null,
      },
    });

    res.status(201).json({ success: true, data: record });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

export const deleteRecord = async (req: AuthRequest, res: Response) => {
  try {
    const henryRecordModel = getHenryRecordModel();
    const { id } = req.params as Record<string, string>;
    const record = await henryRecordModel.findUnique({ where: { id } });
    if (!record) return res.status(404).json({ success: false, error: 'Record not found' });

    // Clean up the stored file if it exists
    if (record.recordPath) {
      const filePath = path.resolve(HENRY_UPLOADS_PATH, record.recordPath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await henryRecordModel.delete({ where: { id } });
    res.json({ success: true, message: 'Record deleted' });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

export const uploadRecordFile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No PDF file uploaded' });
    }

    // Organise into year/month/property subdirectory
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const community = (req.body.community ?? 'general').replace(/[^\w-]/g, '_');
    const departmentTag = String(req.body.departmentTag ?? 'general').replace(/[^\w-]/g, '_');
    const ownerUserId = String(req.body.ownerUserId ?? req.user?.id ?? 'unassigned').replace(
      /[^\w-]/g,
      '_'
    );

    const subDir = path.join(year, month, departmentTag, ownerUserId, community);
    const destDir = path.resolve(HENRY_UPLOADS_PATH, subDir);
    fs.mkdirSync(destDir, { recursive: true });

    // Move uploaded file from default location to organised sub-dir
    const destPath = path.join(destDir, req.file.filename);
    fs.renameSync(req.file.path, destPath);

    const relativePath = path.join(subDir, req.file.filename);

    res.status(201).json({
      success: true,
      data: {
        fileName: req.file.originalname,
        storedAs: req.file.filename,
        relativePath,
        size: req.file.size,
        mimeType: req.file.mimetype,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

export const signRecord = async (req: AuthRequest, res: Response) => {
  try {
    const henryRecordModel = getHenryRecordModel();
    const { id } = req.params as Record<string, string>;
    const record = await henryRecordModel.findUnique({ where: { id } });
    if (!record) return res.status(404).json({ success: false, error: 'Record not found' });

    const signedAt = req.body.signedAt ? new Date(String(req.body.signedAt)) : new Date();
    if (Number.isNaN(signedAt.getTime())) {
      return res.status(400).json({ success: false, error: 'signedAt must be a valid date' });
    }

    const updated = await henryRecordModel.update({
      where: { id },
      data: {
        isDraft: false,
        status: 'signed',
        signedAt,
        ownerUserId: req.body.ownerUserId ?? record.ownerUserId ?? req.user?.id ?? null,
        ownerUserEmail: req.body.ownerUserEmail ?? record.ownerUserEmail ?? req.user?.email ?? null,
      },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

export const serveRecordFile = (req: Request, res: Response) => {
  try {
    const relPath = req.query.path as string;
    if (!relPath) {
      return res.status(400).json({ success: false, error: 'path query parameter is required' });
    }

    // Sanitise path to prevent directory traversal
    const normalised = path.normalize(relPath).replace(/^(\.\.(\/|\\|$))+/, '');
    const filePath = path.resolve(HENRY_UPLOADS_PATH, normalised);

    // Ensure path stays within uploads directory
    if (!filePath.startsWith(path.resolve(HENRY_UPLOADS_PATH))) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${path.basename(filePath)}"`);
    res.sendFile(filePath);
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
};
