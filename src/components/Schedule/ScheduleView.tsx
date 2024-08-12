// @ts-nocheck
import React, { PureComponent } from 'react'
import { DragDropContext, DraggableLocation, DropResult } from '@hello-pangea/dnd'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import {
    closeScheduleTaskAction,
    setScheduleAction,
    updateScheduleTaskAction,
    updateScheduleTaskPositionIndexAction
} from '../../redux/actions/scheduleActions'
import { closeTaskAction, updateTaskAction } from '../../redux/actions/taskActions'
import { setUserAction } from '../../redux/actions/userActions'
import PageLayout from '../common/PageLayout'
import { ITask } from '../../models/appModel'
import { IScheduleTaskPositionIndex } from '../../models/redux/scheduleActionModel'
import { AppState, ScheduleState, UserState } from '../../models/redux/stateModel'
import { selectInitialized, selectSchedule } from '../../redux/selectors/scheduleSelectors'
import { selectUser } from '../../redux/selectors/userSelectors'
import { closeTask, searchSchedule, updateTask } from '../../services/taskService'
import { fetchUser } from '../../services/userService'
import SpinnerView from '../common/Spinner'
import { delay, DELAY_MS } from '../../utils/delay'
import { userReallyChangedOrder } from '../../utils/dragAndDropUtils'
import { handleServerException } from '../../utils/exceptionHandler'
import DroppableTaskListWithHeader from './DroppableTaskListWithHeader'

import React, { useEffect, useCallback } from 'react'
import { DragDropContext, DraggableLocation, DropResult } from '@hello-pangea/dnd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
    closeScheduleTaskAction,
    setScheduleAction,
    updateScheduleTaskAction,
    updateScheduleTaskPositionIndexAction
} from '../../redux/actions/scheduleActions'
import { closeTaskAction, updateTaskAction } from '../../redux/actions/taskActions'
import { setUserAction } from '../../redux/actions/userActions'
import PageLayout from '../common/PageLayout'
import { ITask } from '../../models/appModel'
import { IScheduleTaskPositionIndex } from '../../models/redux/scheduleActionModel'
import { AppState } from '../../models/redux/stateModel'
import { selectInitialized, selectSchedule } from '../../redux/selectors/scheduleSelectors'
import { selectUser } from '../../redux/selectors/userSelectors'
import { closeTask, searchSchedule, updateTask } from '../../services/taskService'
import { fetchUser } from '../../services/userService'
import SpinnerView from '../common/Spinner'
import { delay, DELAY_MS } from '../../utils/delay'
import { userReallyChangedOrder } from '../../utils/dragAndDropUtils'
import { handleServerException } from '../../utils/exceptionHandler'
import DroppableTaskListWithHeader from './DroppableTaskListWithHeader'

const ScheduleView: React.FC = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const user = useSelector(selectUser)
    const schedule = useSelector(selectSchedule)
    const initialized = useSelector(selectInitialized)

    useEffect(() => {
        const setUser = async () => {
            try {
                dispatch(setUserAction(await fetchUser()))
            } catch (e) {
                handleServerException(e)
            }
        }

        const setSchedule = async () => {
            try {
                dispatch(setScheduleAction(await searchSchedule()))
            } catch (e) {
                handleServerException(e)
            }
        }

        setUser()
        setSchedule()
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

    const closeScheduleTask = useCallback(async (id: number) => {
        try {
            const values = await Promise.all([closeTask(id), delay(DELAY_MS)])
            const closedTask = values[0]
            dispatch(closeScheduleTaskAction(closedTask))
            dispatch(closeTaskAction(closedTask))
        } catch (e) {
            handleServerException(e)
        }
    }, [dispatch])

    const updateScheduleTask = useCallback(async (id: number, task: ITask) => {
        try {
            const updatedTask = await updateTask(id, task)
            dispatch(updateScheduleTaskAction(updatedTask))
            dispatch(updateTaskAction(updatedTask))
        } catch (e) {
            handleServerException(e)
        }
    }, [dispatch])

    if (!initialized) return <PageLayout user={user}><SpinnerView/></PageLayout>

    const weekdays = Object
        .keys(schedule)
        .filter(day => !['future', 'overdue'].includes(day) && schedule[day].length > 0)

    return (
        <PageLayout user={user}>
            <DragDropContext onDragEnd={updateTaskPositionIndex}>
                <>
                    {
                        weekdays.map(day =>
                            <DroppableTaskListWithHeader key={day} droppableId={day} header={t('{{ date, DATE_SHORT_RELATIVE }}', { date: new Date(day) })} tasks={schedule[day]} onTaskClose={closeScheduleTask} onSaveTask={updateScheduleTask}/>)
                    }
                    <DroppableTaskListWithHeader droppableId="future" header={t('futureTasks')} tasks={schedule.future} onTaskClose={closeScheduleTask} onSaveTask={updateScheduleTask}/>
                    <DroppableTaskListWithHeader droppableId="overdue" header={t('overdueTasks')} tasks={schedule.overdue} onTaskClose={closeScheduleTask} onSaveTask={updateScheduleTask}/>
                </>
            </DragDropContext>
        </PageLayout>
    )
}

export default ScheduleView

class ScheduleView extends PureComponent {

    componentDidMount() {
        const { setUser, setSchedule } = this.props
        setUser()
        setSchedule()
    }

    render() {
        const { user, schedule, initialized, closeScheduleTask, updateScheduleTask, t } = this.props
        if (!initialized) return <PageLayout user={user}><SpinnerView/></PageLayout>

        const weekdays = Object
            .keys(schedule)
            .filter(day => !['future', 'overdue'].includes(day) && schedule[day].length > 0)

        return (
            <PageLayout user={user}>
                <DragDropContext onDragEnd={this.updateTaskPositionIndex}>
                    <>
                        {
                            weekdays.map(day =>
                                <DroppableTaskListWithHeader key={day} droppableId={day} header={t('{{ date, DATE_SHORT_RELATIVE }}', { date: new Date(day) })} tasks={schedule[day]} onTaskClose={closeScheduleTask} onSaveTask={updateScheduleTask}/>)
                        }
                        <DroppableTaskListWithHeader droppableId="future" header={t('futureTasks')} tasks={schedule.future} onTaskClose={closeScheduleTask} onSaveTask={updateScheduleTask}/>
                        <DroppableTaskListWithHeader droppableId="overdue" header={t('overdueTasks')} tasks={schedule.overdue} onTaskClose={closeScheduleTask} onSaveTask={updateScheduleTask}/>
                    </>
                </DragDropContext>
            </PageLayout>
        )
    }

    updateTaskPositionIndex = (result: DropResult) => {
        const { updateScheduleTaskIndex } = this.props
        const { source, destination } = result
        if (userReallyChangedOrder(source, destination as DraggableLocation)) {
            const scheduleTaskPositionIndex: IScheduleTaskPositionIndex = {
                sourceDroppableId: source.droppableId,
                sourceIndex: source.index,
                destinationDroppableId: destination!.droppableId,
                destinationIndex: destination!.index
            }
            updateScheduleTaskIndex(scheduleTaskPositionIndex)
        }
    }
}

const setUser = () => async (dispatch: Dispatch) => {
    try {
        dispatch(setUserAction(await fetchUser()))
    } catch (e) {
        handleServerException(e)
    }
}

const setSchedule = () => async (dispatch: Dispatch) => {
    try {
        dispatch(setScheduleAction(await searchSchedule()))
    } catch (e) {
        handleServerException(e)
    }
}

const updateScheduleTaskIndex = (scheduleTaskPositionIndex: IScheduleTaskPositionIndex) => (dispatch: Dispatch) => {
    dispatch(updateScheduleTaskPositionIndexAction(scheduleTaskPositionIndex))
}

const updateScheduleTask = (id: number, task: ITask) => async (dispatch: Dispatch) => {
    try {
        const updatedTask = await updateTask(id, task)
        dispatch(updateScheduleTaskAction(updatedTask))
        dispatch(updateTaskAction(updatedTask))
    } catch (e) {
        handleServerException(e)
    }
}

const closeScheduleTask = (id: number) => async (dispatch: Dispatch) => {
    try {
        const values = await Promise.all([closeTask(id), delay(DELAY_MS)])
        const closedTask = values[0]
        dispatch(closeScheduleTaskAction(closedTask))
        dispatch(closeTaskAction(closedTask))
    } catch (e) {
        handleServerException(e)
    }
}

type ActionCreators = {
    setSchedule: () => (dispatch: Dispatch) => Promise<void>;
    closeScheduleTask: (id: number) => (dispatch: Dispatch) => Promise<void>;
    updateScheduleTask: (id: number, task: ITask) => (dispatch: Dispatch) => Promise<void>;
    updateScheduleTaskIndex: (scheduleTaskPositionIndex: IScheduleTaskPositionIndex) => (dispatch: Dispatch) => void;
    setUser: () => (dispatch: Dispatch) => Promise<void>
}

const actionCreators: ActionCreators = {
    setUser,
    setSchedule,
    updateScheduleTaskIndex,
    updateScheduleTask,
    closeScheduleTask
}

const mapDispatchToProps = (dispatch: Dispatch): ActionCreators => bindActionCreators(actionCreators, dispatch)

type MapStateToPropsTypes = UserState & ScheduleState

const mapStateToProps = (state: AppState): MapStateToPropsTypes => ({
    user: selectUser(state),
    schedule: selectSchedule(state),
    initialized: selectInitialized(state)
})

export default connect<MapStateToPropsTypes, ActionCreators>(mapStateToProps, mapDispatchToProps)(withTranslation()(ScheduleView))
