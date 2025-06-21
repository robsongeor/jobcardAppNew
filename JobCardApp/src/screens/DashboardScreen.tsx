import { Text, View, StyleSheet } from "react-native";
import { getStoredUserField } from "../storage/storage";
import { StatCard } from "../components/StatCard";
import COLORS from "../constants/colors";
import { recentActivityType } from "../types/types";
import RecentActivity from "../components/RecentActivity";

export default function DashboardScreen() {
    const name = getStoredUserField('name').split(" ")[0];

    const recentActivityList: recentActivityType[] = [
        { id: 1, title: "Submitted Job Card", date: "2024-06-20", status: "submitted" },
        { id: 2, title: "Job Assigned", date: "2024-06-19", status: "assigned" },
        { id: 3, title: "Completed Inspection", date: "2024-06-19", status: "completed" },
    ];


    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>
                Hello, <Text style={styles.username}>{name}</Text>
            </Text>
            <View style={styles.statsContainer}>
                <StatCard label="Assigned" value={10} unit="Jobs" color={COLORS.primary} icon="user-plus" />
                <StatCard label="Overdue" value={10} unit="Jobs" color={COLORS.error} icon="alert-circle" />
            </View>
            <RecentActivity activity={recentActivityList} />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 21, // Adjust as needed for your layout
        marginHorizontal: 22, // Adds horizontal space

    },
    statsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 21,

    },
    greeting: {
        fontSize: 28,         // Large font
        fontWeight: "400",    // Regular for "Hello,"
        color: "#222",
        marginBottom: 8,
    },
    username: {
        fontWeight: "bold",   // Make the name bold
        color: "#222",        // Adjust color if needed
    },
    subtitle: {
        fontSize: 16,
        color: "#868686",     // Soft gray (matches your mockup)
        fontWeight: "400",
        marginBottom: 24,
    },
});
