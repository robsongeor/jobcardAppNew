import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import SearchBar from '../components/SearchBar';
import { searchJobsTrigams } from '../firebase';
import { Job } from '../types/types';
import { Text } from 'react-native-gesture-handler';
import JobInfoBlock from '../components/JobInfoBlock';

const AssignScreen = () => {
    const [query, setQuery] = useState('');
    const [searchTriggered, setSearchTriggered] = useState(false);


    const [jobs, setJobs] = useState<Job[]>([])


    const handleSearch = async () => {
        if (query.length >= 3) {
            try {
                const results = await searchJobsTrigams(query);
                setJobs(results);
                setSearchTriggered(true);
            } catch (error) {
                console.error("Search failed", error);
                setSearchTriggered(false);
            }
        } else {
            setSearchTriggered(false);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <SearchBar value={query} onChangeText={setQuery} handleSearch={handleSearch} />

            {searchTriggered ? (
                jobs.map((job) => (
                    <JobInfoBlock key={job.id} job={job} />
                ))
            ) : (
                <Text style={{ padding: 16, textAlign: 'center', color: '#888' }}>
                    Enter at least 3 characters and press Search.
                </Text>
            )}


        </View>
    );
};

export default AssignScreen;
