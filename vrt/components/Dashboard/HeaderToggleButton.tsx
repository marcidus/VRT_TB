import React, { useState, useEffect } from 'react';
import { DataService } from '../Data/DataService';
import { FaPause, FaSearch } from 'react-icons/fa'; // Import appropriate icons
import gsap from 'gsap';
import './HeaderToggleButton.css'; // Import the CSS file

interface HeaderToggleButtonProps {
  headersUpdated: boolean; // The current state of header updates
  toggleHeadersUpdated: (newState: boolean) => void; // Function to toggle the state of header updates
}

const HeaderToggleButton: React.FC<HeaderToggleButtonProps> = ({ headersUpdated, toggleHeadersUpdated }) => {
  const [initialHeadersUpdated, setInitialHeadersUpdated] = useState(false);

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

  const handleToggle = () => {
    console.log('Toggling headersUpdated state');
    const dataService = DataService.getInstance();
    dataService.toggleHeadersUpdated()
      .then(data => {
        console.log('Received toggled headersUpdated state:', data);
        toggleHeadersUpdated(data);

        // Animate toggle button with GSAP
        gsap.to('.toggle-knob', {
          x: data ? 26 : 0,
          backgroundColor: data ? '#28a745' : '#dc3545',
          duration: 0.3,
        });
      })
      .catch(error => console.error('Error toggling headersUpdated state:', error));
  };

  return (
    <div className="header-toggle-button-container" onClick={handleToggle}>
      <div className={`toggle-wrapper ${headersUpdated ? 'active' : ''}`}>
        <div className="toggle-knob">
          {headersUpdated ? <FaSearch color="#fff" /> : <FaPause color="#fff" />}
        </div>
      </div>
    </div>
  );
};

export default HeaderToggleButton;
