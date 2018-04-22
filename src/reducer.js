// @flow
import {
    TASK_ADDED,
    TASK_REMOVED,
    TASK_COMPLETE,
    TASK_FAILED,
    QUEUE_CLEAR,
    TASK_IN_PROGRESS,
} from './actionTypes'

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

        case QUEUE_CLEAR:
            // $FlowFixMe
            return { ...state, [queueName]: [] }

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
