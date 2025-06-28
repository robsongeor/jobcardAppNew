import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import COLORS from '../constants/colors';
import PADDING from '../constants/padding';

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
    const [measuredRoutes, setMeasuredRoutes] = useState<Set<number>>(new Set());

    // Reset measurement if tab count changes
    useEffect(() => {
        tabWidths.current = new Array(state.routes.length).fill(0);
        setMeasuredRoutes(new Set());
    }, [state.routes.length]);

    const allWidthsMeasured =
        measuredRoutes.size === state.routes.length &&
        tabWidths.current.length === state.routes.length &&
        tabWidths.current.every(w => w > 0);

    const offsets = getTabOffsets(tabWidths.current);
    const maxTabWidth = Math.max(...tabWidths.current, 1);

    const pillTranslateX = allWidthsMeasured
        ? position.interpolate({
            inputRange: state.routes.map((_, i) => i),
            outputRange: offsets,
        })
        : 0;

    const pillScale = allWidthsMeasured
        ? position.interpolate({
            inputRange: state.routes.map((_, i) => i),
            outputRange: tabWidths.current.map(w => w / maxTabWidth),
        })
        : 1;

    const onTabLayout = (index: number, width: number) => {
        if (tabWidths.current[index] !== width) {
            tabWidths.current[index] = width;
            setMeasuredRoutes(prev => {
                const updated = new Set(prev);
                updated.add(index);
                return updated;
            });
        }
    };

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
                        onLayout={event => onTabLayout(index, event.nativeEvent.layout.width)}
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
        borderRadius: 8,
        marginHorizontal: PADDING.horizontal,
        borderWidth: 3,
        borderColor: COLORS.white,
        marginBottom: 24,
        height: 36,
    },
    pillContainer: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 0,
    },
    pill: {
        height: '100%',
        backgroundColor: COLORS.background,
        borderRadius: 5,
        position: 'absolute',
        top: '0%',
        left: 0,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        padding: 6,
        zIndex: 1,
    },
    label: {
        fontSize: 13,
        color: '#999',
        fontWeight: '500',
    },
    labelFocused: {
        fontSize: 13,
        color: COLORS.offBlack,
        fontWeight: 'bold',
    },
});

export default FormTabBar;
