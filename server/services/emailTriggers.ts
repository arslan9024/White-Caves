import { readFile } from 'fs/promises';
import path from 'path';
import Handlebars from 'handlebars';
import { sendEmailTracked, wrapInBrandedTemplate } from './emailService.js';
import logger from '../utils/logger.js';

export type EmailTriggerEvent =
  | 'welcome'
  | 'lead_assigned'
  | 'viewing_confirmed'
  | 'payment_reminder'
  | 'offer_submitted'
  | 'contract_ready'
  | 'kyc_required';

export interface TriggerEmailInput {
  event: EmailTriggerEvent;
  to: string | string[];
  variables: Record<string, string | number | boolean | null | undefined>;
}

interface TriggerConfig {
  templateFile: string;
  subjectTemplate: string;
}

const EVENT_TRIGGER_REGISTRY: Record<EmailTriggerEvent, TriggerConfig> = {
  welcome: {
    templateFile: 'welcome.hbs',
    subjectTemplate: 'Welcome to White Caves, {{name}}!',
  },
  lead_assigned: {
    templateFile: 'lead-assigned.hbs',
    subjectTemplate: 'New Lead Assigned: {{leadName}}',
  },
  viewing_confirmed: {
    templateFile: 'viewing-confirmed.hbs',
    subjectTemplate: 'Viewing Confirmed: {{propertyTitle}}',
  },
  payment_reminder: {
    templateFile: 'payment-reminder.hbs',
    subjectTemplate: 'Payment Reminder: {{amount}} due {{dueDate}}',
  },
  offer_submitted: {
    templateFile: 'offer-submitted.hbs',
    subjectTemplate: 'Offer Submitted: {{propertyTitle}}',
  },
  contract_ready: {
    templateFile: 'contract-ready.hbs',
    subjectTemplate: 'Contract Ready: {{contractRef}}',
  },
  kyc_required: {
    templateFile: 'kyc-required.hbs',
    subjectTemplate: 'KYC Required for {{referenceType}}',
  },
};

const templateCache = new Map<string, Handlebars.TemplateDelegate>();
const templateBaseDir = path.resolve(process.cwd(), 'server', 'templates', 'email');

async function getCompiledTemplate(filename: string): Promise<Handlebars.TemplateDelegate> {
  const cached = templateCache.get(filename);
  if (cached) return cached;

  const templatePath = path.join(templateBaseDir, filename);
  const raw = await readFile(templatePath, 'utf8');
  const compiled = Handlebars.compile(raw);
  templateCache.set(filename, compiled);
  return compiled;
}

export async function sendTriggeredEmail(input: TriggerEmailInput) {
  const config = EVENT_TRIGGER_REGISTRY[input.event];
  if (!config) {
    throw new Error(`Unsupported email trigger event: ${input.event}`);
  }

  const [bodyTemplate, subjectTemplate] = await Promise.all([
    getCompiledTemplate(config.templateFile),
    Promise.resolve(Handlebars.compile(config.subjectTemplate)),
  ]);

  const htmlBody = bodyTemplate(input.variables);
  const subject = subjectTemplate(input.variables);

  const result = await sendEmailTracked({
    to: input.to,
    subject,
    html: wrapInBrandedTemplate(String(htmlBody)),
    text: String(htmlBody).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
    tags: [{ name: 'trigger_event', value: input.event }],
  });

  logger.info('[emailTriggers] trigger processed', {
    event: input.event,
    success: result.success,
    messageId: result.messageId,
    devMode: result.devMode,
  });

  return result;
}

export function getEmailTriggerRegistry() {
  return { ...EVENT_TRIGGER_REGISTRY };
}

