import 'react-native-get-random-values';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Root = () => (
    <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <App />
            </GestureHandlerRootView>
        </SafeAreaView>
    </SafeAreaProvider>
);

AppRegistry.registerComponent(appName, () => Root);
