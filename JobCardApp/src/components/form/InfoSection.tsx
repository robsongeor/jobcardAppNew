

import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import Field from "./FormInputs/Field";
import SmallTextInput from "./FormInputs/SmallTextInput";
import { Job, JobDescriptionType } from "../../types/types";
import SmallCheckBoxInput from "./FormInputs/SmallCheckBoxInput";
import JobOverviewCard from "../JobOverviewCard";
import PADDING from "../../constants/padding";
import COLORS from "../../constants/colors";
import { JobFormData } from "../../hooks/useJobFormData";
import { useEffect, useState } from "react";
import { addRecentActivity, convertJobToRecent, getStoredUserField } from "../../storage/storage";
import { submitJobCardToFireStore, updateAssignedStatus } from "../../firebase";
import { firebase } from "@react-native-firebase/auth";
import SubmitModal from "./Modals/SubmitModal";
import BottomRightButton from "./Buttons/BottomRightButton";


type InfoSectionProps = {
    job: Job
    data: JobFormData;
    jobId: string;
    setHandleSubmitForHeader: (fn: () => void) => void;
}

export default function InfoSection({ data, jobId, job, setHandleSubmitForHeader }: InfoSectionProps) {
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

    useEffect(() => {

        setHandleSubmitForHeader(() => handleSubmit(data));
    }, [data]);

    const userData = {
        techName: getStoredUserField("name"),
        techPhone: getStoredUserField("phone"),
        techEmail: getStoredUserField("email")
    }



    const handleSubmit = async (data: JobFormData) => {
        setShowModal(true);
        setLoading(true);
        try {
            const user = firebase.auth().currentUser;
            if (!user) return; // ensure we have a user

            const idToken = await user.getIdToken();

            console.log(data)

            // 1. Try to generate the PDF
            const response = await fetch('https://generatejobcardpdf-hjkqebqdtq-uc.a.run.app', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + idToken,
                },
                body: JSON.stringify({ ...job, ...data, ...userData }),
            });

            // 2. Handle errors
            if (!response.ok) {
                const err = await response.text();
                setErrorMsg("Error sending job card: " + err);
                setShowError(true);
                return;
            }

            // 3. PDF was generated successfully – now save and update
            await submitJobCardToFireStore(data);
            await updateAssignedStatus(jobId, getStoredUserField('uid'), "submitted");
            setShowSuccess(true);
            addRecentActivity(convertJobToRecent(job, "submitted"));

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
        setShowError(false);
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
                <JobOverviewCard
                    job={job}
                />
                {/* <BottomRightButton
                    label="Submit"
                    disabled={loading}
                    onPress={() => handleSubmit(data)}
                    icon={"send"}
                /> */}
            </View>
        </>
    )
}


const styles = StyleSheet.create({

    container: {
        flex: 1,

        backgroundColor: COLORS.background
    },
})

