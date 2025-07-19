import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { useAssignedJobs } from '../context/AssignedJobContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JobsStackParamList } from '../navigation/JobStackNavigator';
import SearchBar from '../components/SearchBar';
import { Job, TabType } from '../types/types';
import { getStoredUserField } from '../storage/storage';
import JobsFilters from '../components/JobsFilters';
import COLORS from '../constants/colors';
import JobListItem from '../components/JobListItem';

const JobsScreen = () => {
    const [query, setQuery] = useState("");
    const [activeTab, setActiveTab] = useState<TabType>('all');

    type NavigationProp = NativeStackNavigationProp<JobsStackParamList, 'JobForm'>;
    const navigation = useNavigation<NavigationProp>();

    const { assignedJobs } = useAssignedJobs();

    const handleOpen = (job: Job) => {
        navigation.navigate('JobForm', { jobId: job.id, job: job });
    };

    function jobMatchesQuery(job: any, query: string) {
        for (const key in job) {
            const value = job[key];
            if (typeof value === "string" && value.toLowerCase().includes(query.toLowerCase())) {
                return true;
            }
            if (key === "machine" && typeof value === "object" && value !== null) {
                for (const mKey in value) {
                    const mValue = value[mKey];
                    if (typeof mValue === "string" && mValue.toLowerCase().includes(query.toLowerCase())) {
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
            tabFilter = assignedJobs.filter(
                job => job.assignedStatus[getStoredUserField('uid')] === activeTab
            );
        }

        const sorted = (list: Job[]) =>
            list.sort((a, b) => parseInt(b.job, 10) - parseInt(a.job, 10));

        return query.length === 0
            ? sorted(tabFilter)
            : sorted(tabFilter.filter(job => jobMatchesQuery(job, query)));
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
                        <JobListItem job={item} onPress={() => handleOpen(item)} />
                    )}
                    ListHeaderComponent={
                        <JobsFilters
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    }
                />
            </View>
        </SafeAreaView>
    );
};

export default JobsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollView: {
        flex: 1,
    },
});
