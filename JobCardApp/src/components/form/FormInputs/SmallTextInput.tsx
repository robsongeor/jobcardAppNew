import React, { Children, ReactNode } from "react";
import { TextInput, View, Text, StyleSheet, ViewStyle, StyleProp } from "react-native";
import Label from "./Label";
import DateInput from "./DateInput";
import COLORS from "../../../constants/colors";

type SmallTextInputProps = {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    multiline?: boolean;
    children?: ReactNode;
    required?: boolean;
    style?: StyleProp<ViewStyle>;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad" | "number-pad" | "decimal-pad"; // etc
};

export default function SmallTextInput({
    label,
    value,
    onChangeText,
    multiline = false,
    children,
    required,
    style,
    keyboardType,
}: SmallTextInputProps) {

    const [isFocused, setIsFocused] = React.useState(false);


    const getRequired = (value: string) => {
        // if (value.trim().length === 0 && required) {
        //     return { borderColor: "#FFD600" }
        // }
    }

    return (
        <View style={[SmallInputStyles.inputBlock, style]}>
            <Label
                label={label}
            />
            <View style={SmallInputStyles.flex}>
                <TextInput
                    multiline={multiline}
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}  // <-- pass the prop
                    placeholder={`Enter ${label.toLowerCase()}`}
                    placeholderTextColor="#aaa"
                    style={[
                        SmallInputStyles.input,
                        multiline && SmallInputStyles.multiline,
                        // getRequired(value),
                        isFocused && { borderColor: COLORS.primary, borderWidth: 1.5 }, // Material blue 700 or your choice
                    ]}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}

                />
                {children}
            </View>

        </View>
    );
}



export const SmallInputStyles = StyleSheet.create({
    inputBlock: {
        marginBottom: 20,
    },
    input: {
        fontSize: 15,
        color: COLORS.black,
        backgroundColor: COLORS.white,
        borderWidth: 1.5,
        borderColor: "transparent",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        flex: 1,
    },
    multiline: {
        minHeight: 300,
        textAlignVertical: "top",
    },
    flex: {
        flexDirection: "row",
        alignItems: "stretch",
        gap: 14,
    },
    required: {
        borderColor: "#FFD600", // a nice yellow (Material yellow 700)
        borderWidth: 1,
    }
});
