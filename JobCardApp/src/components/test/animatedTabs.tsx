import React from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";
import Animated, { useAnimatedStyle, SharedValue } from "react-native-reanimated";
import { capitalizeFirst } from "../helpers/formatters";
import PADDING from "../../constants/padding";

type TabLayout = { x: number; width: number };

type AnimatedTabsProps = {
    tabs: string[];
    animatedTabIndex: SharedValue<number>;
    onTabPress?: (index: number) => void;
};

export default function AnimatedTabs({
    tabs,
    animatedTabIndex,
    onTabPress,
}: AnimatedTabsProps) {
    // Track layouts for each tab
    const [tabLayouts, setTabLayouts] = React.useState<TabLayout[]>([]);

    // Ensure all tabs have measured before showing pill
    const allMeasured = tabLayouts.length === tabs.length && tabLayouts.every(l => l && l.width);

    // Animated pill style
    const pillStyle = useAnimatedStyle(() => {
        if (!allMeasured) return { opacity: 0 };

        const index = animatedTabIndex.value;
        const from = Math.floor(index);
        const to = Math.ceil(index);
        const progress = index - from;

        const current = tabLayouts[from] || { x: 0, width: 0 };
        const next = tabLayouts[to] || current;

        const x = current.x + (next.x - current.x) * progress;
        const width = current.width + (next.width - current.width) * progress;

        return {
            transform: [{ translateX: x }],
            width,
            opacity: 1,
        };
    }, [allMeasured, tabLayouts]);

    // Animated label style
    const animatedTextStyle = (i: number) =>
        useAnimatedStyle(() => ({
            color: Math.round(animatedTabIndex.value) === i ? "#222" : "#888",
            fontWeight: Math.round(animatedTabIndex.value) === i ? "700" : "500",
        }));

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row", position: "relative", minHeight: 36 }}>
                {allMeasured && (
                    <Animated.View
                        style={[
                            styles.pill,
                            pillStyle,
                            { position: "absolute", top: 0, left: 0, bottom: 0, zIndex: 0 },
                        ]}
                    />
                )}
                {tabs.map((tab, i) => (
                    <Pressable
                        key={tab}
                        style={styles.tab}
                        onPress={() => onTabPress && onTabPress(i)}
                        onLayout={(e) => {
                            const { x, width } = e.nativeEvent.layout;
                            setTabLayouts((prev) => {
                                if (prev[i] && prev[i].x === x && prev[i].width === width) return prev;
                                const copy = [...prev];
                                copy[i] = { x, width };
                                return copy;
                            });
                        }}
                    >
                        <Animated.Text style={[styles.tabText, animatedTextStyle(i)]}>
                            {capitalizeFirst(tab)}
                        </Animated.Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 4,
        alignSelf: "center",

        flexDirection: "column"
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 22,
        borderRadius: 6,
        zIndex: 2,
        minHeight: 36,
        justifyContent: "center",
    },
    tabText: {
        fontSize: 16,
        color: "#888",
        fontWeight: "500",
    },
    pill: {
        backgroundColor: "#b3dafe",
        borderRadius: 6,
        height: "100%",
    },
});
