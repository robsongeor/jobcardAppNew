// src/firebase.ts
import auth from '@react-native-firebase/auth';
import firestore, { collection, getDocs, getFirestore, query, where, FirebaseFirestoreTypes, limit, startAfter, getDoc, doc, updateDoc, setDoc, addDoc } from '@react-native-firebase/firestore';

import { Job, Machine, Customer, FirestoreMachines, machines } from './types/types';
import { JobFormData } from './hooks/useJobFormData';
import { addRecentActivity, convertJobToRecent } from './storage/storage';

/* Searchs firestore for first trigram (3chars of search term) 
    used to reduce retrieving to many docs from firestore (worst case ~1500)
    use pagination to reduce the chance of large queries 
*/
export const getAllCustomers = async (): Promise<Customer[]> => {
    const db = getFirestore();
    const snapshot = await getDocs(collection(db, "customers"));

    const customers: Customer[] = snapshot.docs.map((doc) => ({
        id: doc.id, // ← this is the Firestore doc ID
        ...(doc.data() as Omit<Customer, "id">),
    }));

    return customers;
};

export const getAllMachines = async (): Promise<FirestoreMachines[]> => {
    const db = getFirestore();
    const snapshot = await getDocs(collection(db, "machines"));

    const machines: FirestoreMachines[] = snapshot.docs.map((doc) => ({
        id: doc.id, // ← this is the Firestore doc ID
        ...(doc.data() as Omit<FirestoreMachines, "id">),
    }));

    return machines;
};

export const searchJobsTrigrams = async (
    searchTerm: string,
    totalFetched: number = 0,
    maxTotalResults: number = 30,
    lastDoc?: FirebaseFirestoreTypes.DocumentSnapshot
): Promise<{ jobs: Job[]; lastDoc?: FirebaseFirestoreTypes.DocumentSnapshot }> => {

    // Returns if max results loaded
    if (totalFetched >= maxTotalResults) {
        console.log("Max search limit reached:", maxTotalResults);
        return { jobs: [], lastDoc };
    }

    const db = getFirestore();

    const clean = searchTerm.toLowerCase().trim();
    const firstTrigram = searchTerm.substring(0, 3);

    let q = query(
        collection(db, 'jobs'),
        where('trigrams', 'array-contains', firstTrigram),
        limit(10)
    );

    if (lastDoc) {
        q = query(
            collection(db, 'jobs'),
            where('trigrams', 'array-contains', firstTrigram),
            startAfter(lastDoc),
            limit(10)
        );
    }

    const snapshot = await getDocs(q);

    const results: Job[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Job, 'id'>),
    }))

    const filtered = results.filter(job =>
        job.fleet.toLowerCase().includes(clean) ||
        job.job.toLowerCase().includes(clean)
    );

    console.log("First trigram:", firstTrigram);
    console.log("Docs returned from Firestore:", snapshot.docs.length);


    return {
        jobs: filtered,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
    };
}

export const getUserData = async (uid: string) => {
    try {
        const db = getFirestore();
        const userRef = doc(db, "users", uid)
        const snapshot = await getDoc(userRef)

        if (snapshot.exists()) {
            return snapshot.data();

        } else {
            console.warn('No user data found for UID:', uid);
            return null;
        }

    } catch (error) {
        console.error('Failed to fetch user data:', error);
        return null;
    }
}

export const assignJobToUser = async (
    jobId: string,
    uid: string,
): Promise<Job | null> => {
    try {
        const db = getFirestore();
        const jobRef = doc(db, 'jobs', jobId);
        const jobSnap = await getDoc(jobRef);

        if (!jobSnap.exists()) {
            console.warn('Job not found:', jobId);
            return null;
        }

        const jobData = jobSnap.data();
        const currentAssigned: string[] = jobData?.assignedTo ?? [];
        const currentAssignedTo = jobData?.assignedStatus ?? []

        // Only add UID if it's not already assigned
        if (!currentAssigned.includes(uid)) {
            const updatedAssigned = [...currentAssigned, uid];
            const updatedAssignedStatus = { ...currentAssignedTo, [uid]: "assigned" }
            const updatedAssignedDate = { ...currentAssignedTo, [uid]: new Date().toISOString() }

            await updateDoc(jobRef, {
                assignedTo: updatedAssigned,
                assignedStatus: updatedAssignedStatus,
                assignedDate: updatedAssignedDate
            });
            console.log(updatedAssignedStatus, "updated assigned")
            console.log(`Assigned job ${jobId} to UID ${uid}`);
            addRecentActivity(convertJobToRecent({ id: jobId, ...jobData } as Job, "assigned"))

        } else {
            console.log(`ℹUser ${uid} already assigned to job ${jobId}`);
        }

        return { id: jobId, ...jobData } as Job;
    } catch (error) {
        console.error('❌ Firestore error during job assignment:', error);
        return null;
    }
};

export const listenToAssignedJobs = (
    uid: string,
    onUpdate: (jobs: Job[]) => void
): (() => void) => {
    const db = getFirestore();
    const jobsRef = collection(db, 'jobs');

    const q = query(jobsRef, where('assignedTo', 'array-contains', uid));

    const unsubscribe = firestore().collection('jobs')
        .where('assignedTo', 'array-contains', uid)
        .onSnapshot(snapshot => {
            const jobs: Job[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as Omit<Job, 'id'>),
            }));
            onUpdate(jobs);
        }, error => {
            console.error("Error listening to assigned jobs:", error);
        });

    return unsubscribe; // So caller can clean up
};

export const submitJobCardToFireStore = async (jobCardData: JobFormData): Promise<boolean> => {
    try {
        const db = getFirestore();
        // Use jobCardData.jobId as document ID
        await setDoc(doc(db, 'jobcards', jobCardData.jobId), jobCardData);

        console.log("Submitted to FireStore");
        return true;
    } catch (error) {
        console.error("Error submitting to FireStore:", error);
        return false;
    }

};

export const updateAssignedStatus = async (jobId: string, uid: string, status: string): Promise<boolean> => {
    try {
        const db = getFirestore();
        const jobRef = doc(db, 'jobs', jobId);
        const jobSnap = await getDoc(jobRef);

        if (!jobSnap.exists()) {
            console.warn('Job not found:', jobId);
            return false;
        }

        const jobData = jobSnap.data();
        // Default to empty object if missing
        const currentAssignedStatus: Record<string, string> = jobData?.assignedStatus ?? {};

        // Merge in the new status for this UID
        const updatedAssignedStatus = {
            ...currentAssignedStatus,
            [uid]: status
        };

        await updateDoc(jobRef, { assignedStatus: updatedAssignedStatus });

        console.log(`Updated status for ${uid} on job ${jobId} to "${status}"`);
        return true;
    } catch (error) {
        console.error('❌ Firestore error during status update:', error);
        return false;
    }
}

export const getJobFromJobNumber = async (jobNumber: string): Promise<Job | null> => {
    const db = getFirestore();

    const jobsRef = collection(db, "jobs");
    const q = query(jobsRef, where("job", "==", jobNumber));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const jobDoc = querySnapshot.docs[0];
        const data = jobDoc.data();

        // Basic runtime check (expand as needed)
        if (data && typeof data.job === "string" && typeof data.status === "string") {
            return data as Job;
        }
    }
    return null;
}

export const getNewJobFromFleetNumber = async (fleetNumber: string): Promise<Job | null> => {
    const db = getFirestore();


    const jobsRef = collection(db, "machines");
    const q = query(jobsRef, where("fleet", "==", fleetNumber.toUpperCase()));
    const querySnapshot = await getDocs(q);

    console.log("QUERY SNAPSHOT SIZE:", querySnapshot.size);
    console.log("DOCS:", querySnapshot.docs.map(d => d.data()));


    if (!querySnapshot.empty) {
        const jobDoc = querySnapshot.docs[0];
        const data = jobDoc.data();

        // Basic runtime check (expand as needed)
        if (data && typeof data.fleet === "string") {

            let emptyJob = createEmptyJob()
            let job = { ...emptyJob, ...data } as Job

            return job;
        }
    }

    console.log(fleetNumber)

    return null;
}

export const createNewJob = async (job: Job): Promise<boolean> => {
    try {
        const db = getFirestore();
        const docRef = await addDoc(collection(db, 'jobs'), job)

        // Step 2: Update doc with its Firestore-generated ID
        await updateDoc(docRef, { id: docRef.id });
        addRecentActivity(convertJobToRecent(job as Job, "assigned"))
        return true
    } catch (error) {
        console.error("Error submitting to FireStore:", error);
        return false;
    }
}

export function createEmptyJob(): Job {
    return {
        id: "",
        fleet: "",
        job: "",
        customerName: "",
        machine: {
            make: "",
            model: "",
            serialNumber: "",
        },
        assignedTo: [],
        assignedStatus: {},
        assignedDate: {},
        description: "",
        site: "",
        status: "",
        customerAddress: "",
        customerAddressSuburb: "",
        customerAddressTown: "",
        siteContact: "",
        siteContactPhone: "",
        coords: { latitude: 0, longitude: 0 }
    } as Job
}

export { auth, firestore };
