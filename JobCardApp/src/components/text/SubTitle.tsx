import { StyleProp, StyleSheet, TextStyle } from "react-native";
import PADDING from "../../constants/padding";
import COLORS from "../../constants/colors";
import { Text } from "react-native-gesture-handler";
import { ReactNode } from "react";

type SubTitleProps = {
    children: ReactNode;
    style?: StyleProp<TextStyle>;
};

export default function SubTitle({ children, style }: SubTitleProps) {
    return <Text style={[styles.title, style]}>{children}</Text>;
}

const styles = StyleSheet.create({

    title: {
        fontSize: 22,
        fontWeight: "500",
        marginBottom: 8,
        color: "#111",
        //backgroundColor: "#aaa"
    },

});
