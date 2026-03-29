import React from 'react';
import { Package, FileCode } from 'lucide-react';

interface ComponentItem {
  name: string;
  status: string;
  category: string;
  usage: number;
  a11y: string;
}

interface ComponentsTabProps {
  components: ComponentItem[];
}

const ComponentsTab: React.FC<ComponentsTabProps> = ({ components }) => {
  return (
    <div className="components-view">
      <h3>Component Library</h3>
      
      <div className="components-header">
        <button className="btn-primary">
          <Package size={16} /> Add Component
        </button>
      </div>

      <div className="components-grid">
        {components.map((component: ComponentItem) => (
          <div key={component.name} className={`component-card status-${component.status}`}>
            <div className="component-header">
              <FileCode size={18} />
              <span className="component-name">{component.name}</span>
              <span className={`status-badge ${component.status}`}>
                {component.status}
              </span>
            </div>
            <div className="component-meta">
              <span className="category">{component.category}</span>
              <span className="usage">{component.usage} usages</span>
              <span className={`a11y-badge a11y-${component.a11y.toLowerCase()}`}>
                {component.a11y}
              </span>
            </div>
            <div className="component-actions">
              <button className="btn-small">View</button>
              <button className="btn-small">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentsTab;
