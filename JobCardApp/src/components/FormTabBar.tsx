import React, { useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import PADDING from '../constants/padding';
import COLORS from '../constants/colors';

function getTabOffsets(widths: number[]) {
    const offsets: number[] = [];
    let acc = 0;
    for (let w of widths) {
        offsets.push(acc);
        acc += w;
    }
    return offsets;
}

const FormTabBar: React.FC<MaterialTopTabBarProps> = ({
    state,
    descriptors,
    navigation,
    position,
}) => {
    const tabWidths = useRef<number[]>([]);
    const [layoutCount, setLayoutCount] = React.useState(0);

    const offsets = getTabOffsets(tabWidths.current);
    const allWidthsMeasured =
        tabWidths.current.length === state.routes.length &&
        tabWidths.current.every(w => w > 0);

    // 1. Calculate max tab width
    const maxTabWidth = Math.max(...tabWidths.current, 1);

    // 2. Calculate pill X
    const pillTranslateX = allWidthsMeasured
        ? position.interpolate({
            inputRange: state.routes.map((_, i) => i),
            outputRange: offsets,
        })
        : 0;

    // 3. Animate scaleX instead of width
    const pillScale = allWidthsMeasured
        ? position.interpolate({
            inputRange: state.routes.map((_, i) => i),
            outputRange: tabWidths.current.map(w => w / maxTabWidth),
        })
        : 1;

    return (
        <View style={styles.container}>
            <View style={styles.pillContainer} pointerEvents="none">
                {allWidthsMeasured && (
                    <Animated.View
                        style={[
                            styles.pill,
                            {
                                width: maxTabWidth,
                                transform: [
                                    { translateX: pillTranslateX },
                                    { scaleX: pillScale },
                                ],
                            },
                        ]}
                    />
                )}
            </View>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });
                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={styles.tab}
                        onLayout={event => {
                            const width = event.nativeEvent.layout.width;
                            if (tabWidths.current[index] !== width) {
                                tabWidths.current[index] = width;
                                setLayoutCount(c => c + 1);
                            }
                        }}
                        activeOpacity={0.7}
                    >
                        {typeof label === 'function'
                            ? label({
                                focused: isFocused,
                                color: isFocused ? '#fff' : '#007bff',
                                children: route.name,
                            })
                            : (
                                <Text style={isFocused ? styles.labelFocused : styles.label}>
                                    {label}
                                </Text>
                            )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        position: 'relative',
        backgroundColor: COLORS.white,
        borderRadius: 20,

        marginHorizontal: 24, // <--- Add this line
    },
    pillContainer: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 0,
    },
    pill: {
        height: '90%',
        backgroundColor: '#007bff',
        borderRadius: 999,
        position: 'absolute',
        top: '5%',
        left: 0,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        padding: 8,
        zIndex: 1,
    },
    label: {
        color: '#555',
        fontWeight: 'bold',
    },
    labelFocused: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default FormTabBar;
