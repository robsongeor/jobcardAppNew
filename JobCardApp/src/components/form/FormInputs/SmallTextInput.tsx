import React, { Children, ReactNode } from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";
import Label from "./Label";
import DateInput from "./DateInput";

type SmallTextInputProps = {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    multiline?: boolean;
    children?: ReactNode;
    required?: boolean;
};

export default function SmallTextInput({
    label,
    value,
    onChangeText,
    multiline = false,
    children,
    required,
}: SmallTextInputProps) {

    const getRequired = (value: string) => {
        if (value.trim().length === 0 && required) {
            return { borderColor: "#FFD600" }
        }
    }

    return (
        <View style={SmallInputStyles.inputBlock}>
            <Label
                label={label}
            />
            <View style={SmallInputStyles.flex}>
                <TextInput
                    multiline={multiline}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    placeholderTextColor="#aaa"
                    style={[SmallInputStyles.input, multiline && SmallInputStyles.multiline, getRequired(value)]}
                />
                {children}
            </View>

        </View>
    );
}



export const SmallInputStyles = StyleSheet.create({
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
        flex: 1,
    },
    multiline: {
        minHeight: 300,
        textAlignVertical: "top",
    },
    flex: {
        flexDirection: "row",

    },
    required: {
        borderColor: "#FFD600", // a nice yellow (Material yellow 700)
        borderWidth: 1,
    }
});
