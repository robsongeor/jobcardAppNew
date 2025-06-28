import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import COLORS from "../../../constants/colors";

type HeaderButtonProps = {
    icon?: string,
    onPress?: () => void,
    disabled?: boolean,
}

export default function HeaderButton({ icon, onPress, disabled }: HeaderButtonProps) {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                disabled && styles.disabledButton,
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={disabled ? 1 : 0.7}
        >
            {icon && (
                <Icon
                    name={icon}
                    size={20}
                    color={disabled ? COLORS.greyed : COLORS.primary}
                />
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "transparent",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 40,
        width: 40,
        borderRadius: 8,
        gap: 8,
    },
    disabledButton: {
        // If you want a visual indicator, uncomment and adjust below:
        // opacity: 0.6,
    },
});
