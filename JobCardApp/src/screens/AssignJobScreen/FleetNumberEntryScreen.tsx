import { Text } from "react-native";
import { AssignJobStackParamList } from "../../navigation/AssignJobStack";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { getNewJobFromFleetNumber } from "../../firebase";
import FieldSearch from "./components/FieldSearch";
import { useNavigation } from "@react-navigation/native";

import COLORS from "../../constants/colors";


type Props = NativeStackScreenProps<AssignJobStackParamList, 'FleetNumberEntry'>;

type Navigation = NativeStackNavigationProp<AssignJobStackParamList, "JobNumberEntry">;

export default function FleetNumberEntryScreen({ route }: Props) {
    const { jobNumber } = route.params

    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<Navigation>();

    const handleSubmit = async (value: string) => {
        setLoading(true);
        console.log(value)
        try {
            const result = await getNewJobFromFleetNumber(value);
            if (result !== null) {
                console.log({ ...result, job: jobNumber })
                navigation.navigate("JobDescriptionEntry", { job: { ...result, job: jobNumber } });
            } else {
                //No fleet number found, need to show message
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
            placeholder="e.g FN2024"
            title={<>Enter the <Text style={{ fontWeight: 600, color: COLORS.primary }}>fleet</Text>{"\n"}number</>}
            subtitle={"We'll check if it exists in our system."}
            keyboardType="numeric"
        />
    )
}