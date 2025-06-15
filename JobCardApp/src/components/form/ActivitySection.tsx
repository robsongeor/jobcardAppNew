import { useState } from "react";
import {
    Button,
    StyleSheet,
    Text,
    TextInput,
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
                <ScrollView >
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
                    </Field>
                </ScrollView>

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

                    <Button title={isEdit !== null ? "Update Activity" : "Add Activity"} onPress={addActivity} />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    // ... keep your previous styles
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

    // NEW styles for the input area at the bottom:
    bottomInputs: {
        padding: 16,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#eee",
    },
    inputRowVertical: {
        marginBottom: 12,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 4,
        marginLeft: 2,
    },
    quantityInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 10,
        fontSize: 16,
        backgroundColor: "#fafafa",
    },
});
