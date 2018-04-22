// @flow
import * as React from 'react'

import Queue from '../../src/TaskRunnerComponent'
import type { Task } from '../../src/reducer'

type Props = {|
    onDone: number => void,
    onFailed: (task: Task) => void,
|}

type State = {
    counter: number,
}

export default class Test extends React.PureComponent<Props, State> {
    counter = 0

    handleAction = (task: Task): Promise<Task> =>
        new Promise((resolve, reject) => {
            setTimeout(() => {
                this.counter += 1
                if (Number(task.id) > 50000) {
                    resolve(task)
                    return
                } else {
                    reject(task)
                    return
                }
            }, 2000)
        })

    handleDone = () => this.props.onDone(this.counter)

    handleFailed = (task: Task) => this.props.onFailed(task)

    render() {
        return (
            <Queue
                queueName={'TEST'}
                onAction={this.handleAction}
                onDone={this.handleDone}
                onFailed={this.handleFailed}
            />
        )
    }
}
