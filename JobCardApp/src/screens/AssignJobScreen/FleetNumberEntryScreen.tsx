import { Text, View } from "react-native";
import { AssignJobStackParamList } from "../../navigation/AssignJobStack";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { getJobFromJobNumber, getNewJobFromFleetNumber } from "../../firebase";
import FieldSearch from "./components/FieldSearch";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";


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
                //navigate to fleet
                console.log(result)
                // navigation.navigate("FleetNumberEntry", { jobNumber: value });
            }

        } catch (error) {
            // Handle error (e.g., show a message)
        } finally {
            setLoading(false);
        }
    };



    return (
        <>
            <FieldSearch
                loading={loading}
                onSubmit={handleSubmit}
                fieldName="fleet"
                placeholder="e.g FN2024"
            />

        </>

    )
}