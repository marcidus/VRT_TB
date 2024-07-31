import React, { createContext, useContext, useState } from 'react';

interface DragContextProps {
  globalOffset: number;
  isSynced: boolean;
  handleDrag: (direction: 'left' | 'right') => void;
  toggleSync: () => void;
  lastSyncedOffset: number;
  setLastSyncedOffset: React.Dispatch<React.SetStateAction<number>>;
  getChartOffset: (chartIndex: number) => number;
  setChartOffset: (chartIndex: number, offset: number) => void;
}

const DragContext = createContext<DragContextProps | undefined>(undefined);

export const DragProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [globalOffset, setGlobalOffset] = useState<number>(0);
  const [isSynced, setIsSynced] = useState<boolean>(true);
  const [lastSyncedOffset, setLastSyncedOffset] = useState<number>(0);
  const [chartOffsets, setChartOffsets] = useState<number[]>([]);

  const handleDrag = (direction: 'left' | 'right') => {
    setGlobalOffset((prevOffset) => {
      const newOffset = direction === 'right' ? prevOffset + 10 : prevOffset - 10;
      setLastSyncedOffset(newOffset);

      if (isSynced) {
        setChartOffsets(prevOffsets => prevOffsets.map(() => Math.max(0, newOffset)));
      }

      return Math.max(0, newOffset);
    });
  };

  const toggleSync = () => {
    if (!isSynced) {
      setGlobalOffset(lastSyncedOffset);
      setChartOffsets(prevOffsets => prevOffsets.map(() => lastSyncedOffset));
    }
    setIsSynced(!isSynced);
  };

  const getChartOffset = (chartIndex: number) => {
    return isSynced ? globalOffset : chartOffsets[chartIndex] || 0;
  };

  const setChartOffset = (chartIndex: number, offset: number) => {
    setChartOffsets((prevOffsets) => {
      const newOffsets = [...prevOffsets];
      newOffsets[chartIndex] = Math.max(0, offset);
      return newOffsets;
    });
  };

  return (
    <DragContext.Provider value={{ globalOffset, isSynced, handleDrag, toggleSync, lastSyncedOffset, setLastSyncedOffset, getChartOffset, setChartOffset }}>
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
