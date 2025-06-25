import { BlurView } from "@react-native-community/blur";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";

type SubmitModalType = {
    loading: boolean;
    showSuccess: boolean;
    showError: boolean;
    closeModal: () => void;
    errorMsg: string
}

export default function SubmitModal({ loading, showSuccess, showError, closeModal, errorMsg }: SubmitModalType) {
    return (
        <BlurView
            style={styles.loadingOverlay}
            blurType="light"
            blurAmount={5}
            reducedTransparencyFallbackColor="white"
        >
            {loading && (
                <>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Submitting...</Text>
                </>
            )}

            {showSuccess && (
                <TouchableOpacity onPress={closeModal} style={styles.loadingOverlay}>
                    <Icon name="check-circle" size={48} color="#4BB543" />
                    <Text style={styles.loadingText}>Submitted Successfully!</Text>
                </TouchableOpacity>
            )}

            {showError && (
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity onPress={closeModal} style={styles.loadingOverlay}>
                        <Icon name="x-circle" size={48} color="#D7263D" />
                        <Text style={styles.errorText}>Submission Failed!</Text>
                        <Text style={styles.errorText}>{errorMsg}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </BlurView>
    );
}

const styles = StyleSheet.create({
    loadingOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 255, 255, 0.0)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 14,
        color: '#007AFF',
        fontSize: 18,
        fontWeight: 'bold'
    },
    errorText: {
        marginTop: 14,
        color: '#D7263D',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
});
