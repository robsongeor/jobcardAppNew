import { assignJobToUser, createNewJob, getJobFromJobNumber } from "../firebase";
import { getStoredUserField } from "../storage/storage";
import { Job } from "../types/types";

export const handleAssign = async (job: Job) => {
    const uid = getStoredUserField('uid');
    if (!uid) return;

    try {
        // If job doesn't exist, create it
        const jobExists = await getJobFromJobNumber(job.job)
        if (jobExists === null) {
            let updatedJob = {
                ...job,
                assignedTo: Array.from(new Set([...(job.assignedTo || []), uid])),
                assignedDate: { ...(job.assignedDate || {}), [uid]: new Date().toISOString() },
                assignedStatus: { ...(job.assignedStatus || {}), [uid]: "assigned" }
            };

            await createNewJob(updatedJob);
        } else {
            await assignJobToUser(jobExists.id, uid);
        }
    } catch (error) {
        // Show error message to user (toast, modal, etc.)
        console.error("Assignment failed:", error);
    }
};