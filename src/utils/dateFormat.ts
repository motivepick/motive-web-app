import { Moment } from 'moment'

export const format = (date: Moment): string => date.local().calendar().toLowerCase()
