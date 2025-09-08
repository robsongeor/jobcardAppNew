import { StyleSheet, View } from "react-native";
import { Job } from "../../types/types";
import JobOverviewCard from "../JobOverviewCard";
import COLORS from "../../constants/colors";
import { JobFormData } from "../../hooks/useJobFormData";

type InfoSectionProps = {
    job: Job;
    data: JobFormData;
    jobId: string;
};

export default function InfoSection({ data, jobId, job }: InfoSectionProps) {
    return (
        <View style={styles.container}>
            <JobOverviewCard job={job} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
});
