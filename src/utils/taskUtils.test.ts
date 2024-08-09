import { dateFromRelativeString } from './taskUtils'
import { DateTime } from 'luxon'
import { ITask } from '../models/appModel'
import { Moment } from 'moment'

describe('dateFromRelativeString', () => {
  it.each([['12.12.2022', 'dd.MM.yyyy'], ['12.12.22', 'dd.MM.yy']])('should set the dueDate based on the last word in the task name if it is a valid date: "%s"', (date, format) => {
    const task = { name: `Do something ${date}` } as ITask
    const expectedDate = DateTime.fromFormat(date, format).endOf('day').toJSDate()

    const updatedTask = dateFromRelativeString(task)
    var dueDate = updatedTask.dueDate as Moment

    expect(dueDate.toDate()).toEqual(expectedDate)
    expect(updatedTask.name).toEqual('Do something')
  })

  it.each(['Do something notADate', ' ', ''])('should not change the dueDate if the last word in the task name is not a valid date: "%s"', taskName => {
    const task = { name: taskName } as ITask

    const updatedTask = dateFromRelativeString(task)
    var dueDate = updatedTask.dueDate as Moment

    expect(dueDate?.toDate()).toBeUndefined()
    expect(updatedTask.name).toEqual(taskName)
  })

  it.each(['послезавтра', 'today', 'on Monday', 'в субботу', ' ', ''])('should not change the dueDate if the last word in the task name equals dueDate (because taskName cannot be empty): "%s"', taskName => {
    const task = { name: taskName } as ITask

    const updatedTask = dateFromRelativeString(task)
    var dueDate = updatedTask.dueDate as Moment

    expect(dueDate?.toDate()).toBeUndefined()
    expect(updatedTask.name).toEqual(taskName)
  })

  it('should set dueDate to end of the day after tomorrow if last word is "послезавтра"', () => {
    const task = { name: 'Do something послезавтра' } as ITask

    const updatedTask = dateFromRelativeString(task)
    var dueDate = updatedTask.dueDate as Moment

    expect(dueDate.toDate()).toEqual(DateTime.local().plus({ days: 2 }).endOf('day').toJSDate())
    expect(updatedTask.name).toEqual('Do something')
  })

  it.each(['today', 'сегодня'])('should set dueDate to end of today if last word is "%s"', dateStr => {
    const task = { name: `Do something ${dateStr}` } as ITask

    const updatedTask = dateFromRelativeString(task)
    var dueDate = updatedTask.dueDate as Moment

    expect(dueDate.toDate()).toEqual(DateTime.local().endOf('day').toJSDate())
    expect(updatedTask.name).toEqual('Do something')
  })

  it.each(['tomorrow', 'завтра'])('should set dueDate to end of tomorrow if last word is "%s"', dateStr => {
    const task = { name: `Do something ${dateStr}` } as ITask

    const updatedTask = dateFromRelativeString(task)
    var dueDate = updatedTask.dueDate as Moment

    expect(dueDate.toDate()).toEqual(DateTime.local().plus({ days: 1 }).endOf('day').toJSDate())
    expect(updatedTask.name).toEqual('Do something')
  })

  const getNextDayOfWeek = (dayIndex: number): Date => {
    const today = DateTime.local()
    if (today.weekday === dayIndex) {
      return today.plus({ weeks: 1 }).startOf('week').plus({ days: dayIndex - 1 }).endOf('day').toJSDate()
    } else if (today.weekday < dayIndex) {
      return today.startOf('week').plus({ days: dayIndex - 1}).endOf('day').toJSDate()
    } else {
      return today.startOf('week').plus({ days: dayIndex + 7 - 1 }).endOf('day').toJSDate()
    }
  }

  it.each([
    ['on Monday', getNextDayOfWeek(1)],
    ['on Tuesday', getNextDayOfWeek(2)],
    ['on Wednesday', getNextDayOfWeek(3)],
    ['on Thursday', getNextDayOfWeek(4)],
    ['on Friday', getNextDayOfWeek(5)],
    ['on Saturday', getNextDayOfWeek(6)],
    ['on Sunday', getNextDayOfWeek(0)],
    ['в понедельник', getNextDayOfWeek(1)],
    ['во вторник', getNextDayOfWeek(2)],
    ['в среду', getNextDayOfWeek(3)],
    ['в четверг', getNextDayOfWeek(4)],
    ['в пятницу', getNextDayOfWeek(5)],
    ['в субботу', getNextDayOfWeek(6)],
    ['в воскресенье', getNextDayOfWeek(0)],
  ])('should set dueDate to end of day if last words are %s', (lastWords, expectedDate) => {
    const task = { name: `Do something ${lastWords}` } as ITask

    const updatedTask = dateFromRelativeString(task)
    var dueDate = updatedTask.dueDate as Moment

    expect(dueDate.toDate()).toEqual(expectedDate)
    expect(updatedTask.name).toEqual('Do something')
  })
})