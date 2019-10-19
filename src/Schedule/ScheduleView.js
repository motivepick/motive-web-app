import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import Navigation from '../Navigation/Navigation'
import { translate } from 'react-i18next'
import { bindActionCreators } from 'redux'
import { closeTaskAction, undoCloseTaskAction, updateTaskAction } from '../actions/taskActions'
import { closeTask, searchSchedule, undoCloseTask, updateTask } from '../services/taskService'
import { handleServerException } from '../utils/exceptionHandler'
import { fetchUser } from '../services/userService'
import { updateUserAction } from '../actions/userActions'
import Footer from '../component/Footer'
import { updateScheduleAction } from '../actions/scheduleActions'
import ScheduleHeader from '../component/ScheduleHeader'
import Task from '../Tasks/Task'

class ScheduleView extends PureComponent {

    componentDidMount() {
        const { updateUser, updateSchedule } = this.props
        updateUser()
        updateSchedule()
    }

    render() {
        const { user, schedule, t } = this.props
        const { week } = schedule
        return (
            <Fragment>
                <Navigation history={this.props.history} user={user}/>
                <div>
                    {Object.keys(week).filter(day => week[day].length > 0).map(day => {
                        return (
                            <Fragment key={day}>
                                <ScheduleHeader date={day}/>
                                <div>
                                    {week[day].map(task =>
                                        <Task key={task.id} id={task.id} name={task.name} description={task.description}
                                            dueDate={task.dueDate} closed={task.closed} onTaskClose={this.onTaskClose} saveTask={updateTask}/>
                                    )}
                                </div>
                            </Fragment>
                        )
                    })}
                    {schedule.future.length > 0 && <Fragment>
                        <ScheduleHeader value={t('futureTasks')}/>
                        <div>
                            {schedule.future.map(task =>
                                <Task key={task.id} id={task.id} name={task.name} description={task.description}
                                    dueDate={task.dueDate} closed={task.closed} onTaskClose={this.onTaskClose} saveTask={updateTask}/>
                            )}
                        </div>
                    </Fragment>}
                    {schedule.overdue.length > 0 && <Fragment>
                        <ScheduleHeader value={t('overdueTasks')}/>
                        <div>
                            {schedule.overdue.map(task =>
                                <Task key={task.id} id={task.id} name={task.name} description={task.description}
                                    dueDate={task.dueDate} closed={task.closed} onTaskClose={this.onTaskClose} saveTask={updateTask}/>
                            )}
                        </div>
                    </Fragment>}
                </div>
                <Footer/>
            </Fragment>
        )
    }

    onTaskClose = (id, newValueOfTaskIsClosed) => {
        const { closeOrUndoCloseTask } = this.props
        closeOrUndoCloseTask(id, newValueOfTaskIsClosed)
    }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

    updateUser: () => async (dispatch) => {
        try {
            dispatch(updateUserAction(await fetchUser()))
        } catch (e) {
            handleServerException(e)
        }
    },

    updateSchedule: () => async (dispatch) => {
        try {
            dispatch(updateScheduleAction(await searchSchedule()))
        } catch (e) {
            handleServerException(e)
        }
    },

    updateTask: (id: number, task) => async (dispatch) => {
        try {
            dispatch(updateTaskAction(await updateTask(id, task)))
        } catch (e) {
            handleServerException(e)
        }
    },

    closeOrUndoCloseTask: (id: number, newValueOfTaskIsClosed: boolean) => async (dispatch) => {
        try {
            if (newValueOfTaskIsClosed) {
                dispatch(closeTaskAction(await closeTask(id)))
            } else {
                dispatch(undoCloseTaskAction(await undoCloseTask(id)))
            }
        } catch (e) {
            handleServerException(e)
        }
    }
}, dispatch)

const mapStateToProps = state => ({
    user: state.user.user,
    tasks: state.tasks.closed ? state.tasks.tasks.filter(t => t.closed) : state.tasks.tasks.filter(t => !t.closed),
    initialized: state.tasks.initialized,
    closed: state.tasks.closed,
    schedule: state.schedule.schedule
})

export default connect(mapStateToProps, mapDispatchToProps)(translate('translations')(ScheduleView))
