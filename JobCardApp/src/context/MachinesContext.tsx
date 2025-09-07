import React, { createContext, useContext, useEffect, useState } from "react";
import { FirestoreMachines } from "../types/types";

import { getCachedMachines } from "../storage/storage";
import { listenToMachines } from "../firebase";

type MachineContextType = {
    machines: FirestoreMachines[];
    loading: boolean;
};

const MachineContext = createContext<MachineContextType>({
    machines: [],
    loading: true,
});

export const MachineProvider = ({ children }: { children: React.ReactNode }) => {
    const [machines, setMachines] = useState<FirestoreMachines[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ✅ Start with cache
        const cached = getCachedMachines();
        if (cached.length > 0) {
            setMachines(cached);
            setLoading(false);
        }

        // ✅ Subscribe to Firestore changes
        const unsubscribe = listenToMachines((updated) => {
            setMachines(updated);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <MachineContext.Provider value={{ machines, loading }}>
            {children}
        </MachineContext.Provider>
    );
};

export const useMachines = () => useContext(MachineContext);
