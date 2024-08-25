import '@testing-library/jest-dom'
import * as React from 'react'
import { render, screen } from '@testing-library/react'
import TasksSubtitle from '../TasksSubtitle'
import { TASK_LIST_ID } from '../../../models/appModel'

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (str: string) => str
    })
}))

describe('TasksSubtitle', () => {
    it('renders a button that shows closed tasks if task list ID is INBOX', () => {
        render(<TasksSubtitle numberOfTasks={1} taskListId={TASK_LIST_ID.INBOX} onToggleOpenClosedTasks={() => ({})}/>)
        expect(screen.queryByText('showClosedTasks')).toBeInTheDocument()
    })

    it('renders a number of tasks if "showNumberOfTasks" is not passed', () => {
        render(<TasksSubtitle numberOfTasks={1} taskListId={TASK_LIST_ID.INBOX} onToggleOpenClosedTasks={() => ({})}/>)
        expect(screen.queryByText('numberOfTasks')).toBeInTheDocument()
    })

    it('renders a number of tasks if "showNumberOfTasks" is "true"', () => {
        render(<TasksSubtitle numberOfTasks={1} taskListId={TASK_LIST_ID.INBOX} onToggleOpenClosedTasks={() => ({})}/>)
        expect(screen.queryByText('numberOfTasks')).toBeInTheDocument()
    })

    it('does not render a number of tasks if "showNumberOfTasks" is "false"', () => {
        render(<TasksSubtitle numberOfTasks={1} taskListId={TASK_LIST_ID.INBOX} onToggleOpenClosedTasks={() => ({})} showNumberOfTasks={false}/>)
        expect(screen.queryByText('numberOfTasks')).not.toBeInTheDocument()
    })
})
