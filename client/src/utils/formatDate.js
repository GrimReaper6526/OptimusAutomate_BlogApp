import { formatDistanceToNow, format } from 'date-fns'

export const fromNow = (date) => formatDistanceToNow(new Date(date), { addSuffix: true })

export const formatDate = (date) => format(new Date(date), 'MMM d, yyyy')

export default formatDate
