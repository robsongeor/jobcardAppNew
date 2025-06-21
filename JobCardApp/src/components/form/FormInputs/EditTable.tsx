import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type TableHeader = {
    label: string;
    flex?: number;
    textAlign?: "auto" | "center" | "left" | "right" | "justify";
};

export type RowCell = {
    value: string;
    flex?: number;
    textAlign?: "auto" | "center" | "left" | "right" | "justify";
}

export type Row = RowCell[];

type EditTableProps = {
    headers: TableHeader[];
    rows: Row[];
    deleteRow: (index: number) => void;
    fillFieldsOnEdit: (index: number) => void;
    isEdit: number | null;
}

export default function EditTable({ headers, rows, deleteRow, fillFieldsOnEdit, isEdit }: EditTableProps) {

    return (

        <View style={{ flex: 1 }}>
            {/* Sticky Header (always visible) */}
            <View style={styles.tableHeader}>
                {headers.map((header, index) => (
                    <Text style={[styles.headerCell, { flex: header.flex, textAlign: header.textAlign }]} key={index}>
                        {header.label}
                    </Text>
                ))}
            </View>

            {/* Scrollable body */}
            <ScrollView>
                {rows.map((row, rowIndex) => (
                    <TouchableOpacity key={rowIndex} onPress={() => fillFieldsOnEdit(rowIndex)}>
                        <View style={styles.tableRow}>
                            {row.map((cell, cellIndex) => (
                                <Text
                                    key={cellIndex}
                                    style={[
                                        styles.rowCell,
                                        { flex: cell.flex ?? 1, textAlign: cell.textAlign },
                                        isEdit === rowIndex && styles.editingRow,
                                    ]}
                                >
                                    {cell.value}
                                </Text>
                            ))}


                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>

    )
}

const styles = StyleSheet.create({
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        alignItems: "center",

    },
    headerCell: {

        fontWeight: "bold",
        fontSize: 14,
        color: "#222",
        textAlign: "left",
        paddingHorizontal: 14,
        paddingVertical: 14,

        borderColor: "#ececec", // or whatever color you prefer
    },
    tableRow: {
        flexDirection: "row",
        backgroundColor: "#fff",
        alignItems: "center",

    },
    editingRow: {
        backgroundColor: "#e3f1ff",
    },
    rowCell: {
        fontSize: 13,
        color: "#444",

        paddingVertical: 14,
        paddingHorizontal: 14,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#ececec",
    },
});

