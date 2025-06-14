// src/firebase.ts
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const getJobs = async () => {
    const snapshot = await firestore().collection('jobs').get();

    const jobs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));

    console.log(jobs)
}



export { auth, firestore };
