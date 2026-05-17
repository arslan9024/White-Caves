import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Database, Play, CheckCircle, Loader, AlertCircle,
  Users, Home, FileText, Shield, Sparkles
} from 'lucide-react';
import { seedDemoData } from '../../../store/slices/dealsSlice';
import './DemoDataPanel.css';

export default function DemoDataPanel({ category = 'all' }) {
  const dispatch = useDispatch();
  const { demoSeeded, loading } = useSelector(state => state.deals);
  const [seeding, setSeeding] = useState(false);
  const [result, setResult] = useState(null);

  const handleSeedDemo = async () => {
    setSeeding(true);
    setResult(null);
    try {
      const response = await dispatch(seedDemoData()).unwrap();
      setResult({ success: true, message: 'Demo data created successfully!' });
    } catch (error) {
      setResult({ success: false, message: error });
    } finally {
      setSeeding(false);
    }
  };

  const DEMO_SCENARIOS = [
    {
      id: 'tenancy',
      title: 'Leasing Demo',
      description: 'Complete tenancy deal from inquiry to Ejari registration',
      icon: Home,
      included: ['Landlord: Ahmed Al Maktoum', 'Tenant: Sarah Johnson', 'Broker: Omar Khalid', 'Property: Villa in JVC'],
      stage: 'Contract Preparation',
      assistant: 'Daisy'
    },
    {
      id: 'offplan',
      title: 'Off-Plan Sale Demo',
      description: 'New development purchase with payment plan',
      icon: Sparkles,
      included: ['Developer: Emaar Properties', 'Buyer: Mohammed Al Rashid', 'Broker: Layla Ahmed', 'Project: Creek Harbour'],
      stage: 'Offer Accepted',
      assistant: 'Clara/Sophia'
    },
    {
      id: 'secondary',
      title: 'Secondary Sale Demo',
      description: 'Resale property transaction with negotiation',
      icon: Users,
      included: ['Seller: Fatima Hassan', 'Buyer: James Wilson', 'Broker: Khalid Mansoor', 'Property: Dubai Marina'],
      stage: 'Negotiation',
      assistant: 'Sophia'
    },
    {
      id: 'kyc',
      title: 'KYC/AML Demo',
      description: 'High-risk customer verification workflow',
      icon: Shield,
      included: ['High-value transaction (AED 5.5M)', 'Sanctioned country nationality', 'EDD required', 'Best practice workflow'],
      stage: 'Pending EDD',
      assistant: 'Henry/Laila'
    }
  ];

  const filteredScenarios = category === 'all' 
    ? DEMO_SCENARIOS 
    : DEMO_SCENARIOS.filter(s => s.id === category);

  return (
    <div className="demo-data-panel">
      <div className="panel-header">
        <div className="header-icon">
          <Database size={24} />
        </div>
        <div className="header-content">
          <h3>Learning Demos</h3>
          <p>Explore realistic demo scenarios to learn best practices</p>
        </div>
        <button 
          className={`seed-btn ${seeding ? 'loading' : ''} ${demoSeeded ? 'seeded' : ''}`}
          onClick={handleSeedDemo}
          disabled={seeding}
        >
          {seeding ? (
            <><Loader size={16} className="spin" /> Creating...</>
          ) : demoSeeded ? (
            <><CheckCircle size={16} /> Demo Ready</>
          ) : (
            <><Play size={16} /> Create Demo Data</>
          )}
        </button>
      </div>

      {result && (
        <motion.div 
          className={`result-message ${result.success ? 'success' : 'error'}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {result.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {result.message}
        </motion.div>
      )}

      <div className="scenarios-grid">
        {filteredScenarios.map((scenario, index) => (
          <motion.div
            key={scenario.id}
            className="scenario-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="scenario-icon">
              <scenario.icon size={24} />
            </div>
            <div className="scenario-content">
              <h4>{scenario.title}</h4>
              <p>{scenario.description}</p>
              <div className="scenario-details">
                <div className="detail-row">
                  <span className="label">Current Stage:</span>
                  <span className="stage-badge">{scenario.stage}</span>
                </div>
                <div className="detail-row">
                  <span className="label">AI Assistant:</span>
                  <span className="assistant-badge">{scenario.assistant}</span>
                </div>
              </div>
              <div className="included-list">
                {scenario.included.map((item, i) => (
                  <span key={i} className="included-item">{item}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="learning-tips">
        <h4>Best Practices</h4>
        <ul>
          <li>Follow the timeline to understand each stage of the process</li>
          <li>Check KYC verification status before proceeding with contracts</li>
          <li>Ensure all required documents are collected before Ejari submission</li>
          <li>Use the AI assistants to automate routine tasks</li>
        </ul>
      </div>
    </div>
  );
}
