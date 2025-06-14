import { useEffect, useState } from "react";
import { Alert, Button, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput } from "react-native";
import auth from "@react-native-firebase/auth";
import firebase from "@react-native-firebase/app";



export default function LoginScreen() {
    console.log("👀 LoginScreen render");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        try {
            const opts = firebase.app().options;
            console.log("🔎 Firebase options:", opts);
            if (!opts || Object.keys(opts).length === 0) {
                console.warn("⚠️ Firebase options look empty — native config might not be loading.");
            }
        } catch (e) {
            console.error("🔥 Error reading firebase.app().options", e);
        }
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            return Alert.alert("Error", "Email and password are required.");
        }
        try {
            const userCred = await auth().signInWithEmailAndPassword(email, password);
            console.log("✅ Logged in:", userCred.user.uid);

        } catch (err: any) {
            console.error(err);
            Alert.alert("Login failed", err.message || "Unknown error");
        }
    };
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.select({ ios: "padding", android: undefined })}
        >
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                textContentType="emailAddress"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                textContentType="password"
            />
            <Button title="Log In" onPress={handleLogin} />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 16,
    },
    title: {
        fontSize: 28,
        marginBottom: 24,
        textAlign: "center",
    },
    input: {
        height: 48,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 12,
    },
});