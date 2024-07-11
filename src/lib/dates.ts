import { formatDistanceToNow, Locale } from "date-fns";


export function deltaToNow(date: string, timzone: string = "") {
    if (!date) return ""
    const dateStr = date.split(".")[0] + 'Z'
    const dateObj = new Date(dateStr);
    return formatDistanceToNow(dateObj, {
        addSuffix: true,
    })
}
