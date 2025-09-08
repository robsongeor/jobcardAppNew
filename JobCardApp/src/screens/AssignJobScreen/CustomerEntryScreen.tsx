import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AssignJobStackParamList } from "../../navigation/AssignJobStack";
import { useEffect, useRef, useState } from "react";
import { createEmptyJob, listenToCustomers } from "../../firebase";
import { Customer, Job } from "../../types/types";
import BottomRightButton from "../../components/form/Buttons/BottomRightButton";
import SearchBar from "../../components/SearchBar";
import COLORS from "../../constants/colors";
import CustomButton from "../../components/form/Buttons/CustomButton";
import { getCachedCustomers } from "../../storage/storage";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import PADDING from "../../constants/padding";
import { useCustomers } from "../../context/CustomerContext";
import SearchList from "./components/SearchList";


type Props = NativeStackScreenProps<AssignJobStackParamList, "CustomerEntry">;

export default function CustomerEntryScreen({ route, navigation }: Props) {
    const { jobNumber, fleet, machine, customer } = route.params
    const [searchTerm, setSearchTerm] = useState("")

    const [storedCustomer, setCustomer] = useState<Customer>(customer)


    //Create an empty job
    const [job, setJob] = useState<Job>(createEmptyJob())


    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

    const [isSearching, setIsSearching] = useState(false);

    const { customers, loading } = useCustomers();

    if (loading) return <Text>Loading customers...</Text>;


    useEffect(() => {
        const results = customers.filter((c) =>
            c.customerName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCustomers(results);
    }, [searchTerm, customers]);


    const handleChange = (field: keyof Customer, value: string) => {
        setCustomer((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = (customer: Customer) => {
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
    };

    const setCustomerSelection = (customer: Customer) => {
        setIsSearching(false)
        setCustomer(customer)
    }
    const inputRef = useRef<TextInput>(null);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={0}
        >

            <SearchBar
                value={searchTerm}
                onChangeText={setSearchTerm}
                handleSearch={() => console.log("search")}
                placeholder="Search Customer..."
                onFocus={() => setIsSearching(true)}
                ref={inputRef}
            />

            {isSearching && <>
                <SearchList
                    list={filteredCustomers}
                    onSelect={setCustomerSelection}
                    titleExtractor={(item) => item.customerName}
                    subtitleExtractor={(item) => `${item.customerAddress}, ${item.customerAddressSuburb} `}
                />

                <BottomRightButton
                    label={"Close"}
                    onPress={() => {
                        setIsSearching(false);
                        inputRef.current?.blur(); // remove focus
                    }}
                    color="red"
                />
            </>
            }

            {!isSearching && <>
                <View style={styles.details}>
                    <Text style={styles.label}>Customer Name</Text>
                    <TextInput
                        style={styles.input}
                        value={storedCustomer.customerName}
                        onChangeText={(text) => handleChange("customerName", text)}
                        placeholder="Enter customer name"
                    />

                    <Text style={styles.label}>Address</Text>
                    <TextInput
                        style={styles.input}
                        value={storedCustomer.customerAddress}
                        onChangeText={(text) => handleChange("customerAddress", text)}
                        placeholder="Enter street address"
                    />

                    <Text style={styles.label}>Suburb</Text>
                    <TextInput
                        style={styles.input}
                        value={storedCustomer.customerAddressSuburb}
                        onChangeText={(text) => handleChange("customerAddressSuburb", text)}
                        placeholder="Enter suburb"
                    />

                    <Text style={styles.label}>Town / City</Text>
                    <TextInput
                        style={styles.input}
                        value={storedCustomer.customerAddressTown}
                        onChangeText={(text) => handleChange("customerAddressTown", text)}
                        placeholder="Enter town/city"
                    />
                </View>

                <BottomRightButton
                    label={loading ? "Loading..." : "Next"}
                    disabled={loading || storedCustomer.customerName.length == 0}
                    onPress={() => handleSubmit(storedCustomer)}
                />
            </>
            }



        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    details: {
        marginHorizontal: PADDING.horizontal
    },
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
    item: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#ddd",
    },
    name: { fontSize: 16, fontWeight: "600" },
    id: { fontSize: 12, color: "#555" },
});
