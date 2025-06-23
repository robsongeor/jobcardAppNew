import { View } from "react-native";
import { useEffect, useState } from "react";
import { Job } from "../types/types";
import { getStoredUserField } from "../storage/storage";
import CreateJobForm from "./CreateJobScreen/createJobForm";
import BottomRightButton from "../components/form/Buttons/BottomRightButton";
import { SafeAreaView } from "react-native-safe-area-context";
import Config from "react-native-config";
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


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <CreateJobForm
                jobInfo={jobInfo}
                setJobInfo={setJobInfo}
            />
            <BottomRightButton
                label="Assign"
                disabled={submitDisabled}
                onPress={() => console.log("Assigned")}
                icon="user-plus"
            />



            <GooglePlacesAutocomplete
                placeholder="Search address"
                fetchDetails={true}
                onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    const address = details?.formatted_address || '';
                    // Loop through details.address_components to extract suburb and city/region
                    // For example:
                    let suburb = '';
                    let region = '';
                    details?.address_components?.forEach(component => {
                        if (component.types.includes('sublocality') || component.types.includes('locality')) {
                            suburb = component.long_name;
                        }
                        if (component.types.includes('administrative_area_level_1')) {
                            region = component.long_name;
                        }
                    });

                    // Update your jobInfo state
                    setJobInfo({
                        ...jobInfo,
                        customerAddress: address,
                        customerAddressSuburb: suburb,
                        customerAddressTown: region,
                    });
                }}
                query={{
                    key: Config.GOOGLE_MAPS_API_KEY,
                    language: 'en',
                    components: 'country:nz', // restricts to NZ, change as needed
                }}
                styles={{
                    // Optional: Customize input style here
                    container: { flex: 0 },
                    textInput: { height: 38, color: '#5d5d5d', fontSize: 16 },
                }}
            />


        </SafeAreaView>

    )
}