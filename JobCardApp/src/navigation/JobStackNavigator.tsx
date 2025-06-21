import React from 'react';
import JobsScreen from '../screens/JobsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import JobFormScreen from '../screens/JobFormScreen';
import { Job } from '../types/types';

export type JobsStackParamList = {
    JobsList: undefined;
    JobForm: { jobId: string, job: Job };
    SignatureModal: { jobId: string };
};

const Stack = createNativeStackNavigator<JobsStackParamList>();

const JobsStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="JobsList" component={JobsScreen} options={{ title: 'My Jobs' }} />
            <Stack.Screen
                name="JobForm"
                component={JobFormScreen}
                options={({ route }) => ({
                    title: `${route.params.job.fleet.toUpperCase()} - ${route.params.job.job}`,
                })}
            />

        </Stack.Navigator>
    );
};

export default JobsStackNavigator;
