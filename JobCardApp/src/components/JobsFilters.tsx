import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TabType } from "../types/types";
import PADDING from "../constants/padding";
import COLORS from "../constants/colors";

type JobsFiltersType = {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;

}

export default function JobsFilters({ activeTab, setActiveTab }: JobsFiltersType) {

    return (
        <View style={styles.container}>
            <TouchableOpacity style={[styles.button, activeTab === 'all' && styles.buttonOn]} onPress={() => setActiveTab('all')}>
                <Text style={[styles.buttonText, activeTab === 'all' && styles.buttonTextOn]}>All</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, activeTab === 'assigned' && styles.buttonOn]} onPress={() => setActiveTab("assigned")}>
                <Text style={[styles.buttonText, activeTab === 'assigned' && styles.buttonTextOn]}>Assigned</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, activeTab === 'submitted' && styles.buttonOn]} onPress={() => setActiveTab("submitted")}>
                <Text style={[styles.buttonText, activeTab === 'submitted' && styles.buttonTextOn]}>Submitted</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, activeTab === 'overdue' && styles.buttonOn]} onPress={() => setActiveTab("overdue")}>
                <Text style={[styles.buttonText, activeTab === 'overdue' && styles.buttonTextOn]}>Overdue</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: COLORS.white,
        borderColor: COLORS.white,
        borderWidth: 3,
        borderRadius: 8,
        marginBottom: 20,
        alignSelf: 'flex-start'
    },
    button: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        paddingHorizontal: 14,
        paddingVertical: 6,
    },
    buttonOn: {
        backgroundColor: COLORS.background,
    },
    buttonText: {
        fontSize: 13,
        color: "#999",
        fontWeight: "bold",
    },
    buttonTextOn: {
        color: COLORS.offBlack,
        fontWeight: "bold",
    }
});
