import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from '../screens/DashboardScreen';
import JobsStackNavigator from './JobStackNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import MyTabBar from './CustomTabBarButton';
import AppHeader from '../components/AppHeader';
import AssignJobStack from './AssignJobStack';

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => (
    <Tab.Navigator
        tabBar={(props) => <MyTabBar {...props} />}
        screenOptions={{
            headerShown: true,             // Show/hide the header
        }}
    >
        <Tab.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={({ route }) => ({
                tabBarLabel: 'Home',
                headerShown: false,
                header: () => <AppHeader title='Home'></AppHeader>

            })}
        />
        <Tab.Screen
            name="Jobs"
            component={JobsStackNavigator}
            options={({ route }) => ({
                headerShown: false,
            })}
        />

        <Tab.Screen
            name="Assign"
            component={AssignJobStack}
            options={({ route }) => ({
                tabBarLabel: 'Assign',
                headerShown: false,
                header: () => <AppHeader title='Assign'></AppHeader>
            })}
        />
        <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={({ route }) => ({
                tabBarLabel: 'Settings',
                headerShown: false,
                header: () => <AppHeader title='Settings'></AppHeader>
            })}
        />

    </Tab.Navigator>

);

export default TabNavigator;
