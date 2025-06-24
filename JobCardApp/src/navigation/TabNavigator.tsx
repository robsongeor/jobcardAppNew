import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from '../screens/DashboardScreen';
import AssignScreen from '../screens/AssignScreen';
import JobsStackNavigator from './JobStackNavigator';
import Icon from 'react-native-vector-icons/Feather';
import SettingsScreen from '../screens/SettingsScreen';
import CustomTabBarButton from './CustomTabBarButton';
import { Text } from 'react-native';
import JobsScreen from '../screens/JobsScreen';
import MyTabBar from './CustomTabBarButton';
import COLORS from '../constants/colors';
import AppHeader from '../components/AppHeader';
import CreateJobScreen from '../screens/CreateJobScreen';
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
                tabBarLabel: 'Jobs',
                headerShown: false,
            })}
        />
        {/* MANUAL JOB CREATION SCREEN - TO BE REMOVED ONCE JOB UPLOAD IS AUTOMATED */}
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
