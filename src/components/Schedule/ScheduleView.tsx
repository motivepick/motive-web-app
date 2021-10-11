// @ts-nocheck
import { History } from 'history'
import React, { MouseEventHandler, PureComponent } from 'react'
import { DraggableLocation, DropResult } from 'react-beautiful-dnd'
import { withTranslation, WithTranslation } from 'react-i18next'
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
import { ISchedule, ITask, IUser } from '../../models/appModel'
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
import DraggableLayout from '../layouts/DraggableLayout'
import DroppableTaskSection from './DroppableTaskSection'

interface ScheduleViewProps extends WithTranslation {
    user: IUser;
    schedule: ISchedule;
    initialized: boolean;
    updateScheduleTask: (id: number, task: ITask) => void;
    updateScheduleTaskIndex: (arg: IScheduleTaskPositionIndex | DropResult) => void;
    setUser: () => void;
    setSchedule: () => void;
    closeScheduleTask: () => void;
    onToggleOpenClosedTasks: MouseEventHandler;
    history: History;
}

interface ScheduleViewState {
    user: IUser;
    schedule: ISchedule;
    initialized: boolean;
}

class ScheduleView extends PureComponent<ScheduleViewProps, ScheduleViewState> {

    componentDidMount() {
        const { setUser, setSchedule } = this.props
        setUser()
        setSchedule()
    }

    render() {
        const { user, schedule, initialized, closeScheduleTask, updateScheduleTask, t } = this.props
        return (
            <DraggableLayout onDragEnd={this.updateTaskPositionIndex} user={user}>
                {initialized ? <div>
                    {Object.keys(schedule)
                        .filter(day => !['future', 'overdue'].includes(day) && schedule[day].length > 0)
                        .map(day => (
                                <DroppableTaskSection key={day} droppableId={day} date={day} tasks={schedule[day]}
                                                      onTaskClose={closeScheduleTask} saveTask={updateScheduleTask}/>
                            )
                        )}
                    <DroppableTaskSection droppableId="future" header={t('futureTasks')} tasks={schedule.future}
                                          onTaskClose={closeScheduleTask} saveTask={updateScheduleTask}/>
                    <DroppableTaskSection droppableId="overdue" header={t('overdueTasks')} tasks={schedule.overdue}
                                          onTaskClose={closeScheduleTask} saveTask={updateScheduleTask}/>
                </div> : <SpinnerView/>}
            </DraggableLayout>
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
