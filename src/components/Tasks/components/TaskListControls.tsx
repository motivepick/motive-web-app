import TasksSubtitle from '../../common/TasksSubtitle'
import React from 'react'
import { useTasksStore } from '../../../redux'
import { TASK_LIST } from '../../../models/appModel'

const NoTasks = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
        <img src="/images/no-tasks-eng.png" width="400px" height="400px" className="d-inline-block align-center"
             alt="No Tasks!"/>
    </div>
)

const TaskListControls = () => {
    const { displayedTasks, taskList, setTaskList } = useTasksStore()
    const onToggleList = () => setTaskList(taskList === TASK_LIST.INBOX ? TASK_LIST.CLOSED : TASK_LIST.INBOX)
    return (
        <>
            <TasksSubtitle numberOfTasks={displayedTasks.totalElements} currentList={taskList}
                           onToggleOpenClosedTasks={onToggleList}/>
            {displayedTasks.totalElements === 0 && <NoTasks/>}
        </>

    )
}

export default TaskListControls
