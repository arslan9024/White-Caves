import React, { useState, useEffect } from 'react';
import { Zap, Server, Cloud, CheckCircle, AlertCircle, Settings } from 'lucide-react';
import './AIModelSelector.css';

/**
 * AIModelSelector - Component to switch between DeepSeek and Ollama AI models
 * Displays model status and allows user to select preferred AI backend
 */
export default function AIModelSelector({ onModelChange = null }) {
  const [currentModel, setCurrentModel] = useState('deepseek');
  const [modelStatus, setModelStatus] = useState({
    deepseek: false,
    ollama: false
  });
  const [loading, setLoading] = useState(true);

  // Check AI model availability on mount
  useEffect(() => {
    checkModelsAvailability();
    const interval = setInterval(checkModelsAvailability, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  /**
   * Check which AI models are available
   */
  const checkModelsAvailability = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/plans/ai-status');
      if (response.ok) {
        const data = await response.json();
        setModelStatus({
          deepseek: data.deepseekAvailable || false,
          ollama: data.ollamaAvailable || false
        });
        setCurrentModel(data.currentModel || 'deepseek');
      }
    } catch (error) {
      console.error('Failed to check AI model status:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Switch AI model
   */
  const handleSwitchModel = async (modelName) => {
    try {
      const response = await fetch('/api/plans/set-ai-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: modelName })
      });

      if (response.ok) {
        setCurrentModel(modelName);
        if (onModelChange) onModelChange(modelName);
        alert(`Switched to ${modelName} AI model`);
      } else {
        const error = await response.json();
        alert(`Failed to switch to ${modelName}. ${error.error || 'Model may not be available.'}`);
      }
    } catch (error) {
      console.error('Error switching AI model:', error);
      alert('Error switching AI model');
    }
  };

  const getModelIcon = (model) => {
    return model === 'deepseek' ? <Cloud size={20} /> : <Server size={20} />;
  };

  const getStatusIcon = (isAvailable) => {
    return isAvailable 
      ? <CheckCircle size={16} className="text-green-500" />
      : <AlertCircle size={16} className="text-red-500" />;
  };

  const getStatusText = (model, isAvailable) => {
    if (!isAvailable) return 'Unavailable';
    return currentModel === model ? 'Active' : 'Ready';
  };

  return (
    <div className="ai-model-selector">
      <div className="selector-header">
        <Zap size={18} className="selector-icon" />
        <span className="selector-title">AI Model</span>
        <Settings size={16} className="settings-icon" />
      </div>

      <div className="models-grid">
        {/* DeepSeek Option */}
        <div
          className={`model-card ${currentModel === 'deepseek' ? 'active' : ''} ${!modelStatus.deepseek ? 'disabled' : ''}`}
          onClick={() => modelStatus.deepseek && handleSwitchModel('deepseek')}
        >
          <div className="model-header">
            <Cloud size={24} className="model-icon deepseek" />
            <span className="model-name">DeepSeek</span>
          </div>
          <div className="model-details">
            <p className="model-type">Cloud API</p>
            <div className="model-status">
              {getStatusIcon(modelStatus.deepseek)}
              <span>{getStatusText('deepseek', modelStatus.deepseek)}</span>
            </div>
          </div>
          <div className="model-features">
            <span className="feature">⚡ Fast</span>
            <span className="feature">🔒 Secure</span>
            <span className="feature">💰 Free</span>
          </div>
        </div>

        {/* Ollama Option */}
        <div
          className={`model-card ${currentModel === 'ollama' ? 'active' : ''} ${!modelStatus.ollama ? 'disabled' : ''}`}
          onClick={() => modelStatus.ollama && handleSwitchModel('ollama')}
        >
          <div className="model-header">
            <Server size={24} className="model-icon ollama" />
            <span className="model-name">Ollama</span>
          </div>
          <div className="model-details">
            <p className="model-type">Local/Private</p>
            <div className="model-status">
              {getStatusIcon(modelStatus.ollama)}
              <span>{getStatusText('ollama', modelStatus.ollama)}</span>
            </div>
          </div>
          <div className="model-features">
            <span className="feature">🏠 Local</span>
            <span className="feature">🔐 Private</span>
            <span className="feature">⚙️ Custom</span>
          </div>
        </div>
      </div>

      <div className="selector-footer">
        {loading && <span className="loading">Checking models...</span>}
        <button 
          className="refresh-btn"
          onClick={checkModelsAvailability}
          disabled={loading}
          title="Refresh model status"
        >
          {loading ? '⟳ Checking...' : '⟳ Refresh'}
        </button>
      </div>

      <div className="selector-help">
        <p>
          <strong>DeepSeek:</strong> Cloud-based, fast responses, requires API key (recommended)
        </p>
        <p>
          <strong>Ollama:</strong> Runs locally, fully private, requires installation
        </p>
      </div>
    </div>
  );
}
