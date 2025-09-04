import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput } from "react-native";
import { AssignJobStackParamList } from "../../navigation/AssignJobStack";
import { useState } from "react";
import { createEmptyJob } from "../../firebase";
import { Customer, Job } from "../../types/types";
import BottomRightButton from "../../components/form/Buttons/BottomRightButton";

type Props = NativeStackScreenProps<AssignJobStackParamList, "CustomerEntry">;

export default function CustomerEntryScreen({ route, navigation }: Props) {
    const { jobNumber, fleet, machine } = route.params

    const [customer, setCustomer] = useState<Customer>({
        coords: { latitude: 0, longitude: 0 },
        customerAddress: "",
        customerAddressSuburb: "",
        customerAddressTown: "",
        customerName: "",
    })

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>("");

    //Create an empty job
    const [job, setJob] = useState<Job>(createEmptyJob())

    const handleChange = (field: keyof Customer, value: string) => {
        setCustomer((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = (customer: Customer) => {
        setError(null); // reset old errors

        const newJob: Job = {
            ...job,
            job: jobNumber,           // <- confirm this field name matches your Job type
            fleet,                    // <- you already have 'fleet' from route.params
            ...customer,
            machine: {
                make: machine.make,
                model: machine.model,
                serialNumber: machine.serialNumber,
            },
        };

        setJob(newJob)

        navigation.navigate("JobDescriptionEntry", { job: newJob });

        console.log(newJob)

    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, padding: 16 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={0}
        >
            <Text style={styles.label}>Job Number: {jobNumber}</Text>
            <Text style={styles.label}>Fleet Number: {fleet}</Text>
            <Text style={styles.label}>Make: {machine.make}</Text>
            <Text style={styles.label}>Model: {machine.model}</Text>
            <Text style={styles.label}>Serial Number: {machine.serialNumber}</Text>

            <Text style={styles.label}>Customer Name</Text>
            <TextInput
                style={styles.input}
                value={customer.customerName}
                onChangeText={(text) => handleChange("customerName", text)}
                placeholder="Enter cabc rentalsustomer name"
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
                style={styles.input}
                value={customer.customerAddress}
                onChangeText={(text) => handleChange("customerAddress", text)}
                placeholder="Enter street address"
            />

            <Text style={styles.label}>Suburb</Text>
            <TextInput
                style={styles.input}
                value={customer.customerAddressSuburb}
                onChangeText={(text) => handleChange("customerAddressSuburb", text)}
                placeholder="Enter suburb"
            />

            <Text style={styles.label}>Town / City</Text>
            <TextInput
                style={styles.input}
                value={customer.customerAddressTown}
                onChangeText={(text) => handleChange("customerAddressTown", text)}
                placeholder="Enter town/city"
            />
            <BottomRightButton
                label={loading ? "Loading..." : "Next"}
                disabled={loading}
                onPress={() => handleSubmit(customer)}
            />
        </KeyboardAvoidingView>
    )
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
