import { View, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AssignJobStackParamList } from "../../navigation/AssignJobStack";
import COLORS from "../../constants/colors";
import { getStoredUserField } from "../../storage/storage";
import { assignJobToUser, createNewJob, getJobFromJobNumber } from "../../firebase";
import JobOverviewCard from "../../components/JobOverviewCard";
import CustomButton from "../../components/form/Buttons/CustomButton";
import Config from "react-native-config";
import { useCallback, useEffect, useState } from "react";

type Props = NativeStackScreenProps<AssignJobStackParamList, 'JobOverview'>;

export default function JobOverviewScreen({ route, navigation }: Props) {

    if (!route.params?.job) {
        navigation.goBack();
        return null;
    }

    const { job } = route.params;

    const uid = getStoredUserField('uid');
    const [status, setStatus] = useState(job.assignedStatus[uid]);

    const handleAssign = useCallback(async () => {

        if (!uid) return;

        try {
            // If job doesn't exist, create it
            const jobExists = await getJobFromJobNumber(job.job)
            if (jobExists === null) {
                let updatedJob = {
                    ...job,
                    assignedTo: Array.from(new Set([...(job.assignedTo || []), uid])),
                    assignedDate: { ...(job.assignedDate || {}), [uid]: new Date().toISOString() },
                    assignedStatus: { ...(job.assignedStatus || {}), [uid]: "assigned" }
                };

                await createNewJob(updatedJob);
                setStatus("assigned")
            } else {
                await assignJobToUser(jobExists.id, uid);
                setStatus("assigned")
            }


        } catch (error) {
            // Show error message to user (toast, modal, etc.)
            console.error("Assignment failed:", error);
        }
    }, [job, uid]);

    useEffect(() => {
        navigation.setParams({ handleAssign });
    }, [handleAssign]);


    return (
        <View style={styles.screen}>
            <JobOverviewCard
                job={job}
                status={status}
                button={
                    <CustomButton
                        text="Assign"
                        icon="user-plus"
                        onPress={handleAssign}
                        disabled={true}
                    />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
});
