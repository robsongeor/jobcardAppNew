import {
    KeyboardAvoidingView,
    KeyboardTypeOptions,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import Title from "../../../components/text/Title";
import BottomRightButton from "../../../components/form/Buttons/BottomRightButton";
import PADDING from "../../../constants/padding";
import COLORS from "../../../constants/colors";
import { ReactNode, useState } from "react";

type FieldSearchProps = {
    loading: boolean;
    onSubmit: (value: string) => void;
    placeholder?: string;
    title?: ReactNode;
    subtitle?: ReactNode;
    keyboardType?: KeyboardTypeOptions;
};

/**
 * A simple, reusable search field with title, subtitle, and a submit button.
 */
export default function FieldSearch({
    loading,
    onSubmit,
    placeholder,
    title,
    subtitle,
    keyboardType,
}: FieldSearchProps) {
    const [value, setValue] = useState("");

    // Enable submit if value is at least 5 chars (trimmed)
    const submitEnabled = value.trim().length > 4;

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
                    {!!title && <Title>{title}</Title>}
                    {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

                    <TextInput
                        style={styles.input}
                        placeholder={placeholder}
                        value={value}
                        onChangeText={setValue}
                        keyboardType={keyboardType}
                        returnKeyType="done"
                        editable={!loading}
                    />
                </ScrollView>
                <BottomRightButton
                    label={loading ? "Loading..." : "Next"}
                    disabled={!submitEnabled || loading}
                    onPress={() => onSubmit(value.trim())}
                />
            </View>
        </KeyboardAvoidingView>
    );
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
});
