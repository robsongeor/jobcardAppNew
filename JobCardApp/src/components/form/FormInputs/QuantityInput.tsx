import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

type QuantityInputProps = {
    quantityValue: string;
    setQuantityValue: (value: string) => void;
    descValue: string;
    setDescValue: (value: string) => void;
    descPlaceholder?: string;
};

export default function QuantityInput({
    quantityValue,
    setQuantityValue,
    descValue,
    setDescValue,
    descPlaceholder,
}: QuantityInputProps) {

    return (
        <View style={styles.container}>
            <TextInput
                value={quantityValue}
                onChangeText={setQuantityValue}
                keyboardType="numeric"
                placeholder="Qty"
                style={styles.quantityInput}
            />
            <TextInput
                value={descValue}
                onChangeText={setDescValue}
                placeholder={descPlaceholder || "Description"}
                style={styles.descInput}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    quantityInput: {
        width: 60,
        marginRight: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 10,
    },
    descInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 10,
    },
});
