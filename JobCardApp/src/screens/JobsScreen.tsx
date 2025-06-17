import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useAssignedJobs } from '../context/AssignedJobContext';
import JobInfoBlock from '../components/JobInfoBlock';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JobsStackParamList } from '../navigation/JobStackNavigator';
import SearchBar from '../components/SearchBar';
import { JobFormData } from '../hooks/useJobFormData';

const JobsScreen = () => {

    const [query, setQuery] = useState("");

    type NavigationProp = NativeStackNavigationProp<JobsStackParamList, 'JobForm'>;
    const navigation = useNavigation<NavigationProp>();

    const { assignedJobs } = useAssignedJobs();

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
        if (query.length === 0) return assignedJobs;
        return assignedJobs.filter(job => jobMatchesQuery(job, query));
    };

    return (
        <View>
            <SearchBar
                value={query}
                onChangeText={setQuery}
                handleSearch={() => console.log(query)}
            />
            <FlatList
                data={filteredJobs()}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <JobInfoBlock
                        job={item}
                        onPress={() => navigation.navigate('JobForm', { jobId: item.id, job: item })}
                    />
                )}
            />
        </View>
    )


}


export default JobsScreen;
