import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useAssignedJobs } from '../context/AssignedJobContext';
import JobInfoBlock from '../components/JobInfoBlock';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JobsStackParamList } from '../navigation/JobStackNavigator';
import SearchBar from '../components/SearchBar';

const JobsScreen = () => {

    const [query, setQuery] = useState("");

    type NavigationProp = NativeStackNavigationProp<JobsStackParamList, 'JobForm'>;
    const navigation = useNavigation<NavigationProp>();

    const { assignedJobs } = useAssignedJobs();

    const filteredJobs = () => {
        //Only filters non nested tags. Need to incorporate machine info (make, model, serial)
        const jobs = assignedJobs.filter((job) =>
            Object.values(job).some(value =>
                typeof value === "string" && value.toLowerCase().includes(query.toLowerCase())
            )
        );

        //If string empty return full jobs list
        return query.length === 0 ? assignedJobs : jobs;
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
