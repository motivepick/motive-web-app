import moment from 'moment';

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