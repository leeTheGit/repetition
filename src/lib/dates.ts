import { formatDistanceToNow, Locale } from "date-fns";


export function deltaToNow(date: string, timzone: string = "") {
    if (!date) return ""
    const dateObj = new Date(date);
    return formatDistanceToNow(dateObj, {
        addSuffix: true,
    })
}
