import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import COLORS from "../../../constants/colors";
import PADDING from "../../../constants/padding";

type SearchListProps = {
    list: any[];
    onSelect: (item: any) => void;
    titleExtractor: (item: any) => string;
    subtitleExtractor: (item: any) => string;
}

export default function SearchList({ list, onSelect, titleExtractor, subtitleExtractor }: SearchListProps) {


    return (
        <FlatList
            style={styles.container}
            data={list}
            keyExtractor={(item, index) => item.id || `${index}`}
            renderItem={({ item }) => (
                <TouchableOpacity style={styles.item} onPress={() => onSelect(item)} >
                    <Text style={styles.name}>{titleExtractor(item)}</Text>
                    <Text style={styles.id}> {subtitleExtractor(item)}</Text>
                </TouchableOpacity>
            )}
            ListEmptyComponent={<Text>Fleet number not found.</Text>}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: PADDING.horizontal,

    },
    item: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#ddd",
    },
    name: { fontSize: 16, fontWeight: "600" },
    id: { fontSize: 12, color: "#555" },
});
