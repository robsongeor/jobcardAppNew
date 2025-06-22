import { StyleSheet, Text } from "react-native";
import COLORS from "../../../constants/colors";

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
        fontSize: 15,
        color: COLORS.black,
        marginLeft: 5,
        marginBottom: 6,
        letterSpacing: 0.5,
        fontWeight: "600"
    },
});
