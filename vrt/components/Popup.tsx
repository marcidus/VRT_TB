/**
 * Author: Alexandre Martroye de Joly
 * Description: This component displays a popup message at the bottom-right corner of the screen.
 *              The popup has a red background and white text, and is styled with padding, margin, 
 *              rounded corners, and a shadow.
 */

import React from 'react';

// Props for the Popup component
interface PopupProps {
  message: string; // The message to display in the popup
}

const Popup: React.FC<PopupProps> = ({ message }) => {
  return (
    <div className="fixed bottom-0 right-0 m-4 p-4 bg-red-500 text-white rounded shadow-lg">
      {message}
    </div>
  );
};

export default Popup;
