export const copyOfListWithUpdatedTask = (tasks, task) => {
    const result = []
    for (const t of tasks) {
        result.push(t.id === task.id ? { ...t, ...task } : t)
    }
    return result
}
