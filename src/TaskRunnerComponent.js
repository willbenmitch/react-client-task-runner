// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import ActionComponent from './ActionComponent'

import { inProgress, complete, failed, remove, reset } from './actions'

import type { InProgress, Complete, Failed, Remove, Reset } from './actions'

import type { Task } from './reducer'

export type Queue = {|
    [queueName: string]: Task[],
|}

type ConnectedProps = {|
    queues: Queue,
    inProgressAction: InProgress,
    completeAction: Complete,
    failedAction: Failed,
    removeAction: Remove,
    resetAction: Reset,
|}

type OwnProps = {|
    queueName: string,
    onAction: (task: Task) => Promise<Task>,
    onDone: (task: Task) => void,
    onFailed: (task: Task) => void,
|}

type Props = OwnProps & ConnectedProps

class TaskRunnerComponent extends PureComponent<Props> {
    componentDidMount() {
        const { queueName, resetAction } = this.props
        const queue = this.props.queues[queueName]
        resetAction(queueName)
    }

    handleTaskAction = (task: Task) => {
        const { queueName, onAction, inProgressAction, completeAction } = this.props
        inProgressAction(queueName, task)
        onAction(task)
            .then(result => completeAction(queueName, result))
            .catch(err => this.handleTaskFailed(task, err))
    }

    handleTaskFailed = (task: Task, err: Error) => {
        const { queueName, onFailed, failedAction } = this.props
        failedAction(queueName, { ...task, err })
        onFailed(task)
    }

    handleTaskComplete = (task: Task) => {
        const { queueName, onDone, removeAction } = this.props
        removeAction(queueName, task)
        onDone(task)
    }

    render() {
        const { queueName } = this.props
        const queue = this.props.queues[queueName]

        if (!queue) console.error('No queueName exists with that string')

        return (
            <ActionComponent
                queue={queue}
                onAction={this.handleTaskAction}
                onDone={this.handleTaskComplete}
            />
        )
    }
}

export default connect(({ queues }) => ({ queues }), {
    inProgressAction: inProgress,
    completeAction: complete,
    failedAction: failed,
    removeAction: remove,
    resetAction: reset,
})(TaskRunnerComponent)
