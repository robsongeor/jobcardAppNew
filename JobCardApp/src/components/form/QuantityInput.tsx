import { View, Button, StyleSheet, TouchableOpacity, Text } from "react-native";
import SmallTextInput from "./FormInputs/SmallTextInput";
import COLORS from "../../constants/colors";
import Icon from "react-native-vector-icons/Feather";

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
                    keyboardType="numeric"
                >
                    <TouchableOpacity style={styles.button} onPress={() => incrementValue(-1)}>
                        <Icon name="minus" size={24} color={COLORS.white} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => incrementValue(1)}>
                        <Icon name="plus" size={24} color={COLORS.white} />
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

    },
    button: {
        paddingVertical: 7,
        paddingHorizontal: 7,
        backgroundColor: COLORS.primary,
        borderRadius: 60,      // slightly rounded corners
        justifyContent: "center",
        alignItems: "center",
        // space between buttons/input
        borderWidth: 1.5,

        borderColor: "transparent",

    },


});
