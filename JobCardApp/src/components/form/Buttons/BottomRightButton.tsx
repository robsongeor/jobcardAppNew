import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Label from "../FormInputs/Label";

type bottomRightButtonProps = {
    label: string
    disabled: boolean;
    onPress: () => void;
}

export default function BottomRightButton({ label, disabled, onPress }: bottomRightButtonProps) {

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
                <Text style={styles.assignButtonText}>{label}</Text>
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
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    assignButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },

})