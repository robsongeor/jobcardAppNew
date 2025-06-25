import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View, Text, StyleSheet } from "react-native";
import JobsList from "./components/JobList";
import { useAssignedJobs } from "../../context/AssignedJobContext";
import { useState } from "react";
import SearchBar from "../../components/SearchBar";
import COLORS from "../../constants/colors";
import PADDING from "../../constants/padding";
import { getStoredUserField } from "../../storage/storage";

const Tab = createMaterialTopTabNavigator();


export default function JobsScreen() {
    const { assignedJobs } = useAssignedJobs();
    const [search, setSearch] = useState("");
    const uid = getStoredUserField('uid');
    const [selectedTab, setSelectedTab] = useState<"all" | "assigned" | "submitted" | "overdue">("all");



    // This would be where you do your filtering
    const filteredJobs = assignedJobs.filter(job =>
        jobMatchesQuery(job, search)
    );

    function jobMatchesQuery(job: any, query: string) {
        // Search top-level string properties
        for (const key in job) {
            const value = job[key];
            if (typeof value === "string" && value.toLowerCase().includes(query.toLowerCase())) {
                return true;
            }
            // If key is 'machine', search inside its string properties
            if (key === "machine" && typeof value === "object" && value !== null) {
                for (const mKey in value) {
                    const mValue = value[mKey];
                    if (
                        typeof mValue === "string" &&
                        mValue.toLowerCase().includes(query.toLowerCase())
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // Now split filteredJobs into their respective tabs if needed:
    const all = filteredJobs;
    const assigned = filteredJobs.filter(job => job.assignedStatus[uid] === "assigned");
    const submitted = filteredJobs.filter(job => job.assignedStatus[uid] === "submitted");
    const overdue = filteredJobs.filter(job => job.assignedStatus[uid] === "overdue");



    return (
        <View style={styles.container}>
            <SearchBar
                value={search}
                onChangeText={setSearch}
                handleSearch={() => console.log(search)}
                autoSearch={true}
            />


            <Tab.Navigator>
                <Tab.Screen
                    name="All"
                    children={() => <JobsList jobsList={all} />}
                />
                <Tab.Screen
                    name="Assigned"
                    children={() => <JobsList jobsList={assigned} />}
                />
                <Tab.Screen
                    name="Submitted"
                    children={() => <JobsList jobsList={submitted} />}
                />
                <Tab.Screen
                    name="Overdue"
                    children={() => <JobsList jobsList={overdue} />}
                />
            </Tab.Navigator>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: PADDING.horizontal,
    },


});