import React, { useMemo, useState } from 'react';
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAssignedJobs } from '../context/AssignedJobContext';
import JobInfoBlock from '../components/JobInfoBlock';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JobsStackParamList } from '../navigation/JobStackNavigator';
import SearchBar from '../components/SearchBar';
import { Job, TabType } from '../types/types';
import { getStoredUserField } from '../storage/storage';
import JobsFilters from '../components/JobsFilters';
import COLORS from '../constants/colors';
import JobListItem from '../components/JobListItem';
import PADDING from '../constants/padding';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

const JobsScreen = () => {

    const [query, setQuery] = useState("");
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const TAB_ORDER: TabType[] = ["all", "assigned", "submitted", "overdue"];

    type NavigationProp = NativeStackNavigationProp<JobsStackParamList, 'JobForm'>;
    const navigation = useNavigation<NavigationProp>();

    const { assignedJobs } = useAssignedJobs();

    const handleOpen = (job: Job) => {
        navigation.navigate('JobForm', { jobId: job.id, job: job })
    }

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

    const filteredJobs = () => {
        let tabFilter = assignedJobs;

        if (activeTab !== 'all') {
            tabFilter = assignedJobs.filter(job => job.assignedStatus[getStoredUserField('uid')] === activeTab)
        }

        if (query.length === 0) {
            return tabFilter.sort((a, b) => parseInt(b.job, 10) - parseInt(a.job, 10))
        }
        const filtered = tabFilter.filter(job => jobMatchesQuery(job, query));
        return filtered.sort((a, b) => parseInt(b.job, 10) - parseInt(a.job, 10))
    };




    return (

        <SafeAreaView style={styles.container}>






            <View style={styles.scrollView}>
                <SearchBar
                    value={query}
                    onChangeText={setQuery}
                    handleSearch={() => console.log(query)}
                    autoSearch={true}
                />

                <FlatList
                    style={{ flex: 1 }}
                    data={filteredJobs()}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <JobListItem
                            job={item}
                            onPress={() => handleOpen(item)}
                        />
                    )
                    }

                    ListHeaderComponent={
                        <JobsFilters
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}

                        />
                    }
                />
            </View>
        </SafeAreaView>

    )
}
export default JobsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,

    },
    scrollView: {
        flex: 1,

    }


});
