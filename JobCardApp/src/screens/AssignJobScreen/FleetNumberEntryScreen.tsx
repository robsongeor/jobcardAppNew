import { Text } from "react-native";
import { AssignJobStackParamList } from "../../navigation/AssignJobStack";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { getNewJobFromFleetNumber } from "../../firebase";
import FieldSearch from "./components/FieldSearch";
import { useNavigation } from "@react-navigation/native";

import COLORS from "../../constants/colors";
import { Job } from "../../types/types";


type Props = NativeStackScreenProps<AssignJobStackParamList, 'FleetNumberEntry'>;


export default function FleetNumberEntryScreen({ route, navigation }: Props) {
    // Check for route first
    if (!route.params?.jobNumber) {
        // Option 1: Navigate back
        navigation.goBack();
        return null;

    }

    const { jobNumber } = route.params

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>("");

    const handleSubmit = async (value: string) => {
        setLoading(true);
        setError(null); // reset old errors
        try {
            const result: Job | null = await getNewJobFromFleetNumber(value);
            if (result !== null) {
                navigation.navigate("JobDescriptionEntry", { job: { ...result, job: jobNumber } });
            } else {
                setError("No fleet number found.");
            }
        } catch (error) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <FieldSearch
            loading={loading}
            onSubmit={handleSubmit}
            placeholder="e.g FN2024"
            title={<>Enter the <Text style={{ fontWeight: '600', color: COLORS.primary }}>fleet</Text>{"\n"}number</>}
            subtitle={"We'll check if it exists in our system."}
            errorMessage={error}
            resetError={() => setError(null)}
        />

    )
}