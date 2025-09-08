import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import JobFormScreen from "../screens/JobFormScreen";
import { Job } from "../types/types";
import AppHeader from "../components/AppHeader";
import JobsScreen from "../screens/JobsScreen";

export type JobsStackParamList = {
    JobsList: undefined;
    JobForm: { jobId: string; job: Job }; // cleaned up
    SignatureModal: { jobId: string };
};

const Stack = createNativeStackNavigator<JobsStackParamList>();

const JobsStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="JobsList"
                component={JobsScreen}
                options={{
                    headerShown: false,
                    header: () => <AppHeader title="Jobs" />,
                }}
            />
            <Stack.Screen name="JobForm" component={JobFormScreen} />
        </Stack.Navigator>
    );
};

export default JobsStackNavigator;
