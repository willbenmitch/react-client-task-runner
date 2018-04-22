// @flow
import { PureComponent } from 'react'
import { PENDING, IN_PROGRESS, COMPLETE, FAILED } from './statusTypes'

import type { Task } from './reducer'

type OwnProps = {|
    queue: Task[],
    onAction: (task: Task) => void,
    onDone: (task: Task) => void,
|}

type Props = OwnProps

export default class ActionComponent extends PureComponent<Props> {
    handleQueue = () => {
        const { queue } = this.props
        queue.map(task => this.sortTask(task))
    }

    sortTask = (task: Task) => {
        const { onAction, onDone } = this.props
        switch (task.status) {
            case PENDING:
                onAction(task)
                return

            case COMPLETE:
                onDone(task)
                return

            case IN_PROGRESS:
            case FAILED:
                return

            default:
                return
        }
    }

    render() {
        this.handleQueue()

        return null
    }
}
