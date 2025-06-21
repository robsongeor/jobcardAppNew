// src/navigation/TabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from '../screens/DashboardScreen';
import AssignScreen from '../screens/AssignScreen';
import JobsStackNavigator from './JobStackNavigator';
import Icon from 'react-native-vector-icons/Feather';

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: true,
            tabBarHideOnKeyboard: true,
            tabBarIcon: ({ color, size, focused }) => {
                let iconName = 'circle'; // fallback icon

                if (route.name === 'Dashboard') iconName = 'home';
                if (route.name === 'Jobs') iconName = 'list';
                if (route.name === 'Assign') iconName = 'user-plus';

                // You can use `focused` to change icon or color if you want
                return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#ccc',
        })}
    >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Jobs" component={JobsStackNavigator} />
        <Tab.Screen name="Assign" component={AssignScreen} />
    </Tab.Navigator>
);

export default TabNavigator;
