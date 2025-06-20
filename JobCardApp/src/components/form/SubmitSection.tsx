import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import BottomRightButton from "./Buttons/BottomRightButton";
import { firebase, reload } from "@react-native-firebase/auth";
import { submitJobCardToFireStore, updateAssignedStatus } from "../../firebase";
import { JobFormData } from "../../hooks/useJobFormData";
import { getStoredUserField } from "../../storage/storage";
import { Job } from "../../types/types";

type SubmitSectionProps = {
    data: JobFormData // Replace 'any' with your JobFormData type if available
    jobId: string
    job: Job
};

export default function SubmitSection({ data, jobId, job }: SubmitSectionProps) {

    const handleSubmit = async (data: JobFormData) => {
        // Save to Firestore as before
        await submitJobCardToFireStore(data);
        await updateAssignedStatus(jobId, getStoredUserField('uid'), "submitted");

        console.log({ ...job, ...data })

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
            // Show a success message or update UI
            console.log("Job card submitted and emailed successfully!");
        } else {
            // Handle error (show error message)
            const err = await response.text();
            console.log("Error sending job card: " + err);
        }
    };


    return (
        <View style={styles.container}>


            {/* Job Info */}
            <Text style={styles.sectionTitle}>Job ID:</Text>
            <Text style={styles.fieldValue}>{data.jobId}</Text>

            <Text style={styles.sectionTitle}>Last Updated:</Text>
            <Text style={styles.fieldValue}>
                {new Date(data.lastUpdated).toLocaleString()}
            </Text>

            {/* Description */}
            <Text style={styles.sectionTitle}>Description</Text>
            {Object.entries(data.description).map(([key, value]) => (
                <Text key={key} style={styles.fieldValue}>
                    {key}: {value === true ? 'Yes' : value === false ? 'No' : String(value)}
                </Text>
            ))}

            {/* Activity */}
            <Text style={styles.sectionTitle}>Activity</Text>
            {data.activity.map((item: any, idx: number) => (
                <View key={item.id || idx} style={styles.itemBlock}>
                    <Text style={styles.fieldValue}>Date: {item.date}</Text>
                    <Text style={styles.fieldValue}>Hours: {item.hours}</Text>
                    <Text style={styles.fieldValue}>KMs: {item.kms}</Text>
                </View>
            ))}

            {/* Parts */}
            <Text style={styles.sectionTitle}>Parts</Text>
            {data.parts.map((item: any, idx: number) => (
                <View key={item.id || idx} style={styles.itemBlock}>
                    <Text style={styles.fieldValue}>Qty: {item.quantityValue}</Text>
                    <Text style={styles.fieldValue}>Description: {item.descValue}</Text>
                </View>
            ))}



            <BottomRightButton
                label="submit"
                disabled={false}
                onPress={() => handleSubmit(data)}
            />

        </View>
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

});
