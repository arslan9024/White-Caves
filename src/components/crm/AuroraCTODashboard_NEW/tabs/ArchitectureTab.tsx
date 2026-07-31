import React from 'react';
import { BarChart3, Server, Database, AlertCircle, CheckCircle } from 'lucide-react';
import type { TechStack, SystemComponent } from '../data/architecture';

interface ArchModule {
  name: string;
  description: string;
  status: string;
}

interface ModuleCategory {
  category: string;
  modules: ArchModule[];
}

interface ArchitectureTabProps {
  modules: ModuleCategory[];
  techStack: TechStack;
  systemComponents: SystemComponent[];
}

const ArchitectureTab: React.FC<ArchitectureTabProps> = ({ modules, techStack, systemComponents }) => {
  return (
    <div className="architecture-view">
      <h3>Platform Architecture</h3>
      
      <div className="platforms-section">
        <h4><BarChart3 size={16} /> Platform Modules</h4>
        <div className="categories-grid">
          {modules.map((category: ModuleCategory) => (
            <div key={category.category} className="category-section">
              <h5>{category.category}</h5>
              <div className="modules-list">
                {category.modules.map((module: ArchModule) => (
                  <div key={module.name} className={`module-item status-${module.status}`}>
                    <div className="module-icon">
                      {module.status === 'production' ? (
                        <CheckCircle size={14} style={{ color: 'var(--success-color)' }} />
                      ) : (
                        <AlertCircle size={14} />
                      )}
                    </div>
                    <div className="module-info">
                      <span className="module-name">{module.name}</span>
                      <span className="module-desc">{module.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="tech-stack-section">
        <h4><Server size={16} /> Technology Stack</h4>
        <div className="tech-grid">
          {Object.entries(techStack).map(([category, items]: [string, string[]]) => (
            <div key={category} className="tech-category">
              <h5>{category.replace(/([A-Z])/g, ' $1').toUpperCase().trim()}</h5>
              <ul className="tech-list">
                {items.map((item: string) => (
                  <li key={item} className="tech-item">
                    <span className="tech-name">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="system-components-section">
        <h4><Database size={16} /> System Components</h4>
        <div className="components-grid">
          {systemComponents.map((component: SystemComponent) => (
            <div key={component.id} className={`component-card status-${component.status}`}>
              <div className="component-header">
                <h5>{component.name}</h5>
                <span className={`type-badge type-${component.type}`}>
                  {component.type}
                </span>
              </div>
              <div className="metrics-display">
                <div className="metric">
                  <span className="label">CPU</span>
                  <span className="value">{component.metrics.cpu}%</span>
                </div>
                <div className="metric">
                  <span className="label">Memory</span>
                  <span className="value">{component.metrics.memory}%</span>
                </div>
                <div className="metric">
                  <span className="label">Uptime</span>
                  <span className="value">{component.metrics.uptime}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArchitectureTab;
