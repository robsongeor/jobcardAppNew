import { View, StyleSheet, Modal } from "react-native";
import BottomRightButton from "./Buttons/BottomRightButton";
import { firebase } from "@react-native-firebase/auth";
import { submitJobCardToFireStore, updateAssignedStatus } from "../../firebase";
import { JobFormData } from "../../hooks/useJobFormData";
import { getStoredUserField } from "../../storage/storage";
import { Job } from "../../types/types";
import { useEffect, useState } from "react";
import JobDetailsOverview from "./JobDetailsOverview";
import SubmitModal from "./Modals/SubmitModal";

type SubmitSectionProps = {
    data: JobFormData;
    jobId: string;
    job: Job;
};

export default function SubmitSection({ data, jobId, job }: SubmitSectionProps) {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        if (showSuccess) {
            timeout = setTimeout(() => {
                setShowModal(false);
                setShowSuccess(false);
            }, 1500);
        }
        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [showSuccess]);

    const handleSubmit = async (data: JobFormData) => {
        setShowModal(true);
        setLoading(true);
        try {
            await submitJobCardToFireStore(data);
            await updateAssignedStatus(jobId, getStoredUserField('uid'), "submitted");
            const user = firebase.auth().currentUser;
            if (!user) return;
            const idToken = await user.getIdToken();
            const response = await fetch('https://generatejobcardpdf-hjkqebqdtq-uc.a.run.app', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + idToken,
                },
                body: JSON.stringify({ ...job, ...data }),
            });
            if (response.ok) {
                setShowSuccess(true);
            } else {
                const err = await response.text();
                setErrorMsg("Error sending job card: " + err);
                setShowError(true);
            }
        } catch (error: any) {
            setErrorMsg(error.message || 'An unexpected error occurred.');
            setShowError(true);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setShowSuccess(false);
    };

    return (
        <>
            <Modal visible={showModal} transparent animationType="fade">
                <SubmitModal
                    showSuccess={showSuccess}
                    showError={showError}
                    loading={loading}
                    closeModal={closeModal}
                    errorMsg={errorMsg}
                />
            </Modal>

            <View style={styles.container}>
                <JobDetailsOverview data={data} job={job} />
                <BottomRightButton
                    label="submit"
                    disabled={loading}
                    onPress={() => handleSubmit(data)}
                    icon={"send"}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1,
        position: "relative"
    },
});
