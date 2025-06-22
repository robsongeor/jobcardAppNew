//JobInfoBlock.tsx
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Job } from "../../types/types";
import { getStoredUserField } from "../../storage/storage";
import PADDING from "../../constants/padding";


type JobInfoBlockProps = {
    job: Job;
    onPress?: () => void;
    isSelected?: boolean;
};

export default function JobInfo({ job, onPress, isSelected }: JobInfoBlockProps) {

    const uid = getStoredUserField('uid');

    return (


        <View style={styles.card}>
            <View style={styles.topRow}>
                <View style={styles.fleetCustomerRow}>
                    <Text style={styles.fleet}>{job.fleet}</Text>
                    <Text style={styles.customer}>{job.customerName}</Text>
                </View>
                <Text style={styles.jobTitle}>{job.job}</Text>

            </View>

            {job.machine ? (
                <View style={styles.machineBlock}>
                    <View style={styles.machineRow}>
                        <Text style={styles.machineValue}>
                            {job.machine.make || 'N/A'} {job.machine.model || 'N/A'} {job.machine.serialNumber || 'N/A'}
                        </Text>

                    </View>
                </View>
            ) : (
                <Text style={styles.machineValue}>Machine info not available</Text>
            )}

            <View style={styles.descriptionBlock}>


            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    card: {

        padding: PADDING.horizontal,

    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    fleetCustomerRow: {
        flexDirection: "row",
        flexShrink: 1,
        flexWrap: "wrap",
    },
    fleet: {
        fontSize: 14,
        fontWeight: "800",
        color: "#3752e2",
        textTransform: "uppercase",
        marginRight: 8,
    },
    customer: {
        fontSize: 14,
        fontWeight: "400",
        textTransform: "uppercase",
        color: "#aaa",
        flexShrink: 1,
        minWidth: 150,
    },
    jobTitle: {
        fontSize: 14,
        fontWeight: "800",
        color: "#222",
        maxWidth: "30%",
        textAlign: "right",
    },
    machineBlock: {
        paddingTop: 4,
    },
    machineRow: {
        marginBottom: 2,
    },
    machineValue: {
        textTransform: "uppercase",
        fontSize: 12,
        color: "#333",
        flexShrink: 1,
    },
    descriptionBlock: {
        marginTop: 4,
    },
    label: {
        fontSize: 12,
        color: "#999",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    description: {
        fontSize: 12,
        color: "#444",
    },
    selected: {
        borderColor: 'blue',
        borderWidth: 2,
    },
});
