import React, { ReactNode, useState } from "react";
import { SafeAreaView, View, Text } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useSharedValue, runOnJS, withTiming } from "react-native-reanimated";
import AnimatedTabs from "./animatedTabs";
import { TabType } from "../../types/types";



//const TAB_LABELS = ["Assigned", "Open", "Submitted", "Overdue"];

type TabBarAnimatedProps = {
    children?: ReactNode
    TAB_LABELS: TabType[]
    activeTab: number;
    setActiveTab: React.Dispatch<React.SetStateAction<number>>;
}

export default function TabBarAnimated({ children, TAB_LABELS, activeTab, setActiveTab }: TabBarAnimatedProps) {
    //const [blah, setActiveTab] = useState(0);
    const animatedTabIndex = useSharedValue(0);

    // Only allow one animation at a time
    const handleTabChange = (newTab: number) => {
        if (animatedTabIndex.value === newTab) return;
        animatedTabIndex.value = withTiming(
            newTab,
            { duration: 90 },
            (isFinished) => {
                if (isFinished) runOnJS(setActiveTab)(newTab);
            }
        );
    };

    // Swipe gesture: swipe left/right to change tab
    const swipeGesture = Gesture.Pan()
        .onEnd((event) => {
            const threshold = 50;
            if (event.translationX < -threshold && activeTab < TAB_LABELS.length - 1) {
                runOnJS(handleTabChange)(activeTab + 1);
            } else if (event.translationX > threshold && activeTab > 0) {
                runOnJS(handleTabChange)(activeTab - 1);
            }
        });

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <GestureDetector gesture={swipeGesture}>
                <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
                    <AnimatedTabs
                        tabs={TAB_LABELS}
                        animatedTabIndex={animatedTabIndex}
                        onTabPress={handleTabChange}
                    />
                    {children}
                    {/* <View style={{ alignItems: "center", marginTop: 32 }}>
                        <Text style={{ fontSize: 22 }}>
                            Current tab: {TAB_LABELS[activeTab]}
                        </Text>
                    </View> */}
                </SafeAreaView>
            </GestureDetector>
        </GestureHandlerRootView>
    );
}
