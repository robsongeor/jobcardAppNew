import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type TableHeader = {
    label: string;
    flex?: number;
};

type RowCell = {
    value: string;
    flex?: number
}

type Row = RowCell[];

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
                    <Text style={[styles.headerCell, { flex: header.flex }]} key={index}>
                        {header.label}
                    </Text>
                ))}
                <Text style={[styles.headerCell, { flex: 1.5 }]}>Actions</Text>
            </View>

            {/* Scrollable body */}
            <ScrollView>
                {rows.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.tableRow}>
                        {row.map((cell, cellIndex) => (
                            <Text
                                key={cellIndex}
                                style={[
                                    styles.rowCell,
                                    { flex: cell.flex ?? 1 },
                                    isEdit === rowIndex && styles.editingRow,
                                ]}
                            >
                                {cell.value}
                            </Text>
                        ))}

                        <View
                            style={[
                                styles.rowCell,
                                { flex: 1.5, flexDirection: "row", gap: 8 },
                            ]}
                        >
                            <TouchableOpacity
                                onPress={() => fillFieldsOnEdit(rowIndex)}
                                style={[styles.iconButton, styles.editButton]}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.iconText}>✏️</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => deleteRow(rowIndex)}
                                style={[styles.iconButton, styles.deleteButton]}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.iconText}>🗑️</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>

    )
}

const styles = StyleSheet.create({
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        paddingVertical: 14,

    },
    headerCell: {
        flex: 1,
        fontWeight: "bold",
        fontSize: 14,
        color: "#222",
        textAlign: "left",
        paddingHorizontal: 14,
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

        flex: 1,
        fontSize: 13,
        color: "#444",
        textAlign: "left",
        paddingVertical: 8,
        paddingHorizontal: 4,

        borderWidth: 1,
        borderColor: "#ececec",
        height: "100%",
        textAlignVertical: "center"

    },
    iconButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 6,
    },
    editButton: {
        backgroundColor: "#007AFF",
    },
    deleteButton: {
        backgroundColor: "#FF3B30",
    },
    iconText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    emptyState: {
        padding: 32,
        alignItems: "center",
    },
    emptyText: {
        color: "#888",
        fontSize: 15,
        fontStyle: "italic",
    },
});
