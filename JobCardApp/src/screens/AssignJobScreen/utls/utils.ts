import { Job } from "../../../types/types";

export function createEmptyJob(jobNumber: string): Job {
    return {
        id: "",
        fleet: "",
        job: jobNumber,
        customerName: "Enter Customer",
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
    } as Job
}