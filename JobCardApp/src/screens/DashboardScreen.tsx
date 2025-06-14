import { Button, Text, View } from "react-native";
import { storage } from "../storage/storage";
import auth from '@react-native-firebase/auth';

export default function DashboardScreen() {

    // Inside your component function:
    const handleSignOut = async () => {
        try {
            await auth().signOut();
            console.log('Signed out');
            // Optionally, navigate back to login screen
        } catch (error) {
            console.error('Sign-out error:', error);
        }
    };

    return (
        <View>
            <Text>
                Dashboard {storage.getString('user')}
                <Button title="Sign Out" onPress={handleSignOut} />
            </Text>

        </View>
    )
}