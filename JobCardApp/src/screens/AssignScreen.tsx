import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import SearchBar from '../components/SearchBar';
import { getJobs } from '../firebase';
import { Job } from '../types/types';
import { Text } from 'react-native-gesture-handler';

const AssignScreen = () => {
    const [query, setQuery] = useState('');

    const [jobs, setJobs] = useState<Job[]>([])

    useEffect(() => {
        const loadJobs = async () => {
            try {
                const data = await getJobs();
                setJobs(data);
            } catch (error) {
                console.error("Error loading jobs:", error);
            }
        };

        loadJobs(); // call it
    }, []);
    const handleSearch = () => {
        console.log("searching", query)
    }

    getJobs();

    return (
        <View style={{ flex: 1 }}>
            <SearchBar value={query} onChangeText={setQuery} handleSearch={handleSearch} />

            {jobs.map((job) => (
                <Text key={job.id}>{job.fleet}</Text>
            ))}

        </View>
    );
};

export default AssignScreen;
