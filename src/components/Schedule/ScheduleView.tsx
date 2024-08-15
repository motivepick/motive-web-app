// @ts-nocheck
import React, { FC, useCallback, useEffect } from 'react'
import { DragDropContext, DraggableLocation, DropResult } from '@hello-pangea/dnd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { closeScheduleTask, setSchedule, updateScheduleTaskPositionIndexAction } from '../../redux/actions/scheduleActions'
import { updateScheduleTask } from '../../redux/reducers/scheduleSlice'
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

    const { data: schedule, isLoading, isFetching } = useSearchScheduleQuery()
    // const [closeTask] = useCloseTaskMutation()
    const [updateTask] = useUpdateTaskMutation()

    useEffect(() => {
        dispatch(setSchedule())
    }, [dispatch])

    const updateTaskPositionIndex = useCallback((result: DropResult) => {
        const { source, destination } = result
        if (userReallyChangedOrder(source, destination as DraggableLocation)) {
            const scheduleTaskPositionIndex: IScheduleTaskPositionIndex = {
                sourceDroppableId: source.droppableId,
                sourceIndex: source.index,
                destinationDroppableId: destination!.droppableId,
                destinationIndex: destination!.index
            }
            dispatch(updateScheduleTaskPositionIndexAction(scheduleTaskPositionIndex))
        }
    }, [dispatch])

    const closeTask = useCallback(async (id: number) => {
        dispatch(closeScheduleTask(id))
    }, [dispatch])

    const updateTask = useCallback(async (id: number, task: ITask) => {
        dispatch(updateScheduleTask(id, task))
    }, [dispatch])

    const handleUpdateTask = useCallback((task: ITask) => {
        updateTask(task)
        dispatch(updateScheduleTask(task))
    }, [updateTask, dispatch])

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
                        onSaveTask={handleUpdateTask}
                    />)
            }
            <DroppableTaskListWithHeader
                droppableId="future"
                header={t('futureTasks')}
                tasks={schedule.future}
                onTaskClose={closeTask}
                onSaveTask={handleUpdateTask}
            />
            <DroppableTaskListWithHeader
                droppableId="overdue"
                header={t('overdueTasks')}
                tasks={schedule.overdue}
                onTaskClose={closeTask}
                onSaveTask={handleUpdateTask}
            />
        </DragDropContext>
    )
}

export default ScheduleView
