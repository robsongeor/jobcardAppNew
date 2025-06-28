import { useState } from "react";
import {
    Platform,
    View,
    KeyboardAvoidingView,
    StyleSheet,
    ScrollView,
} from "react-native";
import uuid from "react-native-uuid";
import { JobActivityType } from "../../types/types";
import SmallTextInput from "./FormInputs/SmallTextInput";
import SmallDateInput from "./FormInputs/SmallDateInput";
import ListInputs from "./FormInputs/ListInputs";
import EditTable, { Row, TableHeader } from "./FormInputs/EditTable";
import { formatDate } from "../helpers/formatters";
import Field from "./FormInputs/Field";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PADDING from "../../constants/padding";
import COLORS from "../../constants/colors";

type ActivitySectionProps = {
    activity: JobActivityType[];
    setActivity: (newActivity: JobActivityType[]) => void;
};

export default function ActivitySection({ activity, setActivity }: ActivitySectionProps) {
    const [date, setDate] = useState(new Date().toISOString());
    const [hours, setHours] = useState("");
    const [kms, setKms] = useState("");
    const [isEdit, setIsEdit] = useState<number | null>(null);
    const insets = useSafeAreaInsets ? useSafeAreaInsets() : { top: 0 };

    const headers: TableHeader[] = [
        { label: "Date", flex: 3, textAlign: "left" },
        { label: "Hours", flex: 1, textAlign: "left" },
        { label: "Mileage", flex: 1, textAlign: "left" }
    ];

    const rows: Row[] = activity.map(activity => [
        { value: formatDate(activity.date), flex: 3, textAlign: "left" },
        { value: activity.hours, flex: 1, textAlign: "left" },
        { value: activity.kms, flex: 1, textAlign: "left" }
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
        setDate(new Date().toISOString());
        setHours("");
        setKms("");
    };

    const deleteActivity = (index: number) => {
        const updated = [...activity];
        updated.splice(index, 1);
        setActivity(updated);

        setIsEdit(null);
        setDate(new Date().toISOString());
        setHours("");
        setKms("");
    };

    const fillFieldsOnEdit = (index: number) => {
        if (isEdit === index) {
            setIsEdit(null);
            setDate(new Date().toISOString());
            setHours("");
            setKms("");
            return;
        }

        const { date, hours, kms } = activity[index];
        setDate(new Date(date).toISOString());
        setHours(hours);
        setKms(kms);
        setIsEdit(index);
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { flex: 1 }]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={64 + insets.top + 59}
        >

            <EditTable
                headers={headers}
                rows={rows}
                deleteRow={deleteActivity}
                fillFieldsOnEdit={fillFieldsOnEdit}
                isEdit={isEdit}
                containerStyle={styles.table}
            />



            <ListInputs isEdit={isEdit} label={"Activity"} addFunction={addActivity} deleteFunction={deleteActivity}>
                <SmallDateInput
                    label="Date"
                    date={date}
                    setDate={setDate}
                />
                <View style={styles.twoColumn}>
                    <SmallTextInput
                        style={{ flex: 1, }}
                        value={hours}
                        onChangeText={setHours}
                        label="Hours"
                        keyboardType="numeric"
                    />
                    <SmallTextInput
                        style={{ flex: 1, }}
                        value={kms}
                        onChangeText={setKms}
                        label="Mileage (km)"
                        keyboardType="numeric"
                    />
                </View>
            </ListInputs>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.background,
    },
    twoColumn: {
        flexDirection: "row",
        gap: 16,
    },

    table: {
        marginHorizontal: PADDING.horizontal,
        backgroundColor: COLORS.background,
    }

})