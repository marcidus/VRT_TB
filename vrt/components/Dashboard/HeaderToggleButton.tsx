import React, { useState, useEffect } from 'react';
import { DataService } from '../Data/DataService';
import './HeaderToggleButton.css'; // Import the CSS file

// Props for the HeaderToggleButton component
interface HeaderToggleButtonProps {
  headersUpdated: boolean; // The current state of header updates
  toggleHeadersUpdated: (newState: boolean) => void; // Function to toggle the state of header updates
}

const HeaderToggleButton: React.FC<HeaderToggleButtonProps> = ({ headersUpdated, toggleHeadersUpdated }) => {
  const [initialHeadersUpdated, setInitialHeadersUpdated] = useState(false);

  // Fetch the initial state of headersUpdated from the server when the component mounts
  useEffect(() => {
    console.log('Fetching initial headersUpdated state');
    const dataService = DataService.getInstance();
    dataService.fetchHeadersUpdated()
      .then(data => {
        console.log('Received headersUpdated state:', data);
        setInitialHeadersUpdated(data);
        toggleHeadersUpdated(data); // Ensure parent state is in sync with initial state
      })
      .catch(error => console.error('Error fetching headersUpdated state:', error));
  }, [toggleHeadersUpdated]);

  // Handle the toggle button click event
  const handleToggle = () => {
    console.log('Toggling headersUpdated state');
    const dataService = DataService.getInstance();
    dataService.toggleHeadersUpdated()
      .then(data => {
        console.log('Received toggled headersUpdated state:', data);
        toggleHeadersUpdated(data);
      })
      .catch(error => console.error('Error toggling headersUpdated state:', error));
  };

  return (
    <div className="header-toggle-button-container">
      <button
        onClick={handleToggle}
        className={`header-toggle-button ${headersUpdated ? 'bg-green' : 'bg-red'}`}
      >
        {headersUpdated ? 'Disable Header Updates' : 'Enable Header Updates'}
      </button>
    </div>
  );
};

export default HeaderToggleButton;
