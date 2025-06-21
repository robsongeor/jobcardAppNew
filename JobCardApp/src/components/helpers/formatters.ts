
export const formatDate = (date: string) => {
    const dateObj = new Date(date);

    const formatted = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    return formatted
}

export const formatDateTime = (date: string) => {
    const dateObj = new Date(date);

    const formattedDate = dateObj.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    const formattedTime = dateObj.toLocaleTimeString('en-NZ', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    }).toLowerCase(); // lower case for "am/pm"

    return `${formattedDate} ${formattedTime}`;
};
