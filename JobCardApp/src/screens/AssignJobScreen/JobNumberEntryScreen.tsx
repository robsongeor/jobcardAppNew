import React, { useState } from "react";
import { Text, StyleSheet } from "react-native";
import COLORS from "../../constants/colors";
import PADDING from "../../constants/padding";
import { getJobFromJobNumber } from "../../firebase";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AssignJobStackParamList } from "../../navigation/AssignJobStack";

import FieldSearch from "./components/FieldSearch";

type Navigation = NativeStackNavigationProp<AssignJobStackParamList, "JobNumberEntry">;

export default function JobNumberEntryScreen() {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<Navigation>();

    const handleSubmit = async (value: string) => {
        setLoading(true);
        try {
            const result = await getJobFromJobNumber(value);
            if (result !== null) {

                navigation.navigate("JobOverview", { job: result });
            } else {
                //navigate to fleet
                navigation.navigate("FleetNumberEntry", { jobNumber: value });
            }
        } catch (error) {
            // Handle error (e.g., show a message)
        } finally {
            setLoading(false);
        }
    };

    return (
        <FieldSearch
            loading={loading}
            onSubmit={handleSubmit}
            placeholder="e.g 130560"
            title={<>Enter the <Text style={{ fontWeight: 600, color: COLORS.primary }}>job</Text>{"\n"}number</>}
            subtitle={"We'll check if it exists in our system."}
            keyboardType="numeric"
        />
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
