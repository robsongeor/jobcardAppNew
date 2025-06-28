import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import COLORS from "../../../constants/colors";

type CustomButtonProps = {
    text?: string,
    icon?: string,
    onPress?: () => void,
    style?: StyleProp<ViewStyle>
    disabled?: boolean,
}

export default function CustomButton({ text, icon, onPress, style, disabled }: CustomButtonProps) {
    return (
        <TouchableOpacity
            style={[
                style,
                styles.button,
                disabled && styles.disabledButton, // apply disabled style if needed
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={disabled ? 1 : 0.7} // prevent visual feedback if disabled
        >
            {text && (
                <Text style={[styles.text, disabled && styles.disabledText]}>
                    {text}
                </Text>
            )}
            {icon && (
                <Icon
                    name={icon}
                    size={15}
                    color={COLORS.background}
                />
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLORS.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'center',
        height: 40,
        borderRadius: 8,
        paddingHorizontal: 15,
        gap: 8,
    },
    text: {
        color: COLORS.background,
        fontSize: 15,
    },
    // Add these styles
    disabledButton: {
        backgroundColor: "#b1b1b1", // e.g., '#cccccc'
        //opacity: 0.6,
    },
    disabledText: {
        // color: COLORS.textDisabled, // e.g., '#888'
    }
});
