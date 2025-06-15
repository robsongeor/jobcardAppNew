import { useState } from "react";
import {
    Button,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import Field from "./FormInputs/Field";
import DateInput from "./FormInputs/DateInput";
import uuid from "react-native-uuid";
import { JobActivityType } from "../../types/types";
import SmallTextInput from "./FormInputs/SmallTextInput";
import Label from "./FormInputs/Label";

type ActivitySectionProps = {
    activity: JobActivityType[];
    setActivity: (newActivity: JobActivityType[]) => void;
};

export default function ActivitySection({ activity, setActivity }: ActivitySectionProps) {
    const [date, setDate] = useState("");
    const [hours, setHours] = useState("");
    const [kms, setKms] = useState("");
    const [isEdit, setIsEdit] = useState<number | null>(null);

    const addActivity = () => {
        const index = isEdit === null ? activity.length : isEdit;
        const editing = isEdit !== null;

        const data = {
            id: uuid.v4() as string,
            date,
            hours,
            kms,
        };

        const updated = [...activity];
        if (editing) {
            updated.splice(index, 1, data);
        } else {
            updated.push(data);
        }

        setActivity(updated);
        setIsEdit(null);
        setDate("");
        setHours("");
        setKms("");
    };

    const deleteActivity = (index: number) => {
        const updated = [...activity];
        updated.splice(index, 1);
        setActivity(updated);
    };

    const fillFieldsOnEdit = (index: number) => {
        const { date, hours, kms } = activity[index];
        setDate(date);
        setHours(hours);
        setKms(kms);
        setIsEdit(index);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={80}
        >
            <View style={{ flex: 1 }}>
                <Field>
                    {/* Sticky Table Header */}
                    <View style={styles.tableHeader}>
                        <Text style={[styles.headerCell, { flex: 2 }]}>Date</Text>
                        <Text style={styles.headerCell}>Hours</Text>
                        <Text style={styles.headerCell}>KMs</Text>
                        <Text style={[styles.headerCell, { flex: 1.5 }]}>Actions</Text>
                    </View>
                    <ScrollView style={{ maxHeight: 240 }}>
                        {activity.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyText}>No activities yet. Add one below!</Text>
                            </View>
                        ) : (
                            activity.map((a, index) => (
                                <View
                                    key={a.id}
                                    style={[
                                        styles.tableRow,
                                        isEdit === index && styles.editingRow,
                                    ]}
                                >
                                    <Text style={[styles.rowCell, { flex: 2 }]}>
                                        {a.date
                                            ? new Date(a.date).toLocaleDateString("en-NZ", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })
                                            : ""}
                                    </Text>
                                    <Text style={styles.rowCell}>{a.hours}</Text>
                                    <Text style={styles.rowCell}>{a.kms}</Text>
                                    <View style={[styles.rowCell, { flex: 1.5, flexDirection: "row", gap: 8 }]}>
                                        <TouchableOpacity
                                            onPress={() => fillFieldsOnEdit(index)}
                                            style={[styles.iconButton, styles.editButton]}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={styles.iconText}></Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => deleteActivity(index)}
                                            style={[styles.iconButton, styles.deleteButton]}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={styles.iconText}></Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))
                        )}
                    </ScrollView>
                </Field>

                {/* Fixed input area at the bottom */}
                <View style={styles.bottomInputs}>
                    <View style={styles.inputRowVertical}>
                        <Label label="Date" />
                        <DateInput date={date} setDate={setDate} />
                    </View>
                    <SmallTextInput
                        value={hours}
                        onChangeText={setHours}
                        label="Hours"
                    />
                    <SmallTextInput
                        value={kms}
                        onChangeText={setKms}
                        label="KMs"
                    />
                    <Button
                        title={isEdit !== null ? "Update Activity" : "Add Activity"}
                        onPress={addActivity}
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingVertical: 6,
        paddingHorizontal: 4,
        marginBottom: 2,
    },
    headerCell: {
        flex: 1,
        fontWeight: "bold",
        fontSize: 14,
        color: "#222",
        textAlign: "left",
    },
    tableRow: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderColor: "#ececec",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    editingRow: {
        backgroundColor: "#e3f1ff",
    },
    rowCell: {
        flex: 1,
        fontSize: 13,
        color: "#444",
        textAlign: "left",
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
    bottomInputs: {
        padding: 16,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#eee",
    },
    inputRowVertical: {
        marginBottom: 12,
    },
});
