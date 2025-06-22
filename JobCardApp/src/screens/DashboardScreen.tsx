import { Text, View, StyleSheet, ScrollView, Button, TouchableOpacity } from "react-native";
import { addRecentActivity, getJobsByStatus, getOverdueJobs, getRecentActivity, getStoredUserField } from "../storage/storage";
import { StatCard } from "../components/StatCard";
import COLORS from "../constants/colors";
import { RecentActivityType } from "../types/types";
import RecentActivity from "../components/RecentActivity";
import { useEffect, useState } from "react";
import { EventBus } from "../utils/EventBus";
import PADDING from "../constants/padding";
import { signOut } from "@react-native-firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useStoredUserDashboardStats } from "../hooks/useStoredUserDashboardStats";
import Icon from "react-native-vector-icons/Feather";

export default function DashboardScreen() {
    const { name, assigned, overdue, isUserLoaded } = useStoredUserDashboardStats();
    const [recentActivityList, setRecentActivityList] = useState<RecentActivityType[]>([]);

    const handleSignOut = async () => {
        try {
            await auth().signOut();
            // Optionally: navigate to login screen or show a message
        } catch (e) {
            // Handle errors (show toast, alert, etc)
            console.log('Sign out error:', e);
        }
    };

    useEffect(() => {
        setRecentActivityList(getRecentActivity());

        const listener = () => setRecentActivityList(getRecentActivity());
        EventBus.on("recentActivityUpdated", listener);

        return () => {
            EventBus.off("recentActivityUpdated", listener);
        };
    }, []);

    if (!isUserLoaded) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading your dashboard...</Text>
        </View>;
    }

    return (

        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
            <View>
                <Text style={styles.greeting}>
                    Hello, <Text style={styles.username}>{name}</Text>
                </Text>
                <TouchableOpacity onPress={handleSignOut}>
                    <Icon name="log-out" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            </View>



            <Text style={styles.sectionTitle}>Stats</Text>
            <View style={styles.statsContainer}>
                <StatCard label="Assigned" value={assigned} unit="Jobs" color={COLORS.primary} icon="user-plus" style={{ marginRight: 4 }} />
                <StatCard label="Overdue" value={overdue} unit="Jobs" color={COLORS.error} icon="alert-circle" style={{ marginLeft: 4 }} />
            </View>
            <RecentActivity activity={recentActivityList} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 21, // Adjust as needed for your layout
        paddingHorizontal: PADDING.horizontal, // Adds horizontal space
        backgroundColor: COLORS.background

    },
    statsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 12,

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
    sectionTitle: {
        fontWeight: "700",
        fontSize: 18,
        color: "#222",
        marginTop: 24,
    },
});
