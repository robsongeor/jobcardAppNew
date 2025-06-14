// src/firebase.ts
import auth from '@react-native-firebase/auth';
import firestore, { collection, getDocs, getFirestore, query, where } from '@react-native-firebase/firestore';
import { Job } from './types/types';

/* Searchs firestore for first trigram (3chars of search term) 
    used to reduce retrieving to many docs from firestore (worst case ~1500)
    use pagination to reduce the chance of large queries 
*/
export const searchJobsTrigams = async (searchTerm: string): Promise<Job[]> => {
    const db = getFirestore();

    const clean = searchTerm.toLowerCase().trim();
    const firstTrigram = searchTerm.substring(0, 3);

    const jobQuery = query(
        collection(db, 'jobs'),
        where('trigrams', 'array-contains', firstTrigram)
    );

    const snapshot = await getDocs(jobQuery);

    const results: Job[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Job, 'id'>),
    }))

    const filtered = results.filter(job =>
        job.fleet.toLowerCase().includes(clean) ||
        job.job.toLowerCase().includes(clean)
    );

    return filtered;
}



export { auth, firestore };
