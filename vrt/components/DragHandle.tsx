import React from 'react';

interface DragHandleProps {
  children: React.ReactNode;
}

const DragHandle: React.FC<DragHandleProps> = ({ children }) => {
  return (
    <div className="handle-bar h-4 bg-gray-600 rounded-t cursor-move">
      {children}
    </div>
  );
};

export default DragHandle;
