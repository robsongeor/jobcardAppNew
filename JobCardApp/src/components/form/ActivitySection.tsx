

import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import Field from "./FormInputs/Field";
import DateInput from "./FormInputs/DateInput";
import uuid from 'react-native-uuid';
import { JobActivityType } from "../../types/types";



type ActivitySectionProps = {
    activity: JobActivityType[];
    setActivity: (newActivity: JobActivityType[]) => void;
};

export default function ActivitySection({ activity, setActivity, }: ActivitySectionProps) {
    const [date, setDate] = useState("");
    const [hours, setHours] = useState("");
    const [kms, setKms] = useState("");
    const [isEdit, setIsEdit] = useState<number | null>(null);

    const addActivity = () => {
        // if null push, else edit index
        const index = isEdit === null ? activity.length : isEdit
        const editting = isEdit !== null;

        const data = {
            id: uuid.v4() as string,
            date,
            hours,
            kms
        }

        //Clear fields
        setDate("");
        setHours("");
        setKms("");

        const newArr = [...activity];

        if (editting) {
            newArr.splice(index, 1, data)
        } else {
            newArr.push(data)
        }


        setActivity(newArr);
        setIsEdit(null);

        console.log(newArr)
    }

    const deleteActivity = (index: number) => {
        const newArr = [...activity];
        newArr.splice(index, 1);

        setActivity(newArr)
    }

    const fillFieldsOnEdit = (index: number) => {
        const { date, hours, kms } = activity[index]
        setDate(date);
        setHours(hours);
        setKms(kms);

        setIsEdit(index)
    }

    return (
        <Field label="Activity">

            {activity.map((a, index) => (
                <View
                    key={a.id}
                    style={styles.container}>
                    <Text>{index}</Text>
                    <Text> {a.date} </Text>
                    <Text> {a.hours} </Text>
                    <Text> {a.kms} </Text>
                    <Button title="edit" onPress={() => fillFieldsOnEdit(index)} />
                    <Button title="delete" onPress={() => deleteActivity(index)} />
                </View>
            ))}

            <View
                key={"activity-date-key"}
                style={styles.container}>
                <DateInput
                    style={styles.quantityInput}
                    date={date}
                    setDate={setDate}
                />
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
    container: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        width: "100%"
    },

    quantityInput: {
        //width: 60,
        flex: 1,
        minWidth: 60,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 10,
    },

});
