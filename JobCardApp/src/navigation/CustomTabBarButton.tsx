import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
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
    Dashboard: { primary: '#E1A700', secondary: '#FFF8E1' },
    Jobs: { primary: '#1E90FF', secondary: '#E3F0FF' },
    Assign: { primary: '#4CAF50', secondary: '#E8F5E9' },
    Settings: { primary: '#666', secondary: '#EEE' },
};

export default function MyTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const animatedValues = React.useRef(
        state.routes.map((_, i) => new Animated.Value(state.index === i ? 1 : 0))
    ).current;

    React.useEffect(() => {
        state.routes.forEach((_, i) => {
            Animated.spring(animatedValues[i], {
                toValue: state.index === i ? 1 : 0,
                useNativeDriver: false,
                speed: 10, // lower for slower, more visible
                bounciness: 12, // increase for more bounce
            }).start();
        });
    }, [state.index]);


    return (
        <View style={styles.container}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label = options.tabBarLabel || options.title || route.name;
                const icon = iconMap[route.name] || 'circle';
                const focused = state.index === index;
                const { primary, secondary } = colorMap[route.name] || { primary: '#000', secondary: '#fff' };

                const animatedFlex = animatedValues[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.8],
                });

                const animatedBg = animatedValues[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: ['white', secondary],
                });


                return (
                    <Animated.View
                        key={route.key}
                        style={[
                            styles.button,
                            {
                                flex: animatedFlex,
                                backgroundColor: animatedBg,
                                borderRadius: 50,
                                padding: focused ? 10 : 0,
                                minWidth: focused ? "8%" : 0,
                            }
                        ]}
                    >
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityState={focused ? { selected: true } : {}}
                            onPress={() => navigation.navigate(route.name)}
                            style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", flex: 1 }}
                            activeOpacity={0.8}
                        >
                            <Icon name={icon} size={25} color={focused ? primary : '#222'} />
                            {focused && typeof label === 'string' && (
                                <Text numberOfLines={1} style={[styles.label, { color: primary, marginLeft: 8 }]}>{label}</Text>
                            )}
                        </TouchableOpacity>
                    </Animated.View>
                );
            })}
        </View>
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
    },
    label: {
        color: '#E1A700',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
