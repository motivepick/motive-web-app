import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import Navigation from '../Navigation/Navigation'
import { translate } from 'react-i18next'
import { bindActionCreators } from 'redux'
import { closeTaskAction, undoCloseTaskAction, updateTaskAction } from '../actions/taskActions'
import { closeTask, searchSchedule, undoCloseTask, updateTask } from '../services/taskService'
import { handleServerException } from '../utils/exceptionHandler'
import { fetchUser } from '../services/userService'
import { setUserAction } from '../actions/userActions'
import Footer from '../component/Footer'
import { setScheduleAction } from '../actions/scheduleActions'
import ScheduleHeader from '../component/ScheduleHeader'
import Task from '../Tasks/Task'
import SpinnerView from '../SpinnerView'

class ScheduleView extends PureComponent {

    componentDidMount() {
        const { setUser, setSchedule } = this.props
        setUser()
        setSchedule()
    }

    render() {
        const { user, schedule, initialized, t } = this.props
        const { week } = schedule
        return (
            <Fragment>
                <Navigation history={this.props.history} user={user}/>
                {initialized ? <div>
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
                </div> : <SpinnerView/>}
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

    setUser: () => async (dispatch) => {
        try {
            dispatch(setUserAction(await fetchUser()))
        } catch (e) {
            handleServerException(e)
        }
    },

    setSchedule: () => async (dispatch) => {
        try {
            dispatch(setScheduleAction(await searchSchedule()))
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
    schedule: state.schedule.schedule,
    initialized: state.schedule.initialized
})

export default connect(mapStateToProps, mapDispatchToProps)(translate('translations')(ScheduleView))
