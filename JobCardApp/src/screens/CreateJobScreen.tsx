import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { Job } from "../types/types";
import { getStoredUserField } from "../storage/storage";
import CreateJobForm from "./CreateJobScreen/createJobForm";
import BottomRightButton from "../components/form/Buttons/BottomRightButton";
import { SafeAreaView } from "react-native-safe-area-context";
import Config from "react-native-config";
import GooglePlacesTextInput from "react-native-google-places-textinput";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

export default function CreateJobScreen() {
    const userID = getStoredUserField("uid");
    const [submitDisabled, setSubmitDisable] = useState(true)

    const [jobInfo, setJobInfo] = useState<Job>({
        id: "",
        fleet: "",
        job: "",
        customerName: "",
        machine: {
            make: "",
            model: "",
            serialNumber: "",
        },
        assignedTo: [],
        assignedStatus: {},
        assignedDate: {},
        description: "",
        site: "",
        status: "",
        customerAddress: "",
        customerAddressSuburb: "",
        customerAddressTown: "",
        siteContact: "",
        siteContactPhone: "",
    });

    function isJobInfoValid(jobInfo: Job): boolean {
        return (
            jobInfo.fleet.trim().length > 0 &&
            jobInfo.job.trim().length > 0 &&
            jobInfo.customerName.trim().length > 0 &&
            jobInfo.machine.make.trim().length > 0 &&
            jobInfo.machine.model.trim().length > 0
        );
    }

    useEffect(() => {
        setSubmitDisable(!isJobInfoValid(jobInfo));
    }, [jobInfo]);








    const handleBasicPlaceSelect = (place: any, token: any) => {
        console.log('Selected place:', place);

        // Full formatted address
        const address = place?.structuredFormat?.mainText?.text || "";

        // Break secondaryText into parts
        const secondaryParts = place?.structuredFormat?.secondaryText?.text.split(",") || [];
        const suburb = secondaryParts[0]?.trim() || "";
        const town = secondaryParts[1]?.trim() || "";

        setJobInfo({
            ...jobInfo,
            customerAddress: address,
            customerAddressSuburb: suburb,
            customerAddressTown: town,
        });
    };





    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Basic Example</Text>
                <GooglePlacesTextInput
                    apiKey={Config.GOOGLE_MAPS_API_KEY || ""}
                    placeHolderText="Search for a location"
                    onPlaceSelect={handleBasicPlaceSelect}
                    minCharsToFetch={2}
                    languageCode="en"
                    includedRegionCodes={['NZ']}  // <<<<<<<<<<<
                />
            </View>


            <View>
                <Text>Address: {jobInfo.customerAddress}</Text>
                <Text>Suburb: {jobInfo.customerAddressSuburb}</Text>
                <Text>Town: {jobInfo.customerAddressTown}</Text>
            </View>

            {/* <CreateJobForm
                jobInfo={jobInfo}
                setJobInfo={setJobInfo}
            />
            <BottomRightButton
                label="Assign"
                disabled={submitDisabled}
                onPress={() => console.log("Assigned")}
                icon="user-plus"
            /> */}
        </SafeAreaView>
















    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    section: {
        marginVertical: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        marginLeft: 16,
        color: '#333333',
    },
});
