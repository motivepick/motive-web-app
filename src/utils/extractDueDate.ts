import { DateTime } from 'luxon'
import * as R from 'ramda'
import { DueDateExtractionResult } from '../models/appModel'

const DAYS_OF_WEEK = {
    0: ['sunday', 'воскресенье'],
    1: ['monday', 'понедельник'],
    2: ['tuesday', 'вторник'],
    3: ['wednesday', 'среду'],
    4: ['thursday', 'четверг'],
    5: ['friday', 'пятницу'],
    6: ['saturday', 'субботу']
}

const CASUAL_DAY = {
    0: ['today', 'сегодня'],
    1: ['tomorrow', 'завтра'],
    2: ['послезавтра']
}

const ALL_DAYS_OF_WEEK = R.chain(R.identity, R.values(DAYS_OF_WEEK))
const ALL_CASUAL_DAY = R.chain(R.identity, R.values(CASUAL_DAY))
const DATE_FORMAT_LONG = 'dd.MM.yyyy'
const DATE_FORMAT_SHORT = 'dd.MM.yy'

const nameWithoutLastWord = (name: string, lastWord: string): string => name.substring(0, name.length - lastWord.length).trim()
const wordsOf = (name: string): string[] => name.split(/\s+/)
const getDateInFormat = (dateStr: string, format: string): DateTime => DateTime.fromFormat(dateStr, format, { setZone: true })
const isCasualDay = (dateStr: string) => ALL_CASUAL_DAY.includes(dateStr)
const isDayOfWeek = (wordBeforeLast: string, lastWord: string) => ALL_DAYS_OF_WEEK.includes(lastWord) && ['on', 'в', 'во'].includes(wordBeforeLast)
const isSupportedDateFormat = (dateStr: string) => getDateInFormat(dateStr, DATE_FORMAT_LONG).isValid || getDateInFormat(dateStr, DATE_FORMAT_SHORT).isValid

const getDateFromRelativeString = (dateStr: string): DateTime => {
    const lastWord = dateStr.split(' ').pop()!
    const casualDay: string | undefined = R.toPairs(CASUAL_DAY).find(entry => entry[1].includes(lastWord))?.[0]
    const dayOfWeek: string | undefined = R.toPairs(DAYS_OF_WEEK).find(entry => entry[1].includes(lastWord))?.[0]
    if (casualDay) {
        return DateTime.local().plus({ days: Number(casualDay) }).endOf('day')
    } else if (dayOfWeek) {
        const calcDaysToAdd = ((7 - DateTime.local().weekday + Number(dayOfWeek)) % 7) || 7
        return DateTime.local().plus({ days: calcDaysToAdd }).endOf('day')
    } else {
        return (getDateInFormat(dateStr, DATE_FORMAT_LONG).isValid
            ? getDateInFormat(dateStr, DATE_FORMAT_LONG)
            : getDateInFormat(dateStr, DATE_FORMAT_SHORT)).endOf('day')
    }
}

const getValidRelativeString = (taskName: string): string | null => {
    const words = wordsOf(taskName)
    const lastWord = words.pop()?.toLowerCase() || ''
    const wordBeforeLast = words.pop()?.toLowerCase() || ''

    if (isCasualDay(lastWord)) {
        return lastWord
    } else if (isDayOfWeek(wordBeforeLast, lastWord)) {
        return wordBeforeLast + ' ' + lastWord
    } else {
        return isSupportedDateFormat(lastWord) ? lastWord : null
    }
}

export const extractDueDate = (name: string): DueDateExtractionResult => {
    const dateStr = getValidRelativeString(name)

    if (name.toLowerCase() == dateStr) return { name, dueDate: null }

    const dueDate: DateTime | null = dateStr ? getDateFromRelativeString(dateStr!).toUTC() : null
    return { name: dateStr ? nameWithoutLastWord(name, dateStr) : name, dueDate }
}
