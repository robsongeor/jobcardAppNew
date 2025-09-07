import { MMKV } from 'react-native-mmkv';
import { FirestoreMachines, Job, Machine, RecentActivityType } from '../types/types';
import { formatDate, formatDateTime } from '../components/helpers/formatters';
import { EventBus } from '../utils/EventBus';
import { getAllCustomers, getAllMachines } from '../firebase'; // wherever your firebase.ts is
import { Customer } from '../types/types';


export const storage = new MMKV();

// Example helpers
export function setAuthToken(token: string) {
    storage.set('authToken', token);
}

export function getAuthToken(): string | undefined {
    return storage.getString('authToken');
}

export const getStoredUserField = (field: string): string => {
    const raw = storage.getString('user');
    if (!raw) return "NO_NAME";

    try {
        const parsed = JSON.parse(raw);
        return parsed[field] ?? null;
    } catch (err) {
        console.error('Failed to parse user from storage:', err);
        return "NO_NAME";
    }
};

export const addRecentActivity = (data: RecentActivityType) => {
    // 1. Read the current array
    const recentActivityStr = storage.getString("recentActivity");
    let recentActivity: RecentActivityType[] = [];

    if (recentActivityStr) {
        try {
            recentActivity = JSON.parse(recentActivityStr);
        } catch (e) {
            // If the data is corrupted, start fresh
            recentActivity = [];
        }
    }

    // 2. Create new item and add to the front
    const newItem: RecentActivityType = data;

    recentActivity.unshift(newItem); // add to start

    // 3. (Optional) Limit the length (e.g. last 20)
    if (recentActivity.length > 10) recentActivity = recentActivity.slice(0, 10);

    // 4. Write back to MMKV as JSON string
    storage.set("recentActivity", JSON.stringify(recentActivity));
    EventBus.emit("recentActivityUpdated"); // Must be after storage.set!
    EventBus.emit("jobsUpdated"); // Must be after storage.set!
};

export function getRecentActivity(): RecentActivityType[] {
    //storage.delete("recentActivity")
    const recentActivityStr = storage.getString("recentActivity");
    let recentActivity: RecentActivityType[] = [];

    if (recentActivityStr) {
        try {
            recentActivity = JSON.parse(recentActivityStr);
        } catch (e) {
            // If the data is corrupted, start fresh
            recentActivity = [];
        }
    }

    return recentActivity;
}

export function convertJobToRecent(job: Job, status: string): RecentActivityType {
    let title = "";

    if (status === "submitted") {
        title = "Submitted Job Card"
    }

    if (status === "assigned") {
        title = "Assigned to Job"
    }

    return {
        id: job.id,
        title: title,
        date: formatDateTime(new Date(Date.now()).toISOString()),
        status: status,
        jobNumber: job.job,
        fleet: job.fleet,
    }
}

export function getJobsByStatus(status: string): Job[] {
    const jobsStr = storage.getString("assignedJobs");
    if (!jobsStr) return [];
    try {
        const allJobs = JSON.parse(jobsStr);
        const assigned = allJobs.filter((job: Job) => job.assignedStatus[getStoredUserField('uid')] === status)
        return assigned;
    } catch {
        return [];
    }
}

export function getOverdueJobs(): Job[] {
    const assigned = getJobsByStatus('overdue')
    const overdue = assigned.filter((job: Job) => {
        const dateAssigned = new Date(job.assignedDate[getStoredUserField('uid')]).getTime()
        const dateNow = new Date().getTime()
        const twoWeeks = 2 * 7 * 24 * 60 * 60 * 1000
        return twoWeeks + dateAssigned < dateNow
    })



    return overdue;
}

export async function syncMachinesToMMKV(): Promise<FirestoreMachines[]> {
    const machines = await getAllMachines();

    if (machines.length > 0) {
        storage.set('machines', JSON.stringify(machines));
        console.log(`✅ Synced ${machines.length} machines to MMKV`);
    } else {
        console.warn('⚠ No machines fetched from Firestore');
    }

    return machines;
}

export function getCachedMachines(): FirestoreMachines[] {
    const raw = storage.getString('machines');
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch (err) {
        console.error('Failed to parse cached customers:', err);
        return [];
    }
}


export async function syncCustomersToMMKV(): Promise<Customer[]> {
    const customers = await getAllCustomers();

    if (customers.length > 0) {
        storage.set('customers', JSON.stringify(customers));
        console.log(`✅ Synced ${customers.length} customers to MMKV`);
    } else {
        console.warn('⚠ No customers fetched from Firestore');
    }

    return customers;
}

export function getCachedCustomers(): Customer[] {
    const raw = storage.getString('customers');
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch (err) {
        console.error('Failed to parse cached customers:', err);
        return [];
    }
}

