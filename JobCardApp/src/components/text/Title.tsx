import { StyleProp, StyleSheet, TextStyle, TouchableOpacity } from "react-native";
import PADDING from "../../constants/padding";
import COLORS from "../../constants/colors";
import { Text } from "react-native-gesture-handler";
import { ReactNode } from "react";

type TitleProps = {
    children?: ReactNode;
    style?: StyleProp<TextStyle>;

};

export default function Title({ children, style }: TitleProps) {
    return (

        <Text style={[styles.title, style]}>{children}</Text>


    )
}

const styles = StyleSheet.create({

    title: {
        fontSize: 40,
        fontWeight: "400",
        marginBottom: 8,
        color: "#111",
        //backgroundColor: "#aaa"
    },

});
