import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import COLORS from "../../../constants/colors";

type SearchListProps = {
    list: any[];
    onSelect: (item: any) => void;
}

export default function SearchList({ list, onSelect }: SearchListProps) {


    return (
        <FlatList
            data={list}
            keyExtractor={(item, index) => item.id || `${index}`}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => onSelect(item)}
                >

                    <Text style={styles.name}>{item.fleet}</Text>
                    <Text style={styles.id}>ID: {item.id || "No ID"}</Text>
                </TouchableOpacity>
            )}
            ListEmptyComponent={<Text>Fleet number not found.</Text>}
        />
    )
}

const styles = StyleSheet.create({



    item: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#ddd",
    },
    name: { fontSize: 16, fontWeight: "600" },
    id: { fontSize: 12, color: "#555" },
});
