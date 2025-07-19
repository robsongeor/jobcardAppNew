export type Job = {
    id: string;
    fleet: string;
    job: string;
    customerName: string;
    machine: {
        make: string;
        model: string;
        serialNumber: string;
    };
    assignedTo: string[];
    assignedStatus: { [uid: string]: string }
    assignedDate: { [uid: string]: string },
    description: string;
    site: string;
    status: string;
    customerAddress: string;
    customerAddressSuburb: string;
    customerAddressTown: string;
    siteContact: string;
    siteContactPhone: string;
    coords: { latitude: number, longitude: number }
};

export type JobActivityType = {
    id: string;
    date: string;
    hours: string;
    kms: string;
}

export type JobDescriptionType = {
    orderNo: string;
    hours: string;
    report: string;
    chargeable: boolean;
    chargeableComment: string
};

export type QuantityInputType = {
    id: string;
    descValue: string;
    quantityValue: string;
}

export type SignInputsType = {
    signature: string;
    clientName: string;
    clientDate: string;

}

export type TabType = 'all' | 'assigned' | 'submitted' | 'overdue' | 'archive';

export type RecentActivityType = {
    id: string;
    title: string;
    date: string;
    status: string;
    jobNumber: string;
    fleet: string
}

export type Machine = {
    fleet: string;
    make: string;
    model: string;
    serialNumber: string
}

export const machines: Machine[] = [
    { fleet: "FN1242", make: "Bendi", model: "B318", serialNumber: "BEN123456" },
    { fleet: "FN1270", make: "Still", model: "RX60-50", serialNumber: "STL987654" },
    { fleet: "FN1301", make: "EP", model: "CPD20L1", serialNumber: "EP204112" },
    { fleet: "FN1325", make: "Komatsu", model: "FB15", serialNumber: "KMTS154329" },
    { fleet: "FN1408", make: "Bendi", model: "B420", serialNumber: "BEN420999" },
    { fleet: "FN1512", make: "Still", model: "RX20-16", serialNumber: "STL456321" },
    { fleet: "FN1620", make: "EP", model: "CPD30", serialNumber: "EP303030" },
    { fleet: "FN1700", make: "Komatsu", model: "FB25", serialNumber: "KMTS259876" },
    { fleet: "FN1815", make: "Bendi", model: "B313", serialNumber: "BEN313001" },
    { fleet: "FN1934", make: "Still", model: "RX60-25", serialNumber: "STL602500" }
];