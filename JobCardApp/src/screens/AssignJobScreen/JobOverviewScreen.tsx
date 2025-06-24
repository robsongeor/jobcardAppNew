import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AssignJobStackParamList } from "../../navigation/AssignJobStack";
import Title from "../../components/text/Title";
import PADDING from "../../constants/padding";
import SubTitle from "../../components/text/SubTitle";
import COLORS from "../../constants/colors";
import BottomRightButton from "../../components/form/Buttons/BottomRightButton";
import SubHeading from "./components/SubHeading";
import Icon from "react-native-vector-icons/Feather";

type Props = NativeStackScreenProps<AssignJobStackParamList, 'JobOverview'>;

export default function JobOverviewScreen({ route }: Props) {
    const { job } = route.params;

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
                            {job.description ?
                                <Text style={styles.leftDetail}>
                                    {job.description}
                                </Text>
                                :
                                <View style={styles.buttonContainer}>
                                    <Text style={styles.leftDetail}>Please add a job description</Text>
                                    <TouchableOpacity style={styles.enterJobButton}>
                                        <Icon name="plus" size={24} color={COLORS.white} />
                                    </TouchableOpacity>
                                </View>


                            }

                        </View>

                    </View>
                </View>

            </View>
            <BottomRightButton
                disabled={!job.description}
                label="Assign" />
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
