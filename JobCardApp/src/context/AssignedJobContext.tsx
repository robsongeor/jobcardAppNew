// app/context/AssignedJobsContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

import { Job } from '../types/types';
import { useAuth } from './AuthContext';
import { listenToAssignedJobs } from '../firebase';
import { storage } from '../storage/storage';


type AssignedJobsContextType = {
    assignedJobs: Job[];
};

const AssignedJobsContext = createContext<AssignedJobsContextType>({
    assignedJobs: [],
});

export const useAssignedJobs = () => useContext(AssignedJobsContext);

export const AssignedJobsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [assignedJobs, setAssignedJobs] = useState<Job[]>([]);
    const { user } = useAuth(); // assumes user has .uid

    useEffect(() => {
        if (!user?.uid) return;

        const unsubscribe = listenToAssignedJobs(user.uid, (jobs) => {
            setAssignedJobs(jobs);
            storage.set('assignedJobs', JSON.stringify(jobs));
        });

        return () => unsubscribe();
    }, [user?.uid]);

    return (
        <AssignedJobsContext.Provider value={{ assignedJobs }}>
            {children}
        </AssignedJobsContext.Provider>
    );
};
