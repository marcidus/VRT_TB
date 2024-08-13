import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { DashboardItem } from './DashboardItemTypes';
import './DashboardTemplates.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

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
  const [dropdownVisible, setDropdownVisible] = useState<{ [key: string]: boolean }>({});
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const toggleDropdown = (templateName: string) => {
    setDropdownVisible(prevState => ({
      ...prevState,
      [templateName]: !prevState[templateName]
    }));
  };

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

  const handleStart = () => {
    setIsDragging(false);
  };

  const handleDrag = () => {
    setIsDragging(true);
  };

  const handleStop = () => {
    // Prevent click if the item was dragged
    if (!isDragging) {
      setIsExpanded(!isExpanded);
    }
    setIsDragging(false);
  };

  return (
    <Draggable onStart={handleStart} onDrag={handleDrag} onStop={handleStop} handle=".drag-handle">
      <div className={`dashboard-templates ${isExpanded ? '' : 'retracted'}`}>
        <div className="drag-handle" style={{ cursor: 'move', background: '#444', padding: '10px', borderRadius: '10px 10px 0 0' }}>
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />} Template Manager
        </div>
        {isExpanded && (
          <>
            <h3>List of Templates</h3>
            <div className="template-list-container">
              <ul className="template-list">
                {Object.keys(templates).map((templateName) => (
                  <li key={templateName} className="template-item">
                    <div className="template-header" onClick={() => toggleDropdown(templateName)}>
                      <span>{templateName}</span>
                    </div>
                    {dropdownVisible[templateName] && (
                      <div className="template-dropdown">
                        <button onClick={() => onLoadTemplate(templateName)}>Load</button>
                        <button onClick={() => handleExport(templateName)}>Export</button>
                        <button onClick={() => handleRename(templateName)}>Rename</button>
                        <button onClick={() => handleDelete(templateName)}>Delete</button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
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
          </>
        )}
      </div>
    </Draggable>
  );
};

export default DashboardTemplates;
