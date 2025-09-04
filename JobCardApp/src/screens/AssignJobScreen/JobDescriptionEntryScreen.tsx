import { Text } from "react-native";
import { AssignJobStackParamList } from "../../navigation/AssignJobStack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import FieldSearch from "./components/FieldSearch";
import { Job } from "../../types/types";
import COLORS from "../../constants/colors";

type Props = NativeStackScreenProps<AssignJobStackParamList, 'JobDescriptionEntry'>;

export default function JobDescriptionEntryScreen({ route, navigation }: Props) {
    // Check for route first
    if (!route.params?.job) {
        navigation.goBack();
        return null;
    }



    const { job } = route.params
    const [loading, setLoading] = useState(false);

    console.log(job)

    const handleSubmit = (value: string) => {
        setLoading(true);
        const newJob = { ...job, description: value } as Job
        navigation.navigate("JobOverview", { job: newJob })
    };

    return (
        <FieldSearch
            loading={loading}
            onSubmit={handleSubmit}
            placeholder="e.g horn not working"
            title={<>Enter the job<Text style={{ fontWeight: 600, color: COLORS.primary }}>{"\n"}description</Text></>}
            subtitle={"Be as descriptive as possible."}
        />
    )
}