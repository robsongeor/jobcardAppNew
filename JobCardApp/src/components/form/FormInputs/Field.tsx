import React, { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type FieldProps = {
    label?: string;
    children?: ReactNode;
    scrollView?: boolean
}

export default function Field({ label, children, scrollView }: FieldProps) {
    return scrollView ? (
        <ScrollView style={styles.card}>
            {label && <Text>{label}</Text>}
            {children}
        </ScrollView>
    ) : (
        <View style={styles.card}>
            {label && <Text>{label}</Text>}
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: "#fefefe",
        padding: 14,
    },
})