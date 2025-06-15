import { useState } from "react";
import {
    Button,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Field from "./FormInputs/Field";
import DateInput from "./FormInputs/DateInput";
import uuid from "react-native-uuid";
import { JobActivityType } from "../../types/types";

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
        <Field label="Activity">

            {activity.map((a, index) => (
                <View key={a.id} style={styles.activityCard}>
                    <View style={styles.activityRow}>
                        <View style={styles.activityTextBlock}>
                            <Text style={styles.value}>
                                {new Date(a.date).toLocaleDateString("en-NZ", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </Text>
                            <Text style={styles.value}>{a.hours} hrs</Text>
                            <Text style={styles.value}>{a.kms} km</Text>
                        </View>

                        <View style={styles.iconButtonRow}>
                            <TouchableOpacity
                                onPress={() => fillFieldsOnEdit(index)}
                                style={[styles.iconButton, styles.editButton]}
                            >
                                <Text style={styles.iconText}>✏️</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => deleteActivity(index)}
                                style={[styles.iconButton, styles.deleteButton]}
                            >
                                <Text style={styles.iconText}>🗑️</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ))}

            <View style={styles.inputRow}>
                <DateInput date={date} setDate={setDate} />
                <TextInput
                    value={hours}
                    onChangeText={setHours}
                    keyboardType="numeric"
                    placeholder="hours"
                    style={styles.quantityInput}
                />
                <TextInput
                    value={kms}
                    onChangeText={setKms}
                    keyboardType="numeric"
                    placeholder="kms"
                    style={styles.quantityInput}
                />
            </View>

            <Button title="Add Activity" onPress={addActivity} />
        </Field>

    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fefefe",
        padding: 14,
        marginHorizontal: 12,
        marginVertical: 6,
        borderRadius: 14,
        borderWidth: 0,
        shadowColor: "#999",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 1,
    },

    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        width: "100%",
    },

    quantityInput: {
        flex: 1,
        minWidth: 60,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 10,
    },

    activityCard: {
        backgroundColor: "#fefefe",
        padding: 12,
        marginBottom: 12,
        borderRadius: 12,
        shadowColor: "#999",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 1,
    },

    activityRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    activityTextBlock: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },

    value: {
        fontSize: 13,
        color: "#444",
        marginRight: 12,
    },

    iconButtonRow: {
        flexDirection: "row",
        gap: 8,
    },

    iconButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
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
});
