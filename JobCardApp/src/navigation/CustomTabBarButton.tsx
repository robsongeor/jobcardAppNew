import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const iconMap: { [key: string]: string } = {
    Dashboard: 'home',
    Jobs: 'list',
    Assign: 'user-plus',
    Settings: 'settings',
};

const colorMap: {
    [key: string]: { primary: string; secondary: string }
} = {
    Dashboard: { primary: '#E1A700', secondary: '#FFF8E1' },  // yellow + pale yellow
    Jobs: { primary: '#1E90FF', secondary: '#E3F0FF' },       // blue + pale blue
    Assign: { primary: '#4CAF50', secondary: '#E8F5E9' },     // green + pale green
    Settings: { primary: '#666', secondary: '#EEE' },         // gray + light gray
};


export default function MyTabBar({ state, descriptors, navigation }: BottomTabBarProps) {



    return (
        <View style={styles.container}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label = options.tabBarLabel || options.title || route.name;
                const icon = iconMap[route.name] || 'circle';
                const focused = state.index === index;
                const { primary, secondary } = colorMap[route.name] || { primary: '#000', secondary: '#fff' };




                return (
                    <TouchableOpacity
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={focused ? { selected: true } : {}}
                        onPress={() => navigation.navigate(route.name)}
                        style={[styles.button, focused && styles.buttonOn, focused && { backgroundColor: secondary }]}
                    >
                        <Icon name={icon} size={25} color={focused ? primary : '#222'} />
                        {focused && typeof label === 'string' && <Text style={[styles.label, { color: primary }]}>{label}</Text>}

                    </TouchableOpacity>
                );
            })}
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',

        paddingVertical: 24,
        paddingHorizontal: 30,
        justifyContent: 'space-around',
        gap: 14,

    },
    button: {
        flexDirection: "row",
        alignItems: 'center',
        gap: 7,
        justifyContent: 'center',
        flex: 1,
    },
    buttonOn: {
        flex: 1.8,
        padding: 10,

        borderRadius: 50,
        backgroundColor: "#ddd"
    },
    label: {
        color: '#E1A700',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
