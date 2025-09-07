import React, { useState } from "react";
import { Text } from "react-native";
import COLORS from "../../constants/colors";

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
                //Job already exists
                navigation.navigate("JobOverview", { job: result });
            } else {
                // //navigate to fleet
                // navigation.navigate("FleetNumberEntry", { jobNumber: value });
                navigation.navigate("NewMachineEntry", { jobNumber: value })
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

