import { StyleSheet, Text } from "react-native";

type LabelProps = {
    label: string;
}

export default function Label({ label }: LabelProps) {

    return (
        <Text style={styles.label}>{label}</Text>
    )
}

const styles = StyleSheet.create({
    label: {
        fontSize: 12,
        color: "#999",
        textTransform: "uppercase",
        marginBottom: 4,
        letterSpacing: 0.5,
    },
});
