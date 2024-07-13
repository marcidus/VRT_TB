import React, { useState, useEffect } from 'react';

const HeaderToggleButton = ({ headersUpdated, toggleHeadersUpdated }) => {
  const [initialHeadersUpdated, setInitialHeadersUpdated] = useState(false);

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
