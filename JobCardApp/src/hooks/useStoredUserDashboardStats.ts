import { useState, useEffect } from "react";
import { getStoredUserField, getJobsByStatus, getOverdueJobs } from "../storage/storage";
import { EventBus } from "../utils/EventBus";

export function useStoredUserDashboardStats() {
    const [name, setName] = useState("NO_NAME");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [assigned, setAssigned] = useState(0);
    const [overdue, setOverdue] = useState(0);
    const [isUserLoaded, setIsUserLoaded] = useState(false);

    useEffect(() => {
        // Try to get user info immediately
        const storedName = getStoredUserField('name');
        const storedEmail = getStoredUserField('email');
        const storedPhone = getStoredUserField('phone');

        if (storedName && storedName !== "NO_NAME") {
            setName(storedName.split(" ")[0]);
            setEmail(storedEmail);
            setPhone(storedPhone);
            setAssigned(getJobsByStatus("assigned").length);
            setOverdue(getOverdueJobs().length);
            setIsUserLoaded(true);
        }

        // Listener for userStored event
        const handleUserStored = () => {
            const updatedName = getStoredUserField('name');
            if (updatedName && updatedName !== "NO_NAME") {
                setName(updatedName.split(" ")[0]);
            }
            setAssigned(getJobsByStatus("assigned").length);
            setOverdue(getOverdueJobs().length);
            setIsUserLoaded(true);
        };
        EventBus.on("userStored", handleUserStored);

        return () => {
            EventBus.off("userStored", handleUserStored);
        };
    }, []);

    return { name, assigned, overdue, isUserLoaded };
}
