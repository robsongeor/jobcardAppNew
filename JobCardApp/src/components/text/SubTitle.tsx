import { StyleProp, StyleSheet, TextStyle, TouchableOpacity } from "react-native";
import PADDING from "../../constants/padding";
import COLORS from "../../constants/colors";
import { Text } from "react-native-gesture-handler";
import { ReactNode } from "react";

type SubTitleProps = {
    children?: ReactNode;
    style?: StyleProp<TextStyle>;
    onPress?: () => void
};

export default function SubTitle({ children, style, onPress }: SubTitleProps) {
    return (
        //<TouchableOpacity onPress={onPress}>
        <Text style={[styles.text, style]}>{children}</Text>
        //</TouchableOpacity>
    )

}

const styles = StyleSheet.create({

    text: {
        fontWeight: "600",
        fontSize: 23,
        color: "#222",
        marginBottom: 4,
        marginTop: 12,
    },

});
