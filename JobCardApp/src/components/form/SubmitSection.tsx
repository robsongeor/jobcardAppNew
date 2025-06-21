import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
import BottomRightButton from "./Buttons/BottomRightButton";
import { firebase } from "@react-native-firebase/auth";
import { submitJobCardToFireStore, updateAssignedStatus } from "../../firebase";
import { JobFormData } from "../../hooks/useJobFormData";
import { getStoredUserField } from "../../storage/storage";
import { Job } from "../../types/types";
import { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Feather";
import JobDetailsOverview from "./JobDetailsOverview";
import { BlurView } from '@react-native-community/blur';

type SubmitSectionProps = {
    data: JobFormData // Replace 'any' with your JobFormData type if available
    jobId: string
    job: Job
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
            }, 1500); // 1.5 seconds
        }
        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [showSuccess]);


    const handleSubmit = async (data: JobFormData) => {
        setShowModal(true)
        setLoading(true)

        try {
            // Save to Firestore as before
            await submitJobCardToFireStore(data);
            await updateAssignedStatus(jobId, getStoredUserField('uid'), "submitted");

            // Get Firebase Auth user token
            const user = firebase.auth().currentUser;
            if (!user) {
                // Handle not logged in (show error or redirect to login)
                return;
            }
            const idToken = await user.getIdToken();

            // POST to your PDF/email Cloud Function
            const response = await fetch('https://generatejobcardpdf-hjkqebqdtq-uc.a.run.app', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + idToken,
                },
                body: JSON.stringify({ ...job, ...data }), // send the form data as JSON
            });

            // Optionally, handle the response
            if (response.ok) {
                const result = await response.json();
                setShowSuccess(true)
                // Show a success message or update UI
            } else {
                // Handle error (show error message)
                const err = await response.text();
                console.log("Error sending job card: " + err);
            }
        } catch (error: any) {
            setErrorMsg(error.message || 'An unexpected error occurred.');
            setShowError(true);
        }

        finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setShowModal(false)
        setShowSuccess(false)
    }

    return (
        <>
            <Modal visible={showModal} transparent animationType="fade">
                <BlurView
                    style={styles.loadingOverlay}
                    blurType="light"   // or "dark", "xlight", etc.
                    blurAmount={5}     // adjust to taste
                    reducedTransparencyFallbackColor="white"
                >
                    {loading && <>
                        <ActivityIndicator size="large" color="#007AFF" />
                        <Text style={styles.loadingText}>Submitting...</Text>
                    </>}

                    {showSuccess && <>
                        <TouchableOpacity onPress={closeModal} style={styles.loadingOverlay}>
                            <Icon name="check-circle" size={48} color="#4BB543" />
                            <Text style={styles.loadingText}>Submitted Successfully!</Text>
                        </TouchableOpacity>
                    </>}

                    {showError && (
                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity onPress={closeModal} style={styles.loadingOverlay}>
                                <Icon name="x-circle" size={48} color="#D7263D" />
                                <Text style={styles.errorText}>Submission Failed!</Text>
                                <Text style={styles.errorText}>{errorMsg}</Text>

                            </TouchableOpacity>
                        </View>
                    )}

                </BlurView>
            </Modal>

            <View style={styles.container}>


                <JobDetailsOverview
                    data={data}
                />

                <BottomRightButton
                    label="submit"
                    disabled={loading}
                    onPress={() => handleSubmit(data)}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#fff",
        flex: 1,
        position: "relative"
    },
    loadingOverlay: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 14,
        color: '#007AFF',
        fontSize: 18,
        fontWeight: 'bold'
    },
    errorText: {
        marginTop: 14,
        color: '#D7263D',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    errorButtonText: {
        color: '#fff',
        backgroundColor: '#D7263D',
        fontWeight: 'bold',
        fontSize: 16,
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 10,
        overflow: 'hidden'
    },

});

