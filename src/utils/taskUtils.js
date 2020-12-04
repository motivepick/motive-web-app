import moment from 'moment'
import * as R from 'ramda'

const DAYS_OF_WEEK = {
    0: ['sunday', 'воскресенье'],
    1: ['monday', 'понедельник'],
    2: ['tuesday', 'вторник'],
    3: ['wednesday', 'среду'],
    4: ['thursday', 'четверг'],
    5: ['friday', 'пятницу'],
    6: ['saturday', 'субботу']
}

const ALL_DAYS_OF_WEEK = R.chain(R.identity, R.values(DAYS_OF_WEEK))

const nameWithoutLastWord = (name, lastWord) => name.substring(0, name.length - lastWord.length).trim()

const wordsOf = (name) => name.split(' ').map(w => w.trim())

export const handleDueDateOf = (task) => {
    const words = wordsOf(task.name)
    const lastWord = words[words.length - 1].toLowerCase()
    const wordBeforeLast = words.length > 1 ? words[words.length - 2].toLowerCase() : null
    if (R.contains(lastWord, ['today', 'сегодня'])) {
        return { ...task, name: nameWithoutLastWord(task.name, lastWord), dueDate: moment().endOf('day') }
    } else if (R.contains(lastWord, ['tomorrow', 'завтра'])) {
        return { ...task, name: nameWithoutLastWord(task.name, lastWord), dueDate: moment().add(1, 'days').endOf('day') }
    } else if (R.contains(lastWord, ['послезавтра'])) {
        return { ...task, name: nameWithoutLastWord(task.name, lastWord), dueDate: moment().add(2, 'days').endOf('day') }
    } else if (R.contains(lastWord, ALL_DAYS_OF_WEEK) && R.contains(wordBeforeLast, ['on', 'в', 'во'])) {
        const dayOfWeek = R.toPairs(DAYS_OF_WEEK).find(entry => entry[1].includes(lastWord))[0]
        const startOfTomorrow = moment().startOf('day').add(1, 'days')
        const dueDate = moment().day(dayOfWeek).endOf('day')
        const dueDateInFuture = dueDate.isBefore(startOfTomorrow) ? dueDate.add(1, 'weeks') : dueDate
        return { ...task, name: nameWithoutLastWord(nameWithoutLastWord(task.name, lastWord), wordBeforeLast), dueDate: dueDateInFuture }
    } else {
        const date = moment(lastWord, ['DD.MM.YYYY', 'DD.MM.YY'], true).endOf('day')
        return date.isValid() ? { ...task, name: nameWithoutLastWord(task.name, lastWord), dueDate: date.endOf('day') } : { ...task }
    }
}
