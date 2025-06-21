import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import COLORS from "../constants/colors";

type StatCardProps = {
    label: string;
    value: string | number;
    unit?: string;
    // icon?: ReactNode // if you want to add icons later
    color?: string;     // for customizing highlight color
    icon?: string;
    style?: StyleProp<ViewStyle>;
};

export function StatCard({ label, value, unit, color = "#FFE066", icon, style }: StatCardProps) {
    return (
        <View style={styles.container}>
            <View style={[styles.card, { backgroundColor: "#fff" }, style]}>
                <View style={styles.iconWrapper}>
                    <Icon name={icon} size={24} color={color} />
                </View>
                <Text style={styles.label}>{label}</Text>
                <Text style={[styles.value, { color: color }]}>
                    {value}
                    {unit && <Text style={styles.unit}> {unit}</Text>}
                </Text>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        width: "50%", // adjust as needed

    },
    card: {

        marginBottom: 8,
        height: 120,
        borderRadius: 16,
        backgroundColor: "#fff",
        padding: 20,

        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box"

    },
    label: {
        color: "#555",
        fontSize: 17,
        fontWeight: "800",
        marginBottom: 5,
    },
    value: {

        fontSize: 26,

        fontWeight: "800",
    },
    unit: {
        color: "#aaa",
        fontSize: 13,
        fontWeight: "800",
    },
    iconWrapper: {
        position: "absolute",
        top: 17,
        right: 20,
        zIndex: 1,
    },
});
