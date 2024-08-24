import { extractDueDate } from '../extractDueDate'
import { DateTime } from 'luxon'

describe('dateFromRelativeString', () => {
    it.each([
        ['12.12.2022', 'dd.MM.yyyy'],
        ['12.12.22', 'dd.MM.yy']
    ])('should set the dueDate based on the last word in the task name if it is a valid date: "%s"', (date, format) => {
        const name = `Do something ${date}`
        const expectedDate = DateTime.fromFormat(date, format).endOf('day').toUTC()

        const updatedTask = extractDueDate(name)
        const dueDate = updatedTask.dueDate

        expect(dueDate).toEqual(expectedDate)
        expect(updatedTask.name).toEqual('Do something')
    })

    it.each([
        'Do something notADate',
        ' ',
        ''
    ])('should not change the dueDate if the last word in the task name is not a valid date: "%s"', taskName => {
        const updatedTask = extractDueDate(taskName)
        const dueDate = updatedTask.dueDate

        expect(dueDate).toBeNull()
        expect(updatedTask.name).toEqual(taskName)
    })

    it.each([
        'послезавтра',
        'today',
        'on Monday',
        'в субботу',
        ' ',
        ''
    ])('should not change the dueDate if the last word in the task name equals dueDate (because taskName cannot be empty): "%s"', taskName => {
        const updatedTask = extractDueDate(taskName)
        const dueDate = updatedTask.dueDate

        expect(dueDate).toBeNull()
        expect(updatedTask).toEqual({ name: taskName, dueDate: null })
    })

    it('should set dueDate to end of the day after tomorrow if last word is "послезавтра"', () => {
        const name = 'Do something послезавтра'

        const updatedTask = extractDueDate(name)
        const dueDate = updatedTask.dueDate

        expect(dueDate).toEqual(DateTime.local().plus({ days: 2 }).endOf('day').toUTC())
        expect(updatedTask.name).toEqual('Do something')
    })

    it.each(['today', 'сегодня'])('should set dueDate to end of today if last word is "%s"', dateStr => {
        const name = `Do something ${dateStr}`

        const updatedTask = extractDueDate(name)
        const dueDate = updatedTask.dueDate

        expect(dueDate).toEqual(DateTime.local().endOf('day').toUTC())
        expect(updatedTask.name).toEqual('Do something')
    })

    it.each(['tomorrow', 'завтра'])('should set dueDate to end of tomorrow if last word is "%s"', dateStr => {
        const name = `Do something ${dateStr}`

        const updatedTask = extractDueDate(name)
        const dueDate = updatedTask.dueDate

        expect(dueDate).toEqual(DateTime.local().plus({ days: 1 }).endOf('day').toUTC())
        expect(updatedTask.name).toEqual('Do something')
    })

    const getNextDayOfWeek = (dayIndex: number): DateTime => {
        const today = DateTime.local()
        if (today.weekday === dayIndex) {
            return today.plus({ weeks: 1 }).startOf('week').plus({ days: dayIndex - 1 }).endOf('day').toUTC()
        } else if (today.weekday < dayIndex) {
            return today.startOf('week').plus({ days: dayIndex - 1 }).endOf('day').toUTC()
        } else {
            return today.startOf('week').plus({ days: dayIndex + 7 - 1 }).endOf('day').toUTC()
        }
    }

    it.each([
        ['on Monday', getNextDayOfWeek(1)],
        ['on Tuesday', getNextDayOfWeek(2)],
        ['on Wednesday', getNextDayOfWeek(3)],
        ['on Thursday', getNextDayOfWeek(4)],
        ['on Friday', getNextDayOfWeek(5)],
        ['on Saturday', getNextDayOfWeek(6)],
        ['on Sunday', getNextDayOfWeek(7)],
        ['в понедельник', getNextDayOfWeek(1)],
        ['во вторник', getNextDayOfWeek(2)],
        ['в среду', getNextDayOfWeek(3)],
        ['в четверг', getNextDayOfWeek(4)],
        ['в пятницу', getNextDayOfWeek(5)],
        ['в субботу', getNextDayOfWeek(6)],
        ['в воскресенье', getNextDayOfWeek(7)]
    ])('should set dueDate to end of day if last words are "%s"', (lastWords, expectedDate) => {
        const task = `Do something ${lastWords}`

        const updatedTask = extractDueDate(task)
        const dueDate = updatedTask.dueDate

        expect(dueDate).toEqual(expectedDate)
        expect(updatedTask.name).toEqual('Do something')
    })
})
