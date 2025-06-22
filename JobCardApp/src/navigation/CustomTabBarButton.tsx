import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { auth } from '../firebase';
import COLORS from '../constants/colors';

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

    const [labelWidths, setLabelWidths] = React.useState<{ [key: string]: number }>({});
    const widthAnimations = React.useRef(
        state.routes.map(() => new Animated.Value(0))
    ).current;

    const gapAnimations = React.useRef(
        state.routes.map((_, i) => new Animated.Value(state.index === i ? 8 : 0))
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

    React.useEffect(() => {
        state.routes.forEach((route, i) => {
            const targetWidth = state.index === i ? (labelWidths[route.key] || 0) : 0;
            Animated.spring(widthAnimations[i], {
                toValue: targetWidth,
                speed: 10,
                bounciness: 9,
                useNativeDriver: false, // width can't use native driver
            }).start();
        });
    }, [state.index, labelWidths]);


    React.useEffect(() => {
        state.routes.forEach((_, i) => {
            Animated.spring(gapAnimations[i], {
                toValue: state.index === i ? 8 : 0,
                useNativeDriver: false,
                speed: 10,
                bounciness: 3,
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




                return (
                    <React.Fragment key={route.key}>
                        {/* Always render the hidden label for measurement */}

                        <View
                            style={{ position: 'absolute', opacity: 0, left: -9999, top: -9999 }}
                            pointerEvents="none"
                            onLayout={e => {
                                const width = e.nativeEvent.layout.width;
                                if (width && labelWidths[route.key] !== width) {
                                    setLabelWidths(lws => ({ ...lws, [route.key]: width }));
                                }
                            }}
                        >
                            {typeof label === 'string' && (
                                <Text
                                    style={[
                                        styles.label,
                                        { color: primary, }
                                    ]}
                                    numberOfLines={1} // ensures text never wraps

                                >
                                    {label}
                                </Text>
                            )}
                        </View>

                        {/* Actual Tab Button */}
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityState={focused ? { selected: true } : {}}
                            onPress={() => navigation.navigate(route.name)}
                            activeOpacity={0.8}
                            style={[
                                styles.button,
                                {
                                    backgroundColor: focused ? secondary : "transparent",
                                    paddingHorizontal: focused ? 24 : 24,

                                },
                            ]}
                        >
                            <Icon name={icon} size={25} color={focused ? primary : '#222'} />
                            <Animated.View style={{ width: gapAnimations[index] }} />
                            <Animated.View
                                style={{
                                    width: widthAnimations[index],
                                    overflow: 'hidden',
                                    flexDirection: 'row',
                                    alignItems: 'center',

                                    height: 26, // must match or slightly exceed your fontSize

                                }}
                            >
                                <View style={{ flexShrink: 1, minWidth: 0, }}>
                                    {focused && typeof label === 'string' && (
                                        <Text
                                            style={[
                                                styles.label,
                                                {
                                                    color: primary,

                                                }
                                            ]}
                                            numberOfLines={1} // ensures text never wraps
                                            ellipsizeMode="clip" // do NOT use "tail"
                                        >
                                            {label}
                                        </Text>
                                    )}
                                </View>
                            </Animated.View>



                        </TouchableOpacity>
                    </React.Fragment>
                );
            })}
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: COLORS.background,
        paddingVertical: 24,
        paddingHorizontal: 14,
        justifyContent: 'space-around',
    },
    button: {
        flexDirection: "row",
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 40,

        justifyContent: 'space-between',
    },
    label: {
        color: '#E1A700',
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 2,
    },
});
