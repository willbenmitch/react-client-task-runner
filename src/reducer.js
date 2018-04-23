// @flow
import {
    TASK_ADDED,
    TASK_REMOVED,
    TASK_COMPLETE,
    TASK_FAILED,
    TASK_RETRY,
    TASK_IN_PROGRESS,
    QUEUE_CLEAR,
    QUEUE_RESET,
} from './actionTypes'

import { PENDING } from './statusTypes'

import type { StatusType } from './statusTypes'

import type { Action } from './actions'

export type Task = {
    id: string,
    status: StatusType,
    err?: Error,
}

export type State = {
    [queueName: string]: Task[],
}

const initialState = (queueNames: string[]): State => {
    const state = {}
    queueNames.map(name => (state[name] = []))
    return state
}

export default (queueNames: string[]) => (
    state: State = initialState(queueNames),
    { type, queueName, payload }: Action
) => {
    switch (type) {
        case TASK_ADDED:
            const addedState = { ...state }
            // $FlowFixMe
            const newQueue = addedState[queueName].concat(payload.task)
            // $FlowFixMe
            return { ...addedState, [queueName]: newQueue }

        case TASK_REMOVED:
            const removedState = { ...state }
            // $FlowFixMe
            const removedQueue = removedState[queueName].filter(item => item.id !== payload.task.id)
            // $FlowFixMe
            return { ...state, [queueName]: removedQueue }

        case TASK_RETRY:
            const retryState = { ...state }
            // $FlowFixMe
            const retryQueue = retryState[queueName].map(
                item => (item.id === payload.task.id ? payload.task : item)
            )
            // $FlowFixMe
            return { ...state, [queueName]: retryQueue }

        case QUEUE_CLEAR:
            // $FlowFixMe
            return { ...state, [queueName]: [] }

        case QUEUE_RESET:
            const resetState = { ...state }
            const resetQueue = resetState[queueName].map(item => ({ ...item, status: PENDING }))

            return { ...state, [queueName]: resetQueue }

        case TASK_COMPLETE:
        case TASK_FAILED:
        case TASK_IN_PROGRESS:
            const statusState = { ...state }
            // $FlowFixMe
            const statusQueue = statusState[queueName].map(
                item => (item.id === payload.task.id ? payload.task : item)
            )
            // $FlowFixMe
            return { ...state, [queueName]: statusQueue }

        default:
            return state
    }
}
