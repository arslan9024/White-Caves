import React, { memo, useState, useCallback } from 'react';
import { 
  Briefcase, MapPin, DollarSign, Clock, Send, Save, Eye,
  Linkedin, Globe, ChevronDown, ChevronUp, Users, Star
} from 'lucide-react';
import './JobComponents.css';

const JOB_PLATFORMS = [
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
  { id: 'indeed', name: 'Indeed', icon: Globe, color: '#2164F3' },
  { id: 'bayt', name: 'Bayt', icon: Globe, color: '#00B251' },
  { id: 'gulftalent', name: 'GulfTalent', icon: Globe, color: '#1A73E8' }
];

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'];
const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive', 'Director'];
const DEPARTMENTS = ['Sales', 'Marketing', 'Operations', 'Finance', 'HR', 'Technology', 'Administration'];

const JobPostComposer = memo(({ 
  job,
  onPublish,
  onSaveDraft,
  onPreview
}) => {
  const [formData, setFormData] = useState(job || {
    title: '',
    department: '',
    location: 'Dubai, UAE',
    employmentType: 'Full-time',
    experienceLevel: '',
    salaryMin: '',
    salaryMax: '',
    description: '',
    requirements: '',
    benefits: ''
  });
  const [selectedPlatforms, setSelectedPlatforms] = useState(['linkedin', 'bayt']);
  const [publishing, setPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = 'Job title is required';
    if (!formData.description?.trim()) newErrors.description = 'Job description is required';
    if (selectedPlatforms.length === 0) newErrors.platforms = 'Select at least one platform';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, selectedPlatforms]);
  
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  }, []);
  
  const handleFieldChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);
  
  const togglePlatform = useCallback((platformId) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  }, []);
  
  const handlePublish = useCallback(async () => {
    if (!validateForm()) {
      showNotification('Please fix the errors before publishing', 'error');
      return;
    }
    
    setPublishing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onPublish) {
        onPublish(formData, selectedPlatforms);
      }
      
      showNotification(`Job posted successfully to ${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? 's' : ''}!`, 'success');
    } catch (error) {
      showNotification('Failed to publish job. Please try again.', 'error');
    } finally {
      setPublishing(false);
    }
  }, [formData, selectedPlatforms, onPublish, validateForm, showNotification]);
  
  const handleSaveDraft = useCallback(() => {
    if (onSaveDraft) {
      onSaveDraft(formData);
    }
    showNotification('Draft saved successfully!', 'success');
  }, [formData, onSaveDraft, showNotification]);
  
  return (
    <div className="job-post-composer">
      {notification && (
        <div className={`notification-toast ${notification.type}`}>
          {notification.message}
        </div>
      )}
      
      <div className="composer-header">
        <div className="header-icon">
          <Briefcase size={24} />
        </div>
        <div className="header-info">
          <h3>Job Post Composer</h3>
          <p>Create and publish job listings across multiple platforms</p>
        </div>
      </div>
      
      <div className="platform-selection">
        <h4>Publish To</h4>
        <div className="platforms-row">
          {JOB_PLATFORMS.map(platform => {
            const IconComponent = platform.icon;
            return (
              <button
                key={platform.id}
                className={`platform-chip ${selectedPlatforms.includes(platform.id) ? 'selected' : ''}`}
                onClick={() => togglePlatform(platform.id)}
                style={{ '--platform-color': platform.color }}
              >
                <IconComponent size={16} />
                <span>{platform.name}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="job-form">
        <div className="form-section">
          <h4>Job Details</h4>
          <div className="form-grid">
            <div className={`form-field span-2 ${errors.title ? 'has-error' : ''}`}>
              <label>Job Title <span className="required">*</span></label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => { handleFieldChange('title', e.target.value); setErrors(prev => ({...prev, title: null})); }}
                placeholder="e.g., Senior Real Estate Agent"
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>
            
            <div className="form-field">
              <label>Department</label>
              <select
                value={formData.department}
                onChange={(e) => handleFieldChange('department', e.target.value)}
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div className="form-field">
              <label>Location</label>
              <div className="input-with-icon">
                <MapPin size={16} />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleFieldChange('location', e.target.value)}
                  placeholder="e.g., Dubai, UAE"
                />
              </div>
            </div>
            
            <div className="form-field">
              <label>Employment Type</label>
              <select
                value={formData.employmentType}
                onChange={(e) => handleFieldChange('employmentType', e.target.value)}
              >
                {EMPLOYMENT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="form-field">
              <label>Experience Level</label>
              <select
                value={formData.experienceLevel}
                onChange={(e) => handleFieldChange('experienceLevel', e.target.value)}
              >
                <option value="">Select Level</option>
                {EXPERIENCE_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            
            <div className="form-field">
              <label>Salary Range (AED/month)</label>
              <div className="salary-range">
                <input
                  type="number"
                  value={formData.salaryMin}
                  onChange={(e) => handleFieldChange('salaryMin', e.target.value)}
                  placeholder="Min"
                />
                <span>to</span>
                <input
                  type="number"
                  value={formData.salaryMax}
                  onChange={(e) => handleFieldChange('salaryMax', e.target.value)}
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h4>Job Description</h4>
          <div className={`form-field ${errors.description ? 'has-error' : ''}`}>
            <label>Description <span className="required">*</span></label>
            <textarea
              value={formData.description}
              onChange={(e) => { handleFieldChange('description', e.target.value); setErrors(prev => ({...prev, description: null})); }}
              placeholder="Describe the role, responsibilities, and day-to-day activities..."
              rows={5}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>
          
          <div className="form-field">
            <label>Requirements</label>
            <textarea
              value={formData.requirements}
              onChange={(e) => handleFieldChange('requirements', e.target.value)}
              placeholder="List the qualifications, skills, and experience required..."
              rows={4}
            />
          </div>
          
          <div className="form-field">
            <label>Benefits</label>
            <textarea
              value={formData.benefits}
              onChange={(e) => handleFieldChange('benefits', e.target.value)}
              placeholder="List the benefits and perks offered..."
              rows={3}
            />
          </div>
        </div>
      </div>
      
      {errors.platforms && (
        <div className="platform-error">{errors.platforms}</div>
      )}
      
      <div className="composer-actions">
        <button className="action-btn secondary" onClick={handleSaveDraft}>
          <Save size={16} />
          Save Draft
        </button>
        <button className="action-btn secondary" onClick={() => setShowPreview(!showPreview)}>
          <Eye size={16} />
          Preview
        </button>
        <button 
          className="action-btn primary"
          onClick={handlePublish}
          disabled={!formData.title || !formData.description || selectedPlatforms.length === 0 || publishing}
        >
          {publishing ? (
            'Publishing...'
          ) : (
            <><Send size={16} /> Publish to {selectedPlatforms.length} Platform{selectedPlatforms.length !== 1 ? 's' : ''}</>
          )}
        </button>
      </div>
      
      {showPreview && (
        <div className="job-preview">
          <h4>Job Preview</h4>
          <div className="preview-card">
            <div className="preview-header">
              <h3>{formData.title || 'Job Title'}</h3>
              <span className="company">White Caves Real Estate</span>
            </div>
            <div className="preview-meta">
              <span><MapPin size={14} /> {formData.location || 'Location'}</span>
              <span><Clock size={14} /> {formData.employmentType}</span>
              <span><Users size={14} /> {formData.department || 'Department'}</span>
              {formData.salaryMin && formData.salaryMax && (
                <span><DollarSign size={14} /> AED {formData.salaryMin} - {formData.salaryMax}/month</span>
              )}
            </div>
            {formData.description && (
              <div className="preview-section">
                <h5>Description</h5>
                <p>{formData.description}</p>
              </div>
            )}
            {formData.requirements && (
              <div className="preview-section">
                <h5>Requirements</h5>
                <p>{formData.requirements}</p>
              </div>
            )}
            {formData.benefits && (
              <div className="preview-section">
                <h5>Benefits</h5>
                <p>{formData.benefits}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

JobPostComposer.displayName = 'JobPostComposer';
export default JobPostComposer;
