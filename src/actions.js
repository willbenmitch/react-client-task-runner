// @flow
import {
    TASK_ADDED,
    TASK_IN_PROGRESS,
    TASK_REMOVED,
    TASK_FAILED,
    TASK_COMPLETE,
    QUEUE_CLEAR,
    TASK_RETRY,
} from './actionTypes'

import { PENDING, IN_PROGRESS, COMPLETE, FAILED } from './statusTypes'

import type { ActionType } from './ActionTypes'
import type { Task } from './reducer'

export type Payload = {|
    task: any,
|}

export type ActionWithoutPayload = {|
    type: ActionType,
    queueName: string,
|}

export type Action = {|
    type: ActionType,
    queueName: string,
    payload: Payload,
|}

export type Dispatch = Action => void

export type Add = (queueName: string, task: Task) => void | Action
export const add: Add = (queueName, task) => ({
    type: TASK_ADDED,
    queueName,
    payload: { task: { ...task, status: PENDING } },
})

export type InProgress = (queueName: string, task: Task) => void | Action
export const inProgress: InProgress = (queueName, task) => ({
    type: TASK_IN_PROGRESS,
    queueName,
    payload: { task: { ...task, status: IN_PROGRESS } },
})

export type Remove = (queueName: string, task: Task) => void | Action
export const remove: Remove = (queueName, task) => ({
    type: TASK_REMOVED,
    queueName,
    payload: { task },
})

export type Complete = (queueName: string, task: Task) => void | Action
export const complete: Complete = (queueName, task) => ({
    type: TASK_COMPLETE,
    queueName,
    payload: { task: { ...task, status: COMPLETE } },
})

export type Failed = (queueName: string, task: Task) => void | Action
export const failed: Failed = (queueName, task) => ({
    type: TASK_FAILED,
    queueName,
    payload: { task: { ...task, status: FAILED } },
})

export type QueueClear = (queueName: string) => void | ActionWithoutPayload
export const queueClear: QueueClear = queueName => ({
    type: QUEUE_CLEAR,
    queueName,
})

export type Retry = (queueName: string, task: Task) => void | Action
export const retry: Retry = (queueName, task) => ({
    type: TASK_RETRY,
    queueName,
    payload: { task: { ...task, status: PENDING } },
})
