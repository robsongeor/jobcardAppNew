import { Text, View } from "react-native"


type AddressCardProps = {
    street: string,
    town: string,
    city: string
}

export default function AddressCard({ street, town, city }: AddressCardProps) {
    function isEmpty(): boolean {
        return street.trim().length === 0
    }

    return (
        <View>
            <Text>Selected Address</Text>

            {isEmpty() ?
                <Text>No address selected</Text>
                :
                <>
                    <Text>{street}</Text>
                    <Text>{town}</Text>
                    <Text>{city}</Text>
                </>
            }

        </View>

    )
}