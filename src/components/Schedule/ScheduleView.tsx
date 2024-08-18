import { DateTime } from 'luxon'
import React, { FC, useCallback, useState } from 'react'
import { DragDropContext, DraggableLocation, DropResult } from '@hello-pangea/dnd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { updateScheduleTaskPositionIndex } from '../../redux/reducers/scheduleSlice'
import { RootState } from '../../redux/store'
import { useCloseTaskMutation, useSearchScheduleQuery, useUpdateTaskMutation } from '../../redux/taskApi'
import { UpdateTaskRequest } from '../../models/appModel'
import { IScheduleTaskPositionIndex } from '../../models/redux/scheduleActionModel'
import SpinnerView from '../common/Spinner'
import { userChangedLists, userReallyChangedOrder } from '../../utils/dragAndDropUtils'
import DroppableTaskListWithHeader from './DroppableTaskListWithHeader'

const ScheduleView: FC = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()

    const [showEmptyLists, setShowEmptyLists] = useState(false)

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

            const newDay = destination!.droppableId
            if (userChangedLists(source, destination as DraggableLocation) && newDay !== 'overdue') {
                const taskId = parseInt(result.draggableId)
                const dueDate = newDay === 'future'
                    ? DateTime.local().plus({ weeks: 1 }).endOf('day').toUTC()
                    : DateTime.fromISO(newDay!).toUTC()
                updateTaskMutation({ id: taskId, request: { dueDate } })
            }

            dispatch(updateScheduleTaskPositionIndex(scheduleTaskPositionIndex))
            setShowEmptyLists(false)
        }
    }, [dispatch, updateTaskMutation, setShowEmptyLists])

    const closeTask = useCallback(async (id: number) => {
        await closeTaskMutation(id)
    }, [closeTaskMutation])

    const updateTask = useCallback(async (id: number, request: UpdateTaskRequest) => {
        updateTaskMutation({ id, request })
    }, [updateTaskMutation])

    const onDragStart = useCallback(() => setShowEmptyLists(true), [setShowEmptyLists])

    if (isLoading || isFetching) return <SpinnerView/>

    const weekdays = Object
        .keys(schedule)
        .filter(day => !['future', 'overdue'].includes(day))

    // https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/guides/responders.md#timing
    return (
        <DragDropContext onDragEnd={updateTaskPositionIndex} onBeforeCapture={onDragStart}>
            {
                weekdays.map(day =>
                    <DroppableTaskListWithHeader
                        key={day}
                        droppableId={day}
                        isDraggable
                        showEmptyList={showEmptyLists}
                        header={t('dueDate', { date: new Date(day) })}
                        tasks={schedule[day]}
                        onTaskClose={closeTask}
                        onSaveTask={updateTask}
                    />)
            }
            <DroppableTaskListWithHeader
                droppableId="future"
                isDraggable
                showEmptyList={showEmptyLists}
                header={t('futureTasks')}
                tasks={schedule.future}
                onTaskClose={closeTask}
                onSaveTask={updateTask}
            />
            <DroppableTaskListWithHeader
                droppableId="overdue"
                isDraggable
                isDropDisabled
                header={t('overdueTasks')}
                tasks={schedule.overdue}
                onTaskClose={closeTask}
                onSaveTask={updateTask}
            />
        </DragDropContext>
    )
}

export default ScheduleView
