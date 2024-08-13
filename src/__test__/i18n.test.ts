import i18n from '../i18n'
import { DateTime } from 'luxon'

const formatDateShort = (date: Date, lng: string) => i18n.t('{{ date, DATE_SHORT_RELATIVE }}', { date: date, lng: lng })

describe('i18n', () => {
  it.each([
    ['today', DateTime.local().plus({ days: 0 }).toJSDate()],
    ['tomorrow', DateTime.local().plus({ days: 1 }).toJSDate()],
    ['yesterday', DateTime.local().plus({ days: -1 }).toJSDate()]])
    ('should use relative time to translate near dates: "%s"', (expectedTranslatedDate, date) => {
      const formattedDate = formatDateShort(date, 'en')
      expect(formattedDate).toEqual(expectedTranslatedDate)
  })

  it('should use WEEKDAY time to translate near dates', () => {
    const date = DateTime.local().plus({ days: 2 }).toJSDate()
    const formattedDate = formatDateShort(date, 'en')
    const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    expect(weekdays).toContainEqual(formattedDate.toLowerCase())
  })
  
  it('should use DATE_SHORT time to translate far dates', () => {
    const date = new Date(2022, 0, 1)
    const formattedDate = formatDateShort(date, 'en')
    expect(formattedDate).toEqual('01.01.2022')
  })
})