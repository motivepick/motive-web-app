import i18n from '../i18n'
import { DateTime, Settings } from 'luxon'
import translation from '../../public/locales/en/translation.json'

i18n.addResources('en', 'translation', translation)

const formatDateShort = (date: string, lng: string) => i18n.t('dueDate', { date: date, lng: lng })

Settings.now = () => DateTime.fromJSDate(new Date('2024-08-25T00:59:59.999999999+03:00')).valueOf()

describe('i18n', () => {
    const yesterdayTodayOrTomorrow: ReadonlyArray<readonly [string, string]> = [
        ['today', DateTime.local().plus({ days: 0 }).toISODate()],
        ['tomorrow', DateTime.local().plus({ days: 1 }).toISODate()],
        ['yesterday', DateTime.local().plus({ days: -1 }).toISODate()]
    ]

    it.each(yesterdayTodayOrTomorrow)('should use relative time to translate near dates: "%s"', (expectedTranslatedDate, date) => {
        const formattedDate = formatDateShort(date, 'en')
        expect(formattedDate).toEqual(expectedTranslatedDate)
    })

    it('should use WEEKDAY time to translate near dates', () => {
        const date = DateTime.local().plus({ days: 2 }).toISODate()
        const formattedDate = formatDateShort(date, 'en')
        const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        expect(weekdays).toContainEqual(formattedDate.toLowerCase())
    })

    it('should use DATE_SHORT time to translate far dates', () => {
        const formattedDate = formatDateShort('2022-01-01', 'en')
        expect(formattedDate).toEqual('01.01.2022')
    })

    it('should format end of yesterday as "yesterday"', () => {
        const formattedDate = formatDateShort('2024-08-24T23:59:59.999999999+03:00', 'en')
        expect(formattedDate).toEqual('yesterday')
    })

    it('should format end of today as "today"', () => {
        const formattedDate = formatDateShort('2024-08-25T23:59:59.999999999+03:00', 'en')
        expect(formattedDate).toEqual('today')
    })

    it('should format end of tomorrow as "tomorrow"', () => {
        const formattedDate = formatDateShort('2024-08-26T23:59:59.999999999+03:00', 'en')
        expect(formattedDate).toEqual('tomorrow')
    })
})
