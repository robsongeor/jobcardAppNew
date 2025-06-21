import { View, Button, StyleSheet, TouchableOpacity, Text } from "react-native";
import SmallTextInput from "./FormInputs/SmallTextInput";

type QuantityInputType = {
    quantity: string;
    setQuantity: React.Dispatch<React.SetStateAction<string>>;
}

export default function QuantityInput({ quantity, setQuantity }: QuantityInputType) {

    const incrementValue = (increment: number) => {
        const makeValid = quantity || "0";

        let value = parseInt(makeValid);
        value = value + increment;

        if (value < 0) {
            value = 0;
        }

        const stringValue = value.toString();
        setQuantity(stringValue)
    }

    return (
        <View style={styles.container}>
            <View style={styles.input}>
                <SmallTextInput
                    value={quantity}
                    onChangeText={setQuantity}
                    label="Quantity"
                >
                    <TouchableOpacity style={styles.button} onPress={() => incrementValue(1)}>
                        <Text> Up </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => incrementValue(-1)}>
                        <Text> Down </Text>
                    </TouchableOpacity>

                </SmallTextInput>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        flex: 1,
        marginRight: 8,
    },
    button: {
        width: 50,            // fixed width
        height: 36,           // fixed height (makes a square)
        backgroundColor: "#f0f0f0", // subtle background
        borderRadius: 6,      // slightly rounded corners
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 4,        // space between buttons/input
        borderWidth: 1,
        borderColor: "#d0d0d0",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },

});
