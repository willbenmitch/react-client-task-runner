// @flow
import * as React from 'react'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import configureStore from './configureStore'
import { TASK_ADDED, TASK_REMOVED, QUEUE_CLEAR, TASK_RETRY, QUEUE_RESET } from './actionTypes'
import * as statusTypes from './statusTypes'

import type { Task as ReducerTask } from './reducer'
import type { Action, ActionWithoutPayload } from './actions'
import TaskRunnerComponent from './TaskRunnerComponent'

export type Task = ReducerTask

export type Props = {|
    queueNames: string[],
    storage: React.Node,
    children?: React.Node[],
|}

let store
let persistor

export default class TaskRunner extends React.PureComponent<Props> {
    componentDidMount() {
        const { queueNames, storage } = this.props
        const configured = configureStore(queueNames, storage)
        store = configured.store
        persistor = configured.persistor
    }

    render() {
        const { children } = this.props
        if (store && persistor)
            return (
                <Provider store={store}>
                    <PersistGate persistor={persistor}>{children}</PersistGate>
                </Provider>
            )

        return null
    }
}

export const Queue = TaskRunnerComponent

export type AddTask = (queueName: string, task: ReducerTask) => void | Action
export const addTask: AddTask = (queueName, task) => {
    if (store)
        return store.dispatch({
            type: TASK_ADDED,
            queueName,
            payload: { task: { ...task, status: PENDING } },
        })

    return
}

export type RemoveTask = (queueName: string, task: ReducerTask) => void | Action
export const removeTask: RemoveTask = (queueName, task) => {
    if (store)
        return store.dispatch({
            type: TASK_REMOVED,
            queueName,
            payload: { task },
        })

    return
}

export type RetryTask = (queueName: string, task: ReducerTask) => void | Action
export const retryTask: RetryTask = (queueName, task) => {
    if (store)
        return store.dispatch({
            type: TASK_RETRY,
            queueName,
            payload: { task: { ...task, status: PENDING } },
        })

    return
}

export type ClearQueue = (queueName: string) => void | ActionWithoutPayload
export const clearQueue: ClearQueue = queueName => {
    if (store)
        return store.dispatch({
            type: QUEUE_CLEAR,
            queueName,
        })

    return
}

export type ResetQueue = (queueName: string) => void | ActionWithoutPayload
export const resetQueue: ResetQueue = queueName => {
    if (store)
        return store.dispatch({
            type: QUEUE_RESET,
            queueName,
        })
}

export type GetQueue = (queueName: string) => void | ReducerTask[]
export const getQueue: GetQueue = queueName => {
    if (store) return store.getState().queues[queueName]

    return
}

export const PENDING = statusTypes.PENDING
export const IN_PROGRESS = statusTypes.IN_PROGRESS
export const COMPLETE = statusTypes.COMPLETE
export const FAILED = statusTypes.FAILED
