import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useAssignedJobs } from '../context/AssignedJobContext';
import JobInfoBlock from '../components/JobInfoBlock';

const JobsScreen = () => {
    const { assignedJobs } = useAssignedJobs();

    return (
        <View>

            <FlatList
                data={assignedJobs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <JobInfoBlock
                        job={item}
                    />
                )}
            />



        </View>
    )


}


export default JobsScreen;
