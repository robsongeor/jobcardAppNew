// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import 'react-native-gesture-handler';
import { AssignedJobsProvider } from './src/context/AssignedJobContext';
import { StatusBar } from 'react-native';
import COLORS from './src/constants/colors';


export default function App() {
  return (
    <AuthProvider>
      <AssignedJobsProvider>
        <NavigationContainer>
          <RootNavigator />
          <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        </NavigationContainer>
      </AssignedJobsProvider>
    </AuthProvider>
  );
}
