function formatDate(Date) {
    return Date.getDate() + "." + Date.getMonth() + "." + Date.getFullYear() + "-" + Date.getHours() + ":" + Date.getMinutes() + ":" + Date.getSeconds() + " ";
}

export { formatDate };