import type { Model, Types } from 'mongoose';

interface LeadRecord {
  name: string;
  email?: string;
  phone?: string;
  source: 'website' | 'whatsapp' | 'referral' | 'walk-in' | 'social-media' | 'property-finder' | 'bayut' | 'dubizzle' | 'other';
  status: 'new' | 'contacted' | 'qualified' | 'negotiating' | 'converted' | 'lost';
  stage: 'inquiry' | 'viewing-scheduled' | 'viewing-completed' | 'offer-made' | 'negotiation' | 'documentation' | 'closed';
  score: number;
  propertyInterest?: Types.ObjectId;
  propertyType: 'villa' | 'townhouse' | 'apartment' | 'plot' | 'penthouse' | 'duplex' | 'studio' | 'any';
  budget?: { min?: number; max?: number; currency: string };
  preferredLocations: string[];
  assignedAgent?: { id?: string; name?: string };
  notes?: string;
  lastContactDate?: Date;
  nextFollowUp?: Date;
  tags: string[];
  interactions: Array<{
    type?: 'call' | 'email' | 'whatsapp' | 'meeting' | 'viewing' | 'note';
    summary?: string;
    outcome?: string;
    date: Date;
    agentId?: string;
  }>;
  isActive: boolean;
  convertedAt?: Date;
  lostReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

declare const Lead: Model<LeadRecord>;
export default Lead;
