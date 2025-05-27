'use client';
import { createContext, useContext, useState } from 'react';

const ParticipantContext = createContext();

export function ParticipantProvider({ children }) {
  const [participants, setParticipants] = useState([]);

  return (
    <ParticipantContext.Provider value={{ participants, setParticipants }}>
      {children}
    </ParticipantContext.Provider>
  );
}

export function useParticipants() {
  const context = useContext(ParticipantContext);
  if (!context) {
    throw new Error('useParticipants must be used within a ParticipantProvider');
  }
  return context;
} 