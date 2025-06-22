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

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => (
    <Tab.Navigator
        tabBar={(props) => <MyTabBar {...props} />}
        screenOptions={{
            headerShown: true,
            // Don't set tabBarButton here!
        }}
    >
        <Tab.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={({ route }) => ({
                tabBarLabel: 'Home',
            })}
        />
        <Tab.Screen
            name="Jobs"
            component={JobsScreen}
            options={({ route }) => ({
                tabBarLabel: 'Jobs',
            })}
        />
        <Tab.Screen
            name="Assign"
            component={AssignScreen}
            options={({ route }) => ({
                tabBarLabel: 'Assign',
            })}
        />
        <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={({ route }) => ({
                tabBarLabel: 'Settings',
            })}
        />

    </Tab.Navigator>

);

export default TabNavigator;
