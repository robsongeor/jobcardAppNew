import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AssignJobStackParamList } from "../../navigation/AssignJobStack";
import { KeyboardAvoidingView, Platform, Text, TextInput, View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { FirestoreMachines, Machine } from "../../types/types";
import { useEffect, useRef, useState } from "react";
import BottomRightButton from "../../components/form/Buttons/BottomRightButton";
import SearchBar from "../../components/SearchBar";
import COLORS from "../../constants/colors";
import PADDING from "../../constants/padding";
import { getCachedCustomers, getCachedMachines, syncCustomersToMMKV, syncMachinesToMMKV } from "../../storage/storage";

type Props = NativeStackScreenProps<AssignJobStackParamList, "NewMachineEntry">;

export default function NewMachineEntryScreen({ route, navigation }: Props) {
    const { jobNumber } = route.params;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>("");

    const [searchTerm, setSearchTerm] = useState("")

    const [isSearching, setIsSearching] = useState(false);

    const [machine, setMachine] = useState<Machine>({
        fleet: "",
        make: "",
        model: "",
        serialNumber: "",
    });

    const [machines, setMachines] = useState<FirestoreMachines[]>([]);
    const [filteredMachines, setFilteredMachines] = useState<FirestoreMachines[]>([]);

    const handleChange = (field: keyof Machine, value: string) => {
        setMachine((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = (machine: Machine) => {
        setError(null); // reset old errors
        console.log(machine)
        navigation.navigate("CustomerEntry", { jobNumber: jobNumber, fleet: machine.fleet, machine });
    };

    useEffect(() => {
        const cached = getCachedMachines();

        if (cached.length === 0) {
            syncMachinesToMMKV().then((fresh) => {
                setMachines(fresh);
                setFilteredMachines(fresh); // set initial filtered list
                console.log("Fetched from Firestore:", fresh.length);
            });
        } else {
            setMachines(cached);
            setFilteredMachines(cached); // set initial filtered list
            console.log("Loaded machines:", cached.length);
        }
    }, []);

    useEffect(() => {
        const results = machines.filter((c) =>
            c.fleet.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMachines(results);
    }, [searchTerm, machines]);

    const inputRef = useRef<TextInput>(null);

    const setMachineSelection = (machine: FirestoreMachines) => {
        setIsSearching(false)

        const convertToMachine = {
            fleet: machine.fleet,
            make: machine.machine.make,
            model: machine.machine.model,
            serialNumber: machine.machine.serialNumber
        } as Machine

        setMachine(convertToMachine)

    }

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
                placeholder="Search Fleet..."
                onFocus={() => setIsSearching(true)}
                ref={inputRef}
            />

            {isSearching && <FlatList
                data={filteredMachines}
                keyExtractor={(item, index) => item.id || `${index}`}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => setMachineSelection(item)}
                    >

                        <Text style={styles.name}>{item.fleet}</Text>
                        <Text style={styles.id}>ID: {item.id || "No ID"}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text>No customers found.</Text>}
            />}


            {isSearching && <BottomRightButton
                label={"Close"}
                onPress={() => {
                    setIsSearching(false);
                    inputRef.current?.blur(); // remove focus
                }}
                color="red"
            />}

            {!isSearching &&
                <View style={styles.details}>
                    <Text style={styles.label}>Fleet Number</Text>
                    <TextInput
                        style={styles.input}
                        value={machine.fleet}
                        onChangeText={(text) => handleChange("fleet", text)}
                        placeholder="Enter Fleet Number"
                    />

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
                </View>}


            {!isSearching && <BottomRightButton
                label={loading ? "Loading..." : "Next"}
                disabled={loading}
                onPress={() => handleSubmit(machine)}
            />}


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
    item: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#ddd",
    },
    name: { fontSize: 16, fontWeight: "600" },
    id: { fontSize: 12, color: "#555" },
});

