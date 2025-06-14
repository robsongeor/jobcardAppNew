// src/firebase.ts
import auth from '@react-native-firebase/auth';
import firestore, { collection, getDocs, getFirestore } from '@react-native-firebase/firestore';
import { Job } from './types/types';

export const getJobs = async (): Promise<Job[]> => {
    try {
        const db = getFirestore();
        const jobsRef = collection(db, 'jobs');

        const snapshot = await getDocs(jobsRef);

        const jobs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<Job, 'id'>),
        }));

        return jobs;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        throw error; // you could also return []
    }

}



export { auth, firestore };
