import React, { useState } from "react";
import { View, StyleSheet, TextInput, Text } from "react-native";
import Signature from "react-native-signature-canvas";
import DateInput from "./FormInputs/DateInput";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

export default function SignSection() {
    const [date, setDate] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [isSigning, setIsSigning] = useState(false);

    const handleOK = (signature: string) => {
        console.log("Signature base64:", signature);
    };

    const handleClear = () => {
        console.log("Signature cleared");
    };

    const handleBegin = () => setIsSigning(true);
    const handleEnd = () => setTimeout(() => setIsSigning(false), 300);

    // This gesture swallows horizontal movement to prevent tab swipes
    const blockingGesture = Gesture.Pan()
        .onUpdate(() => { }) // we don’t need to respond — just block
        .minDistance(0); // make it respond immediately

    return (
        <View style={styles.container}>
            <GestureDetector gesture={blockingGesture}>
                <View style={styles.signatureWrapper}>
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
            </GestureDetector>

            {isSigning && <Text> Signing...</Text>}

            <TextInput
                value={customerName}
                onChangeText={setCustomerName}
                placeholder="Customer Name"
            />
            <DateInput date={date} setDate={setDate} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    signatureWrapper: {
        flex: 1,
    },
});
