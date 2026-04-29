import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, Clock, AlertCircle, User, Home, FileText, 
  Send, Shield, Building, Calendar, DollarSign, Users
} from 'lucide-react';
import './DealJourneyTimeline.css';

const TENANCY_STAGES = [
  { id: 'inquiry', label: 'Inquiry', icon: Users },
  { id: 'viewing_scheduled', label: 'Viewing Scheduled', icon: Calendar },
  { id: 'viewing_completed', label: 'Viewing Done', icon: CheckCircle },
  { id: 'offer_submitted', label: 'Offer Submitted', icon: Send },
  { id: 'landlord_review', label: 'Landlord Review', icon: User },
  { id: 'offer_accepted', label: 'Offer Accepted', icon: CheckCircle },
  { id: 'contract_preparation', label: 'Contract Prep', icon: FileText },
  { id: 'pending_signatures', label: 'Pending Signatures', icon: FileText },
  { id: 'signed', label: 'Contract Signed', icon: CheckCircle },
  { id: 'ejari_submitted', label: 'Ejari Submitted', icon: Building },
  { id: 'ejari_registered', label: 'Ejari Registered', icon: Shield },
  { id: 'completed', label: 'Completed', icon: CheckCircle }
];

const SALES_STAGES = [
  { id: 'lead', label: 'Lead', icon: Users },
  { id: 'qualified', label: 'Qualified', icon: CheckCircle },
  { id: 'viewing_scheduled', label: 'Viewing Scheduled', icon: Calendar },
  { id: 'viewing_completed', label: 'Viewing Done', icon: CheckCircle },
  { id: 'offer_submitted', label: 'Offer Submitted', icon: Send },
  { id: 'negotiation', label: 'Negotiation', icon: Users },
  { id: 'offer_accepted', label: 'Offer Accepted', icon: CheckCircle },
  { id: 'spa_preparation', label: 'SPA Preparation', icon: FileText },
  { id: 'spa_signed', label: 'SPA Signed', icon: FileText },
  { id: 'noc_applied', label: 'NOC Applied', icon: Building },
  { id: 'noc_received', label: 'NOC Received', icon: CheckCircle },
  { id: 'dld_transfer', label: 'DLD Transfer', icon: Building },
  { id: 'completed', label: 'Completed', icon: CheckCircle }
];

export default function DealJourneyTimeline({ deal, dealType = 'tenancy', compact = false }) {
  const [selectedStage, setSelectedStage] = useState(null);
  
  const stages = dealType === 'tenancy' ? TENANCY_STAGES : SALES_STAGES;
  const currentStageIndex = stages.findIndex(s => s.id === deal?.status);
  
  const getStageStatus = (index) => {
    if (index < currentStageIndex) return 'completed';
    if (index === currentStageIndex) return 'current';
    return 'pending';
  };
  
  const getTimelineEntry = (stageId) => {
    return deal?.timeline?.find(t => t.stage === stageId);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-AE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!deal) {
    return (
      <div className="deal-journey-empty">
        <Clock size={48} />
        <p>No deal selected</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="deal-journey-compact">
        <div className="compact-header">
          <span className="deal-number">{deal.dealNumber}</span>
          <span className={`status-badge status-${deal.status}`}>
            {stages.find(s => s.id === deal.status)?.label || deal.status}
          </span>
        </div>
        <div className="compact-progress">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentStageIndex + 1) / stages.length) * 100}%` }}
          />
        </div>
        <div className="compact-info">
          <span>{deal.property?.address || 'N/A'}</span>
          <span>{dealType === 'tenancy' ? deal.tenant?.name : deal.buyer?.name}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="deal-journey-timeline">
      <div className="journey-header">
        <div className="deal-info">
          <h3>{deal.dealNumber}</h3>
          <span className={`type-badge ${dealType}`}>
            {dealType === 'tenancy' ? 'Leasing' : deal.dealType === 'off_plan' ? 'Off-Plan' : 'Secondary'}
          </span>
        </div>
        <div className="parties-info">
          <div className="party">
            <Home size={16} />
            <span>{deal.property?.address}</span>
          </div>
          {dealType === 'tenancy' ? (
            <>
              <div className="party">
                <User size={16} />
                <span>Landlord: {deal.landlord?.name}</span>
              </div>
              <div className="party">
                <User size={16} />
                <span>Tenant: {deal.tenant?.name}</span>
              </div>
            </>
          ) : (
            <>
              <div className="party">
                <User size={16} />
                <span>Seller: {deal.seller?.name}</span>
              </div>
              <div className="party">
                <User size={16} />
                <span>Buyer: {deal.buyer?.name}</span>
              </div>
            </>
          )}
          <div className="party">
            <Users size={16} />
            <span>Agent: {deal.broker?.name}</span>
          </div>
        </div>
      </div>

      <div className="timeline-container">
        {stages.map((stage, index) => {
          const status = getStageStatus(index);
          const timelineEntry = getTimelineEntry(stage.id);
          const StageIcon = stage.icon;
          
          return (
            <motion.div
              key={stage.id}
              className={`timeline-stage ${status}`}
              onClick={() => setSelectedStage(selectedStage === stage.id ? null : stage.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="stage-connector">
                {index > 0 && <div className={`connector-line ${status}`} />}
              </div>
              
              <div className={`stage-icon ${status}`}>
                {status === 'completed' ? (
                  <CheckCircle size={20} />
                ) : status === 'current' ? (
                  <Clock size={20} />
                ) : (
                  <StageIcon size={20} />
                )}
              </div>
              
              <div className="stage-content">
                <span className="stage-label">{stage.label}</span>
                {timelineEntry && (
                  <span className="stage-date">{formatDate(timelineEntry.timestamp)}</span>
                )}
              </div>
              
              {selectedStage === stage.id && timelineEntry && (
                <motion.div 
                  className="stage-details"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <p><strong>Actor:</strong> {timelineEntry.actor}</p>
                  <p><strong>Notes:</strong> {timelineEntry.notes}</p>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="journey-footer">
        <div className="financial-summary">
          <div className="summary-item">
            <DollarSign size={16} />
            <span>
              {dealType === 'tenancy' 
                ? `AED ${deal.offer?.monthlyRent?.toLocaleString()}/month`
                : `AED ${(deal.offer?.agreedPrice || deal.offer?.offerPrice)?.toLocaleString()}`
              }
            </span>
          </div>
          {deal.kycVerification && (
            <div className="summary-item">
              <Shield size={16} />
              <span>KYC: {deal.kycVerification.tenantVerified || deal.kycVerification.buyerVerified ? 'Verified' : 'Pending'}</span>
            </div>
          )}
        </div>
        <div className="broker-info">
          <span>Assigned by: {deal.broker?.assignedBy}</span>
        </div>
      </div>
    </div>
  );
}
