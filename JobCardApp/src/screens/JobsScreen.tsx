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
        } else


            if (query.length === 0) return tabFilter;
        return tabFilter.filter(job => jobMatchesQuery(job, query));
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

            {/* <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[
                        styles.toggleButton,
                        styles.toggleButtonLeft,
                        activeTab === 'all' ? styles.toggleButtonActive : styles.toggleButtonInactive,
                    ]}
                    onPress={() => setActiveTab('all')}
                >
                    <Text style={activeTab === 'all' ? styles.toggleTextActive : styles.toggleTextInactive}>
                        All
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.toggleButton,
                        styles.toggleButtonLeft,
                        activeTab === 'assigned' ? styles.toggleButtonActive : styles.toggleButtonInactive,
                    ]}
                    onPress={() => setActiveTab('assigned')}
                >
                    <Text style={activeTab === 'assigned' ? styles.toggleTextActive : styles.toggleTextInactive}>
                        Assigned
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.toggleButton,
                        styles.toggleButtonRight,
                        activeTab === 'submitted' ? styles.toggleButtonActive : styles.toggleButtonInactive,
                    ]}
                    onPress={() => setActiveTab('submitted')}
                >
                    <Text style={activeTab === 'submitted' ? styles.toggleTextActive : styles.toggleTextInactive}>
                        Submitted
                    </Text>
                </TouchableOpacity>
            </View> */}


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

const styles = StyleSheet.create({
    toggleContainer: {
        flexDirection: 'row',
        margin: 10,
    },
    toggleButton: {
        flex: 1,
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    toggleButtonLeft: {
        marginRight: 4,
    },
    toggleButtonRight: {
        marginLeft: 4,
    },
    toggleButtonActive: {
        backgroundColor: '#007AFF',
    },
    toggleButtonInactive: {
        backgroundColor: '#f0f0f0',
    },
    toggleTextActive: {
        color: '#fff',
    },
    toggleTextInactive: {
        color: '#000',
    },
});


export default JobsScreen;
