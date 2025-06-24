import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native";
import COLORS from "../../constants/colors";
import PADDING from "../../constants/padding";
import BottomRightButton from "../../components/form/Buttons/BottomRightButton";
import { getJobFromJobNumber } from "../../firebase";
import { Job } from "../../types/types";

export default function JobNumberEntryScreen() {
    const [jobNumber, setJobNumber] = useState("");
    const [submitEnabled, setSubmitEnabled] = useState(false)
    const [job, setJob] = useState<Job | null>(null)
    const [loading, setLoading] = useState(false);


    const handleSubmit = async () => {
        setLoading(true);
        try {
            const result = await getJobFromJobNumber(jobNumber);
            if (result !== null) {
                setJob(result);
                // Navigation logic here if you want!
            } else {
                //navigate to fleet
            }

        } catch (error) {
            // Handle error (e.g., show a message)
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        setSubmitEnabled(jobNumber.trim().length > 4);
    }, [jobNumber]);


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={0}
        >
            <View style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={styles.title}>Enter your job number</Text>
                    <Text style={styles.subtitle}>
                        We'll check if this job exists in our system.
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g 130560"
                        value={jobNumber}
                        onChangeText={setJobNumber}
                        keyboardType="number-pad"
                        returnKeyType="done"
                        maxLength={10}
                    />


                </ScrollView>
                <BottomRightButton
                    label="Search"
                    disabled={!submitEnabled || loading}
                    onPress={handleSubmit}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "stretch",
        paddingHorizontal: PADDING.horizontal,
        backgroundColor: COLORS.background,
    },
    title: {
        fontSize: 40,
        fontWeight: "600",
        marginBottom: 8,
        color: "#111",
    },
    subtitle: {
        fontSize: 16,
        color: "#555",
        marginBottom: 24,
    },
    input: {
        backgroundColor: COLORS.white,
        borderRadius: 40,
        paddingHorizontal: 20,
        paddingVertical: 16,
        fontSize: 16,
        marginBottom: 12,
    },

    button: {

        backgroundColor: "#111",
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",

    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "400",
    },
});
