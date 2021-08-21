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

export enum TaskListType {
    INBOX = 'INBOX',
    CLOSED = 'CLOSED'
}

export type TaskListTypeAsLiterals = `${TaskListType}`

export type IUser = {
    id: number;
    accountId: string;
    name: string;
    temporary: boolean;
}
