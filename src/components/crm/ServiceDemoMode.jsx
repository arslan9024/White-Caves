import React, { useState, useCallback } from 'react';
import { 
  Play, Pause, SkipForward, RotateCcw, ChevronDown, ChevronRight,
  Clock, CheckCircle, Users, Zap, FileText, Bot, ArrowRight
} from 'lucide-react';
import { COMPANY_SERVICES, getAllServices, getServicesByCategory } from '../../data/services/companyServices';
import FlowchartViewer from './FlowchartViewer';
import './ServiceDemoMode.css';

const SERVICE_CATEGORIES = [
  { id: 'sales', label: 'Property Sales', icon: '🏠', color: '#8B5CF6' },
  { id: 'leasing', label: 'Leasing', icon: '🔑', color: '#14B8A6' },
  { id: 'financial', label: 'Financial', icon: '💰', color: '#F59E0B' },
  { id: 'legal', label: 'Legal & Compliance', icon: '⚖️', color: '#6366F1' },
  { id: 'operations', label: 'Operations', icon: '⚙️', color: '#10B981' },
  { id: 'marketing', label: 'Marketing', icon: '📣', color: '#EC4899' },
  { id: 'technology', label: 'Technology', icon: '💻', color: '#06B6D4' }
];

const ServiceDemoMode = () => {
  const [selectedCategory, setSelectedCategory] = useState('sales');
  const [selectedService, setSelectedService] = useState(null);
  const [currentStageIndex, setCurrentStageIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [demoLog, setDemoLog] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState(['sales']);

  const services = getServicesByCategory(selectedCategory) || [];
  const currentStage = selectedService?.stages?.[currentStageIndex] || null;

  const addLogEntry = useCallback((message, type = 'info') => {
    setDemoLog(prev => [
      ...prev,
      {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        message,
        type
      }
    ].slice(-20));
  }, []);

  const handleSelectService = (service) => {
    setSelectedService(service);
    setCurrentStageIndex(-1);
    setIsPlaying(false);
    setDemoLog([]);
    addLogEntry(`Selected service: ${service.name}`, 'system');
    addLogEntry(`This workflow has ${service.stages?.length || 0} stages`, 'info');
    addLogEntry(`Assigned AI assistants: ${service.assistants?.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(', ')}`, 'info');
  };

  const handleNextStage = useCallback(() => {
    if (!selectedService?.stages) return;
    
    if (currentStageIndex < selectedService.stages.length - 1) {
      const nextIndex = currentStageIndex + 1;
      const nextStage = selectedService.stages[nextIndex];
      setCurrentStageIndex(nextIndex);
      addLogEntry(`Stage ${nextIndex + 1}: ${nextStage.name}`, 'stage');
      
      if (nextStage.actions) {
        nextStage.actions.forEach((action, idx) => {
          setTimeout(() => {
            addLogEntry(`  • ${action}`, 'action');
          }, (idx + 1) * 300);
        });
      }
    } else {
      setIsPlaying(false);
      addLogEntry('Workflow completed successfully!', 'success');
    }
  }, [selectedService, currentStageIndex, addLogEntry]);

  const handlePlayPause = () => {
    if (!selectedService) return;
    
    if (currentStageIndex === -1) {
      addLogEntry('Starting workflow demonstration...', 'system');
      handleNextStage();
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentStageIndex(-1);
    setIsPlaying(false);
    setDemoLog([]);
    if (selectedService) {
      addLogEntry(`Reset workflow: ${selectedService.name}`, 'system');
    }
  };

  const handleStageClick = (stage, index) => {
    setCurrentStageIndex(index);
    addLogEntry(`Jumped to stage: ${stage.name}`, 'system');
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
    setSelectedCategory(categoryId);
  };

  React.useEffect(() => {
    let interval;
    if (isPlaying && selectedService && currentStageIndex < selectedService.stages.length - 1) {
      interval = setInterval(() => {
        handleNextStage();
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStageIndex, selectedService, handleNextStage]);

  return (
    <div className="service-demo-mode">
      <div className="demo-header">
        <div className="demo-title">
          <Zap size={24} />
          <h2>Service Workflow Demo</h2>
        </div>
        <p className="demo-description">
          Interactive demonstration of White Caves' 35 service workflows. Select a service to explore the end-to-end process.
        </p>
      </div>

      <div className="demo-content">
        <aside className="service-selector">
          <h3>Select Service</h3>
          <div className="category-list">
            {SERVICE_CATEGORIES.map(category => {
              const categoryServices = COMPANY_SERVICES[category.id] || [];
              const isExpanded = expandedCategories.includes(category.id);
              
              return (
                <div key={category.id} className="category-section">
                  <button 
                    className={`category-header ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => toggleCategory(category.id)}
                    style={{ '--category-color': category.color }}
                  >
                    <span className="category-icon">{category.icon}</span>
                    <span className="category-name">{category.label}</span>
                    <span className="category-count">{categoryServices.length}</span>
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  
                  {isExpanded && (
                    <div className="service-list">
                      {categoryServices.map(service => (
                        <button
                          key={service.id}
                          className={`service-item ${selectedService?.id === service.id ? 'selected' : ''}`}
                          onClick={() => handleSelectService(service)}
                        >
                          <span className="service-icon">{service.icon}</span>
                          <div className="service-info">
                            <span className="service-name">{service.name}</span>
                            <span className="service-meta">{service.stages?.length || 0} stages</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        <main className="demo-main">
          {selectedService ? (
            <>
              <div className="service-header">
                <div className="service-identity">
                  <span className="service-icon-large">{selectedService.icon}</span>
                  <div>
                    <h3>{selectedService.name}</h3>
                    <p>{selectedService.description}</p>
                  </div>
                </div>
                <div className="service-stats">
                  <div className="stat">
                    <Clock size={16} />
                    <span>{selectedService.avgDuration}</span>
                  </div>
                  <div className="stat">
                    <FileText size={16} />
                    <span>{selectedService.stages?.length || 0} stages</span>
                  </div>
                  <div className="stat">
                    <Bot size={16} />
                    <span>{selectedService.assistants?.length || 0} AI assistants</span>
                  </div>
                </div>
              </div>

              <div className="demo-controls">
                <button 
                  className={`control-btn play ${isPlaying ? 'playing' : ''}`}
                  onClick={handlePlayPause}
                  disabled={currentStageIndex >= (selectedService.stages?.length || 0) - 1 && !isPlaying}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  {isPlaying ? 'Pause' : currentStageIndex === -1 ? 'Start Demo' : 'Resume'}
                </button>
                <button 
                  className="control-btn"
                  onClick={handleNextStage}
                  disabled={currentStageIndex >= (selectedService.stages?.length || 0) - 1}
                >
                  <SkipForward size={18} />
                  Next Stage
                </button>
                <button 
                  className="control-btn"
                  onClick={handleReset}
                >
                  <RotateCcw size={18} />
                  Reset
                </button>
                
                <div className="progress-indicator">
                  <span>Progress: {currentStageIndex + 1 > 0 ? currentStageIndex + 1 : 0} / {selectedService.stages?.length || 0}</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${((currentStageIndex + 1) / (selectedService.stages?.length || 1)) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="workflow-visualization">
                <h4>Workflow Stages</h4>
                <FlowchartViewer
                  stages={selectedService.stages || []}
                  currentStage={currentStage?.id}
                  onStageClick={handleStageClick}
                  interactive={true}
                  showActions={true}
                  orientation="horizontal"
                />
              </div>

              {currentStage && (
                <div className="current-stage-detail">
                  <h4>
                    <span className="stage-icon">{currentStage.icon}</span>
                    Current Stage: {currentStage.name}
                  </h4>
                  <div className="stage-details-grid">
                    <div className="detail-card">
                      <label>Duration</label>
                      <span>{currentStage.duration}</span>
                    </div>
                    <div className="detail-card actions">
                      <label>Actions</label>
                      <ul>
                        {currentStage.actions?.map((action, idx) => (
                          <li key={idx}>
                            <CheckCircle size={14} />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="assigned-assistants">
                <h4><Users size={16} /> Assigned AI Assistants</h4>
                <div className="assistant-chips">
                  {selectedService.assistants?.map(assistant => (
                    <span key={assistant} className="assistant-chip">
                      <Bot size={14} />
                      {assistant.charAt(0).toUpperCase() + assistant.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="demo-placeholder">
              <div className="placeholder-icon">
                <Zap size={64} strokeWidth={1} />
              </div>
              <h3>Select a Service to Begin</h3>
              <p>Choose a service from the sidebar to view its complete workflow and run an interactive demonstration.</p>
              <div className="service-quick-stats">
                <div className="quick-stat">
                  <span className="stat-value">35</span>
                  <span className="stat-label">Services</span>
                </div>
                <div className="quick-stat">
                  <span className="stat-value">7</span>
                  <span className="stat-label">Categories</span>
                </div>
                <div className="quick-stat">
                  <span className="stat-value">150+</span>
                  <span className="stat-label">Workflow Stages</span>
                </div>
              </div>
            </div>
          )}
        </main>

        <aside className="demo-log">
          <h4>
            <FileText size={16} />
            Activity Log
          </h4>
          <div className="log-entries">
            {demoLog.length === 0 ? (
              <div className="log-empty">Select a service and start the demo to see activity</div>
            ) : (
              demoLog.map(entry => (
                <div key={entry.id} className={`log-entry log-${entry.type}`}>
                  <span className="log-time">{entry.timestamp}</span>
                  <span className="log-message">{entry.message}</span>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ServiceDemoMode;
