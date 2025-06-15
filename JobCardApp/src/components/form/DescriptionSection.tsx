

import { StyleSheet, Text, View } from "react-native";
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

        <Field>
            <SmallTextInput
                label="Order Number"
                value={description.orderNo}
                onChangeText={(value) => updateField("orderNo", value)}
            />
            <SmallTextInput
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
        </Field>


    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fefefe",
        padding: 14,
        marginHorizontal: 12,
        marginVertical: 6,
        borderRadius: 14,
        borderWidth: 0,
        shadowColor: "#999",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 1,
    },
});
