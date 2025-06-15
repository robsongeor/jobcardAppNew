import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useAssignedJobs } from '../context/AssignedJobContext';
import JobInfoBlock from '../components/JobInfoBlock';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JobsStackParamList } from '../navigation/JobStackNavigator';




const JobsScreen = () => {

    type NavigationProp = NativeStackNavigationProp<JobsStackParamList, 'JobForm'>;
    const navigation = useNavigation<NavigationProp>();

    const { assignedJobs } = useAssignedJobs();

    return (
        <View>
            <FlatList
                data={assignedJobs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <JobInfoBlock
                        job={item}
                        onPress={() => navigation.navigate('JobForm', { jobId: item.id })}
                    />
                )}
            />
        </View>
    )


}


export default JobsScreen;
