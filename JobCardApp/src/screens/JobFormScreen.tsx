import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { JobsStackParamList } from '../navigation/JobStackNavigator';


type JobFormRouteProp = RouteProp<JobsStackParamList, 'JobForm'>;

const JobFormScreen = () => {
    const route = useRoute<JobFormRouteProp>();
    const { jobId } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>📝 Job Card for ID: {jobId}</Text>
            {/* We’ll add inputs, status, notes, etc. next */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default JobFormScreen;
