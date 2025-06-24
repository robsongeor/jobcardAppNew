import { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import COLORS from "../../../constants/colors";

type textSubHeading = {
    children?: ReactNode;
    onPress?: () => void;
    visible?: boolean
}

export default function SubHeading({ children, onPress, visible }: textSubHeading) {

    return (
        <View style={styles.container}>

            <Text style={styles.textSubHeading}>{children}</Text>

            {visible && <TouchableOpacity onPress={onPress}>
                <Text style={styles.editText}>EDIT</Text>
            </TouchableOpacity>}
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 4,

    },
    textSubHeading: {
        fontWeight: "900",
        fontSize: 11,
        color: "#999",
    },
    editText: {
        fontWeight: "500",
        fontSize: 11,
        color: COLORS.primary,
    }
})