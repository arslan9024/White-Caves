import React, { useState } from 'react';
import { Sparkles, Plus, Check, ShieldCheck, Zap, ToggleLeft, ToggleRight, Trash2, Edit3 } from 'lucide-react';

interface AutoReplyRule {
  id: string;
  name: string;
  keywords: string[];
  responseTemplate: string;
  intentTag: string;
  leadScoreBoost: number;
  active: boolean;
  dldInventoryLookup: boolean;
  escalationTarget: string;
}

const INITIAL_RULES: AutoReplyRule[] = [
  {
    id: 'rule-1',
    name: 'DAMAC Hills 2 Villa & Pricing Inquiry',
    keywords: ['villa', 'DAMAC Hills 2', 'price', 'buy', 'cost', 'VARDON', 'PACIFICA'],
    responseTemplate: 'Greeting {{client_name}}! Nina AI here for White Caves Real Estate. We have {{available_count}} matching villas in DAMAC Hills 2 starting from AED 1.35M. Would you like to schedule a private viewing with Arslan Malik (+971 50 576 0056)?',
    intentTag: 'Property Inquiry',
    leadScoreBoost: 25,
    active: true,
    dldInventoryLookup: true,
    escalationTarget: '+971 50 576 0056',
  },
  {
    id: 'rule-2',
    name: 'Ejari & Lease Contract Support',
    keywords: ['rent', 'Ejari', 'lease', 'contract', 'PDC', 'landlord'],
    responseTemplate: 'Hello {{client_name}}! White Caves Leasing Services handles complete DLD Ejari registration, PDC collection, and landlord payout accounting. Our standard terms are 4 PDCs.',
    intentTag: 'Ejari Renewal',
    leadScoreBoost: 15,
    active: true,
    dldInventoryLookup: false,
    escalationTarget: 'Leasing Desk',
  },
  {
    id: 'rule-3',
    name: 'DLD Title Deed Verification Request',
    keywords: ['title deed', 'DLD', 'verify', 'owner', 'Form A', 'Form B'],
    responseTemplate: 'Hello! All property listings at White Caves are 100% verified against official Dubai Land Department Title Deeds via DLD REST Integration.',
    intentTag: 'Title Deed Audit',
    leadScoreBoost: 30,
    active: true,
    dldInventoryLookup: true,
    escalationTarget: 'Legal Desk',
  },
];

export const AutoReplyPlannerTab: React.FC = () => {
  const [rules, setRules] = useState<AutoReplyRule[]>(INITIAL_RULES);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newRule, setNewRule] = useState({
    name: 'New AI Trigger Rule',
    keywordsText: 'offplan, luxury, investment',
    responseTemplate: 'Thank you for contacting White Caves Real Estate! Our investment team is matching your query.',
    intentTag: 'General Inquiry',
    leadScoreBoost: 10,
    dldInventoryLookup: true,
    escalationTarget: '+971 50 576 0056',
  });

  const toggleRuleActive = (ruleId: string) => {
    setRules(prev =>
      prev.map(r => (r.id === ruleId ? { ...r, active: !r.active } : r))
    );
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    const createdRule: AutoReplyRule = {
      id: `rule-${Date.now()}`,
      name: newRule.name,
      keywords: newRule.keywordsText.split(',').map(k => k.trim()),
      responseTemplate: newRule.responseTemplate,
      intentTag: newRule.intentTag,
      leadScoreBoost: newRule.leadScoreBoost,
      active: true,
      dldInventoryLookup: newRule.dldInventoryLookup,
      escalationTarget: newRule.escalationTarget,
    };

    setRules(prev => [createdRule, ...prev]);
    setShowAddModal(false);
  };

  return (
    <div className="autoreply-planner-tab" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          color: '#FFFFFF',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '2rem' }}>⚡</span>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-06b6d4, #06B6D4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Nina AI Smart Auto-Reply & Keyword Intent Engine
              </span>
              <h3 style={{ margin: '2px 0 0', fontSize: '1.35rem', fontWeight: 800, color: 'var(--white, #FFFFFF)' }}>
                Automated Auto-Reply Rule Planner (+971 50 576 0056)
              </h3>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: '#06B6D4',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '9px 18px',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
            }}
          >
            <Plus size={16} /> Add Auto-Reply Rule
          </button>
        </div>

        <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary, #CBD5E1)', lineHeight: 1.5 }}>
          Configure live trigger rules for Nina AI. When an incoming WhatsApp message arrives on <strong>+971 50 576 0056</strong>, Nina parses keyword intents, pulls matching properties from our <strong>9,210 DAMAC Hills 2 Database</strong>, updates lead scores, and responds automatically!
        </p>
      </div>

      {/* Rules List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {rules.map(rule => (
          <div
            key={rule.id}
            style={{
              background: '#FFFFFF',
              border: rule.active ? '1.5px solid #06B6D4' : '1px solid #CBD5E1',
              borderRadius: '14px',
              padding: '1.25rem',
              boxShadow: rule.active ? '0 4px 16px rgba(6, 182, 212, 0.08)' : 'none',
              opacity: rule.active ? 1 : 0.65,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>{rule.name}</h4>
                <span style={{ background: 'rgba(6, 182, 212, 0.12)', color: 'var(--color-06b6d4, #06B6D4)', fontWeight: 800, fontSize: '0.75rem', padding: '3px 10px', borderRadius: '6px' }}>
                  Tag: {rule.intentTag}
                </span>
                {rule.dldInventoryLookup && (
                  <span style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-green, #10B981)', fontWeight: 800, fontSize: '0.75rem', padding: '3px 10px', borderRadius: '6px' }}>
                    ✓ 9,210 DLD DB Matcher Active
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={() => toggleRuleActive(rule.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: rule.active ? '#06B6D4' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                  }}
                >
                  {rule.active ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                  {rule.active ? 'Active' : 'Disabled'}
                </button>
              </div>
            </div>

            {/* Keywords */}
            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #64748B)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Trigger Keywords:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {rule.keywords.map(kw => (
                  <span key={kw} style={{ background: 'var(--color-f1f5f9, #F1F5F9)', color: 'var(--color-334155, #334155)', fontWeight: 700, fontSize: '0.78rem', padding: '3px 8px', borderRadius: '6px' }}>
                    "{kw}"
                  </span>
                ))}
              </div>
            </div>

            {/* Template */}
            <div style={{ background: 'var(--color-f8fafc, #F8FAFC)', border: '1px solid var(--text-secondary, #E2E8F0)', borderRadius: '10px', padding: '0.85rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary, #64748B)', display: 'block', marginBottom: '4px' }}>
                Automated Response Template (Nina AI Response):
              </span>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-1e293b, #1E293B)', fontStyle: 'italic', lineHeight: 1.45 }}>
                "{rule.responseTemplate}"
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ADD RULE MODAL */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--white, #FFFFFF)', borderRadius: '16px', padding: '1.5rem', width: '90%', maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-06b6d4, #06B6D4)' }}>
              + Create Nina AI Auto-Reply Rule
            </h3>
            <form onSubmit={handleAddRule} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <label>
                Rule Name:
                <input type="text" value={newRule.name} onChange={e => setNewRule({ ...newRule, name: e.target.value })} required style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid var(--text-secondary, #CBD5E1)' }} />
              </label>
              <label>
                Keywords (comma separated):
                <input type="text" value={newRule.keywordsText} onChange={e => setNewRule({ ...newRule, keywordsText: e.target.value })} required style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid var(--text-secondary, #CBD5E1)' }} />
              </label>
              <label>
                Response Template:
                <textarea value={newRule.responseTemplate} onChange={e => setNewRule({ ...newRule, responseTemplate: e.target.value })} rows={3} required style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid var(--text-secondary, #CBD5E1)' }} />
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--text-secondary, #CBD5E1)', background: 'var(--white, #FFFFFF)', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'var(--color-06b6d4, #06B6D4)', color: 'var(--white, #FFFFFF)', fontWeight: 800, cursor: 'pointer' }}>Save Rule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
