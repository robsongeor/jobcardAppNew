// components/AppHeader.js
import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PADDING from '../constants/padding';

type AppHeaderType = {
    title?: string;
    onBack?: () => void;
    right?: ReactNode;
}

export default function AppHeader({ title, onBack, right }: AppHeaderType) {
    const insets = useSafeAreaInsets ? useSafeAreaInsets() : { top: 0 };

    return (
        <View
            style={[
                styles.headerContainer,
                {
                    height: 64 + insets.top,
                    paddingTop: insets.top,
                    backgroundColor: COLORS.background,
                    paddingHorizontal: PADDING.horizontal,
                },
            ]}
        >
            {/* Left: back button or empty view for spacing */}
            <View style={styles.sideContainer}>
                {onBack && (
                    <TouchableOpacity style={styles.button} onPress={onBack}>
                        <Icon name="arrow-left" size={20} color={COLORS.black} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Middle: title centered */}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
            </View>

            {/* Right: placeholder for symmetry */}
            <View style={styles.sideContainer} >
                {right}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 20,
    },
    sideContainer: {
        minWidth: 36,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    titleContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        color: COLORS.black,
        marginLeft: 18,
    },
    button: {
        height: 40,
        width: 40,
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,

    }
});
