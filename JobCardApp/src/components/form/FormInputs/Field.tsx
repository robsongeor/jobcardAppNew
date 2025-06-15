import React, { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type FieldProps = {
    label?: string;
    children?: ReactNode;
}

export default function Field({ label, children }: FieldProps) {

    return (
        <ScrollView style={styles.card}>
            {label && <Text> {label} </Text>}
            {children}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fefefe",
        padding: 14,
        marginHorizontal: 12,
        marginVertical: 6,
        borderRadius: 14,
        borderWidth: 0,
        shadowColor: "#999",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 1,
    },
})