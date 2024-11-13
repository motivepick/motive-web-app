import '@testing-library/jest-dom'
import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import Task from '../Task'
import { DraggableChildrenFn } from '@hello-pangea/dnd'

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (str: string) => str
    })
}))

const noop: DraggableChildrenFn = () => null

const task = () => (
    <Task
        id={382}
        name="Athens and Thessaloniki: check activities on https://www.tripadvisor.com"
        description="If it wasn't split yet, remind the creator to do it."
        closed={false}
        isDraggable={false}
        draggableId="382"
        index={0}
        saveTask={jest.fn()}
        onTaskClose={jest.fn()}
    >
        {noop}
    </Task>
)

describe('Task', () => {
    it('opens task form when the calendar icon is clicked', () => {
        render(task())
        fireEvent.click(screen.getByTestId('description-icon'))
        expect(screen.queryByTestId('task-form')).toBeInTheDocument()
    })

    it('does not open task form when the check mark icon is clicked', () => {
        render(task())
        fireEvent.click(screen.getByTestId('check-mark-icon'))
        expect(screen.queryByTestId('task-form')).not.toBeInTheDocument()
    })

    it('does not open task form when the anchor (link) is clicked', () => {
        render(task())
        fireEvent.click(screen.getByRole('link', { name: 'https://www.tripadvisor.com' }))
        expect(screen.queryByTestId('task-form')).not.toBeInTheDocument()
    })

    it('does not close task form when an element on the form is clicked', () => {
        render(task())
        fireEvent.click(screen.getByTestId('description-icon'))
        fireEvent.click(screen.getByTestId('input-text'))
        expect(screen.queryByTestId('task-form')).toBeInTheDocument()
    })
})
