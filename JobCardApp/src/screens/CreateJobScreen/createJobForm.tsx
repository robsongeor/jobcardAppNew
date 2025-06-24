import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import Label from "../../components/form/FormInputs/Label";
import SmallTextInput from "../../components/form/FormInputs/SmallTextInput";
import { Job, Machine, machines } from "../../types/types";
import COLORS from "../../constants/colors";
import { useState } from "react";
import FleetAutoComplete from "../../components/FleetAutoComplete";
import GooglePlacesTextInput from "../../components/GooglePlacesTextInputCustom";
import Config from "react-native-config";
import SearchBar from "../../components/SearchBar";
import PADDING from "../../constants/padding";
import { getJobFromJobNumber } from "../../firebase";
import { SafeAreaView } from "react-native-safe-area-context";
import JobSearch from "../../components/assign/JobSearch";


type createJobFormProps = {
    jobInfo: Job;
    setJobInfo: React.Dispatch<React.SetStateAction<Job>>;
}

export default function CreateJobForm({ jobInfo, setJobInfo }: createJobFormProps) {
    const [showResults, setShowResults] = useState(false);
    const [addressQuery, setAddressQuery] = useState("");
    const [jobNotFound, setJobNotFound] = useState(false);
    const [job, setJob] = useState<Job>()

    const hasField = (value: string) => {
        return value.trim().length > 0
    }

    const setMachine = (machine: Machine) => {
        const { fleet, ...rest } = machine
        setJobInfo({ ...jobInfo, fleet, machine: rest })
    }

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

        setShowResults(false);
    };

    const handleJobSearch = async (query: string) => {

        const job = await getJobFromJobNumber(query)
        //if job exists store, else show next section

        console.log(job)

        if (job) {
            setJobInfo(job)
            setJobNotFound(false)
            // setJob(job)
        }
        else {
            setJobNotFound(true)
            setJobInfo({
                id: '',
                fleet: '',
                job: query, // <- keep the user’s searched job number
                customerName: '',
                machine: {
                    make: '',
                    model: '',
                    serialNumber: '',
                },
                assignedTo: [],
                assignedStatus: {},
                assignedDate: {},
                description: '',
                site: '',
                status: '',
                customerAddress: '',
                customerAddressSuburb: '',
                customerAddressTown: '',
                siteContact: '',
                siteContactPhone: '',
            });

        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <JobSearch
                jobInfo={jobInfo}
                setJobInfo={setJobInfo}
                handleJobSearch={handleJobSearch}
            />

            {jobNotFound &&
                <FleetAutoComplete
                    fleetList={machines}
                    onSelect={setMachine}
                />
            }

            {jobNotFound && hasField(jobInfo.fleet) &&
                <View>
                    <SmallTextInput
                        label="Customer"
                        value={jobInfo.customerName}
                        onChangeText={(value) => setJobInfo({ ...jobInfo, customerName: value })}

                    />
                    <GooglePlacesTextInput
                        apiKey={Config.GOOGLE_MAPS_API_KEY || ""}
                        placeHolderText="Search for a location"
                        onPlaceSelect={handleBasicPlaceSelect}
                        minCharsToFetch={4}
                        languageCode="en"
                        includedRegionCodes={['NZ']}
                        resultsVisible={showResults}
                        value={addressQuery}
                        onTextChange={() => setShowResults(true)}
                        onFocus={() => setShowResults(true)}
                        searchInput={(inputProps) => (
                            <SearchBar {...inputProps} />
                        )}
                    />
                    <SmallTextInput
                        label="Description"
                        value={jobInfo.description}
                        onChangeText={(value) => setJobInfo({ ...jobInfo, description: value })}
                    />
                </View>}


        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: PADDING.horizontal,
    },
    machine: {
        borderRadius: 16,
        backgroundColor: COLORS.white,
        padding: 18,
        marginBottom: 16,
    },
    fleetNumber: {
        fontSize: 19,
        fontWeight: 'bold',
        color: "#2a2a2a",
        marginBottom: 10,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },

    label: {
        fontWeight: '500',
        color: "#888",
        fontSize: 13,
        minWidth: 60,
    },
    value: {
        fontWeight: '600',
        color: "#333",
        fontSize: 15,
        flexShrink: 1,
        textAlign: "right",
    },
});
