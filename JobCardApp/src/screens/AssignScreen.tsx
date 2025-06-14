import React, { useState } from 'react';
import { View } from 'react-native';
import SearchBar from '../components/SearchBar';
import { getJobs } from '../firebase';

const AssignScreen = () => {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        console.log("searching", query)
    }

    getJobs();

    return (
        <View style={{ flex: 1 }}>
            <SearchBar value={query} onChangeText={setQuery} handleSearch={handleSearch} />

        </View>
    );
};

export default AssignScreen;
