import { Text, TouchableOpacity, View } from "react-native";
import Signature from "react-native-signature-canvas";

type SignatureModalType = {
    updateField: (key: string, value: string) => void
    setShowSignatureModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SignatureModal({ updateField, setShowSignatureModal }: SignatureModalType) {

    const handleOK = (signature: string) => {
        console.log("Signature base64:", signature);
        updateField("signature", signature)
    };

    const handleClear = () => {
        console.log("Signature cleared");
        updateField("signature", "")
    };

    return (
        <View style={{ flex: 1, backgroundColor: "white", justifyContent: "center" }}>
            <View style={{ flex: 1, margin: 16 }}>
                <Signature
                    onOK={(signature) => {
                        handleOK(signature);
                        setShowSignatureModal(false);
                    }}
                    onClear={handleClear}
                    descriptionText="Sign above"
                    clearText="Clear"
                    confirmText="Save"
                    webStyle={`.m-signature-pad--footer {margin: 0px; justify-content: space-between;}`} />
                <TouchableOpacity
                    onPress={() => setShowSignatureModal(false)}
                    style={{ marginTop: 16, alignSelf: "center" }}>
                    <Text>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>

    )
}