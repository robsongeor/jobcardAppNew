import { Text } from "react-native";
import { AssignJobStackParamList } from "../../navigation/AssignJobStack";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import FieldSearch from "./components/FieldSearch";
import { useNavigation } from "@react-navigation/native";
import { Job } from "../../types/types";
import COLORS from "../../constants/colors";

type Props = NativeStackScreenProps<AssignJobStackParamList, 'JobDescriptionEntry'>;

type Navigation = NativeStackNavigationProp<AssignJobStackParamList, "JobNumberEntry">;

export default function JobDescriptionEntryScreen({ route, navigation }: Props) {
    const { job } = route.params
    const [loading, setLoading] = useState(false);

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