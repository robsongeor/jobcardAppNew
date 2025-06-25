import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AssignJobStackParamList } from "../../navigation/AssignJobStack";
import Title from "../../components/text/Title";
import PADDING from "../../constants/padding";
import SubTitle from "../../components/text/SubTitle";
import COLORS from "../../constants/colors";
import BottomRightButton from "../../components/form/Buttons/BottomRightButton";
import SubHeading from "./components/SubHeading";
import Config from "react-native-config";
import { getStoredUserField } from "../../storage/storage";
import { assignJobToUser, createNewJob, getJobFromJobNumber } from "../../firebase";

type Props = NativeStackScreenProps<AssignJobStackParamList, 'JobOverview'>;

export default function JobOverviewScreen({ route, navigation }: Props) {

    if (!route.params?.job) {
        navigation.goBack();
        return null;
    }

    const { job } = route.params;

    function getStaticMapUrl(lat: number, lng: number) {
        return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x300&markers=color:red|${lat},${lng}&key=${Config.GOOGLE_MAPS_API_KEY}`;
    }

    const mapUrl = getStaticMapUrl(job.coords.latitude, job.coords.longitude);

    const handleAssign = async () => {

        const uid = getStoredUserField('uid');
        if (!uid) return;

        try {
            // If job doesn't exist, create it
            const jobExists = await getJobFromJobNumber(job.job)
            if (jobExists === null) {
                let updatedJob = {
                    ...job,
                    assignedTo: Array.from(new Set([...(job.assignedTo || []), uid])),
                    assignedDate: { ...(job.assignedDate || {}), [uid]: new Date().toISOString() },
                    assignedStatus: { ...(job.assignedStatus || {}), [uid]: "assigned" }
                };

                await createNewJob(updatedJob);
            } else {

                await assignJobToUser(jobExists.id, uid);
            }
        } catch (error) {
            // Show error message to user (toast, modal, etc.)
            console.error("Assignment failed:", error);
        }
    };


    return (
        <View style={styles.screen}>

            <View style={styles.container}>
                {/* TITLE */}
                <View style={{ flexDirection: "row" }}>
                    <Title style={{ fontWeight: "300" }}>Job </Title>
                    <Title>{job.job}</Title>
                </View>

                {/* CARD */}
                <View style={styles.card}>
                    <SubTitle>{job.customerName}</SubTitle>

                    {/* Address */}
                    <View style={styles.detailsCard}>
                        <SubHeading>ADDRESS</SubHeading>
                        <View style={styles.details}>
                            <Text style={styles.address}>
                                {job.customerAddress}
                            </Text>
                        </View>
                        <View style={styles.details}>
                            <Text style={styles.leftDetail}>
                                {`${job.customerAddressSuburb}, ${job.customerAddressTown}`}
                            </Text>
                        </View>
                    </View>

                    {/* MAP */}
                    <View style={styles.map}>
                        <Image
                            style={{ width: "100%", height: 120, borderRadius: 12 }}
                            source={{ uri: mapUrl }}
                            resizeMode="cover"
                        />
                    </View>

                    {/* DETAILS */}
                    <View style={styles.detailsCard}>
                        <SubHeading>MACHINE DETAILS</SubHeading>
                        <View style={styles.details}>
                            <Text style={styles.leftDetail}>Fleet number</Text>
                            <Text style={styles.rightDetail}>{job.fleet.toUpperCase()}</Text>
                        </View>
                        <View style={styles.details}>
                            <Text style={styles.leftDetail}>Make</Text>
                            <Text style={styles.rightDetail}>{job.machine.make}</Text>
                        </View>
                        <View style={styles.details}>
                            <Text style={styles.leftDetail}>Model</Text>
                            <Text style={styles.rightDetail}>{job.machine.model}</Text>
                        </View>
                        <View style={styles.details}>
                            <Text style={styles.leftDetail}>Serial</Text>
                            <Text style={styles.rightDetail}>{job.machine.serialNumber}</Text>
                        </View>

                        <View style={styles.cardSection}>
                            <SubHeading>JOB DESCRIPTION</SubHeading>
                            <Text style={styles.leftDetail}>
                                {job.description}
                            </Text>
                        </View>
                    </View>
                </View>

            </View>
            <BottomRightButton
                disabled={!job.description}
                label="Assign"
                onPress={handleAssign}
                icon="user-plus"
            />

        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1, backgroundColor:
            COLORS.background
    },
    container: {
        flex: 1,
        marginHorizontal: PADDING.horizontal,
        marginTop: 24,

    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    enterJobButton: {
        backgroundColor: COLORS.primary,

        padding: 10,



    },
    enterJobText: {

        fontSize: 14,
        fontWeight: "600",
    },

    card: {
        margin: 12,
        paddingHorizontal: 12,
        paddingTop: 12,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        marginBottom: 24,
        paddingBottom: 48,
        //  marginHorizontal: PADDING.horizontal
    },

    cardSection: {
        paddingTop: 12,
    },
    detailsCard: {
        paddingHorizontal: 4,
    },
    details: {
        paddingTop: 4,
        flexDirection: "row",
        justifyContent: "space-between",

    },
    rightDetail: {
        fontWeight: 700,
        color: "#555",
        fontSize: 15,
    },
    leftDetail: {
        fontWeight: 400,
        color: "#555",
        fontSize: 15,
    },
    address: {
        fontWeight: 700,
        color: "#555",
        fontSize: 15,
    },
    map: {
        marginTop: 18,
        marginBottom: 12,
        height: 120,
        borderRadius: 12,
        backgroundColor: "#ccc"
    },
    text: {
        fontWeight: "500",
        fontSize: 16,
        color: "#555",

    },
    textHeading: {
        fontWeight: "600",
        fontSize: 23,
        color: "#222",
        marginBottom: 4,
        marginTop: 12,

    },

});
