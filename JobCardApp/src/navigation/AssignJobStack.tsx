import { createNativeStackNavigator } from "@react-navigation/native-stack";
import JobNumberEntryScreen from "../screens/AssignJobScreen/JobNumberEntryScreen";
import JobOverviewScreen from "../screens/AssignJobScreen/JobOverviewScreen";
import FleetNumberEntryScreen from "../screens/AssignJobScreen/FleetNumberEntryScreen";

const Stack = createNativeStackNavigator();

export default function AssignJobStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="JobNumberEntry" component={JobNumberEntryScreen} />
            <Stack.Screen name="JobOverview" component={JobOverviewScreen} />
            <Stack.Screen name="FleetNumberEntry" component={FleetNumberEntryScreen} />
        </Stack.Navigator>
    );
}