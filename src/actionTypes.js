// @flow
import * as actionTypes from './actionTypes'
export type ActionType = $Values<typeof actionTypes>

export const TASK_ADDED = 'TASK_ADDED'
export const TASK_IN_PROGRESS = 'TASK_IN_PROGRESS'
export const TASK_REMOVED = 'TASK_REMOVED'
export const TASK_COMPLETE = 'TASK_COMPLETE'
export const TASK_FAILED = 'TASK_FAILED'
export const QUEUE_CLEAR = 'QUEUE_CLEAR'
