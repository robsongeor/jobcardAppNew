

import { ScrollView, StyleSheet, Text, View } from "react-native";
import Field from "./FormInputs/Field";
import SmallTextInput from "./FormInputs/SmallTextInput";
import { Job, JobDescriptionType } from "../../types/types";
import SmallCheckBoxInput from "./FormInputs/SmallCheckBoxInput";
import JobOverviewCard from "../JobOverviewCard";
import PADDING from "../../constants/padding";
import COLORS from "../../constants/colors";




type DescriptionSectionProps = {
    description: JobDescriptionType;
    setDescription: React.Dispatch<React.SetStateAction<JobDescriptionType>>;
    job: Job
}

export default function DescriptionSection({ description, setDescription, job }: DescriptionSectionProps) {

    const updateField = (name: string, value: string | boolean) => {
        const updated = {
            ...description,
            [name]: value
        }

        setDescription(updated)
    }

    return (
        <ScrollView style={styles.container}>

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
                    keyboardType="numeric"
                />
                <SmallTextInput
                    label="Hours"
                    value={description.hours}
                    onChangeText={(value) => updateField("hours", value)}
                    required
                />
                <SmallTextInput
                    multiline
                    label="Report"
                    value={description.report}
                    onChangeText={(value) => updateField("report", value)}
                    required
                />
            </Field>

        </ScrollView>
    )
}


const styles = StyleSheet.create({

    container: {
        flex: 1,

        backgroundColor: COLORS.background
    },
})