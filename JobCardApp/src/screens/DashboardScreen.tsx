import { Text, View, StyleSheet } from "react-native";
import { addRecentActivity, getJobsByStatus, getRecentActivity, getStoredUserField } from "../storage/storage";
import { StatCard } from "../components/StatCard";
import COLORS from "../constants/colors";
import { RecentActivityType } from "../types/types";
import RecentActivity from "../components/RecentActivity";
import { useEffect, useState } from "react";
import { EventBus } from "../utils/EventBus";

export default function DashboardScreen() {
    const name = getStoredUserField('name').split(" ")[0];
    const [recentActivityList, setRecentActivityList] = useState<RecentActivityType[]>([]);

    const [assigned, setAssigned] = useState(getJobsByStatus("assigned").length)

    useEffect(() => {
        setRecentActivityList(getRecentActivity());

        const listener = () => setRecentActivityList(getRecentActivity());
        EventBus.on("recentActivityUpdated", listener);

        return () => {
            EventBus.off("recentActivityUpdated", listener);
        };
    }, []);


    useEffect(() => {
        const updateAssigned = () => setAssigned(getJobsByStatus("assigned").length);
        updateAssigned(); // Run once on mount

        EventBus.on("jobsUpdated", updateAssigned);

        // Cleanup function (must return void)
        return () => {
            EventBus.off("jobsUpdated", updateAssigned);
        };
    }, []);



    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>
                Hello, <Text style={styles.username}>{name}</Text>
            </Text>
            <View style={styles.statsContainer}>
                <StatCard label="Assigned" value={assigned} unit="Jobs" color={COLORS.primary} icon="user-plus" style={{ marginRight: 4 }} />
                <StatCard label="Overdue" value={10} unit="Jobs" color={COLORS.error} icon="alert-circle" style={{ marginLeft: 4 }} />
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
