import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Signature from "react-native-signature-canvas";
import DateInput from "./FormInputs/DateInput";
import Field from "./FormInputs/Field";
import SmallTextInput from "./FormInputs/SmallTextInput";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Label from "./FormInputs/Label";

type SignSectionProps = {
    setIsSigning: (value: boolean) => void;
}

export default function SignSection({ setIsSigning }: SignSectionProps) {
    const [date, setDate] = useState("");
    const [customerName, setCustomerName] = useState("");


    const handleOK = (signature: string) => {
        console.log("Signature base64:", signature);
    };

    const handleClear = () => {
        console.log("Signature cleared");
    };

    const handleBegin = () => setIsSigning(true);
    const handleEnd = () => setTimeout(() => setIsSigning(false), 300);

    const blockingGesture = Gesture.Pan()
        .onUpdate(() => { })
        .minDistance(0);

    return (
        <Field>
            <Text style={styles.label}>Customer Signature</Text>

            <View style={styles.signatureBox}>
                <Signature
                    onOK={handleOK}
                    onClear={handleClear}
                    onBegin={handleBegin}
                    onEnd={handleEnd}
                    descriptionText="Sign above"
                    clearText="Clear"
                    confirmText="Save"
                    webStyle={`.m-signature-pad--footer { display: none; margin: 0px; }`}
                />
            </View>


            <SmallTextInput
                label="Customer Name"
                value={customerName}
                onChangeText={setCustomerName}
            />

            <View style={styles.dateInputGroup}>
                <Label label="date" />
                <DateInput date={date} setDate={setDate} />
            </View>
        </Field>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 6,
        marginLeft: 4,
    },
    signatureBox: {
        height: 250,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 16,
    },
    dateInputGroup: {
        marginTop: 12,
    },
});
