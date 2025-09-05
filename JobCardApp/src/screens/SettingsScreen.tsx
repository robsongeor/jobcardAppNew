import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TextInput,
} from "react-native";
import {
    syncCustomersToMMKV,
    getCachedCustomers,
    storage,
} from "../storage/storage";
import { Customer } from "../types/types";

export default function SettingsScreen() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [search, setSearch] = useState("");
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        const cached = getCachedCustomers();

        if (cached.length === 0) {
            syncCustomersToMMKV().then((fresh) => {
                setCustomers(fresh);
                setFilteredCustomers(fresh); // set initial filtered list
                console.log("Fetched from Firestore:", fresh.length);
            });
        } else {
            setCustomers(cached);
            setFilteredCustomers(cached); // set initial filtered list
            console.log("Loaded cached customers:", cached.length);
        }
    }, []);

    useEffect(() => {
        const results = customers.filter((c) =>
            c.customerName.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredCustomers(results);
    }, [search, customers]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Customer List</Text>

            <TextInput
                placeholder="Search by customer name..."
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
            />

            <FlatList
                data={filteredCustomers}
                keyExtractor={(item, index) => item.id || `${index}`}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.name}>{item.customerName}</Text>
                        <Text style={styles.id}>ID: {item.id || "No ID"}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text>No customers found.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    header: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
    searchInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
    },
    item: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#ddd",
    },
    name: { fontSize: 16, fontWeight: "600" },
    id: { fontSize: 12, color: "#555" },
});
