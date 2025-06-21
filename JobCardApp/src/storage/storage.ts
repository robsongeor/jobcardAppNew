import { MMKV } from 'react-native-mmkv';
import { Job, RecentActivityType } from '../types/types';
import { formatDate, formatDateTime } from '../components/helpers/formatters';
import { EventBus } from '../utils/EventBus';


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

    console.log(status)

    if (status === "submitted") {
        title = "Submitted Job Card"
    }

    if (status === "assigned") {
        title = "Assigned to Job"
    }

    console.log(job.job)

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

        console.log(assigned.length)

        return assigned;
    } catch {
        return [];
    }
}

export function getOverdueJobs(): Job[] {
    const assigned = getJobsByStatus('assigned')

    const overdue = assigned.filter((job: Job) => {

        console.log(job.assignedDate[getStoredUserField('uid')])
        const dateAssigned = new Date(job.assignedDate[getStoredUserField('uid')]).getTime()
        const dateNow = new Date().getTime()
        const twoWeeks = 2 * 7 * 24 * 60 * 60 * 1000

        console.log({
            dateAssigned,
            twoWeeksLater: dateAssigned + twoWeeks,
            dateNow
        });


        return twoWeeks + dateAssigned < dateNow
    })

    console.log(overdue)

    return overdue;
}