import moment from 'moment'
import * as R from 'ramda'

export const ordered = (tasks) => {
    return tasks.sort((a, b) => {
        if (absent(a.dueDate) && absent(b.dueDate)) {
            return 0;
        } else if (absent(a.dueDate) && present(b.dueDate)) {
            return 1;
        } else if (present(a.dueDate) && absent(b.dueDate)) {
            return -1;
        } else {
            return dueDateOf(a).isAfter(dueDateOf(b)) ? 1 : -1;
        }
    });
};

const dueDateOf = (task) => {
    return moment(task.dueDate, moment.ISO_8601);
};

const present = (value) => {
    return !absent(value);
};

const absent = (value) => {
    return !value;
};


const DAYS_OF_WEEK = {
    'Monday': 'понедельник',
    'Tuesday': 'вторник',
    'Wednesday': 'среду',
    'Thursday': 'четверг',
    'Friday': 'пятницу',
    'Saturday': 'субботу',
    'Sunday': 'воскресенье'
}

const nameWithoutLastWord = (name, lastWord) => name.substring(0, name.length - lastWord.length).trim()

const wordsOf = (name) => name.split(' ').map(w => w.trim())

const ALL_DAYS_OF_WEEK = R.keys(DAYS_OF_WEEK) + R.keys(DAYS_OF_WEEK)

export const handleDueDateOf = (task) => {
    const words = wordsOf(task.name)
    const lastWord = words[words.length - 1]
    const wordBeforeLast = words.length > 1 ? words[words.length - 2] : null
    if (R.contains(lastWord, ['today', 'сегодня'])) {
        return { ...task, name: nameWithoutLastWord(task.name, lastWord), dueDate: moment().endOf('day') }
    } else if (R.contains(lastWord, ['tomorrow', 'завтра'])) {
        return {
            ...task, name: nameWithoutLastWord(task.name, lastWord), dueDate: moment().add(1, 'days').endOf('day')
        }
    } else {
        if (R.contains(lastWord, ALL_DAYS_OF_WEEK) && R.contains(wordBeforeLast, ['on', 'в', 'во'])) {
            const dayOfWeek = R.contains(lastWord, R.keys(DAYS_OF_WEEK))
                ? lastWord : R.toPairs(DAYS_OF_WEEK).filter(entry => entry[1] === lastWord)[0][0]
            const startOfToday = moment().startOf('day')
            const dueDate = moment().day(dayOfWeek).endOf('day')
            const dueDateInFuture = dueDate.isBefore(startOfToday) ? dueDate.add(1, 'weeks') : dueDate
            return {
                ...task,
                name: nameWithoutLastWord(nameWithoutLastWord(task.name, lastWord), wordBeforeLast),
                dueDate: dueDateInFuture
            }
        } else {
            const date = moment(lastWord, ['DD.MM.YYYY', 'DD.MM.YY'], true).endOf('day')
            return date.isValid() ? { ...task, name: nameWithoutLastWord(task.name, lastWord), dueDate: date.endOf('day') } : { ...task }
        }
    }
}
