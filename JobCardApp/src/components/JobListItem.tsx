import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Job } from "../types/types";
import { getStoredUserField } from "../storage/storage";
import Icon from "react-native-vector-icons/Feather";
import COLORS from "../constants/colors";
import PADDING from "../constants/padding";
import { capitalizeFirst, formatDate } from "./helpers/formatters";

type JobListItemProps = {
    job: Job;
    onPress?: () => void;
};

export default function JobListItem({ job, onPress }: JobListItemProps) {
    const uid = getStoredUserField('uid');
    const status = job.assignedStatus[uid];

    function getStatusIcon(status: string | undefined) {
        switch (status) {
            case 'submitted':
                return "check-circle";
            case 'assigned':
                return "user-plus";
            case 'overdue':
                return "alert-circle";
            default:
                return "minus-circle";
        }
    }

    function getStatusColor(status: string | undefined) {
        switch (status) {
            case 'submitted':
                return COLORS.success;
            case 'assigned':
                return COLORS.secondary;
            case 'overdue':
                return COLORS.error;
            default:
                return COLORS.greyedText;
        }
    }

    const getStatusStyle = (status: string | undefined) => ({
        color: getStatusColor(status),
    });

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            {/* TOP ROW */}
            <View style={styles.row}>
                <View style={styles.left}>
                    <View style={[styles.icon, { borderColor: getStatusColor(status) }]}>
                        <Icon name={getStatusIcon(status)} size={20} color={getStatusColor(status)} />
                    </View>
                </View>
                <View style={[styles.middle, { justifyContent: "flex-end" }]}>
                    <View>
                        <Text style={styles.title}>
                            Job {job.job} <Text style={styles.subTitle}>({job.fleet.toUpperCase()})</Text>
                        </Text>
                        <Text style={styles.subTitle}>
                            {capitalizeFirst(job.machine.make)} {job.machine.model.toUpperCase()}
                        </Text>
                        <Text numberOfLines={1} style={styles.subText}>
                            {capitalizeFirst(job.description)}
                        </Text>
                    </View>
                </View>
                <View style={styles.right}>
                    <TouchableOpacity style={styles.moreButton}>
                        <Icon name="more-vertical" size={18} color={COLORS.black} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* BOTTOM ROW */}
            <View style={styles.row}>
                <View style={[styles.left, { justifyContent: "flex-end" }]}>
                    <Text style={[styles.subTitle, styles.statusLabel]}>Status</Text>
                </View>
                <View style={[styles.middle, { justifyContent: "flex-end" }]}>
                    <Text style={[styles.status, getStatusStyle(status)]}>
                        {capitalizeFirst(status)}
                    </Text>
                </View>
                <View style={styles.right}>
                    <Text ellipsizeMode="tail" numberOfLines={1} style={styles.customerName}>
                        {capitalizeFirst(job.customerName)}
                    </Text>
                    <Text style={styles.dateText}>{formatDate(job.assignedDate[uid])}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        marginHorizontal: PADDING.horizontal,
    },
    row: {
        flexDirection: "row",
    },
    left: {
        flex: 1,
    },
    middle: {
        flex: 4,
    },
    right: {
        flex: 1.5,
        alignItems: "flex-end",
    },
    icon: {
        width: 48,
        height: 48,
        opacity: 0.8,
        borderRadius: 24,
        borderWidth: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    moreButton: {
        alignItems: "flex-end",
    },
    title: {
        fontWeight: "700",
        fontSize: 15,
    },
    subTitle: {
        marginTop: 2,
        fontSize: 12,
        fontWeight: "700",
        color: "#888",
    },
    subText: {
        marginTop: 2,
        fontSize: 12,
        fontWeight: "500",
        color: "#888",
    },
    status: {
        fontWeight: "700",
        fontSize: 14,
    },
    statusLabel: {
        fontWeight: "800",
        color: "#777",
    },
    customerName: {
        fontWeight: "400",
        color: "#1e82cf",
    },
    dateText: {
        fontWeight: "600",
    },
});
