// @ts-nocheck
import React, { FC, useCallback, useEffect } from 'react'
import { DragDropContext, DraggableLocation, DropResult } from '@hello-pangea/dnd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { closeScheduleTask, setSchedule, updateScheduleTask, updateScheduleTaskPositionIndexAction } from '../../redux/actions/scheduleActions'
import PageLayout from '../common/PageLayout'
import { ITask } from '../../models/appModel'
import { IScheduleTaskPositionIndex } from '../../models/redux/scheduleActionModel'
import { selectInitialized, selectSchedule } from '../../redux/selectors/scheduleSelectors'
import SpinnerView from '../common/Spinner'
import { userReallyChangedOrder } from '../../utils/dragAndDropUtils'
import DroppableTaskListWithHeader from './DroppableTaskListWithHeader'

const ScheduleView: FC = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const schedule = useSelector(selectSchedule)
    const initialized = useSelector(selectInitialized)

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

    if (!initialized) return <PageLayout><SpinnerView/></PageLayout>

    const weekdays = Object
        .keys(schedule)
        .filter(day => !['future', 'overdue'].includes(day) && schedule[day].length > 0)

    return (
        <PageLayout>
            <DragDropContext onDragEnd={updateTaskPositionIndex}>
                {
                    weekdays.map(day =>
                        <DroppableTaskListWithHeader
                            key={day}
                            droppableId={day}
                            header={t('{{ date, DATE_SHORT_RELATIVE }}', { date: new Date(day) })}
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
        </PageLayout>
    )
}

export default ScheduleView
