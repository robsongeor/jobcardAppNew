import { StyleSheet, Text, View } from "react-native";
import COLORS from "../constants/colors";
import { capitalizeFirst } from "./helpers/formatters";

type StatusProps = {
    status: string;
}

export default function Status({ status }: StatusProps) {
    // Optionally, you can map status to a color:
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "complete":
                return "green";
            case "assigned":
                return "orange";
            case "cancelled":
                return "red";
            default:
                return "grey";
        }
    };

    return (
        <View style={[styles.container, { flexDirection: "row", alignItems: "center" }]}>
            {/* Colored dot */}
            <Text>{capitalizeFirst(status)}</Text>
            <View
                style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: getStatusColor(status),

                }}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: "#bbb",
        height: "100%",
        gap: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
    }

})
