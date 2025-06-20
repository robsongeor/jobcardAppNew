// src/navigation/JobsStackNavigator.tsx
import React from 'react';
import JobsScreen from '../screens/JobsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import JobFormScreen from '../screens/JobFormScreen';
import { Job } from '../types/types';
//import SignatureModal from '../components/form/SignatureModal';

export type JobsStackParamList = {
    JobsList: undefined;
    JobForm: { jobId: string, job: Job }; // or { job: Job } if passing whole job
    SignatureModal: { jobId: string };
};

const Stack = createNativeStackNavigator<JobsStackParamList>();

const JobsStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="JobsList" component={JobsScreen} options={{ title: 'My Jobs' }} />
            <Stack.Screen name="JobForm" component={JobFormScreen} options={{ title: 'Job Card' }} />
            {/* <Stack.Screen name="SignatureModal" component={SignatureModal} options={{ title: 'Customer Signature' }} /> */}
        </Stack.Navigator>
    );
};

export default JobsStackNavigator;
