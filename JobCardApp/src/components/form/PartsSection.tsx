
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { QuantityInputType } from "../../types/types";
import uuid from 'react-native-uuid';
import Field from "./FormInputs/Field";
import { useState } from "react";
import EditTable, { Row, TableHeader } from "./FormInputs/EditTable";
import ListInputs from "./FormInputs/ListInputs";
import SmallTextInput from "./FormInputs/SmallTextInput";
import QuantityInput from "./QuantityInput";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import COLORS from "../../constants/colors";
import PADDING from "../../constants/padding";

type PartsSectionProps = {
    parts: QuantityInputType[];
    setParts: (newParts: QuantityInputType[]) => void
}

export default function PartsSection({ parts, setParts }: PartsSectionProps) {
    const [quantity, setQuantity] = useState("");
    const [description, setDescription] = useState("");
    const [isEdit, setIsEdit] = useState<number | null>(null);
    const insets = useSafeAreaInsets ? useSafeAreaInsets() : { top: 0 };



    const headers: TableHeader[] = [
        { label: "Part Description", flex: 7, textAlign: "left" },
        { label: "Qty", flex: 1, textAlign: "left" },

    ]

    const rows: Row[] = parts.map(part => [
        { value: part.descValue, flex: 7, textAlign: "left" },
        { value: part.quantityValue, flex: 1, textAlign: "left" },

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
        <KeyboardAvoidingView
            style={[styles.container, { flex: 1 }]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={64 + insets.top + 59}
        >

            <EditTable
                headers={headers}
                rows={rows}
                deleteRow={deletePart}
                fillFieldsOnEdit={fillFieldsOnEdit}
                isEdit={isEdit}
                containerStyle={styles.table}
            />

            <ListInputs isEdit={isEdit} label={"Part"} addFunction={addPart} deleteFunction={deletePart}>
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
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.background,
    },

    table: {
        marginHorizontal: PADDING.horizontal,
        backgroundColor: COLORS.background,
    }

})