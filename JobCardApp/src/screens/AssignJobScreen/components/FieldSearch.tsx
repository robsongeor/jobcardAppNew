import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Title from "../../../components/text/Title";
import BottomRightButton from "../../../components/form/Buttons/BottomRightButton";
import PADDING from "../../../constants/padding";
import COLORS from "../../../constants/colors";
import { useEffect, useState } from "react";
import SubTitle from "../../../components/text/SubTitle";

type FieldSearchProps = {
    loading: boolean;
    onSubmit: (value: string) => void;
    fieldName: string;
    placeholder?: string;
}

export default function FieldSearch({ loading, onSubmit, fieldName, placeholder }: FieldSearchProps) {
    const [value, setValue] = useState("");
    const [submitEnabled, setSubmitEnabled] = useState(false)


    useEffect(() => {
        setSubmitEnabled(value.trim().length > 4);
    }, [value]);


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={0}
        >
            <View style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                >
                    <Title>Enter the {fieldName} {"\n"}number</Title>

                    <Text style={styles.subtitle}>
                        We'll check if it exists in our system.
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder={placeholder}
                        value={value}
                        onChangeText={setValue}
                        //keyboardType=""
                        returnKeyType="done"
                    //or maxLength={10}
                    />



                </ScrollView>
                <BottomRightButton
                    label="Next"
                    disabled={!submitEnabled || loading}
                    onPress={() => onSubmit(value)}
                />
            </View >
        </KeyboardAvoidingView >
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "stretch",
        paddingHorizontal: PADDING.horizontal,
        backgroundColor: COLORS.background,
    },

    subtitle: {
        fontSize: 16,
        color: "#555",
        marginBottom: 24,
    },
    input: {
        backgroundColor: COLORS.white,
        borderRadius: 40,
        paddingHorizontal: 20,
        paddingVertical: 16,
        fontSize: 16,
        marginBottom: 12,
    },

    button: {

        backgroundColor: "#111",
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",

    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "400",
    },
});
