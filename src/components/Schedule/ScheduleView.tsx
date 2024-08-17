import React, { FC, useCallback } from 'react'
import { DragDropContext, DraggableLocation, DropResult } from '@hello-pangea/dnd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { updateScheduleTaskPositionIndex } from '../../redux/reducers/scheduleSlice'
import { RootState } from '../../redux/store'
import { useCloseTaskMutation, useSearchScheduleQuery, useUpdateTaskMutation } from '../../redux/taskApi'
import PageLayout from '../common/PageLayout'
import { ITask } from '../../models/appModel'
import { IScheduleTaskPositionIndex } from '../../models/redux/scheduleActionModel'
import SpinnerView from '../common/Spinner'
import { userReallyChangedOrder } from '../../utils/dragAndDropUtils'
import DroppableTaskListWithHeader from './DroppableTaskListWithHeader'

const ScheduleView: FC = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()

    const schedule = useSelector((state: RootState) => state.schedule)
    const { isLoading, isFetching } = useSearchScheduleQuery()
    const [updateTaskMutation] = useUpdateTaskMutation()
    const [closeTaskMutation] = useCloseTaskMutation()

    const updateTaskPositionIndex = useCallback((result: DropResult) => {
        const { source, destination } = result
        if (userReallyChangedOrder(source, destination as DraggableLocation)) {
            const scheduleTaskPositionIndex: IScheduleTaskPositionIndex = {
                sourceDroppableId: source.droppableId,
                sourceIndex: source.index,
                destinationDroppableId: destination!.droppableId,
                destinationIndex: destination!.index
            }
            dispatch(updateScheduleTaskPositionIndex(scheduleTaskPositionIndex))
        }
    }, [dispatch])

    const closeTask = useCallback(async (id: number) => {
        await closeTaskMutation(id)
    }, [closeTaskMutation])

    const updateTask = useCallback(async (id: number, task: ITask) => {
        updateTaskMutation({ id, task })
    }, [updateTaskMutation])

    if (isLoading || isFetching) return <SpinnerView/>

    const weekdays = Object
        .keys(schedule)
        .filter(day => !['future', 'overdue'].includes(day) && schedule[day].length > 0)

    return (
        <DragDropContext onDragEnd={updateTaskPositionIndex}>
            {
                weekdays.map(day =>
                    <DroppableTaskListWithHeader
                        key={day}
                        droppableId={day}
                        header={t('dueDate', { date: new Date(day) })}
                        tasks={schedule[day]}
                        onTaskClose={closeTask}
                        onSaveTask={updateTask}
                    />)
            }
            <DroppableTaskListWithHeader
                droppableId="future"
                header={t('futureTasks')}
                tasks={schedule.future}
                onTaskClose={closeTask}
                onSaveTask={updateTask}
            />
            <DroppableTaskListWithHeader
                droppableId="overdue"
                header={t('overdueTasks')}
                tasks={schedule.overdue}
                onTaskClose={closeTask}
                onSaveTask={updateTask}
            />
        </DragDropContext>
    )
}

export default ScheduleView
