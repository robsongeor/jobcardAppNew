// src/navigation/JobsStackNavigator.tsx
import React from 'react';
import JobsScreen from '../screens/JobsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import JobFormScreen from '../screens/JobFormScreen';

export type JobsStackParamList = {
    JobsList: undefined;
    JobForm: { jobId: string }; // or { job: Job } if passing whole job
};

const Stack = createNativeStackNavigator<JobsStackParamList>();

const JobsStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="JobsList" component={JobsScreen} options={{ title: 'My Jobs' }} />
            <Stack.Screen name="JobForm" component={JobFormScreen} options={{ title: 'Job Card' }} />
        </Stack.Navigator>
    );
};

export default JobsStackNavigator;
