// src/navigation/TabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import the screens you want as tabs
import DashboardScreen from '../screens/DashboardScreen';
import JobsScreen from '../screens/JobsScreen'; // create this if you haven’t yet

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => (
    <Tab.Navigator
        screenOptions={{
            headerShown: false,
            // you can add icons, styling, etc. here later
        }}
    >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Jobs" component={JobsScreen} />
    </Tab.Navigator>
);

export default TabNavigator;
