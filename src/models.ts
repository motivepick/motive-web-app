export type ITask = {
    id: number;
    name: string;
    description: string | null;
    created: string;
    dueDate: string | null;
    closingDate: string | null;
    closed: boolean;
    visible: boolean;
}

export enum TASK_LIST {
    // eslint-disable-next-line no-unused-vars
    INBOX = 'INBOX',
    // eslint-disable-next-line no-unused-vars
    CLOSED = 'CLOSED'
}

export type TaskListTypeAsLiterals = `${TASK_LIST}`

export type IUser = {
    id: number;
    accountId: string;
    name: string;
    temporary: boolean;
}
