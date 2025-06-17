import { Button, StyleSheet, View } from "react-native"
import Label from "./Label"
import SmallTextInput from "./SmallTextInput"
import DateInput from "./DateInput"
import { ReactNode } from "react"

type ListInputsProps = {
    isEdit: number | null,
    label: string,
    children: ReactNode
    addFunction: () => void
}


export default function ListInputs({ label, children, isEdit, addFunction }: ListInputsProps) {


    return (
        <View style={styles.bottomInputs}>
            {children}
            <Button
                title={isEdit !== null ? `Update ${label}` : `Add ${label}`}
                onPress={addFunction}
            />
        </View>
    )
}

const styles = StyleSheet.create({

    bottomInputs: {
        padding: 16,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#eee",
    },

});
