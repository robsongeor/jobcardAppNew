import React, { useState } from "react";
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Signature from "react-native-signature-canvas";
import DateInput from "./FormInputs/DateInput";
import Field from "./FormInputs/Field";
import SmallTextInput from "./FormInputs/SmallTextInput";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Label from "./FormInputs/Label";
import { SignInputsType } from "../../types/types";

type SignSectionProps = {
    setIsSigning: (value: boolean) => void;
    signed: SignInputsType;
    setSignatures: React.Dispatch<React.SetStateAction<SignInputsType>>;
}

export default function SignSection({ setIsSigning, signed, setSignatures }: SignSectionProps) {

    const [showSignatureModal, setShowSignatureModal] = useState(false);


    const updateField = (name: string, value: string | boolean) => {
        const updated = {
            ...signed,
            [name]: value
        }
        console.log(updated)
        setSignatures(updated)

        //1console.log(signatures)
    }


    const handleOK = (signature: string) => {
        console.log("Signature base64:", signature);
        updateField("signature", signature)
    };

    const handleClear = () => {
        console.log("Signature cleared");
        updateField("signature", "")
    };

    const handleBegin = () => setIsSigning(true);
    const handleEnd = () => setTimeout(() => setIsSigning(false), 300);


    return (
        <Field>
            <Text style={styles.label}>Customer Signature</Text>





            <Modal
                visible={showSignatureModal}
                animationType="slide"
                onRequestClose={() => setShowSignatureModal(false)}
            >
                <View style={{ flex: 1, backgroundColor: "white", justifyContent: "center" }}>
                    <View style={{ flex: 1, margin: 16 }}>
                        <Signature
                            onOK={(signature) => {
                                handleOK(signature);
                                setShowSignatureModal(false);
                            }}
                            onClear={handleClear}
                            onBegin={handleBegin}
                            onEnd={handleEnd}
                            descriptionText="Sign above"
                            clearText="Clear"
                            confirmText="Save"
                            webStyle={`
  .m-signature-pad--footer {
    margin: 0px;
    justify-content: space-between;
  }
`} />
                        <TouchableOpacity
                            onPress={() => setShowSignatureModal(false)}
                            style={{ marginTop: 16, alignSelf: "center" }}
                        >
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>



            <TouchableOpacity onPress={() => setShowSignatureModal(true)}>
                <View style={styles.signatureBox}>

                    {signed.signature ? (
                        <Image
                            source={{ uri: signed.signature }}
                            style={{ width: "100%", height: 200, resizeMode: "contain" }}
                        />
                    ) : null}
                </View>

            </TouchableOpacity>



            <SmallTextInput
                label="Customer Name"
                value={signed.clientName ?? ""}
                onChangeText={(value) => updateField("clientName", value)}
            />

            <View style={styles.dateInputGroup}>
                <Label label="date" />
                <DateInput date={signed.clientDate} setDate={(value) => updateField("clientDate", value)} />
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
