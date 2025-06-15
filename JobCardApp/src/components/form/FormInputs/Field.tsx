import React, { ReactNode } from "react";
import { Text, View } from "react-native";

type FieldProps = {
    label: string;
    children?: ReactNode;
}

export default function Field({ label, children }: FieldProps) {

    return (
        <View>
            <Text> {label} </Text>
            {children}
        </View>
    )
}