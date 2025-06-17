import { useEffect, useState } from 'react';
import { storage } from '../storage/storage';
import { JobActivityType, JobDescriptionType, QuantityInputType } from '../types/types';


export type JobFormData = {
    jobId: string;
    lastUpdated: number;
    activity: JobActivityType[];
    description: JobDescriptionType
    parts: QuantityInputType[];
};

export function useJobFormData(jobId: string) {
    const [form, setForm] = useState<JobFormData | null>(null);

    // Load or create the form
    useEffect(() => {
        const key = `jobForm_${jobId}`;
        const existing = storage.getString(key);

        if (existing) {
            setForm(JSON.parse(existing));
        } else {
            const newForm: JobFormData = {
                jobId,
                lastUpdated: Date.now(),
                activity: [],
                description: {
                    orderNo: "",
                    hours: "",
                    report: "",
                    chargeable: false,
                    chargeableComment: ""
                },
                parts: [],
            };
            storage.set(key, JSON.stringify(newForm));
            setForm(newForm);
        }
    }, [jobId]);

    // Update a field (e.g. description)
    const updateField = (field: keyof JobFormData, value: any) => {
        if (!form) return;

        const updated = {
            ...form,
            [field]: value,
            lastUpdated: Date.now(),
        };

        storage.set(`jobForm_${jobId}`, JSON.stringify(updated));
        setForm(updated);
    };

    return {
        form,
        updateField,
    };
}
