import React, { FC, useCallback } from 'react'
import { DragDropContext, DraggableLocation, DropResult } from '@hello-pangea/dnd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { useCloseTaskMutation, useFetchScheduleQuery, useUpdateTaskMutation, useUpdateTasksOrderAsyncMutation } from '../../redux/api'
import { UpdateTaskRequest } from '../../models/appModel'
import SpinnerView from '../common/Spinner'
import { userReallyChangedOrder } from '../../utils/dragAndDropUtils'
import DroppableTaskListWithHeader from './DroppableTaskListWithHeader'
import { updateScheduleTasksOrder } from '../../redux/reducers/tasksSlice'

const ScheduleView: FC = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch<AppDispatch>()

    const byId = useSelector((state: RootState) => state.tasks.byId)
    const schedule = useSelector((state: RootState) => state.tasks.taskLists)
    const { isLoading, isFetching } = useFetchScheduleQuery()
    const [updateTaskMutation] = useUpdateTaskMutation()
    const [updateTasksOrderAsyncMutation] = useUpdateTasksOrderAsyncMutation()
    const [closeTaskMutation] = useCloseTaskMutation()

    const updateTaskPositionIndex = useCallback((result: DropResult) => {
        const { draggableId, source, destination } = result
        if (userReallyChangedOrder(source, destination as DraggableLocation)) {
            const newDay = destination!.droppableId
            if (newDay !== 'overdue') {
                dispatch(updateScheduleTasksOrder({
                    sourceListType: source.droppableId,
                    taskId: parseInt(draggableId),
                    destinationListType: destination!.droppableId,
                    destinationIndex: destination!.index
                }))
            }
        }
    }, [dispatch, updateTasksOrderAsyncMutation])

    const closeTask = useCallback(async (id: number) => {
        await closeTaskMutation(id)
    }, [closeTaskMutation])

    const updateTask = useCallback(async (id: number, request: UpdateTaskRequest) => {
        updateTaskMutation({ id, request })
    }, [updateTaskMutation])

    if (isLoading || isFetching) return <SpinnerView/>

    const weekdays = Object
        .keys(schedule)
        .filter(day => day.startsWith('SCHEDULE'))
    return (
        <DragDropContext onDragEnd={updateTaskPositionIndex}>
            {
                weekdays.map(day =>
                    <DroppableTaskListWithHeader
                        key={day}
                        droppableId={day}
                        isDraggable
                        header={t('dueDate', { date: schedule[day].meta.day })}
                        tasks={schedule[day].allIds.map(id => byId[id])}
                        onTaskClose={closeTask}
                        onSaveTask={updateTask}
                    />)
            }
            <DroppableTaskListWithHeader
                droppableId="FUTURE"
                isDraggable
                header={t('futureTasks')}
                tasks={schedule['FUTURE'].allIds.map(id => byId[id])}
                onTaskClose={closeTask}
                onSaveTask={updateTask}
            />
            <DroppableTaskListWithHeader
                droppableId="OVERDUE"
                isDraggable
                isDropDisabled
                header={t('overdueTasks')}
                tasks={schedule['OVERDUE'].allIds.map(id => byId[id])}
                onTaskClose={closeTask}
                onSaveTask={updateTask}
            />
        </DragDropContext>
    )
}

export default ScheduleView
