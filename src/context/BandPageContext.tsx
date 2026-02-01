import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { BandPageContextType } from '../types';

const BandPageContext = createContext<BandPageContextType | undefined>(undefined);

export const BandPageProvider = ({ children }: { children: ReactNode }) => {
    const [bandPageActions, setBandPageActions] = useState<{
        onEditBand: () => void;
        onAddAlbum: () => void;
        onAddShow: () => void;
        onDeleteBand: () => void;
    } | null>(null);
    const [isOnBandPage, setIsOnBandPage] = useState(false);

    return (
        <BandPageContext.Provider value={{ bandPageActions, setBandPageActions, isOnBandPage, setIsOnBandPage }}>
            {children}
        </BandPageContext.Provider>
    );
};

export const useBandPage = () => {
    const context = useContext(BandPageContext);
    if (!context) throw new Error('useBandPage must be used within a BandPageProvider');
    return context;
};
