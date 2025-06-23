import { Text, View } from "react-native";
import SmallTextInput from "../components/form/FormInputs/SmallTextInput";
import { useState } from "react";
import { Job } from "../types/types";
import { getStoredUserField } from "../storage/storage";

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
            <SmallTextInput
                label="Job Number"
                value={jobInfo.job}
                onChangeText={(value) => setJobInfo({ ...jobInfo, job: value })}
            />
            <SmallTextInput
                label="Fleet Number"
                value={jobInfo.fleet}
                onChangeText={(value) => setJobInfo({ ...jobInfo, fleet: value })}
            />
            <SmallTextInput
                label="Customer Name"
                value={jobInfo.customerName}
                onChangeText={(value) => setJobInfo({ ...jobInfo, customerName: value })}
            />
            <SmallTextInput
                label="Make"
                value={jobInfo.machine.make}
                onChangeText={(value) =>
                    setJobInfo({ ...jobInfo, machine: { ...jobInfo.machine, make: value } })
                }
            />
            <SmallTextInput
                label="Model"
                value={jobInfo.machine.model}
                onChangeText={(value) =>
                    setJobInfo({ ...jobInfo, machine: { ...jobInfo.machine, model: value } })
                }
            />
            <SmallTextInput
                label="Serial"
                value={jobInfo.machine.serialNumber}
                onChangeText={(value) =>
                    setJobInfo({
                        ...jobInfo,
                        machine: { ...jobInfo.machine, serialNumber: value },
                    })
                }
            />
            <SmallTextInput
                label="Description"
                value={jobInfo.description}
                onChangeText={(value) => setJobInfo({ ...jobInfo, description: value })}
            />
            <SmallTextInput
                label="Site (optional)"
                value={jobInfo.site}
                onChangeText={(value) => setJobInfo({ ...jobInfo, site: value })}
            />
        </View>

    )
}