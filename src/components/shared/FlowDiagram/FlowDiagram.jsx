import React from 'react';
import { ArrowRight, Check, Clock, Circle } from 'lucide-react';
import './FlowDiagram.css';

const FlowDiagram = ({
  nodes = [],
  currentNode = null,
  direction = 'horizontal',
  showLabels = true,
  onNodeClick = null,
  colorScheme = '#D32F2F'
}) => {
  const getNodeStatus = (node, index) => {
    const currentIndex = nodes.findIndex(n => n.id === currentNode);
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'active';
    return 'pending';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <Check size={16} />;
      case 'active':
        return <Clock size={16} />;
      default:
        return <Circle size={12} />;
    }
  };

  return (
    <div className={`flow-diagram ${direction}`} style={{ '--flow-color': colorScheme }}>
      {nodes.map((node, index) => {
        const status = node.status || getNodeStatus(node, index);
        const isClickable = onNodeClick !== null;

        return (
          <React.Fragment key={node.id}>
            <div 
              className={`flow-node ${status} ${isClickable ? 'clickable' : ''}`}
              onClick={() => isClickable && onNodeClick(node)}
            >
              <div className="node-icon">
                {node.icon || getStatusIcon(status)}
              </div>
              {showLabels && (
                <div className="node-info">
                  <span className="node-label">{node.label}</span>
                  {node.sublabel && (
                    <span className="node-sublabel">{node.sublabel}</span>
                  )}
                </div>
              )}
            </div>
            
            {index < nodes.length - 1 && (
              <div className={`flow-connector ${status === 'completed' ? 'completed' : ''}`}>
                <ArrowRight size={18} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default FlowDiagram;
