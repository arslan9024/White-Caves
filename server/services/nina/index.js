import GoogleSheetsService from './GoogleSheetsService.js';
import PhoneNumberService from './PhoneNumberService.js';
import ProjectService from './ProjectService.js';
import BroadcastManager from './BroadcastManager.js';
import RateLimiter from './RateLimiter.js';
import MessageRouter from './MessageRouter.js';
import CampaignService from './CampaignService.js';
import MessageTemplates from './MessageTemplates.js';

import AIServices, {
  intentClassifier,
  leadScorer,
  sentimentAnalyzer,
  languageDetector,
  responseGenerator
} from './AIServices.js';

import SecurityServices, {
  encryptedStorage,
  auditLogger,
  accessControl,
  sessionManager
} from './SecurityServices.js';

import SchedulingServices, {
  countryMapper,
  localTimeScheduler,
  strictScheduleManager,
  behavioralSimulator,
  optOutDetector
} from './SchedulingServices.js';

export {
  GoogleSheetsService,
  PhoneNumberService,
  ProjectService,
  BroadcastManager,
  RateLimiter,
  MessageRouter,
  CampaignService,
  MessageTemplates,
  AIServices,
  intentClassifier,
  leadScorer,
  sentimentAnalyzer,
  languageDetector,
  responseGenerator,
  SecurityServices,
  encryptedStorage,
  auditLogger,
  accessControl,
  sessionManager,
  SchedulingServices,
  countryMapper,
  localTimeScheduler,
  strictScheduleManager,
  behavioralSimulator,
  optOutDetector
};

export default {
  GoogleSheetsService,
  PhoneNumberService,
  ProjectService,
  BroadcastManager,
  RateLimiter,
  MessageRouter,
  CampaignService,
  MessageTemplates,
  AI: AIServices,
  Security: SecurityServices,
  Scheduling: SchedulingServices
};
