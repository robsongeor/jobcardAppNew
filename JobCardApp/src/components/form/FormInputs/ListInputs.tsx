import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Label from "./Label"
import SmallTextInput from "./SmallTextInput"
import DateInput from "./DateInput"
import { ReactNode } from "react"
import COLORS from "../../../constants/colors"

type ListInputsProps = {
    isEdit: number | null,
    label: string,
    children: ReactNode
    addFunction: () => void
    deleteFunction: (index: number) => void
}


export default function ListInputs({ label, children, isEdit, addFunction, deleteFunction }: ListInputsProps) {


    return (
        <View style={styles.bottomInputs}>
            {children}


            <View style={styles.buttonContainer} >
                <TouchableOpacity style={[styles.button]} onPress={addFunction}>
                    <Text style={styles.buttonText}>{isEdit !== null ? `Update ${label}` : `Add ${label}`}</Text>
                </TouchableOpacity>

                {isEdit !== null &&
                    <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={() => deleteFunction(isEdit)}>
                        <Text style={styles.buttonText}>Remove</Text>
                    </TouchableOpacity>}
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    bottomInputs: {
        padding: 16,
        backgroundColor: COLORS.background,
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 8,
    },

    button: {
        flex: 1,
        paddingVertical: 12,

        borderRadius: 8,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonRed: {
        backgroundColor: COLORS.error,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },


});
