import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, User, X } from 'lucide-react';
import './SharedComponents.css';

const AssignmentDropdown = memo(({ 
  agents = [],
  selectedAgentId,
  onSelect,
  placeholder = 'Select Agent',
  searchable = true,
  showStatus = true,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  
  const selectedAgent = agents.find(a => a.id === selectedAgentId);
  
  const filteredAgents = searchQuery
    ? agents.filter(a => 
        a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.phone?.includes(searchQuery)
      )
    : agents;
  
  const handleSelect = useCallback((agentId) => {
    onSelect(agentId);
    setIsOpen(false);
    setSearchQuery('');
  }, [onSelect]);
  
  const handleClear = useCallback((e) => {
    e.stopPropagation();
    onSelect(null);
  }, [onSelect]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'busy': return '#F59E0B';
      case 'offline': return '#EF4444';
      default: return '#64748B';
    }
  };
  
  return (
    <div className={`assignment-dropdown ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`} ref={dropdownRef}>
      <button 
        className="dropdown-trigger"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {selectedAgent ? (
          <div className="selected-agent">
            <div className="agent-avatar">
              {selectedAgent.avatar || <User size={14} />}
            </div>
            <span className="agent-name">{selectedAgent.name}</span>
            {showStatus && (
              <span 
                className="agent-status-dot"
                style={{ backgroundColor: getStatusColor(selectedAgent.status) }}
              />
            )}
            <button className="clear-btn" onClick={handleClear}>
              <X size={14} />
            </button>
          </div>
        ) : (
          <span className="placeholder">{placeholder}</span>
        )}
        <ChevronDown size={16} className="dropdown-icon" />
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          {searchable && (
            <div className="dropdown-search">
              <Search size={14} />
              <input
                type="text"
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          )}
          
          <div className="dropdown-list">
            {filteredAgents.length === 0 ? (
              <div className="no-results">No agents found</div>
            ) : (
              filteredAgents.map(agent => (
                <button
                  key={agent.id}
                  className={`dropdown-item ${selectedAgentId === agent.id ? 'selected' : ''}`}
                  onClick={() => handleSelect(agent.id)}
                >
                  <div className="agent-avatar">
                    {agent.avatar || <User size={14} />}
                  </div>
                  <div className="agent-info">
                    <span className="agent-name">{agent.name}</span>
                    {agent.phone && <span className="agent-phone">{agent.phone}</span>}
                  </div>
                  {showStatus && (
                    <span 
                      className="agent-status-dot"
                      style={{ backgroundColor: getStatusColor(agent.status) }}
                    />
                  )}
                  {selectedAgentId === agent.id && (
                    <Check size={14} className="check-icon" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
});

AssignmentDropdown.displayName = 'AssignmentDropdown';
export default AssignmentDropdown;
