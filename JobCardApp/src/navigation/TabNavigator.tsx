// src/navigation/TabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from '../screens/DashboardScreen';
import AssignScreen from '../screens/AssignScreen';
import JobsStackNavigator from './JobStackNavigator';

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => (
    <Tab.Navigator
        screenOptions={{
            headerShown: true,
            tabBarHideOnKeyboard: true
            // you can add icons, styling, etc. here later
        }}
    >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Jobs" component={JobsStackNavigator} />
        <Tab.Screen name="Assign" component={AssignScreen} />
    </Tab.Navigator>
);

export default TabNavigator;
