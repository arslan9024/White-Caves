// FILE: src/components/crm/AIAssistantHub.data.ts
/**
 * White Caves Real Estate LLC - AI Assistant Hub Data & Feature Flows
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import {
  Users,
  MessageSquare,
  Bot,
  Briefcase,
  Target,
  Home,
  DollarSign,
  Megaphone,
  Shield,
  FileText,
  Users2,
  Server,
  LucideIcon,
} from 'lucide-react';

export const ASSISTANT_ICONS: Record<string, LucideIcon> = {
  nadia: MessageSquare,
  mary: FileText,
  clara: Target,
  nina: Bot,
  nancy: Users2,
  theodora: DollarSign,
  olivia: Megaphone,
  zoe: Briefcase,
  laila: Shield,
  sophia: Users,
  daisy: Home,
  aurora: Server,
};

export interface FeatureFlow {
  id: string;
  name: string;
  source: string;
  target: string;
  description: string;
  automationLevel: 'full' | 'semi-auto';
}

export const FEATURE_FLOWS: FeatureFlow[] = [
  {
    id: 'whatsapp_lead_capture',
    name: 'WhatsApp Lead Capture',
    source: 'nadia',
    target: 'clara',
    description:
      'Qualified leads from WhatsApp conversations are automatically transferred to the Leads CRM',
    automationLevel: 'full',
  },
  {
    id: 'lead_property_matching',
    name: 'Lead Property Matching',
    source: 'clara',
    target: 'mary',
    description: 'AI matches qualified leads with suitable properties from the inventory',
    automationLevel: 'semi-auto',
  },
  {
    id: 'bot_conversation_routing',
    name: 'Bot Conversation Routing',
    source: 'nina',
    target: 'nadia',
    description: 'Complex conversations from bots are escalated to human agents via Nadia',
    automationLevel: 'full',
  },
  {
    id: 'sales_lead_handoff',
    name: 'Sales Lead Handoff',
    source: 'nadia',
    target: 'sophia',
    description: 'Hot leads from WhatsApp are handed off to the sales pipeline',
    automationLevel: 'semi-auto',
  },
  {
    id: 'agent_assignment',
    name: 'Agent Assignment',
    source: 'clara',
    target: 'nancy',
    description: 'Leads are assigned to available agents based on HR availability data',
    automationLevel: 'full',
  },
  {
    id: 'financial_tracking',
    name: 'Deal Financial Tracking',
    source: 'sophia',
    target: 'theodora',
    description: 'Closed deals are synced to finance for invoicing and payment tracking',
    automationLevel: 'full',
  },
  {
    id: 'compliance_check',
    name: 'KYC Compliance Check',
    source: 'clara',
    target: 'laila',
    description: 'New leads undergo automated compliance and KYC verification',
    automationLevel: 'semi-auto',
  },
  {
    id: 'leasing_sync',
    name: 'Leasing Property Sync',
    source: 'mary',
    target: 'daisy',
    description: 'Available rental properties are synced to the leasing management system',
    automationLevel: 'full',
  },
  {
    id: 'system_health_reporting',
    name: 'System Health Reporting',
    source: 'aurora',
    target: 'zoe',
    description: 'Critical system alerts and performance reports are sent to executive dashboard',
    automationLevel: 'full',
  },
  {
    id: 'deployment_tracking',
    name: 'Deployment Tracking',
    source: 'aurora',
    target: 'theodora',
    description: 'Infrastructure costs and deployment metrics are synced for financial tracking',
    automationLevel: 'semi-auto',
  },
];
