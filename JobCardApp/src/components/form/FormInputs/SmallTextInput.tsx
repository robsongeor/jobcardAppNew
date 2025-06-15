import React from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";
import Label from "./Label";

type InputProps = {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    multiline?: boolean;
};

export default function SmallTextInput({
    label,
    value,
    onChangeText,
    multiline = false,
}: InputProps) {
    return (
        <View style={styles.inputBlock}>
            <Label
                label={label}
            />
            <TextInput
                multiline={multiline}
                value={value}
                onChangeText={onChangeText}
                placeholder={`Enter ${label.toLowerCase()}`}
                placeholderTextColor="#aaa"
                style={[styles.input, multiline && styles.multiline]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    inputBlock: {
        marginBottom: 12,
    },
    input: {
        fontSize: 13,
        color: "#222",
        backgroundColor: "#fefefe",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    multiline: {
        minHeight: 300,
        textAlignVertical: "top",
    },
});
