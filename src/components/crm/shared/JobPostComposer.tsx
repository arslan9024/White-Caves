import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { 
  Briefcase, MapPin, DollarSign, Clock, Send, Save, Eye,
  Linkedin, Globe, ChevronDown, ChevronUp, Users, Star
} from 'lucide-react';
import * as S from './JobComponents.styles';

const JOB_PLATFORMS = [
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
  { id: 'indeed', name: 'Indeed', icon: Globe, color: '#2164F3' },
  { id: 'bayt', name: 'Bayt', icon: Globe, color: '#00B251' },
  { id: 'gulftalent', name: 'GulfTalent', icon: Globe, color: '#1A73E8' }
];

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'];
const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive', 'Director'];
const DEPARTMENTS = ['Sales', 'Marketing', 'Operations', 'Finance', 'HR', 'Technology', 'Administration'];

interface JobData {
  title?: string;
  department?: string;
  location?: string;
  employmentType?: string;
  experienceLevel?: string;
  salaryMin?: string;
  salaryMax?: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  [key: string]: unknown;
}

interface JobPostComposerProps {
  job?: JobData;
  onPublish?: (data: JobData, platforms: string[]) => void;
  onSaveDraft?: (data: JobData) => void;
  onPreview?: (data: JobData) => void;
}

const JobPostComposer = memo(({ 
  job,
  onPublish,
  onSaveDraft,
  onPreview
}: JobPostComposerProps) => {
  const [formData, setFormData] = useState<JobData>(job || {
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
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['linkedin', 'bayt']);
  const [publishing, setPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const notifyTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => clearTimeout(notifyTimerRef.current);
  }, []);
  
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) newErrors.title = 'Job title is required';
    if (!formData.description?.trim()) newErrors.description = 'Job description is required';
    if (selectedPlatforms.length === 0) newErrors.platforms = 'Select at least one platform';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, selectedPlatforms]);
  
  const showNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    clearTimeout(notifyTimerRef.current);
    notifyTimerRef.current = setTimeout(() => setNotification(null), 4000);
  }, []);
  
  const handleFieldChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);
  
  const togglePlatform = useCallback((platformId: string) => {
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
    <S.JobPostComposer>
      {notification && (
        <S.NotificationToast $type={notification.type}>
          {notification.message}
        </S.NotificationToast>
      )}
      
      <S.ComposerHeader>
        <S.HeaderIcon>
          <Briefcase size={24} />
        </S.HeaderIcon>
        <S.HeaderInfo>
          <h3>Job Post Composer</h3>
          <p>Create and publish job listings across multiple platforms</p>
        </S.HeaderInfo>
      </S.ComposerHeader>
      
      <S.PlatformSelection>
        <h4>Publish To</h4>
        <S.PlatformsRow>
          {JOB_PLATFORMS.map(platform => {
            const IconComponent = platform.icon;
            return (
              <S.PlatformChip
                key={platform.id}
                $selected={selectedPlatforms.includes(platform.id)}
                $color={platform.color}
                onClick={() => togglePlatform(platform.id)}
              >
                <IconComponent size={16} />
                <span>{platform.name}</span>
              </S.PlatformChip>
            );
          })}
        </S.PlatformsRow>
      </S.PlatformSelection>
      
      <S.JobForm>
        <S.FormSection>
          <h4>Job Details</h4>
          <S.FormGrid>
            <S.FormField $span2 $hasError={!!errors.title}>
              <label>Job Title <span className="required">*</span></label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => { handleFieldChange('title', e.target.value); setErrors(prev => ({...prev, title: ''})); }}
                placeholder="e.g., Senior Real Estate Agent"
              />
              {errors.title && <S.ErrorMessage>{errors.title}</S.ErrorMessage>}
            </S.FormField>
            
            <S.FormField>
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
            </S.FormField>
            
            <S.FormField>
              <label>Location</label>
              <S.InputWithIcon>
                <MapPin size={16} />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleFieldChange('location', e.target.value)}
                  placeholder="e.g., Dubai, UAE"
                />
              </S.InputWithIcon>
            </S.FormField>
            
            <S.FormField>
              <label>Employment Type</label>
              <select
                value={formData.employmentType}
                onChange={(e) => handleFieldChange('employmentType', e.target.value)}
              >
                {EMPLOYMENT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </S.FormField>
            
            <S.FormField>
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
            </S.FormField>
            
            <S.FormField>
              <label>Salary Range (AED/month)</label>
              <S.SalaryRange>
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
              </S.SalaryRange>
            </S.FormField>
          </S.FormGrid>
        </S.FormSection>
        
        <S.FormSection>
          <h4>Job Description</h4>
          <S.FormField $hasError={!!errors.description}>
            <label>Description <span className="required">*</span></label>
            <textarea
              value={formData.description}
              onChange={(e) => { handleFieldChange('description', e.target.value); setErrors(prev => ({...prev, description: ''})); }}
              placeholder="Describe the role, responsibilities, and day-to-day activities..."
              rows={5}
            />
            {errors.description && <S.ErrorMessage>{errors.description}</S.ErrorMessage>}
          </S.FormField>
          
          <S.FormField>
            <label>Requirements</label>
            <textarea
              value={formData.requirements}
              onChange={(e) => handleFieldChange('requirements', e.target.value)}
              placeholder="List the qualifications, skills, and experience required..."
              rows={4}
            />
          </S.FormField>
          
          <S.FormField>
            <label>Benefits</label>
            <textarea
              value={formData.benefits}
              onChange={(e) => handleFieldChange('benefits', e.target.value)}
              placeholder="List the benefits and perks offered..."
              rows={3}
            />
          </S.FormField>
        </S.FormSection>
      </S.JobForm>
      
      {errors.platforms && (
        <S.PlatformError>{errors.platforms}</S.PlatformError>
      )}
      
      <S.ComposerActions>
        <S.ActionBtn $variant="secondary" onClick={handleSaveDraft}>
          <Save size={16} />
          Save Draft
        </S.ActionBtn>
        <S.ActionBtn $variant="secondary" onClick={() => setShowPreview(!showPreview)}>
          <Eye size={16} />
          Preview
        </S.ActionBtn>
        <S.ActionBtn 
          $variant="primary"
          onClick={handlePublish}
          disabled={!formData.title || !formData.description || selectedPlatforms.length === 0 || publishing}
        >
          {publishing ? (
            'Publishing...'
          ) : (
            <><Send size={16} /> Publish to {selectedPlatforms.length} Platform{selectedPlatforms.length !== 1 ? 's' : ''}</>
          )}
        </S.ActionBtn>
      </S.ComposerActions>
      
      {showPreview && (
        <S.JobPreview>
          <h4>Job Preview</h4>
          <S.PreviewCard>
            <S.PreviewHeader>
              <h3>{formData.title || 'Job Title'}</h3>
              <span className="company">White Caves Real Estate</span>
            </S.PreviewHeader>
            <S.PreviewMeta>
              <span><MapPin size={14} /> {formData.location || 'Location'}</span>
              <span><Clock size={14} /> {formData.employmentType}</span>
              <span><Users size={14} /> {formData.department || 'Department'}</span>
              {formData.salaryMin && formData.salaryMax && (
                <span><DollarSign size={14} /> AED {formData.salaryMin} - {formData.salaryMax}/month</span>
              )}
            </S.PreviewMeta>
            {formData.description && (
              <S.PreviewSection>
                <h5>Description</h5>
                <p>{formData.description}</p>
              </S.PreviewSection>
            )}
            {formData.requirements && (
              <S.PreviewSection>
                <h5>Requirements</h5>
                <p>{formData.requirements}</p>
              </S.PreviewSection>
            )}
            {formData.benefits && (
              <S.PreviewSection>
                <h5>Benefits</h5>
                <p>{formData.benefits}</p>
              </S.PreviewSection>
            )}
          </S.PreviewCard>
        </S.JobPreview>
      )}
    </S.JobPostComposer>
  );
});

JobPostComposer.displayName = 'JobPostComposer';
export default JobPostComposer;
