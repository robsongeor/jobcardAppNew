import { createNativeStackNavigator } from "@react-navigation/native-stack";
import JobNumberEntryScreen from "../screens/AssignJobScreen/JobNumberEntryScreen";
import JobOverviewScreen from "../screens/AssignJobScreen/JobOverviewScreen";
import FleetNumberEntryScreen from "../screens/AssignJobScreen/FleetNumberEntryScreen";
import { Job } from "../types/types";
import AppHeader from "../components/AppHeader";
import JobDescriptionEntryScreen from "../screens/AssignJobScreen/JobDescriptionEntryScreen";

export type AssignJobStackParamList = {
    JobNumberEntry: undefined;
    JobOverview: { job: Job };
    FleetNumberEntry: { jobNumber: string };
    JobDescriptionEntry: { job: Job };
};

const Stack = createNativeStackNavigator<AssignJobStackParamList>();

export default function AssignJobStack() {
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
                options={({ navigation }) => ({
                    header: () => (
                        <AppHeader
                            title="Overview"
                            onBack={() => navigation.goBack()}
                        />
                    ),
                    gestureEnabled: true, // ensure swipe-back is on
                })}
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