
import { SmallInputStyles } from "./SmallTextInput";
import Label from "./Label";
import { StyleSheet, TextInput, View } from "react-native";
import CheckBox from "@react-native-community/checkbox";
import COLORS from "../../../constants/colors";


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

    console.log(label)

    return (
        <View style={SmallInputStyles.inputBlock}>
            <Label label={label} />
            <View style={[{ flexDirection: "row", alignItems: "center" }, styles.checkAndInput]}>
                <CheckBox
                    value={checkBoxValue}
                    onValueChange={onCheckBoxChange}
                />
                <TextInput
                    multiline={multiline}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={`Enter ${inputPlaceholder.toLowerCase()}`}
                    placeholderTextColor="#aaa"
                    style={[
                        SmallInputStyles.input, styles.input,
                        multiline && SmallInputStyles.multiline,
                        { flex: 1, marginLeft: 0 },
                    ]}
                />

            </View>
        </View>
    );

}

const styles = StyleSheet.create({

    input: {
        borderColor: "transparent",
    },
    checkAndInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        backgroundColor: COLORS.white
    }
});
