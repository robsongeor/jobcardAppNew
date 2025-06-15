

import { Text, View } from "react-native";
import Field from "./FormInputs/Field";
import SmallTextInput from "./FormInputs/SmallTextInput";
import { JobDescriptionType } from "../../types/types";


type DescriptionSectionProps = {
    description: JobDescriptionType;
    setDescription: React.Dispatch<React.SetStateAction<JobDescriptionType>>;
}

export default function DescriptionSection({ description, setDescription }: DescriptionSectionProps) {


    const updateField = (name: string, value: string) => {
        const updated = {
            ...description,
            [name]: value
        }

        setDescription(updated)
    }

    return (
        <View>
            <Field label="Hours">
                <SmallTextInput
                    label="Order Number"
                    value={description.orderNo}
                    onChangeText={(value) => updateField("orderNo", value)}
                />
                <SmallTextInput
                    // multiline
                    label="Hours"
                    value={description.hours}
                    onChangeText={(value) => updateField("hours", value)}
                />
                <SmallTextInput
                    multiline
                    label="Report"
                    value={description.report}
                    onChangeText={(value) => updateField("report", value)}
                />

                <Text> {description.report}</Text>
            </Field>
        </View>

    )
}