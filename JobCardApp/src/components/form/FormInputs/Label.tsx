import { StyleSheet, Text } from "react-native";
import COLORS from "../../../constants/colors";
import PADDING from "../../../constants/padding";

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
        fontSize: 13,
        color: COLORS.black,

        borderTopEndRadius: 8,
        letterSpacing: 0.5,
        fontWeight: "600",
        padding: 8,
        backgroundColor: COLORS.white
    },
});
