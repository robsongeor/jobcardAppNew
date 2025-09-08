import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AssignJobStackParamList } from "../../navigation/AssignJobStack";
import { KeyboardAvoidingView, Platform, Text, TextInput, View, StyleSheet } from "react-native";
import { Customer, FirestoreMachines, Machine } from "../../types/types";
import { useEffect, useRef, useState } from "react";
import BottomRightButton from "../../components/form/Buttons/BottomRightButton";
import SearchBar from "../../components/SearchBar";
import COLORS from "../../constants/colors";
import PADDING from "../../constants/padding";
import { useMachines } from "../../context/MachinesContext";
import SearchList from "./components/SearchList";

type Props = NativeStackScreenProps<AssignJobStackParamList, "NewMachineEntry">;

export default function NewMachineEntryScreen({ route, navigation }: Props) {

    const { machines, loading } = useMachines();
    if (loading) return <Text>Loading customers...</Text>;

    const { jobNumber } = route.params;

    const [searchTerm, setSearchTerm] = useState("")
    const [isSearching, setIsSearching] = useState(false);

    const [machine, setMachine] = useState<Machine>({
        fleet: "",
        make: "",
        model: "",
        serialNumber: "",
    });

    const [customer, setCustomer] = useState<Customer>({
        coords: { latitude: 0, longitude: 0 },
        customerAddress: "",
        customerAddressSuburb: "",
        customerAddressTown: "",
        customerName: "",
    });

    const [filteredMachines, setFilteredMachines] = useState<FirestoreMachines[]>([]);
    const [inputsValid, setInputsValid] = useState(true)


    const UpdateMachineField = (field: keyof Machine, value: string) => {
        setMachine((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleNavigation = (machine: Machine) => {
        navigation.navigate("CustomerEntry", { jobNumber: jobNumber, fleet: machine.fleet, machine, customer });
    };

    //Filter Machines by search term
    useEffect(() => {
        const results = machines.filter((c) =>
            c.fleet.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMachines(results);
    }, [searchTerm, machines]);

    //Simple validation checking if fleet, make and model not empty
    useEffect(() => {
        if (machine.fleet.length > 0 && machine.make.length > 0 && machine.model.length > 0) {
            setInputsValid(false)
        } else {
            setInputsValid(true)
        }
    }, [machine])

    //For removing focus on cancel
    const inputRef = useRef<TextInput>(null);

    //Takes firestoreMachine (which has both machine and customer fields) and converts it
    const setMachineSelection = (machine: FirestoreMachines) => {
        setIsSearching(false)

        const convertToMachine = {
            fleet: machine.fleet,
            make: machine.machine.make,
            model: machine.machine.model,
            serialNumber: machine.machine.serialNumber
        } as Machine

        const convertToCustomer = {
            coords: machine.coords,
            customerAddress: machine.customerAddress,
            customerAddressSuburb: machine.customerAddressSuburb,
            customerAddressTown: machine.customerAddressTown,
            customerName: machine.customerName,

        } as Customer

        setMachine(convertToMachine)
        setCustomer(convertToCustomer)
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={0}
        >
            {/* SEARCH  */}
            <SearchBar
                value={searchTerm}
                onChangeText={setSearchTerm}
                handleSearch={() => console.log("search")}
                placeholder="Search Fleet..."
                onFocus={() => setIsSearching(true)}
                ref={inputRef}
            />

            {isSearching && <>
                <SearchList
                    list={filteredMachines}
                    onSelect={setMachineSelection}
                    titleExtractor={(item) => item.fleet}
                    subtitleExtractor={(item) => `${item.machine.make || ""} ${item.machine.model || ""} `}
                />

                <BottomRightButton
                    label={"Close"}
                    onPress={() => {
                        setIsSearching(false);
                        inputRef.current?.blur(); // remove focus
                    }}
                    color="red"
                />
            </>}

            {!isSearching && <>
                <View style={styles.details}>
                    <Text style={styles.label}>Fleet Number</Text>
                    <TextInput
                        style={styles.input}
                        value={machine.fleet}
                        onChangeText={(text) => UpdateMachineField("fleet", text)}
                        placeholder="Enter Fleet Number"
                    />

                    <Text style={styles.label}>Make</Text>
                    <TextInput
                        style={styles.input}
                        value={machine.make}
                        onChangeText={(text) => UpdateMachineField("make", text)}
                        placeholder="Enter make"
                    />

                    <Text style={styles.label}>Model</Text>
                    <TextInput
                        style={styles.input}
                        value={machine.model}
                        onChangeText={(text) => UpdateMachineField("model", text)}
                        placeholder="Enter model"
                    />

                    <Text style={styles.label}>Serial Number</Text>
                    <TextInput
                        style={styles.input}
                        value={machine.serialNumber}
                        onChangeText={(text) => UpdateMachineField("serialNumber", text)}
                        placeholder="Enter serial number"
                    />
                </View>

                <BottomRightButton
                    label={loading ? "Loading..." : "Next"}
                    disabled={loading || inputsValid}
                    onPress={() => handleNavigation(machine)}
                />
            </>
            }

        </KeyboardAvoidingView>
    );
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

});

