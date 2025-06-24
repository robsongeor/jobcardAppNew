import { createNativeStackNavigator } from "@react-navigation/native-stack";
import JobNumberEntryScreen from "../screens/AssignJobScreen/JobNumberEntryScreen";
import JobOverviewScreen from "../screens/AssignJobScreen/JobOverviewScreen";
import FleetNumberEntryScreen from "../screens/AssignJobScreen/FleetNumberEntryScreen";
import { Job } from "../types/types";
import AppHeader from "../components/AppHeader";

export type AssignJobStackParamList = {
    JobNumberEntry: undefined;
    JobOverview: { job: Job };
    FleetNumberEntry: { jobNumber: string };
};

const Stack = createNativeStackNavigator<AssignJobStackParamList>();

export default function AssignJobStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                options={{ headerShown: false }}
                name="JobNumberEntry"
                component={JobNumberEntryScreen}
            />
            <Stack.Screen
                name="JobOverview"
                component={JobOverviewScreen}
                options={({ route, navigation }) => ({

                    header: () => <AppHeader

                        onBack={() => navigation.goBack()}
                    />

                })}
            />
            <Stack.Screen name="FleetNumberEntry" component={FleetNumberEntryScreen} />
        </Stack.Navigator>
    );
}