import React from 'react';
import { ChevronDown, ChevronRight, FileCode, Copy, Edit2, Folder } from 'lucide-react';

interface ModuleFile {
  name: string;
  lines: number;
}

interface CodeModule {
  name: string;
  expanded: boolean;
  files: ModuleFile[];
}

interface CodeModulesData {
  codeModules: CodeModule[];
  expandedModule: string | null;
  handleToggleModule: (moduleName: string) => void;
}

interface CodeModulesTabProps {
  data: CodeModulesData;
}

export const CodeModulesTab: React.FC<CodeModulesTabProps> = ({ data }) => {
  const { codeModules, expandedModule, handleToggleModule } = data;

  return (
    <div className="code-modules-tab">
      <div className="tab-header">
        <h3>Code Modules</h3>
        <p className="subtitle">Manage bot code and modules</p>
      </div>

      <div className="modules-tree">
        {codeModules.map((module: CodeModule) => (
          <div key={module.name} className="module-group">
            <div
              className="module-header"
              onClick={() => handleToggleModule(module.name)}
              style={{ cursor: 'pointer' }}
            >
              <span className="module-toggle">
                {module.expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </span>
              <Folder size={18} className="module-icon" />
              <span className="module-name">{module.name}</span>
              <span className="file-count">{module.files.length} files</span>
            </div>

            {module.expanded && (
              <div className="files-list">
                {module.files.map((file: ModuleFile) => (
                  <div key={file.name} className="file-item">
                    <FileCode size={16} className="file-icon" />
                    <div className="file-info">
                      <span className="file-name">{file.name}</span>
                      <span className="file-lines">{file.lines} lines</span>
                    </div>
                    <div className="file-actions">
                      <button className="action-btn" title="View"><FileCode size={14} /></button>
                      <button className="action-btn" title="Copy"><Copy size={14} /></button>
                      <button className="action-btn" title="Edit"><Edit2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="module-stats">
        <div className="stat">
          <span className="label">Total Modules</span>
          <span className="value">{codeModules.length}</span>
        </div>
        <div className="stat">
          <span className="label">Total Files</span>
          <span className="value">{codeModules.reduce((sum: number, m: CodeModule) => sum + m.files.length, 0)}</span>
        </div>
        <div className="stat">
          <span className="label">Total Lines of Code</span>
          <span className="value">{codeModules.reduce((sum, m) => sum + m.files.reduce((s, f) => s + f.lines, 0), 0)}</span>
        </div>
      </div>
    </div>
  );
};
