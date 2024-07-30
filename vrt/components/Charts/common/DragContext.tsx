import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';

interface DragContextProps {
  globalOffset: number;
  isSynced: boolean;
  handleDrag: (direction: 'left' | 'right') => void;
  toggleSync: (localOffset: number, updateLocalOffset: Dispatch<SetStateAction<number>>) => void;
  resync: () => number;
  setGlobalOffset: Dispatch<SetStateAction<number>>;
}

const DragContext = createContext<DragContextProps | undefined>(undefined);

export const DragProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [globalOffset, setGlobalOffset] = useState<number>(0);
  const [isSynced, setIsSynced] = useState<boolean>(true);

  const handleDrag = (direction: 'left' | 'right') => {
    setGlobalOffset((prevOffset) => {
      const newOffset = direction === 'right' ? prevOffset + 10 : prevOffset - 10;
      return Math.max(0, newOffset);
    });
  };

  const toggleSync = (localOffset: number, updateLocalOffset: Dispatch<SetStateAction<number>>) => {
    if (isSynced) {
      updateLocalOffset(globalOffset);
    }
    setIsSynced(!isSynced);
  };

  const resync = () => globalOffset;

  return (
    <DragContext.Provider value={{ globalOffset, isSynced, handleDrag, toggleSync, resync, setGlobalOffset }}>
      {children}
    </DragContext.Provider>
  );
};

export const useDrag = () => {
  const context = useContext(DragContext);
  if (!context) {
    throw new Error('useDrag must be used within a DragProvider');
  }
  return context;
};
