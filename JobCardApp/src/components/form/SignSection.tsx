import React, { useState } from "react";
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DateInput from "./FormInputs/DateInput";
import Field from "./FormInputs/Field";
import SmallTextInput from "./FormInputs/SmallTextInput";
import Label from "./FormInputs/Label";
import { SignInputsType } from "../../types/types";
import SignatureModal from "./SignatureModal";
import COLORS from "../../constants/colors";

type SignSectionProps = {
    signed: SignInputsType;
    setSignatures: React.Dispatch<React.SetStateAction<SignInputsType>>;
}

export default function SignSection({ signed, setSignatures }: SignSectionProps) {
    const [showSignatureModal, setShowSignatureModal] = useState(false);

    const updateField = (name: string, value: string | boolean) => {
        const updated = {
            ...signed,
            [name]: value
        }
        setSignatures(updated)
    }

    return (
        <Field>
            <Text style={styles.label}>Customer Signature</Text>

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

            <Modal
                visible={showSignatureModal}
                animationType="slide"
                onRequestClose={() => setShowSignatureModal(false)}>

                <SignatureModal
                    updateField={updateField}
                    setShowSignatureModal={setShowSignatureModal}
                />

            </Modal>

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
        backgroundColor: COLORS.white,
    },
    dateInputGroup: {
        marginTop: 12,
    },
});
