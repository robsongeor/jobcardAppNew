
import { Button, Text, TouchableOpacity, View } from "react-native";
import { QuantityInputType } from "../../types/types";
import uuid from 'react-native-uuid';
import Field from "./FormInputs/Field";
import QuantityInput from "./FormInputs/QuantityInput";



type PartsSectionProps = {
    parts: QuantityInputType[];
    setParts: (newParts: QuantityInputType[]) => void
}

export default function PartsSection({ parts, setParts }: PartsSectionProps) {

    // Add Parts Field
    const addPartField = () => {
        const id = uuid.v4() as string
        setParts([...parts, { id: id, descValue: '', quantityValue: '' }]);
    };

    const updatePart = (index: number, key: 'descValue' | 'quantityValue', value: string) => {
        const newParts = [...parts];
        newParts[index][key] = value;
        setParts(newParts);
    };

    const removeField = (id: string) => {
        const newParts = parts.filter((part) => part.id !== id);
        setParts(newParts);
    };
    return (
        <Field label="Parts">
            {parts.map((part, index) => (
                <View
                    key={part.id}
                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
                >
                    <View style={{ flex: 1 }}>
                        <QuantityInput
                            descValue={part.descValue}
                            setDescValue={(value) => updatePart(index, 'descValue', value)}
                            quantityValue={part.quantityValue}
                            setQuantityValue={(value) => updatePart(index, 'quantityValue', value)}
                        />
                    </View>

                    {index !== 0 && (
                        <TouchableOpacity
                            onPress={() => removeField(part.id)}
                            style={{
                                marginLeft: 8,
                                backgroundColor: '#e74c3c',
                                paddingVertical: 8,
                                paddingHorizontal: 12,
                                borderRadius: 6,
                            }}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ))}

            <Button title="Add Part" onPress={addPartField} />
        </Field>
    )
}