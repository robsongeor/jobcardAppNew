import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SearchBar from '../components/SearchBar';
import { assignJobToUser, auth, getUserData, searchJobsTrigrams } from '../firebase';
import { Job } from '../types/types';
import JobInfoBlock from '../components/JobInfoBlock';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { getStoredUserField } from '../storage/storage';
import BottomRightButton from '../components/form/Buttons/BottomRightButton';

const AssignScreen = () => {
    const [query, setQuery] = useState('');
    const [searchTriggered, setSearchTriggered] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);



    const [jobs, setJobs] = useState<Job[]>([])

    const [lastDoc, setLastDoc] = useState<FirebaseFirestoreTypes.DocumentSnapshot | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [totalFetched, setTotalFetched] = useState(0)
    const maxResults = 30;

    const loadMoreJobs = async () => {
        if (loading || !hasMore || query.length < 3) return;

        setLoading(true);

        try {
            console.log("Searching for:", query);

            const { jobs: newJobs, lastDoc: newLastDoc } = await searchJobsTrigrams(query, totalFetched, maxResults, lastDoc || undefined);
            setJobs(prev => [...prev, ...(newJobs || [])]);
            setLastDoc(newLastDoc || null);
            setHasMore(!!newLastDoc); // if there's no lastDoc returned, we've reached the end

            setTotalFetched(prev => prev + newJobs.length)

        } catch (error) {
            console.error('Failed to load more jobs:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleSearch = async () => {
        if (query.length < 3 || loading) return;

        setSearchTriggered(true);
        setLoading(true);
        setJobs([]);
        setLastDoc(null);
        setHasMore(true);
        setTotalFetched(0); // ✅ reset on new search

        try {
            const { jobs: newJobs, lastDoc: newLastDoc } = await searchJobsTrigrams(
                query,
                0,
                maxResults,
                undefined,
            );
            setJobs(newJobs);
            setLastDoc(newLastDoc || null);
            setHasMore(!!newLastDoc);
            setTotalFetched(newJobs.length); // ✅ update count
        } catch (error) {
            console.error("Error searching jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    //Assigning Job to user
    const handleAssignJob = async () => {
        //Store locally first, on success update assignedTo field in firebase
        if (!selectedJobId) return;

        const uid = getStoredUserField('uid');

        if (!uid) {
            console.warn('User info missing from storage')
        } else {
            const job = await assignJobToUser(selectedJobId, uid);
            if (job) {
                setSelectedJobId(null)
            };
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <SearchBar value={query} onChangeText={setQuery} handleSearch={handleSearch} autoSearch={false} />

            {searchTriggered ? (
                <FlatList
                    data={jobs}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) =>
                        <JobInfoBlock
                            job={item}
                            isSelected={item.id === selectedJobId}
                            onPress={() => setSelectedJobId(item.id === selectedJobId ? null : item.id)}
                        />}
                    onEndReached={loadMoreJobs}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={loading ? <Text style={{ textAlign: 'center', padding: 16 }}>Loading more...</Text> : null}
                />
            ) : (
                <Text style={{ padding: 16, textAlign: 'center', color: '#888' }}>
                    Enter at least 3 characters and press Search.
                </Text>
            )}
            <BottomRightButton
                label='Assign'
                disabled={!selectedJobId}
                onPress={handleAssignJob}
            />

        </View>
    );

};


export default AssignScreen;
