import { DraggableLocation } from '@hello-pangea/dnd'

export const userReallyChangedOrder = (source: DraggableLocation, destination: DraggableLocation | null): boolean =>
    !!destination && (source.droppableId !== destination.droppableId || source.index !== destination.index)

export const userChangedLists = (source: DraggableLocation, destination: DraggableLocation): boolean =>
    destination && source.droppableId !== destination.droppableId