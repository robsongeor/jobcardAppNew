import { FlatList } from "react-native-gesture-handler";
import JobListItem from "../../../components/JobListItem";
import { Job } from "../../../types/types";
import { StyleSheet } from "react-native";
import COLORS from "../../../constants/colors";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { JobsStackParamList } from "../../../navigation/JobStackNavigator";

type JobsListType = {
    jobsList: Job[]
}

export default function JobsList({ jobsList }: JobsListType) {
    const navigation = useNavigation<NavigationProp<JobsStackParamList>>();

    const handleOpen = (job: Job) => {
        navigation.navigate('JobForm', { jobId: job.id, job: job })
    }

    return (
        <FlatList
            style={styles.container}
            data={jobsList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <JobListItem
                    job={item}
                    onPress={() => handleOpen(item)}
                />
            )}


        />
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,

    },


});