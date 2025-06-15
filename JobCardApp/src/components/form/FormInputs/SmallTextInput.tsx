import React, { Dispatch, SetStateAction } from "react";
import { TextInput, View } from "react-native";


type inputProps = {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    multiline?: boolean
}

export default function SmallTextInput({ label, value, onChangeText, multiline }: inputProps) {

    return (
        <View>
            <TextInput
                multiline={multiline}
                value={value}
                onChangeText={onChangeText}
                placeholder={`Enter ${label.toLowerCase()}...`}
                style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 6,
                    padding: 10,
                    fontSize: 16,
                    backgroundColor: "#fff",
                }}
            />
        </View>

    )
}