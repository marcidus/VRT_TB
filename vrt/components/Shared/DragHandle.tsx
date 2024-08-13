/**
 * Author: Alexandre Martroye de Joly
 * Description: This component provides a draggable handle for use with draggable elements. It wraps its children
 *              and applies styling to indicate that the element is draggable.
 */

import React from 'react';

// Props for the DragHandle component
interface DragHandleProps {
  children: React.ReactNode; // The content to be displayed inside the draggable handle
}

const DragHandle: React.FC<DragHandleProps> = ({ children }) => {
  return (
    <div className="handle-bar h-4 bg-gray-600 rounded-t cursor-move">
      {children}
    </div>
  );
};

export default DragHandle;
