import { ScrollView, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import COLORS from "../../../constants/colors";

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
    containerStyle?: StyleProp<ViewStyle>;
}

export default function EditTable({ headers, rows, deleteRow, fillFieldsOnEdit, isEdit, containerStyle }: EditTableProps) {

    const borders = (index: number) => {
        if (index + 1 < headers.length) {
            return styles.borderRight;
        }
    }

    return (

        <View style={[containerStyle, { flex: 1 }]}>
            {/* Sticky Header (always visible) */}
            <View style={styles.tableHeader}>
                {headers.map((header, index) => (
                    <Text style={[styles.headerCell, { flex: header.flex, textAlign: header.textAlign }, borders(index)]} key={index}>
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
        backgroundColor: COLORS.white,
        alignItems: "center",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.white
    },
    headerCell: {
        fontWeight: "500",
        fontSize: 13,
        color: "#666",
        textAlign: "left",
        paddingHorizontal: 14,
        paddingVertical: 8,


    },
    tableRow: {
        flexDirection: "row",
        //backgroundColor: "#fff",
        alignItems: "center",

    },
    editingRow: {
        //backgroundColor: "#e3f1ff",
        color: COLORS.primary
    },
    rowCell: {
        fontSize: 13,
        color: "#444",
        fontWeight: "500",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#dfdfdf"

    },

    borderRight: {
        // borderRightWidth: 1,
    }
});

