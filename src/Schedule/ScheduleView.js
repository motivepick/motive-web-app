import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import Navigation from '../Navigation/Navigation'
import { translate } from 'react-i18next'
import { bindActionCreators } from 'redux'
import { closeTask, searchSchedule, updateTask } from '../services/taskService'
import { handleServerException } from '../utils/exceptionHandler'
import { fetchUser } from '../services/userService'
import { setUserAction } from '../actions/userActions'
import Footer from '../component/Footer'
import { closeScheduleTaskAction, setScheduleAction, updateScheduleTaskAction, updateScheduleTaskPositionIndexAction } from '../actions/scheduleActions'
import ScheduleHeader from '../component/ScheduleHeader'
import SpinnerView from '../SpinnerView'
import { delay, DELAY_MS } from '../utils/delay'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { userReallyChangedOrder } from '../utils/dragAndDropUtils'
import ScheduleTask from '../Tasks/ScheduleTask'

class ScheduleView extends PureComponent {

    componentDidMount() {
        const { setUser, setSchedule } = this.props
        setUser()
        setSchedule()
    }

    render() {
        const { user, schedule, initialized, closeScheduleTask, updateScheduleTask, t } = this.props
        return (
            <DragDropContext onDragEnd={this.updateTaskPositionIndex}>
                <Navigation history={this.props.history} user={user}/>
                {initialized ? <div>
                    {Object.keys(schedule).filter(day => !['future', 'overdue'].includes(day) && schedule[day].length > 0).map(day => {
                        return (
                            <Fragment key={day}>
                                <ScheduleHeader date={day}/>
                                <Droppable droppableId={day}>
                                    {provided => (
                                        <div {...provided.droppableProps} ref={provided.innerRef}>
                                            {schedule[day].map(task =>
                                                <ScheduleTask key={task.id} id={task.id} name={task.name} description={task.description}
                                                    dueDate={task.dueDate} closed={task.closed} onTaskClose={closeScheduleTask} saveTask={updateScheduleTask}/>
                                            )}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </Fragment>
                        )
                    })}
                    {schedule.future.length > 0 && <Fragment>
                        <ScheduleHeader value={t('futureTasks')}/>
                        <Droppable droppableId="future">
                            {provided => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {schedule.future.map(task =>
                                        <ScheduleTask key={task.id} id={task.id} name={task.name} description={task.description}
                                            dueDate={task.dueDate} closed={task.closed} onTaskClose={closeScheduleTask} saveTask={updateScheduleTask}/>
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </Fragment>}
                    {schedule.overdue.length > 0 && <Fragment>
                        <ScheduleHeader value={t('overdueTasks')}/>
                        <Droppable droppableId="overdue">
                            {provided => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {schedule.overdue.map(task =>
                                        <ScheduleTask key={task.id} id={task.id} name={task.name} description={task.description}
                                            dueDate={task.dueDate} closed={task.closed} onTaskClose={closeScheduleTask} saveTask={updateScheduleTask}/>
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </Fragment>}
                </div> : <SpinnerView/>}
                <Footer/>
            </DragDropContext>
        )
    }

    updateTaskPositionIndex = (result) => {
        const { updateScheduleTaskIndex } = this.props
        const { source, destination } = result
        if (userReallyChangedOrder(source, destination)) {
            updateScheduleTaskIndex(source.droppableId, source.index, destination.droppableId, destination.index)
        }
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

    updateScheduleTaskIndex: (sourceDroppableId, sourceIndex, destinationDroppableId, destinationIndex) => (dispatch) => {
        dispatch(updateScheduleTaskPositionIndexAction(sourceDroppableId, sourceIndex, destinationDroppableId, destinationIndex))
    },

    updateScheduleTask: (id: number, task) => async (dispatch) => {
        try {
            dispatch(updateScheduleTaskAction(await updateTask(id, task)))
        } catch (e) {
            handleServerException(e)
        }
    },

    closeScheduleTask: (id: number) => async (dispatch) => {
        try {
            const values = await Promise.all([closeTask(id), delay(DELAY_MS)])
            dispatch(closeScheduleTaskAction(values[0]))
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(ScheduleView))
