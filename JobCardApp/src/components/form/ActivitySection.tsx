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
import SmallDateInput from "./FormInputs/SmallDateInput";
import ListInputs from "./FormInputs/ListInputs";
import EditTable from "./FormInputs/EditTable";
import { formatDate } from "../helpers/formatters";

type ActivitySectionProps = {
    activity: JobActivityType[];
    setActivity: (newActivity: JobActivityType[]) => void;
};

export default function ActivitySection({ activity, setActivity }: ActivitySectionProps) {
    const [date, setDate] = useState("");
    const [hours, setHours] = useState("");
    const [kms, setKms] = useState("");
    const [isEdit, setIsEdit] = useState<number | null>(null);

    const headers = [
        { label: "Date", flex: 2 },
        { label: "Hours", flex: 1 },
        { label: "Mileage", flex: 1 }
    ]

    const rows = activity.map(activity => [
        { value: formatDate(activity.date), flex: 2 },
        { value: activity.hours, flex: 1 },
        { value: activity.kms, flex: 1 }
    ]);

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
            <Field scrollView={false}>
                <EditTable
                    headers={headers}
                    rows={rows}
                    deleteRow={deleteActivity}
                    fillFieldsOnEdit={fillFieldsOnEdit}
                    isEdit={isEdit}
                />
            </Field>

            <ListInputs isEdit={isEdit} label={"Activity"} addFunction={addActivity}>
                <SmallDateInput
                    label="Date"
                    date={date}
                    setDate={setDate}
                />
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
            </ListInputs>

            {/* Fixed input area at the bottom */}


        </KeyboardAvoidingView >
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

    inputRowVertical: {
        marginBottom: 12,
    },
});
