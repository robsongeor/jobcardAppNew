
import { Button, Text, TouchableOpacity, View } from "react-native";
import { QuantityInputType } from "../../types/types";
import uuid from 'react-native-uuid';
import Field from "./FormInputs/Field";
import QuantityInput from "./FormInputs/QuantityInput";
import { useState } from "react";
import EditTable from "./FormInputs/EditTable";
import ListInputs from "./FormInputs/ListInputs";
import SmallTextInput from "./FormInputs/SmallTextInput";

type PartsSectionProps = {
    parts: QuantityInputType[];
    setParts: (newParts: QuantityInputType[]) => void
}

export default function PartsSection({ parts, setParts }: PartsSectionProps) {
    const [quantity, setQuantity] = useState("");
    const [description, setDescription] = useState("");
    const [isEdit, setIsEdit] = useState<number | null>(null);


    const headers = [
        { label: "Quantity", flex: 1 },
        { label: "Part Description", flex: 3 }
    ]

    const rows = parts.map(part => [
        { value: part.quantityValue, flex: 1 },
        { value: part.descValue, flex: 3 }
    ]);

    const addPart = () => {
        const index = isEdit === null ? parts.length : isEdit;
        const editing = isEdit !== null;

        const data = {
            id: uuid.v4() as string,
            quantityValue: quantity,
            descValue: description,
        };

        const updated = [...parts];
        if (editing) {
            updated.splice(index, 1, data);
        } else {
            updated.push(data);
        }

        setParts(updated);
        setIsEdit(null);
        setQuantity("");
        setDescription("");
    };

    const deletePart = (index: number) => {
        const updated = [...parts];
        updated.splice(index, 1);
        setParts(updated);
    };

    const fillFieldsOnEdit = (index: number) => {
        const { descValue, quantityValue } = parts[index];
        setQuantity(quantityValue);
        setDescription(descValue);
        setIsEdit(index);
    };

    return (
        <View>
            <Field label="Parts">
                <EditTable
                    headers={headers}
                    rows={rows}
                    deleteRow={deletePart}
                    fillFieldsOnEdit={fillFieldsOnEdit}
                    isEdit={isEdit}
                />
            </Field>
            <ListInputs isEdit={isEdit} label={"Part"} addFunction={addPart}>
                <SmallTextInput
                    value={quantity}
                    onChangeText={setQuantity}
                    label="Hours"
                />
                <SmallTextInput
                    value={description}
                    onChangeText={setDescription}
                    label="KMs"
                />
            </ListInputs>
        </View>
    )
}