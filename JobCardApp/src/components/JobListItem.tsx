//JobInfoBlock.tsx
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Job } from "../types/types";
import { getStoredUserField } from "../storage/storage";
import Icon from "react-native-vector-icons/Feather";
import COLORS from "../constants/colors";
import PADDING from "../constants/padding";
import SubTitle from "./text/SubTitle";
import { capitalizeFirst, formatDate } from "./helpers/formatters";


type JobListItemProps = {
    job: Job;
    onPress?: () => void;
    isSelected?: boolean;
};

export default function JobListItem({ job, onPress, isSelected }: JobListItemProps) {

    const uid = getStoredUserField('uid');

    function getStatusIcon(status: string | undefined) {
        if (status === 'submitted') {
            return "check-circle"
        }
        if (status === 'assigned') {
            return "user-plus"

        }
        if (status === 'overdue') {
            return "alert-circle"
        }

        return "minus-circle"
    }

    function getStatusColor(status: string | undefined) {
        if (status === 'submitted') {
            return { color: COLORS.success };
        }
        if (status === 'assigned') {
            return { color: COLORS.secondary };
        }
        if (status === 'overdue') {
            return { color: COLORS.error };
        }


        return { color: COLORS.greyedText }
    }

    function getColor(status: string | undefined) {
        if (status === 'submitted') {
            return COLORS.success;
        }
        if (status === 'assigned') {
            return COLORS.secondary;
        }
        if (status === 'overdue') {
            return COLORS.error;
        }


        return COLORS.greyedText
    }



    return (

        <TouchableOpacity style={styles.container} onPress={onPress}>
            {/* TOP ROW */}
            <View style={styles.row}>
                {/* LEFT */}
                <View style={styles.left}>
                    <View style={[styles.icon, { borderColor: getColor(job.assignedStatus[uid],) }]}>
                        <Icon name={getStatusIcon(job.assignedStatus[uid])} size={20} color={getColor(job.assignedStatus[uid])} />
                    </View>

                </View>

                {/* MIDDLE */}
                <View style={[styles.middle, { justifyContent: "flex-end" }]}>
                    <View >
                        {/* Title */}
                        <Text style={styles.title}>Job {job.job} <Text style={styles.subTitle}>({job.fleet.toUpperCase()})</Text></Text>
                        {/* Sub text */}
                        <Text style={styles.subTitle}>{capitalizeFirst(job.machine.make)} {job.machine.model.toUpperCase()}</Text>
                        <Text numberOfLines={1} style={styles.subText}>{capitalizeFirst(job.description)}</Text>
                    </View>

                </View>

                {/* RIGHT */}
                <View style={styles.right}>
                    <TouchableOpacity style={styles.moreButton}>
                        <Icon name="more-vertical" size={18} color={COLORS.black} />
                    </TouchableOpacity>

                </View>
            </View>


            {/* BOTTOM ROW */}
            <View style={styles.row}>
                {/* LEFT */}
                <View style={[styles.left, { justifyContent: "flex-end" }]}>
                    <Text style={[styles.subTitle, { fontWeight: "800", color: "#777" }]}>Status</Text>
                </View>

                {/* MIDDLE */}
                <View style={[styles.middle, { justifyContent: "flex-end" }]}>
                    <Text style={[styles.status, getStatusColor(job.assignedStatus[uid])]}>{capitalizeFirst(job.assignedStatus[uid])}</Text>

                </View>

                {/* RIGHT */}
                <View style={styles.right}>
                    <Text numberOfLines={1} style={[styles.subTitle, { fontWeight: "400", color: "#1e82cf" }]}>{capitalizeFirst(job.customerName)}</Text>
                    <Text style={[styles.subTitle, { fontWeight: "600" }]}>{formatDate(job.assignedDate[uid])}</Text>
                </View>
            </View>
        </TouchableOpacity>


    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc"
    },
    row: {
        flexDirection: "row"
    },
    left: {
        flex: 1,

    },
    middle: {
        flex: 4,

    },
    right: {
        flex: 1.5,

        alignItems: "flex-end"
    },
    icon: {
        width: 48,
        height: 48,
        opacity: .8,
        borderRadius: 24,
        borderWidth: 0,
        justifyContent: "center",
        alignItems: "center"
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
        color: "#888"
    },
    subText: {
        marginTop: 2,
        fontSize: 12,
        fontWeight: "500",
        color: "#888"
    },
    status: {
        fontWeight: "700",
        fontSize: 14,
    },


});
