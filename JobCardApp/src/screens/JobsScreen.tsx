import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAssignedJobs } from '../context/AssignedJobContext';
import JobInfoBlock from '../components/JobInfoBlock';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JobsStackParamList } from '../navigation/JobStackNavigator';
import SearchBar from '../components/SearchBar';
import { Job, TabType } from '../types/types';
import { updateAssignedStatus } from '../firebase';
import { getStoredUserField } from '../storage/storage';
import JobsFilters from '../components/JobsFilters';



const JobsScreen = () => {

    const [query, setQuery] = useState("");
    const [activeTab, setActiveTab] = useState<TabType>('assigned');


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
        <View>
            <SearchBar
                value={query}
                onChangeText={setQuery}
                handleSearch={() => console.log(query)}
                autoSearch={true}
            />

            <JobsFilters
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />


            <FlatList
                data={filteredJobs()}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <JobInfoBlock
                        job={item}
                        onPress={() => handleOpen(item)}
                    />
                )}
            />
        </View>
    )


}



export default JobsScreen;
