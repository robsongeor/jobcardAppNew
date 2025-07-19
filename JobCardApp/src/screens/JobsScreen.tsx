import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
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
import Icon from 'react-native-vector-icons/Feather';
import PADDING from '../constants/padding';

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
        const uid = getStoredUserField('uid');
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 7);

        const showArchived = activeTab === "archive"



        let tabFilter = assignedJobs;

        if (activeTab !== 'all') {
            const notArchived = activeTab === 'archive' ? 'submitted' : activeTab

            console.log(notArchived)

            tabFilter = assignedJobs.filter(
                job => job.assignedStatus[uid] === notArchived
            );

            console.log(tabFilter)
        }
        // if not archive
        const cleaned = tabFilter.filter(job => {
            const status = job.assignedStatus[uid];
            const assignedDate = new Date(job.assignedDate[uid]);
            const isOld = assignedDate < cutoffDate;

            return !(status === 'submitted' && isOld);
        });

        const archived = tabFilter.filter(job => {

            const assignedDate = new Date(job.assignedDate[uid]);
            const isOld = assignedDate < cutoffDate;

            return (isOld);
        });

        const sorted = (list: Job[]) =>
            list.sort((a, b) => parseInt(b.job, 10) - parseInt(a.job, 10));


        const jobs = showArchived ? archived : cleaned


        return query.length === 0
            ? sorted(jobs)
            : sorted(jobs.filter(job => jobMatchesQuery(job, query)));
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
                        <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 20, paddingRight: PADDING.horizontal }}>

                            <JobsFilters
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />
                            <TouchableOpacity onPress={() => setActiveTab("archive")}>
                                <Icon name="archive" size={20} color={COLORS.primary} />
                            </TouchableOpacity>

                        </View>
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
