import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SearchBar from '../components/SearchBar';
import { auth, getUserData, searchJobsTrigrams } from '../firebase';
import { Job } from '../types/types';
import JobInfoBlock from '../components/JobInfoBlock';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { getStoredUserField } from '../storage/storage';

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
        console.log(getStoredUserField('uid'))
        // if (!selectedJobId || !auth.currentUser) return;

        // try {
        //     const jobRef = doc(db, 'jobs', selectedJobId);
        //     await updateDoc(jobRef, {
        //         assignedTo: auth.currentUser.uid,
        //     });
        //     console.log('Job assigned!');
        //     setSelectedJobId(null); // clear selection after assigning
        // } catch (error) {
        //     console.error('Failed to assign job:', error);
        // }
    };



    return (
        <View style={{ flex: 1 }}>
            <SearchBar value={query} onChangeText={setQuery} handleSearch={handleSearch} />

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

            <View style={styles.assignButtonContainer}>
                <TouchableOpacity
                    disabled={!selectedJobId}
                    style={[
                        styles.assignButton,
                        !selectedJobId && { backgroundColor: 'grey' },
                    ]}
                    onPress={handleAssignJob}
                >
                    <Text style={styles.assignButtonText}>Assign</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

};

const styles = StyleSheet.create({
    assignButtonContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    assignButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    assignButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },

})

export default AssignScreen;
