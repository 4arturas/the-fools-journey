"use client";
import React, { createContext, useState, ReactNode } from 'react';

interface AppData {
    applicationUrl: string;
    showHelp: boolean;
}

interface AppContextType {
    appData: AppData;
    setAppData: React.Dispatch<React.SetStateAction<AppData>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [appData, setAppData] = useState<AppData>({
        applicationUrl: 'http://localhost:3000',
        showHelp: true,
    });

    return (
        <AppContext.Provider value={{ appData, setAppData }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
