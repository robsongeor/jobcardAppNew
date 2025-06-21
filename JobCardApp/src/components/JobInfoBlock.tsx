//JobInfoBlock.tsx
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Job } from "../types/types";
import { getStoredUserField } from "../storage/storage";
import Icon from "react-native-vector-icons/Feather";
import COLORS from "../constants/colors";


type JobInfoBlockProps = {
    job: Job;
    onPress?: () => void;
    isSelected?: boolean;
};

export default function JobInfoBlock({ job, onPress, isSelected }: JobInfoBlockProps) {

    const uid = getStoredUserField('uid');

    function getStatusIcon(status: string | undefined) {
        if (status === 'submitted') {
            return <Icon name="check-circle" size={21} color={COLORS.success} />;
        }
        if (status === 'assigned') {
            return <Icon name="plus-circle" size={21} color={COLORS.primary} />

        }

        return <Icon name="minus-circle" size={21} color={COLORS.greyed} />;
    }

    function getStatusColor(status: string | undefined) {
        if (status === 'submitted') {
            return { color: COLORS.success };
        }
        if (status === 'assigned') {
            return { color: COLORS.primary };
        }

        return { color: COLORS.greyedText }
    }


    return (
        <TouchableOpacity
            onPress={onPress}
            style={[isSelected && styles.selected]}>



            <View style={styles.card}>
                <View style={styles.topRow}>
                    <View style={styles.fleetCustomerRow}>
                        <Text style={[styles.fleet, getStatusColor(job.assignedStatus[uid])]}>{job.fleet}</Text>
                        <Text style={styles.customer}>{job.customerName}</Text>
                    </View>
                    <Text style={styles.jobTitle}>{job.job}</Text>

                </View>

                {job.machine ? (
                    <View style={styles.machineBlock}>
                        <View style={styles.machineRow}>
                            <Text style={styles.machineValue}>
                                {job.machine.make || 'N/A'} {job.machine.model || 'N/A'}
                            </Text>
                            <Text style={styles.machineValue}>
                                SN: {job.machine.serialNumber || 'N/A'}
                            </Text>
                        </View>
                    </View>
                ) : (
                    <Text style={styles.machineValue}>Machine info not available</Text>
                )}

                <View style={styles.descriptionBlock}>
                    <Text style={styles.label}>Job Description</Text>
                    <Text style={styles.description} numberOfLines={3} ellipsizeMode="tail">
                        {job.description}
                    </Text>
                </View>
            </View>
            <View style={styles.checkCircleContainer}>
                {getStatusIcon(job.assignedStatus[uid])}
            </View>



        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fefefe",
        padding: 14,

        borderColor: "#ccc",
        borderBottomWidth: 1,

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
    checkCircleContainer: {
        position: 'absolute',
        right: 10,
        bottom: 10,
        padding: 2,


    },

});
