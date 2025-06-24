
export const formatDate = (date: string) => {
    const dateObj = new Date(date);

    const formatted = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const comma = formatted.split(" ")

    return `${comma[1]} ${comma[0]}, ${comma[2]}`
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

export function capitalizeFirst(string: string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}
