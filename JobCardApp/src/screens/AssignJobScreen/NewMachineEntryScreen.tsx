import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AssignJobStackParamList } from "../../navigation/AssignJobStack";
import { KeyboardAvoidingView, Platform, Text, TextInput, View, StyleSheet } from "react-native";
import { Machine } from "../../types/types";
import { useState } from "react";
import BottomRightButton from "../../components/form/Buttons/BottomRightButton";

type Props = NativeStackScreenProps<AssignJobStackParamList, "NewMachineEntry">;

export default function NewMachineEntryScreen({ route, navigation }: Props) {
    const { jobNumber, fleetNumber } = route.params;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>("");

    const [machine, setMachine] = useState<Machine>({
        fleet: fleetNumber,
        make: "",
        model: "",
        serialNumber: "",
    });

    const handleChange = (field: keyof Machine, value: string) => {
        setMachine((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = (machine: Machine) => {
        setError(null); // reset old errors
        console.log(machine)
        navigation.navigate("CustomerEntry", { jobNumber: jobNumber, fleet: fleetNumber, machine });
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, padding: 16 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={0}
        >
            <Text style={styles.label}>Job Number: {jobNumber}</Text>
            <Text style={styles.label}>Fleet Number: {fleetNumber}</Text>

            <Text style={styles.label}>Make</Text>
            <TextInput
                style={styles.input}
                value={machine.make}
                onChangeText={(text) => handleChange("make", text)}
                placeholder="Enter make"
            />

            <Text style={styles.label}>Model</Text>
            <TextInput
                style={styles.input}
                value={machine.model}
                onChangeText={(text) => handleChange("model", text)}
                placeholder="Enter model"
            />

            <Text style={styles.label}>Serial Number</Text>
            <TextInput
                style={styles.input}
                value={machine.serialNumber}
                onChangeText={(text) => handleChange("serialNumber", text)}
                placeholder="Enter serial number"
            />
            <BottomRightButton
                label={loading ? "Loading..." : "Next"}
                disabled={loading}
                onPress={() => handleSubmit(machine)}
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    label: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: "600",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginTop: 4,
    },
});
