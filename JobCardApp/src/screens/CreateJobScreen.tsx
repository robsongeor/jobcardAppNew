import { View } from "react-native";
import { useState } from "react";
import { Job } from "../types/types";
import { getStoredUserField } from "../storage/storage";
import CreateJobForm from "./CreateJobScreen/createJobForm";

export default function CreateJobScreen() {
    const userID = getStoredUserField("uid");

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


    return (
        <View>
            <CreateJobForm
                jobInfo={jobInfo}
                setJobInfo={setJobInfo}
            />
        </View>

    )
}