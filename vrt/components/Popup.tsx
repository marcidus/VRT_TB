import React from 'react';

interface PopupProps {
  message: string;
}

const Popup: React.FC<PopupProps> = ({ message }) => {
  return (
    <div className="fixed bottom-0 right-0 m-4 p-4 bg-red-500 text-white rounded shadow-lg">
      {message}
    </div>
  );
};

export default Popup;
