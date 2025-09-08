import { createNativeStackNavigator } from "@react-navigation/native-stack";
import JobNumberEntryScreen from "../screens/AssignJobScreen/JobNumberEntryScreen";
import JobOverviewScreen from "../screens/AssignJobScreen/JobOverviewScreen";
import { Customer, Job, Machine } from "../types/types";
import AppHeader from "../components/AppHeader";
import JobDescriptionEntryScreen from "../screens/AssignJobScreen/JobDescriptionEntryScreen";
import NewMachineEntryScreen from "../screens/AssignJobScreen/NewMachineEntryScreen";
import CustomerEntryScreen from "../screens/AssignJobScreen/CustomerEntryScreen";

export type AssignJobStackParamList = {
    JobNumberEntry: undefined;
    JobOverview: { job: Job; handleAssign?: () => Promise<void> };
    FleetNumberEntry: { jobNumber: string };
    JobDescriptionEntry: { job: Job };
    NewMachineEntry: { jobNumber: string };
    CustomerEntry: { jobNumber: string, fleet: string, machine: Machine, customer: Customer }
};

const Stack = createNativeStackNavigator<AssignJobStackParamList>();

export default function AssignJobStack() {

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="JobNumberEntry"
                component={JobNumberEntryScreen}
                options={() => ({
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
                name="NewMachineEntry"
                component={NewMachineEntryScreen}
                options={({ navigation }) => ({
                    header: () => (
                        <AppHeader
                            onBack={() => navigation.goBack()}
                        />
                    ),
                    gestureEnabled: true,

                })}
            />
            <Stack.Screen
                name="CustomerEntry"
                component={CustomerEntryScreen}
                options={({ navigation }) => ({
                    header: () => (
                        <AppHeader
                            onBack={() => navigation.goBack()}
                        />
                    ),
                    gestureEnabled: true,

                })}
            />
            <Stack.Screen
                name="JobDescriptionEntry"
                component={JobDescriptionEntryScreen}
                options={({ navigation }) => ({
                    header: () => (
                        <AppHeader
                            onBack={() => navigation.goBack()}
                        />
                    ),
                    gestureEnabled: true,

                })}
            />
        </Stack.Navigator>
    );
}