import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import Navigation from '../Navigation/Navigation'
import { translate } from 'react-i18next'
import { bindActionCreators } from 'redux'
import {
    closeTaskAction,
    createTaskAction,
    toggleOpenClosedTasksAction,
    undoCloseTaskAction,
    updateTaskAction,
    updateUserTasksAction
} from '../actions/taskActions'
import { closeTask, createTask, searchUserTasks, undoCloseTask, updateTask } from '../services/taskService'
import { handleServerException } from '../utils/exceptionHandler'
import { fetchUser } from '../services/userService'
import { updateUserAction } from '../actions/userActions'

class ScheduleView extends PureComponent {

    componentDidMount() {
        const { updateUser, updateUserTasks } = this.props
        updateUser()
        updateUserTasks()
    }

    render() {
        const { user } = this.props
        return (
            <Fragment>
                <Navigation history={this.props.history} user={user}/>
                <div>

                </div>
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

    updateUserTasks: () => async (dispatch) => {
        try {
            dispatch(updateUserTasksAction(await searchUserTasks()))
        } catch (e) {
            handleServerException(e)
        }
    },

    createTask: task => async (dispatch) => {
        try {
            dispatch(createTaskAction(await createTask(task)))
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
    },

    toggleOpenClosedTasks: (closed: boolean) => (dispatch) => {
        try {
            dispatch(toggleOpenClosedTasksAction(closed))
        } catch (e) {
            handleServerException(e)
        }
    },

    showError: () => () => {
    }
}, dispatch)

const mapStateToProps = state => ({
    user: state.user.user,
    tasks: state.tasks.closed ? state.tasks.tasks.filter(t => t.closed) : state.tasks.tasks.filter(t => !t.closed),
    initialized: state.tasks.initialized,
    closed: state.tasks.closed
})

export default connect(mapStateToProps, mapDispatchToProps)(translate('translations')(ScheduleView))
