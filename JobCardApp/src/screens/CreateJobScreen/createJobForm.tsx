import SmallTextInput from "../../components/form/FormInputs/SmallTextInput";
import { Job } from "../../types/types";

type createJobFormProps = {
    jobInfo: Job;
    setJobInfo: React.Dispatch<React.SetStateAction<Job>>;
}

export default function CreateJobForm({ jobInfo, setJobInfo }: createJobFormProps) {

    return (
        <>
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

        </>
    )
}