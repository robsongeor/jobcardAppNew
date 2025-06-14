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
    description: string;
    site: string;
    status: string;
};