import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
import BottomRightButton from "./Buttons/BottomRightButton";
import { firebase, reload } from "@react-native-firebase/auth";
import { submitJobCardToFireStore, updateAssignedStatus } from "../../firebase";
import { JobFormData } from "../../hooks/useJobFormData";
import { getStoredUserField } from "../../storage/storage";
import { Job } from "../../types/types";
import { useState } from "react";
import Icon from "react-native-vector-icons/Feather";
import JobDetailsOverview from "./JobDetailsOverview";

type SubmitSectionProps = {
    data: JobFormData // Replace 'any' with your JobFormData type if available
    jobId: string
    job: Job
};

export default function SubmitSection({ data, jobId, job }: SubmitSectionProps) {

    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);


    const handleSubmit = async (data: JobFormData) => {
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
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <Modal visible={loading} transparent animationType="fade">
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Submitting...</Text>
                </View>
            </Modal>

            <Modal visible={showSuccess} transparent animationType="fade">
                <TouchableOpacity onPress={() => setShowSuccess(false)} style={styles.loadingOverlay}>
                    <Icon name="check-circle" size={48} color="#4BB543" />
                    <Text style={styles.loadingText}>Submitted Successfully!</Text>
                </TouchableOpacity>
            </Modal>

            <View style={styles.container}>


                <JobDetailsOverview
                    data={data}
                />

                <BottomRightButton
                    label="submit"
                    disabled={false}
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
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 16,
        marginBottom: 4,
        color: "#222",
    },
    fieldValue: {
        marginBottom: 4,
        fontSize: 16,
        color: "#333",
    },
    itemBlock: {
        marginBottom: 8,
        paddingLeft: 12,
        borderLeftWidth: 2,
        borderLeftColor: "#eee",
    },
    submitButton: {
        backgroundColor: "#007aff",
        borderRadius: 8,
        paddingVertical: 14,
        marginTop: 24,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        letterSpacing: 1,
    },
    loadingOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 14,
        color: '#007AFF',
        fontSize: 18,
        fontWeight: 'bold'
    },
    successButton: {
        marginTop: 18,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 32,
        alignItems: 'center',
    },
    successButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },



});
