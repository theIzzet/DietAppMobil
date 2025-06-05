// context/ReminderContext.js
import React, { createContext, useContext, useState } from 'react';

const ReminderContext = createContext();

export const ReminderProvider = ({ children }) => {
  const [isReminderActive, setIsReminderActive] = useState(false);

  return (
    <ReminderContext.Provider value={{ isReminderActive, setIsReminderActive }}>
      {children}
    </ReminderContext.Provider>
  );
};

export const useReminder = () => useContext(ReminderContext);
