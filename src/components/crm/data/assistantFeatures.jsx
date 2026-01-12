import React from 'react';
import { 
  Bot, MessageSquare, Code, Terminal, Smartphone, Wifi, Zap,
  Users, Briefcase, Calendar, Award, FileText, UserPlus,
  MessageCircle, Phone, Star, Tag, Filter, Archive,
  Building2, MapPin, DollarSign, TrendingUp, CheckCircle,
  Search, Clock, Send, Shield, Database, Globe, Settings, Eye, AlertCircle,
  Brain, Lock, Key, Fingerprint, Timer, Languages, Map, UserX, Shuffle
} from 'lucide-react';

export const NINA_FEATURES = [
  {
    name: 'Multi-Bot Session Manager',
    category: 'Bot Management',
    status: 'active',
    description: 'Manage multiple WhatsApp bot sessions (Lion0, Lion1, Lion2) with real-time status monitoring, QR code scanning for new connections, and session persistence.',
    sourceFiles: ['NinaWhatsAppBotCRM.jsx', 'SessionManager.js'],
    capabilities: ['Connect/disconnect bots', 'QR code generation', 'Session persistence', 'Multi-device support'],
    icon: <Smartphone size={18} />
  },
  {
    name: 'Web Terminal Interface',
    category: 'Development Tools',
    status: 'active',
    description: 'Built-in terminal for executing commands, viewing real-time logs, and debugging bot behavior with color-coded output.',
    sourceFiles: ['NinaWhatsAppBotCRM.jsx'],
    capabilities: ['Command execution', 'Real-time logs', 'Log export', 'Color-coded output'],
    icon: <Terminal size={18} />
  },
  {
    name: 'Code Module Explorer',
    category: 'Development Tools',
    status: 'active',
    description: 'File explorer and code viewer for WhatsApp bot modules including client creation, message handlers, and configuration files.',
    sourceFiles: ['CreatingNewWhatsAppClient.js', 'WhatsAppClientFunctions.js', 'MessageHandler.js'],
    capabilities: ['File browser', 'Syntax highlighting', 'Copy/download code', 'Line count display'],
    icon: <Code size={18} />
  },
  {
    name: 'Bot Analytics Dashboard',
    category: 'Analytics',
    status: 'active',
    description: 'Comprehensive analytics showing message volume, lead generation, response rates, and performance comparison across all bots.',
    sourceFiles: ['NinaWhatsAppBotCRM.jsx'],
    capabilities: ['Message metrics', 'Lead tracking', 'Response time analysis', 'Bot comparison'],
    icon: <TrendingUp size={18} />
  },
  {
    name: 'Auto-Reply Engine',
    category: 'Automation',
    status: 'active',
    description: 'Automated response system with AI-powered intent detection and customizable reply templates.',
    sourceFiles: ['AutoReply.js', 'MessageHandler.js'],
    capabilities: ['Intent detection', 'Template responses', 'Keyword triggers', 'Business hours handling'],
    icon: <MessageSquare size={18} />
  },
  {
    name: 'Lead Scoring Module',
    category: 'AI/ML',
    status: 'active',
    description: 'AI-powered lead scoring based on conversation analysis, engagement patterns, and buying signals.',
    sourceFiles: ['AIServices.js', 'LeadScoring.js'],
    capabilities: ['Engagement scoring', 'Intent analysis', 'Priority classification', 'Score thresholds'],
    icon: <Star size={18} />
  },
  {
    name: 'Appointment Booking Integration',
    category: 'Integrations',
    status: 'active',
    description: 'Automated appointment scheduling through WhatsApp with calendar sync and confirmation messages.',
    sourceFiles: ['AppointmentBooking.js'],
    capabilities: ['Calendar integration', 'Auto-confirmation', 'Reminder messages', 'Rescheduling'],
    icon: <Calendar size={18} />
  },
  {
    name: 'WhatsApp Client Factory',
    category: 'Core System',
    status: 'active',
    description: 'Core module for creating and initializing new WhatsApp Web.js clients with authentication handling.',
    sourceFiles: ['CreatingNewWhatsAppClient.js'],
    capabilities: ['Client initialization', 'Auth handling', 'Error recovery', 'Session caching'],
    icon: <Bot size={18} />
  },
  {
    name: 'Message Queue System',
    category: 'Core System',
    status: 'active',
    description: 'Queue-based message processing for handling high volumes and preventing rate limiting.',
    sourceFiles: ['MessageHandler.js', 'BroadcastManager.js'],
    capabilities: ['Queue processing', 'Rate limiting', 'Retry logic', 'Priority queues'],
    icon: <Database size={18} />
  },
  {
    name: 'Multi-Number Support',
    category: 'Bot Management',
    status: 'active',
    description: 'Support for managing multiple phone numbers with team member assignment and routing rules.',
    sourceFiles: ['ArslanNumbers.js', 'NawalNumbers.js', 'BotConfig.js'],
    capabilities: ['Number management', 'Agent assignment', 'Load balancing', 'Fallback routing'],
    icon: <Phone size={18} />
  },
  {
    name: 'Real-time Connection Monitor',
    category: 'Monitoring',
    status: 'active',
    description: 'Live monitoring of bot connection status with automatic reconnection and alert notifications.',
    sourceFiles: ['SessionManager.js'],
    capabilities: ['Status monitoring', 'Auto-reconnect', 'Alert system', 'Uptime tracking'],
    icon: <Wifi size={18} />
  },
  {
    name: 'FAQ Bot Module',
    category: 'Automation',
    status: 'active',
    description: 'Pre-configured FAQ responses for common real estate inquiries with multi-language support.',
    sourceFiles: ['AutoReply.js'],
    capabilities: ['FAQ matching', 'Multi-language', 'Fuzzy search', 'Category routing'],
    icon: <MessageCircle size={18} />
  },
  {
    name: 'Broadcast Messaging',
    category: 'Communication',
    status: 'active',
    description: 'Bulk message broadcasting to contact lists with scheduling and personalization tokens.',
    sourceFiles: ['BroadcastManager.js', 'CampaignService.js'],
    capabilities: ['Bulk sending', 'Scheduling', 'Personalization', 'Delivery tracking'],
    icon: <Send size={18} />
  },
  {
    name: 'Webhook Integration',
    category: 'Integrations',
    status: 'beta',
    description: 'Webhook endpoints for external system integration and real-time event notifications.',
    sourceFiles: ['WhatsAppClientFunctions.js'],
    capabilities: ['Event webhooks', 'API endpoints', 'Authentication', 'Retry handling'],
    nextMilestone: 'Add Zapier integration',
    icon: <Globe size={18} />
  },
  {
    name: 'Media Handler',
    category: 'Core System',
    status: 'active',
    description: 'Process and send images, documents, and voice messages with automatic optimization.',
    sourceFiles: ['MessageHandler.js'],
    capabilities: ['Image processing', 'Document sharing', 'Voice messages', 'File compression'],
    icon: <FileText size={18} />
  },
  {
    name: 'AI Intent Classifier',
    category: 'AI/ML',
    status: 'active',
    description: 'Machine learning-powered message intent classification for property inquiry, viewing requests, negotiation, and opt-out detection.',
    sourceFiles: ['AIServices.js'],
    capabilities: ['Intent detection', 'Keyword matching', 'Arabic support', 'Confidence scoring'],
    icon: <Brain size={18} />
  },
  {
    name: 'AI Sentiment Analyzer',
    category: 'AI/ML',
    status: 'active',
    description: 'Analyze customer sentiment from messages to detect positive, negative, or urgent communications.',
    sourceFiles: ['AIServices.js'],
    capabilities: ['Sentiment scoring', 'Urgency detection', 'Mood indicators', 'Escalation triggers'],
    icon: <Zap size={18} />
  },
  {
    name: 'AI Language Detector',
    category: 'AI/ML',
    status: 'active',
    description: 'Automatic language detection for Arabic, English, Hindi, and Chinese to enable bilingual responses.',
    sourceFiles: ['AIServices.js'],
    capabilities: ['Auto-detection', 'Script analysis', 'Confidence level', 'Bilingual routing'],
    icon: <Languages size={18} />
  },
  {
    name: 'AI Response Generator',
    category: 'AI/ML',
    status: 'active',
    description: 'Generate personalized responses in Arabic and English based on detected intent and customer context.',
    sourceFiles: ['AIServices.js'],
    capabilities: ['Template responses', 'Personalization', 'Multi-language', 'Context awareness'],
    icon: <MessageSquare size={18} />
  },
  {
    name: 'AES-256 Encrypted Storage',
    category: 'Security',
    status: 'active',
    description: 'Military-grade AES-256-GCM encryption for WhatsApp session data and sensitive information.',
    sourceFiles: ['SecurityServices.js'],
    capabilities: ['AES-256 encryption', 'IV generation', 'Auth tag verification', 'Secure key management'],
    icon: <Lock size={18} />
  },
  {
    name: 'Access Audit Logger',
    category: 'Security',
    status: 'active',
    description: 'Comprehensive audit logging for all Nina actions including user access, API calls, and campaign executions.',
    sourceFiles: ['SecurityServices.js'],
    capabilities: ['Action logging', 'User tracking', 'IP logging', 'Suspicious activity detection'],
    icon: <Eye size={18} />
  },
  {
    name: 'Role-Based Access Control',
    category: 'Security',
    status: 'active',
    description: 'Granular permission system with admin, manager, agent, and viewer roles for controlled access.',
    sourceFiles: ['SecurityServices.js'],
    capabilities: ['Role assignment', 'Permission checking', 'User management', 'Access restrictions'],
    icon: <Key size={18} />
  },
  {
    name: 'Session Management',
    category: 'Security',
    status: 'active',
    description: 'Secure session handling with automatic expiration, activity tracking, and session cleanup.',
    sourceFiles: ['SecurityServices.js'],
    capabilities: ['Session creation', 'Expiry handling', 'Activity tracking', 'Cleanup automation'],
    icon: <Fingerprint size={18} />
  },
  {
    name: 'ISO Country Mapper',
    category: 'Scheduling',
    status: 'active',
    description: 'Complete ISO 3166-1 country code mapping with nationality detection, timezone, and business hours.',
    sourceFiles: ['SchedulingServices.js'],
    capabilities: ['Country detection', 'Nationality mapping', 'Timezone lookup', 'Business hours'],
    icon: <Map size={18} />
  },
  {
    name: 'Local Time Scheduler',
    category: 'Scheduling',
    status: 'active',
    description: 'Timezone-aware message scheduling that respects local business hours and weekends per country.',
    sourceFiles: ['SchedulingServices.js'],
    capabilities: ['Local time calculation', 'Weekend detection', 'Lunch break avoidance', 'DST handling'],
    icon: <Clock size={18} />
  },
  {
    name: 'Strict Schedule Manager',
    category: 'Scheduling',
    status: 'active',
    description: 'Enforces strict sending windows with off-hours blocking, hourly limits, and time-based rate controls.',
    sourceFiles: ['SchedulingServices.js'],
    capabilities: ['Off-hour blocking', 'Hourly limits', 'Daily quotas', 'Time-based throttling'],
    icon: <Timer size={18} />
  },
  {
    name: 'Behavioral Simulator',
    category: 'Anti-Detection',
    status: 'active',
    description: 'Simulates human-like typing delays and response patterns to avoid bot detection.',
    sourceFiles: ['SchedulingServices.js'],
    capabilities: ['Typing simulation', 'Random delays', 'Activity patterns', 'Natural pacing'],
    icon: <Bot size={18} />
  },
  {
    name: 'Opt-Out Detector',
    category: 'Compliance',
    status: 'active',
    description: 'Scans chat history for opt-out keywords in English and Arabic to respect user preferences.',
    sourceFiles: ['SchedulingServices.js'],
    capabilities: ['Keyword detection', 'Arabic support', 'Auto-blocking', 'Compliance logging'],
    icon: <UserX size={18} />
  },
  {
    name: 'Weighted Random Selection',
    category: 'Campaign Intelligence',
    status: 'active',
    description: 'Intelligent contact selection with 30-day restriction and weighted prioritization for older contacts.',
    sourceFiles: ['CampaignService.js'],
    capabilities: ['30-day restriction', 'Weight-based selection', 'Pattern avoidance', 'Fair distribution'],
    icon: <Shuffle size={18} />
  },
  {
    name: 'Google Sheets Integration',
    category: 'Integrations',
    status: 'active',
    description: 'Direct integration with Google Sheets for contact management and campaign result logging.',
    sourceFiles: ['GoogleSheetsService.js'],
    capabilities: ['Sheet reading', 'Data writing', 'Auto-sync', 'Project mapping'],
    icon: <Database size={18} />
  },
  {
    name: 'Phone Number Validator',
    category: 'Core System',
    status: 'active',
    description: 'UAE-focused phone validation with network detection (Etisalat, Du) and international support.',
    sourceFiles: ['PhoneNumberService.js'],
    capabilities: ['UAE validation', 'Network detection', 'Format normalization', 'Duplicate removal'],
    icon: <Phone size={18} />
  },
  {
    name: 'Campaign Manager',
    category: 'Campaign Intelligence',
    status: 'active',
    description: 'Full campaign lifecycle management with project selection, blocklist handling, and progress tracking.',
    sourceFiles: ['CampaignService.js', 'BroadcastManager.js'],
    capabilities: ['Campaign creation', 'Progress tracking', 'Blocklist integration', 'Stats aggregation'],
    icon: <TrendingUp size={18} />
  },
  {
    name: 'Message Templates',
    category: 'Communication',
    status: 'active',
    description: 'Professional bilingual message templates with personalization tokens and category organization.',
    sourceFiles: ['MessageTemplates.js'],
    capabilities: ['Template library', 'Arabic/English', 'Personalization', 'Category filtering'],
    icon: <FileText size={18} />
  }
];

export const NANCY_FEATURES = [
  {
    name: 'Employee Directory',
    category: 'Workforce Management',
    status: 'active',
    description: 'Comprehensive employee database with search, filtering, department grouping, and detailed profiles.',
    sourceFiles: ['NancyHRCRM.jsx'],
    capabilities: ['Employee profiles', 'Department filter', 'Search & sort', 'Status tracking'],
    icon: <Users size={18} />
  },
  {
    name: 'Job Board Management',
    category: 'Talent Acquisition',
    status: 'active',
    description: 'Create and manage job postings with requirements, salary ranges, and application tracking.',
    sourceFiles: ['NancyHRCRM.jsx'],
    capabilities: ['Job creation', 'Requirements list', 'Salary management', 'Status control'],
    icon: <Briefcase size={18} />
  },
  {
    name: 'Applicant Tracking System',
    category: 'Talent Acquisition',
    status: 'active',
    description: 'Track job applicants through the hiring pipeline with AI-powered scoring and status management.',
    sourceFiles: ['NancyHRCRM.jsx'],
    capabilities: ['Pipeline stages', 'AI scoring', 'Resume storage', 'Communication tools'],
    icon: <UserPlus size={18} />
  },
  {
    name: 'Attendance Monitoring',
    category: 'Workforce Management',
    status: 'active',
    description: 'Track employee attendance with monthly reports, late arrival tracking, and absence management.',
    sourceFiles: ['NancyHRCRM.jsx'],
    capabilities: ['Attendance tracking', 'Leave balance', 'Late tracking', 'Monthly reports'],
    icon: <Calendar size={18} />
  },
  {
    name: 'Performance Reviews',
    category: 'Performance',
    status: 'active',
    description: 'Performance evaluation system with scoring, star ratings, and metric visualization.',
    sourceFiles: ['NancyHRCRM.jsx'],
    capabilities: ['Score visualization', 'Star ratings', 'Metric breakdown', 'Historical data'],
    icon: <Award size={18} />
  },
  {
    name: 'Leave Management',
    category: 'Workforce Management',
    status: 'beta',
    description: 'Employee leave request system with balance tracking and approval workflows.',
    sourceFiles: ['NancyHRCRM.jsx'],
    capabilities: ['Leave requests', 'Balance tracking', 'Approval workflow', 'Calendar view'],
    nextMilestone: 'Add manager approval flow',
    icon: <Clock size={18} />
  },
  {
    name: 'Department Analytics',
    category: 'Analytics',
    status: 'active',
    description: 'Department-level metrics including headcount, performance averages, and turnover rates.',
    sourceFiles: ['NancyHRCRM.jsx'],
    capabilities: ['Headcount analysis', 'Performance metrics', 'Turnover tracking', 'Cost analysis'],
    icon: <TrendingUp size={18} />
  },
  {
    name: 'Onboarding Workflow',
    category: 'Talent Acquisition',
    status: 'planned',
    description: 'Automated onboarding process with document collection, training assignments, and checklist tracking.',
    capabilities: ['Document collection', 'Training modules', 'Checklist tracking', 'Mentor assignment'],
    nextMilestone: 'Design onboarding flow',
    icon: <CheckCircle size={18} />
  },
  {
    name: 'Payroll Integration',
    category: 'Integrations',
    status: 'planned',
    description: 'Integration with payroll systems for salary management and compensation tracking.',
    capabilities: ['Salary sync', 'Bonus tracking', 'Tax calculations', 'Pay slip generation'],
    nextMilestone: 'Select payroll provider',
    icon: <DollarSign size={18} />
  },
  {
    name: 'Employee Self-Service',
    category: 'Workforce Management',
    status: 'planned',
    description: 'Self-service portal for employees to update info, request leave, and view payslips.',
    capabilities: ['Profile updates', 'Leave requests', 'Document access', 'Payslip viewing'],
    nextMilestone: 'Design employee portal',
    icon: <Settings size={18} />
  }
];

export const LINDA_FEATURES = [
  {
    name: 'Real-time Chat Interface',
    category: 'Communication',
    status: 'active',
    description: 'Live chat interface for WhatsApp conversations with read receipts, typing indicators, and message history.',
    sourceFiles: ['LindaWhatsAppCRM.jsx'],
    capabilities: ['Live messaging', 'Read receipts', 'Message history', 'Media support'],
    icon: <MessageCircle size={18} />
  },
  {
    name: 'Lead Pre-qualification',
    category: 'AI Features',
    status: 'active',
    description: 'AI-powered lead qualification based on conversation analysis and buying intent signals.',
    sourceFiles: ['LindaWhatsAppCRM.jsx'],
    capabilities: ['Intent detection', 'Priority scoring', 'Hot/warm/cold tagging', 'AI recommendations'],
    icon: <Star size={18} />
  },
  {
    name: 'Quick Reply Templates',
    category: 'Automation',
    status: 'active',
    description: 'Pre-configured response templates for common inquiries with one-click insertion.',
    sourceFiles: ['LindaWhatsAppCRM.jsx'],
    capabilities: ['Template library', 'Quick insert', 'Category organization', 'Custom templates'],
    icon: <Zap size={18} />
  },
  {
    name: 'Contact Management',
    category: 'CRM',
    status: 'active',
    description: 'Manage customer contacts with tags, priority levels, and conversation history.',
    sourceFiles: ['LindaWhatsAppCRM.jsx'],
    capabilities: ['Contact profiles', 'Tag system', 'Priority levels', 'History tracking'],
    icon: <Users size={18} />
  },
  {
    name: 'Conversation Filtering',
    category: 'Organization',
    status: 'active',
    description: 'Filter and search conversations by priority, tags, status, and date range.',
    sourceFiles: ['LindaWhatsAppCRM.jsx'],
    capabilities: ['Priority filter', 'Tag filter', 'Search', 'Date range'],
    icon: <Filter size={18} />
  },
  {
    name: 'AI Insights Panel',
    category: 'AI Features',
    status: 'active',
    description: 'Real-time AI suggestions and insights during conversations for better engagement.',
    sourceFiles: ['LindaWhatsAppCRM.jsx'],
    capabilities: ['Conversation insights', 'Response suggestions', 'Sentiment analysis', 'Action prompts'],
    icon: <Bot size={18} />
  },
  {
    name: 'Conversation Archive',
    category: 'Organization',
    status: 'active',
    description: 'Archive completed conversations with search and export functionality.',
    sourceFiles: ['LindaWhatsAppCRM.jsx'],
    capabilities: ['Archive system', 'Search archived', 'Export history', 'Restore function'],
    icon: <Archive size={18} />
  },
  {
    name: 'Multi-channel Support',
    category: 'Communication',
    status: 'planned',
    description: 'Extend support to SMS, email, and social media channels in unified inbox.',
    capabilities: ['SMS integration', 'Email sync', 'Social media', 'Unified inbox'],
    nextMilestone: 'Add SMS channel',
    icon: <Globe size={18} />
  }
];

export const MARY_FEATURES = [
  {
    name: 'Property Inventory CRUD',
    category: 'Inventory Management',
    status: 'active',
    description: 'Full create, read, update, delete operations for property listings with form validation.',
    sourceFiles: ['MaryInventoryCRM.jsx'],
    capabilities: ['Add properties', 'Edit listings', 'Delete properties', 'Bulk operations'],
    icon: <Building2 size={18} />
  },
  {
    name: 'Smart Property Search',
    category: 'Search & Filter',
    status: 'active',
    description: 'Advanced search with filters for type, purpose, price range, location, and specs.',
    sourceFiles: ['MaryInventoryCRM.jsx'],
    capabilities: ['Multi-filter', 'Price range', 'Location search', 'Spec matching'],
    icon: <Search size={18} />
  },
  {
    name: 'Property Detail Views',
    category: 'Display',
    status: 'active',
    description: 'Comprehensive property detail modals with images, specs, location, and agent info.',
    sourceFiles: ['MaryInventoryCRM.jsx', 'FullScreenDetailModal.jsx'],
    capabilities: ['Image gallery', 'Spec display', 'Agent card', 'Action buttons'],
    icon: <Eye size={18} />
  },
  {
    name: 'Status Management',
    category: 'Inventory Management',
    status: 'active',
    description: 'Track property status (available, reserved, sold, rented) with visual indicators.',
    sourceFiles: ['MaryInventoryCRM.jsx'],
    capabilities: ['Status tracking', 'Visual badges', 'History log', 'Bulk update'],
    icon: <Tag size={18} />
  },
  {
    name: 'DLD/RERA Compliance',
    category: 'Compliance',
    status: 'active',
    description: 'Track Dubai Land Department numbers and RERA registration for compliance.',
    sourceFiles: ['MaryInventoryCRM.jsx'],
    capabilities: ['DLD tracking', 'RERA numbers', 'Expiry alerts', 'Compliance reports'],
    icon: <Shield size={18} />
  },
  {
    name: 'Agent Assignment',
    category: 'Team Management',
    status: 'active',
    description: 'Assign properties to agents with workload tracking and performance metrics.',
    sourceFiles: ['MaryInventoryCRM.jsx'],
    capabilities: ['Agent assignment', 'Workload view', 'Performance link', 'Reassignment'],
    icon: <Users size={18} />
  },
  {
    name: 'Analytics Dashboard',
    category: 'Analytics',
    status: 'active',
    description: 'Property analytics including views, inquiries, listing performance, and trends.',
    sourceFiles: ['MaryInventoryCRM.jsx'],
    capabilities: ['View tracking', 'Inquiry metrics', 'Performance trends', 'Comparison'],
    icon: <TrendingUp size={18} />
  },
  {
    name: 'Import/Export Tools',
    category: 'Data Management',
    status: 'beta',
    description: 'Bulk import/export property data in CSV and Excel formats.',
    sourceFiles: ['MaryInventoryCRM.jsx'],
    capabilities: ['CSV import', 'Excel export', 'Data mapping', 'Validation'],
    nextMilestone: 'Add portal sync',
    icon: <Database size={18} />
  },
  {
    name: 'AI Pricing Suggestions',
    category: 'AI Features',
    status: 'planned',
    description: 'AI-powered pricing recommendations based on market data and comparables.',
    capabilities: ['Market analysis', 'Comparable lookup', 'Price trends', 'ROI calculator'],
    nextMilestone: 'Integrate market data',
    icon: <DollarSign size={18} />
  }
];

export const CLARA_FEATURES = [
  {
    name: 'Lead Pipeline Management',
    category: 'Lead Management',
    status: 'active',
    description: 'Visual pipeline for tracking leads through stages: initial, qualified, viewing, offer, closed.',
    sourceFiles: ['ClaraLeadsCRM.jsx'],
    capabilities: ['Stage tracking', 'Drag-drop', 'Stage automation', 'Conversion tracking'],
    icon: <TrendingUp size={18} />
  },
  {
    name: 'Lead CRUD Operations',
    category: 'Lead Management',
    status: 'active',
    description: 'Full create, read, update, delete operations for leads with comprehensive forms.',
    sourceFiles: ['ClaraLeadsCRM.jsx'],
    capabilities: ['Add leads', 'Edit info', 'Delete leads', 'Bulk actions'],
    icon: <Users size={18} />
  },
  {
    name: 'AI Lead Scoring',
    category: 'AI Features',
    status: 'active',
    description: 'Automated lead scoring based on engagement, budget, timeline, and behavior patterns.',
    sourceFiles: ['ClaraLeadsCRM.jsx'],
    capabilities: ['Auto-scoring', 'Score breakdown', 'Priority ranking', 'Score history'],
    icon: <Star size={18} />
  },
  {
    name: 'Activity Timeline',
    category: 'Communication',
    status: 'active',
    description: 'Chronological activity log for all lead interactions including calls, emails, and meetings.',
    sourceFiles: ['ClaraLeadsCRM.jsx'],
    capabilities: ['Activity log', 'Type filtering', 'Notes', 'Timeline view'],
    icon: <Clock size={18} />
  },
  {
    name: 'Follow-up Management',
    category: 'Task Management',
    status: 'active',
    description: 'Schedule and track follow-ups with reminders and calendar integration.',
    sourceFiles: ['ClaraLeadsCRM.jsx'],
    capabilities: ['Schedule follow-ups', 'Reminders', 'Overdue alerts', 'Calendar sync'],
    icon: <Calendar size={18} />
  },
  {
    name: 'Contact Management',
    category: 'Lead Management',
    status: 'active',
    description: 'Multi-channel contact options with call logging, email tracking, and WhatsApp integration.',
    sourceFiles: ['ClaraLeadsCRM.jsx'],
    capabilities: ['Call logging', 'Email tracking', 'WhatsApp link', 'Contact history'],
    icon: <Phone size={18} />
  },
  {
    name: 'Source Tracking',
    category: 'Analytics',
    status: 'active',
    description: 'Track lead sources (website, referral, portal, social) with conversion analytics.',
    sourceFiles: ['ClaraLeadsCRM.jsx'],
    capabilities: ['Source tagging', 'Conversion rates', 'ROI tracking', 'Source comparison'],
    icon: <Globe size={18} />
  },
  {
    name: 'Agent Assignment',
    category: 'Team Management',
    status: 'active',
    description: 'Assign leads to agents with round-robin, load balancing, or manual assignment.',
    sourceFiles: ['ClaraLeadsCRM.jsx'],
    capabilities: ['Manual assign', 'Round-robin', 'Load balance', 'Reassignment'],
    icon: <Briefcase size={18} />
  },
  {
    name: 'Lead Detail Modal',
    category: 'Display',
    status: 'active',
    description: 'Comprehensive lead detail view with all info, activities, and quick actions.',
    sourceFiles: ['ClaraLeadsCRM.jsx', 'FullScreenDetailModal.jsx'],
    capabilities: ['Full profile', 'Activity history', 'Quick actions', 'Notes section'],
    icon: <Eye size={18} />
  },
  {
    name: 'SLA Monitoring',
    category: 'Compliance',
    status: 'planned',
    description: 'Track response time SLAs with alerts for overdue follow-ups.',
    capabilities: ['Response SLAs', 'Overdue alerts', 'Performance reports', 'Escalation'],
    nextMilestone: 'Define SLA rules',
    icon: <AlertCircle size={18} />
  }
];
