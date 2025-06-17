
import { SmallInputStyles } from "./SmallTextInput";
import Label from "./Label";
import DateInput from "./DateInput";
import { View } from "react-native";

type SmallDateInputProps = {
    label: string;
    date: string;
    setDate: (value: string) => void;
};

export default function SmallDateInput({
    label,
    date,
    setDate,
}: SmallDateInputProps) {
    return (
        <View style={SmallInputStyles.inputBlock}>
            <Label
                label={label}
            />
            <DateInput date={date} setDate={setDate} />
        </View>
    );
}