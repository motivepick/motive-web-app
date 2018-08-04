import moment from 'moment';

export const handleDueDateOf = (task) => {
    const lastWord = lastWordOf(task.name);
    if (['today', 'сегодня'].includes(lastWord)) {
        return { ...task, name: nameWithoutLastWord(task, lastWord), dueDate: moment().endOf('day') };
    } else if (['tomorrow', 'завтра'].includes(lastWord)) {
        return {
            ...task, name: nameWithoutLastWord(task, lastWord), dueDate: moment().add(1, 'days').endOf('day')
        };
    } else {
        const date = moment(lastWord, ['DD.MM.YYYY', 'DD.MM.YY'], true).endOf('day');
        return date.isValid() ? { ...task, name: nameWithoutLastWord(task, lastWord), dueDate: date.endOf('day') } : { ...task };
    }
};

const nameWithoutLastWord = (task, lastWord) => task.name.substring(0, task.name.length - lastWord.length).trim();

const lastWordOf = (name) => name.split(' ').splice(-1)[0].toLowerCase().trim();
