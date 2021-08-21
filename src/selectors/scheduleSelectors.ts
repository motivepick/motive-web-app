import { ISchedule } from '../models'
import { AppState } from './state.model'

export const selectSchedule = (state: AppState): ISchedule => state.schedule.schedule

export const selectInitialized = (state: AppState): boolean => state.schedule.initialized
