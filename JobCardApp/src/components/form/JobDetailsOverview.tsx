import { StyleSheet, Text, View } from "react-native";
import { JobFormData } from "../../hooks/useJobFormData";
import { Job } from "../../types/types";
import JobInfo from "./JobInfo";
import JobInfoDetailed from "./JobInfoDetailed";

type JobDetailsOverviewType = {
    data: JobFormData,
    job?: Job,
}

export default function JobDetailsOverview({ data, job }: JobDetailsOverviewType) {


    return (
        <>
            {job && <JobInfoDetailed job={job} data={data} />}


        </>
    )
}


const styles = StyleSheet.create({
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 16,
        marginBottom: 4,
        color: "#222",
    },
    fieldValue: {
        marginBottom: 4,
        fontSize: 16,
        color: "#333",
    },
    itemBlock: {
        marginBottom: 8,
        paddingLeft: 12,
        borderLeftWidth: 2,
        borderLeftColor: "#eee",
    },
});

