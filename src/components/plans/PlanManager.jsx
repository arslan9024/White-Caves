import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Trash2, Edit2, RefreshCw, Wand2, Merge2, Download,
  Calendar, Tag, FileText, AlertCircle, CheckCircle2, Clock
} from 'lucide-react';
import AIModelSelector from './AIModelSelector';
import './PlanManager.css';

/**
 * PlanManager Component - CRUD interface for managing plans
 * Integrates with Zoe's plan backend service
 */
export default function PlanManager() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPlans, setSelectedPlans] = useState(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [stats, setStats] = useState(null);

  // Load plans on mount
  useEffect(() => {
    loadPlans();
    loadStats();
  }, [searchQuery, filterStatus]);

  /**
   * Load all plans with optional filtering
   */
  const loadPlans = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const response = await fetch(`/api/plans/list?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to load plans');
      
      const data = await response.json();
      setPlans(data.plans || []);
    } catch (error) {
      console.error('Error loading plans:', error);
      alert('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load plan statistics
   */
  const loadStats = async () => {
    try {
      const response = await fetch('/api/plans/stats');
      if (!response.ok) throw new Error('Failed to load stats');
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  /**
   * Create new plan
   */
  const handleCreatePlan = async (planData) => {
    try {
      const response = await fetch('/api/plans/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData)
      });

      if (!response.ok) throw new Error('Failed to create plan');
      
      alert('Plan created successfully!');
      setShowCreateModal(false);
      loadPlans();
      loadStats();
    } catch (error) {
      console.error('Error creating plan:', error);
      alert('Failed to create plan');
    }
  };

  /**
   * Delete plan
   */
  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;

    try {
      const response = await fetch(`/api/plans/${planId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete plan');
      
      alert('Plan deleted successfully');
      loadPlans();
      loadStats();
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Failed to delete plan');
    }
  };

  /**
   * Improve plan with AI
   */
  const handleImprovePlan = async (planId) => {
    if (!window.confirm('Improve this plan with AI?')) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/plans/${planId}/improve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ focusAreas: ['Clarity', 'Actionable Items', 'Success Metrics'] })
      });

      if (!response.ok) throw new Error('Failed to improve plan');
      
      alert('Plan improved with AI successfully!');
      loadPlans();
    } catch (error) {
      console.error('Error improving plan:', error);
      alert('Failed to improve plan');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Merge selected plans
   */
  const handleMergePlans = async (outputFilename) => {
    if (selectedPlans.size < 2) {
      alert('Select at least 2 plans to merge');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/plans/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planIds: Array.from(selectedPlans),
          outputFilename,
          metadata: { tags: ['merged'] }
        })
      });

      if (!response.ok) throw new Error('Failed to merge plans');
      
      alert('Plans merged successfully!');
      setShowMergeModal(false);
      setSelectedPlans(new Set());
      loadPlans();
      loadStats();
    } catch (error) {
      console.error('Error merging plans:', error);
      alert('Failed to merge plans');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle plan selection for merging
   */
  const togglePlanSelection = (planId) => {
    const newSelected = new Set(selectedPlans);
    if (newSelected.has(planId)) {
      newSelected.delete(planId);
    } else {
      newSelected.add(planId);
    }
    setSelectedPlans(newSelected);
  };

  /**
   * Format date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  /**
   * Get status badge color
   */
  const getStatusColor = (status) => {
    const colors = {
      'draft': '#FDB022',
      'active': '#10B981',
      'archived': '#6B7280',
      'review': '#3B82F6'
    };
    return colors[status] || '#6B7280';
  };

  return (
    <div className="plan-manager">
      {/* AI Model Selector */}
      <AIModelSelector onModelChange={(model) => {
        console.log(`User switched to ${model} AI model`);
        loadPlans();
      }} />

      {/* Header */}
      <div className="pm-header">
        <div className="pm-title">
          <FileText size={28} />
          <h2>Strategic Plans Manager</h2>
          <span className="pm-subtitle">Zoe's Plan Hub</span>
        </div>

        <div className="pm-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={18} /> New Plan
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => selectedPlans.size >= 2 && setShowMergeModal(true)}
            disabled={selectedPlans.size < 2}
          >
            <Merge2 size={18} /> Merge ({selectedPlans.size})
          </button>
          <button 
            className="btn btn-ghost"
            onClick={loadPlans}
            disabled={loading}
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="pm-stats">
          <div className="stat-card">
            <FileText size={20} />
            <div>
              <p className="stat-value">{stats.totalPlans}</p>
              <p className="stat-label">Total Plans</p>
            </div>
          </div>
          <div className="stat-card">
            <CheckCircle2 size={20} />
            <div>
              <p className="stat-value">{stats.byStatus.active || 0}</p>
              <p className="stat-label">Active</p>
            </div>
          </div>
          <div className="stat-card">
            <Clock size={20} />
            <div>
              <p className="stat-value">{stats.averageWords}</p>
              <p className="stat-label">Avg Words</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="pm-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search plans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="status-filter"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="review">Review</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Plans List */}
      <div className="pm-list">
        {loading && <p className="loading">Loading plans...</p>}
        
        {!loading && plans.length === 0 && (
          <p className="no-plans">No plans found. Create one to get started!</p>
        )}

        {!loading && plans.map(plan => (
          <div 
            key={plan.id} 
            className={`plan-card ${selectedPlans.has(plan.id) ? 'selected' : ''}`}
          >
            <input
              type="checkbox"
              checked={selectedPlans.has(plan.id)}
              onChange={() => togglePlanSelection(plan.id)}
              className="plan-checkbox"
            />

            <div className="plan-content">
              <div className="plan-header">
                <h3>{plan.title}</h3>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(plan.status) }}
                >
                  {plan.status}
                </span>
              </div>

              <p className="plan-preview">{plan.preview}</p>

              <div className="plan-meta">
                <span className="meta-item">
                  <Calendar size={14} />
                  Updated {formatDate(plan.updated)}
                </span>
                {plan.tags.length > 0 && (
                  <span className="meta-item">
                    <Tag size={14} />
                    {plan.tags.join(', ')}
                  </span>
                )}
                {plan.aiImproved && (
                  <span className="meta-item ai-improved">
                    <Wand2 size={14} />
                    AI Enhanced
                  </span>
                )}
              </div>
            </div>

            <div className="plan-actions">
              <button 
                className="action-btn improve-btn"
                onClick={() => handleImprovePlan(plan.id)}
                title="Improve with AI"
              >
                <Wand2 size={18} />
              </button>
              <button 
                className="action-btn edit-btn"
                onClick={() => setEditingPlan(plan.id)}
                title="Edit plan"
              >
                <Edit2 size={18} />
              </button>
              <button 
                className="action-btn delete-btn"
                onClick={() => handleDeletePlan(plan.id)}
                title="Delete plan"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals will be added as separate components */}
      {showCreateModal && (
        <CreatePlanModal 
          onCreate={handleCreatePlan}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {showMergeModal && (
        <MergePlansModal
          selectedCount={selectedPlans.size}
          onMerge={handleMergePlans}
          onClose={() => setShowMergeModal(false)}
        />
      )}

      {editingPlan && (
        <PlanEditor
          planId={editingPlan}
          onClose={() => {
            setEditingPlan(null);
            loadPlans();
          }}
        />
      )}
    </div>
  );
}

/**
 * CreatePlanModal - Modal for creating new plans
 */
function CreatePlanModal({ onCreate, onClose }) {
  const [formData, setFormData] = useState({
    filename: '',
    title: '',
    content: '',
    tags: '',
    status: 'draft'
  });
  const [useAI, setUseAI] = useState(false);
  const [aiLoading, setAILoading] = useState(false);

  const handleGenerateAI = async () => {
    if (!formData.title) {
      alert('Enter plan title/type');
      return;
    }

    setAILoading(true);
    try {
      const response = await fetch('/api/plans/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType: formData.title,
          requirements: formData.content,
          filename: formData.filename || `${formData.title.toLowerCase().replace(/\s+/g, '-')}.md`
        })
      });

      if (!response.ok) throw new Error('Failed to generate plan');
      
      const result = await response.json();
      setFormData({
        ...formData,
        content: result.generatedContent,
        filename: result.filename
      });
      setUseAI(false);
      alert('Plan generated with AI!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate plan');
    } finally {
      setAILoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.filename || !formData.content) {
      alert('Filename and content are required');
      return;
    }

    onCreate({
      filename: formData.filename,
      content: formData.content,
      metadata: {
        title: formData.title || formData.filename,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        status: formData.status
      }
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Create New Plan</h3>

        <div className="toggle-section">
          <label>
            <input 
              type="checkbox" 
              checked={useAI}
              onChange={(e) => setUseAI(e.target.checked)}
            />
            Generate with AI
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Plan title/type (e.g., 'Monday Strategy')"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />

          <input
            type="text"
            placeholder="Filename (e.g., 'monday-strategy.md')"
            value={formData.filename}
            onChange={(e) => setFormData({...formData, filename: e.target.value})}
          />

          {useAI ? (
            <>
              <textarea
                placeholder="Requirements or description for AI generation"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows="4"
              />
              <button 
                type="button"
                className="btn btn-secondary"
                onClick={handleGenerateAI}
                disabled={aiLoading}
              >
                {aiLoading ? 'Generating...' : 'Generate with AI'}
              </button>
            </>
          ) : (
            <textarea
              placeholder="Plan content (markdown format)"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              rows="10"
              required
            />
          )}

          <input
            type="text"
            placeholder="Tags (comma-separated, optional)"
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
          />

          <select 
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="review">Review</option>
          </select>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Plan</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * MergePlansModal - Modal for merging plans
 */
function MergePlansModal({ selectedCount, onMerge, onClose }) {
  const [outputFilename, setOutputFilename] = useState('merged-plan.md');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!outputFilename.trim()) {
      alert('Enter output filename');
      return;
    }
    onMerge(outputFilename);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Merge {selectedCount} Plans</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Output filename (e.g., 'merged-plans.md')"
            value={outputFilename}
            onChange={(e) => setOutputFilename(e.target.value)}
            required
          />
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Merge Plans</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * PlanEditor - Component for editing plans
 */
function PlanEditor({ planId, onClose }) {
  const [plan, setPlan] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPlan();
  }, [planId]);

  const loadPlan = async () => {
    try {
      const response = await fetch(`/api/plans/${planId}`);
      if (!response.ok) throw new Error('Failed to load plan');
      
      const data = await response.json();
      setPlan(data);
      setContent(data.content);
    } catch (error) {
      console.error('Error loading plan:', error);
      alert('Failed to load plan');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      alert('Content cannot be empty');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/plans/${planId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });

      if (!response.ok) throw new Error('Failed to save plan');
      
      alert('Plan saved successfully!');
      onClose();
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Failed to save plan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay full-screen">
      <div className="editor-content">
        <div className="editor-header">
          <h3>{plan?.metadata?.title || 'Edit Plan'}</h3>
          <div className="editor-actions">
            <button className="btn btn-ghost" onClick={onClose}>Close</button>
            <button 
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving || loading}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading plan...</p>
        ) : (
          <textarea
            className="plan-editor"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter plan content in markdown format..."
          />
        )}
      </div>
    </div>
  );
}
