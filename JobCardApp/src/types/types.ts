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
    description: string;
    site: string;
    status: string;
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

export type TabType = 'all' | 'assigned' | 'submitted';