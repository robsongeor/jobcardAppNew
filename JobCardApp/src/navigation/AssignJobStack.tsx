import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import JobNumberEntryScreen from "../screens/AssignJobScreen/JobNumberEntryScreen";
import JobOverviewScreen from "../screens/AssignJobScreen/JobOverviewScreen";
import FleetNumberEntryScreen from "../screens/AssignJobScreen/FleetNumberEntryScreen";
import { Job } from "../types/types";
import AppHeader from "../components/AppHeader";
import JobDescriptionEntryScreen from "../screens/AssignJobScreen/JobDescriptionEntryScreen";
import { Text } from "react-native";
import CustomButton from "../components/form/Buttons/CustomButton";
import HeaderButton from "../components/form/Buttons/HeaderButton";
import { getStoredUserField } from "../storage/storage";
import { useState } from "react";

export type AssignJobStackParamList = {
    JobNumberEntry: undefined;
    JobOverview: { job: Job; handleAssign?: () => Promise<void> };
    FleetNumberEntry: { jobNumber: string };
    JobDescriptionEntry: { job: Job };
};

const Stack = createNativeStackNavigator<AssignJobStackParamList>();

export default function AssignJobStack() {
    const uid = getStoredUserField("uid")



    return (
        <Stack.Navigator>
            <Stack.Screen

                name="JobNumberEntry"
                component={JobNumberEntryScreen}
                options={({ route, navigation }) => ({
                    header: () => <AppHeader />

                })
                }
            />
            <Stack.Screen
                name="JobOverview"
                component={JobOverviewScreen}
                options={{ gestureEnabled: true }} // no custom header here!
            />

            <Stack.Screen
                name="FleetNumberEntry"
                component={FleetNumberEntryScreen}
                options={({ route, navigation }) => ({
                    header: () => (<AppHeader
                        onBack={() => navigation.goBack()}
                    />
                    ),
                    gestureEnabled: true,

                })}
            />
            <Stack.Screen
                name="JobDescriptionEntry"
                component={JobDescriptionEntryScreen}
                options={({ route, navigation }) => ({
                    header: () => (<AppHeader
                        onBack={() => navigation.goBack()}
                    />
                    ),
                    gestureEnabled: true,

                })}
            />
        </Stack.Navigator>
    );
}