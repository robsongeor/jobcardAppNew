import { Text, View } from "react-native";
import { AssignJobStackParamList } from "../../navigation/AssignJobStack";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { getJobFromJobNumber, getNewJobFromFleetNumber } from "../../firebase";
import FieldSearch from "./components/FieldSearch";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import { Job } from "../../types/types";


type Props = NativeStackScreenProps<AssignJobStackParamList, 'JobDescriptionEntry'>;

type Navigation = NativeStackNavigationProp<AssignJobStackParamList, "JobNumberEntry">;

export default function JobDescriptionEntryScreen({ route }: Props) {
    const { job } = route.params

    const [loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(false)
    const navigation = useNavigation<Navigation>();


    const handleSubmit = (value: string) => {
        setLoading(true);


        const newJob = { ...job, description: value } as Job
        navigation.navigate("JobOverview", { job: newJob })

    };





    return (
        <>
            <FieldSearch
                loading={loading}
                onSubmit={handleSubmit}
                fieldName="job description"
                placeholder="e.g horn not working"
            />

        </>

    )
}