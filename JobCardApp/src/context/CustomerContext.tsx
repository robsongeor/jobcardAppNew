import React, { createContext, useContext, useEffect, useState } from "react";
import { Customer } from "../types/types";

import { getCachedCustomers } from "../storage/storage";
import { listenToCustomers } from "../firebase";

type CustomerContextType = {
    customers: Customer[];
    loading: boolean;
};

const CustomerContext = createContext<CustomerContextType>({
    customers: [],
    loading: true,
});

export const CustomerProvider = ({ children }: { children: React.ReactNode }) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ✅ Start with cache
        const cached = getCachedCustomers();
        if (cached.length > 0) {
            setCustomers(cached);
            setLoading(false);
        }

        // ✅ Subscribe to Firestore changes
        const unsubscribe = listenToCustomers((updated) => {
            setCustomers(updated);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <CustomerContext.Provider value={{ customers, loading }}>
            {children}
        </CustomerContext.Provider>
    );
};

export const useCustomers = () => useContext(CustomerContext);
