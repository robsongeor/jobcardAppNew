// components/AppHeader.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import COLORS from '../constants/colors';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PADDING from '../constants/padding';

type AppHeaderType = {
    title?: string;
    onBack?: () => void;
}

export default function AppHeader({ title, onBack }: AppHeaderType) {
    const insets = useSafeAreaInsets ? useSafeAreaInsets() : { top: 0 };

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 64 + insets.top,
                paddingTop: insets.top,
                backgroundColor: COLORS.background,
                paddingBottom: 20,
                paddingHorizontal: PADDING.horizontal,
            }}
        >
            {/* Left: back button or empty view for spacing */}
            <View style={{ width: 36, alignItems: 'flex-start', justifyContent: 'center' }}>
                {onBack && (
                    <TouchableOpacity onPress={onBack}>
                        <Icon name="chevron-left" size={24} color={COLORS.black} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Middle: title centered */}
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: COLORS.black,
                }}>
                    {title}
                </Text>
            </View>

            {/* Right: placeholder for symmetry */}
            <View style={{ width: 36 }} />
        </View>
    );
}
