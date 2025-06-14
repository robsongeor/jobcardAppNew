// src/firebase.ts
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const getJobs = async () => {
    try {
        const snapshot = await firestore().collection('jobs').get();

        const jobs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return jobs;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        throw error; // you could also return []
    }

}



export { auth, firestore };
