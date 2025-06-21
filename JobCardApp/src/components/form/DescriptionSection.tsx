

import { StyleSheet, Text, View } from "react-native";
import Field from "./FormInputs/Field";
import SmallTextInput from "./FormInputs/SmallTextInput";
import { JobDescriptionType } from "../../types/types";
import SmallCheckBoxInput from "./FormInputs/SmallCheckBoxInput";




type DescriptionSectionProps = {
    description: JobDescriptionType;
    setDescription: React.Dispatch<React.SetStateAction<JobDescriptionType>>;
}

export default function DescriptionSection({ description, setDescription }: DescriptionSectionProps) {

    const updateField = (name: string, value: string | boolean) => {
        const updated = {
            ...description,
            [name]: value
        }

        setDescription(updated)
    }

    return (

        <Field>

            <SmallCheckBoxInput
                label="Chargeable"
                inputPlaceholder="reason (damage, customer unit, etc)"
                checkBoxValue={description.chargeable}
                onCheckBoxChange={(value) => updateField("chargeable", value)}
                value={description.chargeableComment}
                onChangeText={(value) => updateField("chargeableComment", value)}
            />
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

