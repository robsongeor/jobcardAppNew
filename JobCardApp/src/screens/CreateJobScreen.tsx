import { View } from "react-native";
import { useEffect, useState } from "react";
import { Job } from "../types/types";
import { getStoredUserField } from "../storage/storage";
import CreateJobForm from "./CreateJobScreen/createJobForm";
import BottomRightButton from "../components/form/Buttons/BottomRightButton";
import { SafeAreaView } from "react-native-safe-area-context";

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
        </SafeAreaView>

    )
}