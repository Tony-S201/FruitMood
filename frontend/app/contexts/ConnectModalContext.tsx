'use client';

import React, { createContext, useContext } from 'react';

interface ConnectModalContextType {
    openConnectModal: () => void;
}

const ConnectModalContext = createContext<ConnectModalContextType | undefined>(undefined);

export const useConnectModal = (): ConnectModalContextType => {
    const context = useContext(ConnectModalContext);
    if (!context) {
        throw new Error('useConnectModal must be used within a ConnectModalProvider');
    }
    return context;
};

interface ConnectModalProviderProps {
    children: React.ReactNode;
    openConnectModal: () => void;
}

export const ConnectModalProvider: React.FC<ConnectModalProviderProps> = ({ children, openConnectModal }) => {
    return (
        <ConnectModalContext.Provider value={{ openConnectModal }}>
            {children}
        </ConnectModalContext.Provider>
    );
};