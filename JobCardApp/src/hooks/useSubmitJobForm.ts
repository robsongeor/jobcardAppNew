import { useState } from "react";
import { firebase } from "@react-native-firebase/auth";
import { addRecentActivity, convertJobToRecent, getStoredUserField } from "../storage/storage";
import { submitJobCardToFireStore, updateAssignedStatus } from "../firebase";
import { Job } from "../types/types";
import { JobFormData } from "./useJobFormData";

export function useSubmitJobForm(job: Job, jobId: string, form: JobFormData | null) {
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const userData = {
        techName: getStoredUserField("name"),
        techPhone: getStoredUserField("phone"),
        techEmail: getStoredUserField("email"),
    };

    const handleSubmit = async () => {
        if (!form) {
            console.warn("Tried to submit before form was ready");
            return;
        }
        setLoading(true);
        try {
            const user = firebase.auth().currentUser;
            if (!user) throw new Error("No user logged in");

            const idToken = await user.getIdToken();

            const response = await fetch(
                "https://generatejobcardpdf-hjkqebqdtq-uc.a.run.app",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + idToken,
                    },
                    body: JSON.stringify({ ...job, ...form, ...userData }),
                }
            );

            if (!response.ok) {
                const err = await response.text();
                throw new Error("Error sending job card: " + err);
            }

            await submitJobCardToFireStore(form);
            await updateAssignedStatus(jobId, getStoredUserField("uid"), "submitted");
            setShowSuccess(true);
            addRecentActivity(convertJobToRecent(job, "submitted"));
        } catch (err: any) {
            setErrorMsg(err.message || "Unexpected error");
            setShowError(true);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setShowSuccess(false);
        setShowError(false);
    };

    return { handleSubmit, loading, showSuccess, showError, errorMsg, closeModal };
}
