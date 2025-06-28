
import { SmallInputStyles } from "./SmallTextInput";
import Label from "./Label";
import { StyleSheet, TextInput, View } from "react-native";
import CheckBox from "@react-native-community/checkbox";
import COLORS from "../../../constants/colors";
import { useState } from "react";


type SmallCheckBoxInputProps = {
    label: string;
    value: string;
    inputPlaceholder: string;
    onChangeText: (value: string) => void;
    checkBoxValue: boolean;
    onCheckBoxChange: (value: boolean) => void;
    multiline?: boolean;
};

export default function SmallCheckBoxInput({
    label,
    inputPlaceholder,
    value,
    checkBoxValue,
    onCheckBoxChange,
    onChangeText,
    multiline,


}: SmallCheckBoxInputProps) {
    const [isFocused, setIsFocused] = useState(false);


    return (
        <View style={SmallInputStyles.inputBlock}>
            <Label label={label} />
            <View style={[{ flexDirection: "row", alignItems: "center" }, styles.checkAndInput, isFocused && { borderColor: COLORS.primary, borderWidth: 1.5 }]}>
                <CheckBox
                    value={checkBoxValue}
                    onValueChange={onCheckBoxChange}
                    tintColors={{ true: COLORS.primary, false: "#aaa" }} // COLORS.primary = your highlight color

                />
                <TextInput
                    multiline={multiline}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={`Enter ${inputPlaceholder.toLowerCase()}`}
                    placeholderTextColor="#aaa"
                    style={[
                        SmallInputStyles.input, styles.input,
                        { flex: 1, marginLeft: 0 },
                    ]}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}

                />

            </View>
        </View>
    );

}

const styles = StyleSheet.create({

    input: {

    },
    checkAndInput: {
        paddingLeft: 3,
        //backgroundColor: COLORS.white,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: "transparent"
    },


});
