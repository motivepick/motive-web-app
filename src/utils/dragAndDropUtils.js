export const userReallyChangedOrder = (source, destination) =>
    destination && (source.droppableId !== destination.droppableId || source.index !== destination.index)
