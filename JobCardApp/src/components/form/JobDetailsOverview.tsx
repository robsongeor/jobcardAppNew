import { StyleSheet, Text, View } from "react-native";
import { Job } from "../../types/types";
import { JobFormData } from "../../hooks/useJobFormData";

type JobDetailsOverviewType = {
    data: JobFormData
}

export default function JobDetailsOverview({ data }: JobDetailsOverviewType) {


    return (
        <>
            {/* Job Info */}
            <Text style={styles.sectionTitle}>Job ID:</Text>
            <Text style={styles.fieldValue}>{data.jobId}</Text>

            <Text style={styles.sectionTitle}>Last Updated:</Text>
            <Text style={styles.fieldValue}>
                {new Date(data.lastUpdated).toLocaleString()}
            </Text>

            {/* Description */}
            <Text style={styles.sectionTitle}>Description</Text>
            {Object.entries(data.description).map(([key, value]) => (
                <Text key={key} style={styles.fieldValue}>
                    {key}: {value === true ? 'Yes' : value === false ? 'No' : String(value)}
                </Text>
            ))}

            {/* Activity */}
            <Text style={styles.sectionTitle}>Activity</Text>
            {data.activity.map((item: any, idx: number) => (
                <View key={item.id || idx} style={styles.itemBlock}>
                    <Text style={styles.fieldValue}>Date: {item.date}</Text>
                    <Text style={styles.fieldValue}>Hours: {item.hours}</Text>
                    <Text style={styles.fieldValue}>KMs: {item.kms}</Text>
                </View>
            ))}

            {/* Parts */}
            <Text style={styles.sectionTitle}>Parts</Text>
            {data.parts.map((item: any, idx: number) => (
                <View key={item.id || idx} style={styles.itemBlock}>
                    <Text style={styles.fieldValue}>Qty: {item.quantityValue}</Text>
                    <Text style={styles.fieldValue}>Description: {item.descValue}</Text>
                </View>
            ))}

        </>
    )
}


const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#fff",
        flex: 1,
        position: "relative"
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 16,
        marginBottom: 4,
        color: "#222",
    },
    fieldValue: {
        marginBottom: 4,
        fontSize: 16,
        color: "#333",
    },
    itemBlock: {
        marginBottom: 8,
        paddingLeft: 12,
        borderLeftWidth: 2,
        borderLeftColor: "#eee",
    },
    submitButton: {
        backgroundColor: "#007aff",
        borderRadius: 8,
        paddingVertical: 14,
        marginTop: 24,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        letterSpacing: 1,
    },
    loadingOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 14,
        color: '#007AFF',
        fontSize: 18,
        fontWeight: 'bold'
    },
    successButton: {
        marginTop: 18,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 32,
        alignItems: 'center',
    },
    successButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },



});
