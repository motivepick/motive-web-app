// @ts-nocheck
import React from 'react'
import ScheduleHeader from '../common/ScheduleHeader'
import { Droppable } from 'react-beautiful-dnd'
import Task from '../common/Task/Task'
import { ITask, ITaskNullable } from '../../models/appModel'

type TDroppableTaskSection = {
    header?: string;
    date?: string;
    droppableId: string;
    tasks: ITask[];
    onTaskClose: (id: number) => void;
    saveTask: (id: number, task: ITaskNullable) => void;
}

const DroppableTaskSection: React.FC<TDroppableTaskSection> = ({ header, date, droppableId, tasks, onTaskClose, saveTask }) => {
    if (!tasks.length) return null
    return (
        <>
            <ScheduleHeader value={header} date={date}/>
            <Droppable droppableId={droppableId}>
                {provided => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {tasks.map(task =>
                            <Task key={task.id} id={task.id} name={task.name} description={task.description}
                                  dueDate={task.dueDate} closed={task.closed}
                                  onTaskClose={onTaskClose} saveTask={saveTask}/>
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </>
    )
}

export default DroppableTaskSection
