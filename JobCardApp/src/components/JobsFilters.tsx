import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TabType } from "../types/types";

type JobsFiltersType = {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
}

export default function JobsFilters({ activeTab, setActiveTab }: JobsFiltersType) {
    return (
        <View style={styles.container}>


            <TouchableOpacity style={[styles.button, activeTab === 'all' && styles.buttonOn]} onPress={() => setActiveTab('all')}>
                <Text style={[styles.buttonText, activeTab === 'all' && styles.buttonTextOn]}>All</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, activeTab === 'assigned' && styles.buttonOn]} onPress={() => setActiveTab("assigned")}>
                <Text style={[styles.buttonText, activeTab === 'assigned' && styles.buttonTextOn]}>Assigned</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, activeTab === 'submitted' && styles.buttonOn]} onPress={() => setActiveTab("submitted")}>
                <Text style={[styles.buttonText, activeTab === 'submitted' && styles.buttonTextOn]}>Submitted</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, activeTab === 'overdue' && styles.buttonOn]} onPress={() => setActiveTab("overdue")}>
                <Text style={[styles.buttonText, activeTab === 'overdue' && styles.buttonTextOn]}>Overdue</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 9,
        backgroundColor: "#fff",
        gap: 14,

        borderColor: "#ccc",
        borderBottomWidth: 1,
    },
    button: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",

        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#007AFF',
        marginHorizontal: 4,
        paddingVertical: 6,
    },
    buttonOn: {
        backgroundColor: '#007AFF',
    },
    buttonText: {
        fontSize: 10,
        color: "#007AFF",
        fontWeight: "bold",
    },
    buttonTextOn: {
        fontSize: 10,
        color: "#fff",
        fontWeight: "bold",
    }
});
