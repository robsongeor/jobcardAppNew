import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Label from "../FormInputs/Label";
import Icon from "react-native-vector-icons/Feather";
import COLORS from "../../../constants/colors";

type bottomRightButtonProps = {
    label?: string
    disabled?: boolean;
    onPress?: () => void;
    icon?: string;
}

export default function BottomRightButton({ label, disabled, onPress, icon }: bottomRightButtonProps) {

    return (
        <View style={styles.assignButtonContainer}>
            <TouchableOpacity
                disabled={disabled}
                style={[
                    styles.assignButton,
                    disabled && { backgroundColor: 'grey' },
                ]}
                onPress={onPress}
            >
                {label && <Text style={styles.assignButtonText}>{label}</Text>}
                {icon && <Icon
                    name={icon}
                    size={20}
                    color={COLORS.background}
                    style={styles.iconStyle}
                />}



            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    assignButtonContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,

    },
    assignButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        borderRadius: 40,
        paddingBottom: 14,

        paddingHorizontal: 30,
    },

    assignButtonText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',

        paddingRight: 4,
        paddingLeft: 3,
    },

    iconStyle: {
        marginLeft: 12, // tweak for your preferred spacing
    },

})