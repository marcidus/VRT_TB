import React from 'react';
import { DashboardItem } from './DashboardItemTypes';
import './DashboardTemplates.css'; // Import the CSS file

interface DashboardTemplatesProps {
  templates: { [key: string]: DashboardItem[] };
  onLoadTemplate: (templateName: string) => void;
  onImportTemplate: (templateName: string, state: DashboardItem[]) => void;
  onDeleteTemplate: (templateName: string) => void;
  onRenameTemplate: (oldTemplateName: string, newTemplateName: string) => void;
  onSaveTemplate: (templateName: string) => void;
}

const DashboardTemplates: React.FC<DashboardTemplatesProps> = ({
  templates,
  onLoadTemplate,
  onImportTemplate,
  onDeleteTemplate,
  onRenameTemplate,
  onSaveTemplate
}) => {
  const handleExport = (templateName: string) => {
    const state = templates[templateName];
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${templateName}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const importedState: DashboardItem[] = JSON.parse(e.target.result as string);
          const templateName = prompt('Enter a name for the imported template:', 'Imported Template');
          if (templateName) {
            onImportTemplate(templateName, importedState);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDelete = (templateName: string) => {
    if (window.confirm(`Are you sure you want to delete the template "${templateName}"?`)) {
      onDeleteTemplate(templateName);
    }
  };

  const handleRename = (oldTemplateName: string) => {
    const newTemplateName = prompt('Enter a new name for the template:', oldTemplateName);
    if (newTemplateName && newTemplateName !== oldTemplateName) {
      onRenameTemplate(oldTemplateName, newTemplateName);
    }
  };

  return (
    <div className="dashboard-templates">
      <h3>Template Manager</h3>
      <ul>
        {Object.keys(templates).map((templateName) => (
          <li key={templateName} className="template-item">
            <span>{templateName}</span>
            <div className="template-buttons">
              <button onClick={() => onLoadTemplate(templateName)}>Load</button>
              <button onClick={() => handleExport(templateName)}>Export</button>
              <button onClick={() => handleRename(templateName)}>Rename</button>
              <button onClick={() => handleDelete(templateName)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <input type="file" onChange={handleImport} className="import-input" />
      <button
        className="save-template-button"
        onClick={() => {
          const templateName = prompt("Enter a name for the template:");
          if (templateName) {
            onSaveTemplate(templateName);
          }
        }}
      >
        Save as Template
      </button>
    </div>
  );
};

export default DashboardTemplates;
