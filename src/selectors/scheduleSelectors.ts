import { ISchedule } from '../models/appModel'
import { AppState } from '../models/redux/stateModel'

export const selectSchedule = (state: AppState): ISchedule => state.schedule.schedule

export const selectInitialized = (state: AppState): boolean => state.schedule.initialized
