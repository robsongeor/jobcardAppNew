// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import 'react-native-gesture-handler';
import { AssignedJobsProvider } from './src/context/AssignedJobContext';


export default function App() {
  return (
    <AuthProvider>
      <AssignedJobsProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AssignedJobsProvider>
    </AuthProvider>
  );
}
