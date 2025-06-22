import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import COLORS from "../constants/colors";
import { RecentActivityType } from "../types/types";

type RecentActivityProps = {
    activity: RecentActivityType[]
}


export default function RecentActivity({ activity }: RecentActivityProps) {
    return (
        <View style={{ marginTop: 18 }}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            {activity.map((item, index) => (
                <View key={index} style={styles.activityRow}>
                    <Icon
                        name={
                            item.status === "submitted"
                                ? "check-circle"
                                : item.status === "assigned"
                                    ? "user-plus"
                                    : "clipboard"
                        }
                        size={20}
                        color={
                            item.status === "submitted"
                                ? COLORS.success
                                : item.status === "assigned"
                                    ? COLORS.primary
                                    : "#999"
                        }
                        style={{ marginRight: 8 }}
                    />
                    <View>
                        <Text style={styles.activityTitle}>{item.title}: {item.jobNumber}</Text>
                        <Text style={styles.activityDate}>{item.date}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
}


const styles = StyleSheet.create({
    sectionTitle: {
        fontWeight: "700",
        fontSize: 18,
        color: "#222",
        marginBottom: 8,
    },
    activityRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        backgroundColor: COLORS.white,
        padding: 10,
        borderRadius: 8,
    },
    activityTitle: {
        fontSize: 15,
        color: "#222",
        fontWeight: "500",
    },
    activityDate: {
        fontSize: 12,
        color: "#888",
    },

})