import React from 'react';
import { DashboardItem } from './DashboardItemTypes';

interface DashboardTemplatesProps {
  templates: { [key: string]: DashboardItem[] };
  onLoadTemplate: (templateName: string) => void;
  onImportTemplate: (templateName: string, state: DashboardItem[]) => void;
  onDeleteTemplate: (templateName: string) => void;
  onRenameTemplate: (oldTemplateName: string, newTemplateName: string) => void;
  onSaveTemplate: (templateName: string) => void; // Add this prop
}

const DashboardTemplates: React.FC<DashboardTemplatesProps> = ({ templates, onLoadTemplate, onImportTemplate, onDeleteTemplate, onRenameTemplate, onSaveTemplate }) => {
  const handleExport = (templateName: string) => {
    const state = templates[templateName];
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${templateName}.json`);
    document.body.appendChild(downloadAnchorNode); // Required for FF
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
    <div style={{ position: 'fixed', top: '10px', right: '10px', backgroundColor: 'white', padding: '10px', border: '1px solid black', borderRadius: '5px', zIndex: 1000 }}>
      <h3>Saved Templates</h3>
      <ul>
        {Object.keys(templates).map((templateName) => (
          <li key={templateName} className="flex items-center space-x-2">
            <span>{templateName}</span>
            <button onClick={() => onLoadTemplate(templateName)} className="bg-blue-500 text-white rounded px-2">Load</button>
            <button onClick={() => handleExport(templateName)} className="bg-green-500 text-white rounded px-2">Export</button>
            <button onClick={() => handleRename(templateName)} className="bg-yellow-500 text-white rounded px-2">Rename</button>
            <button onClick={() => handleDelete(templateName)} className="bg-red-500 text-white rounded px-2">Delete</button>
          </li>
        ))}
      </ul>
      <input type="file" onChange={handleImport} className="mt-2" />
      <button
        onClick={() => {
          const templateName = prompt("Enter a name for the template:");
          if (templateName) {
            onSaveTemplate(templateName);
          }
        }}
        className="mt-2 bg-green-500 text-white rounded px-4 py-2"
      >
        Save as Template
      </button>
    </div>
  );
};

export default DashboardTemplates;
