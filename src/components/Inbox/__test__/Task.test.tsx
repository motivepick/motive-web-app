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

const task = () => <Task
    id={382}
    name="Athens and Thessaloniki: check activities"
    description="If it wasn't split yet, remind the creator to do it."
    closed={false}
    isDraggable={false}
    draggableId={'382'}
    index={0}
    saveTask={jest.fn()}
    onTaskClose={jest.fn()}
>
    {noop}
</Task>

describe('Task', () => {
    it('opens task form when the calendar icon is clicked', () => {
        render(task())
        const descriptionIcon = screen.getByTestId('description-icon')
        fireEvent.click(descriptionIcon)
        expect(screen.queryByTestId('task-form')).toBeInTheDocument()
    })

    it('does not open task form when the check mark icon is clicked', () => {
        render(task())
        const descriptionIcon = screen.getByTestId('check-mark-icon')
        fireEvent.click(descriptionIcon)
        expect(screen.queryByTestId('task-form')).not.toBeInTheDocument()
    })
})
