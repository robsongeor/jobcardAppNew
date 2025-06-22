
import { View } from "react-native";
import { QuantityInputType } from "../../types/types";
import uuid from 'react-native-uuid';
import Field from "./FormInputs/Field";
import { useState } from "react";
import EditTable, { Row, TableHeader } from "./FormInputs/EditTable";
import ListInputs from "./FormInputs/ListInputs";
import SmallTextInput from "./FormInputs/SmallTextInput";
import QuantityInput from "./QuantityInput";

type PartsSectionProps = {
    parts: QuantityInputType[];
    setParts: (newParts: QuantityInputType[]) => void
}

export default function PartsSection({ parts, setParts }: PartsSectionProps) {
    const [quantity, setQuantity] = useState("");
    const [description, setDescription] = useState("");
    const [isEdit, setIsEdit] = useState<number | null>(null);


    const headers: TableHeader[] = [
        { label: "Part Description", flex: 7, textAlign: "left" },
        { label: "Qty", flex: 1, textAlign: "right" },

    ]

    const rows: Row[] = parts.map(part => [
        { value: part.descValue, flex: 7, textAlign: "left" },
        { value: part.quantityValue, flex: 1, textAlign: "right" },

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
        <View style={{ flex: 1 }}>

            <EditTable
                headers={headers}
                rows={rows}
                deleteRow={deletePart}
                fillFieldsOnEdit={fillFieldsOnEdit}
                isEdit={isEdit}
            />

            <ListInputs isEdit={isEdit} label={"Part"} addFunction={addPart} deleteFunction={deletePart}>
                {/* <SmallTextInput
                    value={quantity}
                    onChangeText={setQuantity}
                    label="Quantity"
                /> */}
                <QuantityInput
                    quantity={quantity}
                    setQuantity={setQuantity}
                />
                <SmallTextInput
                    value={description}
                    onChangeText={setDescription}
                    label="Part Description"
                />
            </ListInputs>
        </View>
    )
}