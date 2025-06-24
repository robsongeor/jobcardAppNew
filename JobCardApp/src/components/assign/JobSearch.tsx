import { Button, StyleSheet, View } from "react-native";
import SmallTextInput from "../form/FormInputs/SmallTextInput";
import { Job } from "../../types/types";

type JobSearchProps = {
    jobInfo: Job;
    setJobInfo: React.Dispatch<React.SetStateAction<Job>>;
    handleJobSearch: (query: string) => void;
}

export default function JobSearch({ jobInfo, setJobInfo, handleJobSearch }: JobSearchProps) {


    return (
        <View style={styles.row}>
            <SmallTextInput
                label="Enter Job Number to Begin"
                value={jobInfo.job}
                onChangeText={(value) => setJobInfo({ ...jobInfo, job: value })}
                placeholder="e.g. 130680"
                style={styles.input} // Assuming your SmallTextInput passes style down
            />
            <View style={styles.buttonWrapper}>
                <Button
                    title="Search"
                    onPress={() => handleJobSearch(jobInfo.job)}
                />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',

        gap: 8, // If not supported, use marginLeft on buttonWrapper
    },
    input: {
        flex: 1,
        marginRight: 8,
    },
    buttonWrapper: {
        // optional: adjust button width or margin if needed
    },
});
