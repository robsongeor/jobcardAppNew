import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import JobFormScreen from '../screens/JobFormScreen';
import { Job } from '../types/types';
import AppHeader from '../components/AppHeader';
import JobsScreen from '../screens/JobsScreen';
import CustomButton from '../components/form/Buttons/CustomButton';
import HeaderButton from '../components/form/Buttons/HeaderButton';
import { View } from 'react-native';


export type JobsStackParamList = {
    JobsList: undefined;
    JobForm: { jobId: string, job: Job };
    SignatureModal: { jobId: string };
};

const Stack = createNativeStackNavigator<JobsStackParamList>();

const JobsStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="JobsList" component={JobsScreen}
                options={({ route }) => ({
                    headerShown: false,
                    header: () => <AppHeader title='Jobs'></AppHeader>
                })} />
            <Stack.Screen
                name="JobForm"
                component={JobFormScreen}
                options={({ route, navigation }) => ({

                    header: () => <AppHeader
                        title={`${route.params.job.fleet.toUpperCase()}`}
                        onBack={() => navigation.goBack()}
                        right={
                            <View style={{ flexDirection: "row" }}>
                                <HeaderButton

                                    icon="camera"
                                    //onPress={handleAssign}
                                    disabled={false}
                                />
                                <HeaderButton

                                    icon="send"
                                    //onPress={handleAssign}
                                    disabled={false}
                                />
                            </View>

                        }
                    />

                })}
            />

        </Stack.Navigator>
    );
};

export default JobsStackNavigator;
