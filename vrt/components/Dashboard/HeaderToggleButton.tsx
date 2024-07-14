/**
 * Author: Alexandre Martroye de Joly
 * Description: This component provides a toggle button to enable or disable header updates. It fetches the initial state
 *              of header updates from the server and ensures the parent component's state is in sync with this initial state.
 *              The button's appearance and label change based on whether header updates are enabled or disabled.
 */

import React, { useState, useEffect } from 'react';

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
    fetch('http://localhost:3001/headers-updated')
      .then(response => response.json())
      .then(data => {
        console.log('Received headersUpdated state:', data.headersUpdated);
        setInitialHeadersUpdated(data.headersUpdated);
        toggleHeadersUpdated(data.headersUpdated); // Ensure parent state is in sync with initial state
      })
      .catch(error => console.error('Error fetching headersUpdated state:', error));
  }, []);

  // Handle the toggle button click event
  const handleToggle = () => {
    console.log('Toggling headersUpdated state');
    fetch('http://localhost:3001/toggle-headers-updated', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('Received toggled headersUpdated state:', data.headersUpdated);
        toggleHeadersUpdated(data.headersUpdated);
      })
      .catch(error => console.error('Error toggling headersUpdated state:', error));
  };

  return (
    <div className="mb-4">
      <button
        onClick={handleToggle}
        className={`px-4 py-2 rounded ${headersUpdated ? 'bg-green-500' : 'bg-red-500'} text-white`}
        style={{ zIndex: 1000 }} // Ensure it is on top
      >
        {headersUpdated ? 'Disable Header Updates' : 'Enable Header Updates'}
      </button>
    </div>
  );
};

export default HeaderToggleButton;
