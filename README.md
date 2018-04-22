### A client side task runner for react and react-native applications.

## Purpose
`react-task-runner` performs asynchronous tasks in the background of a react or react-native application.

## Installation
`npm install react-task-runner`

## Run a Test App
### Dependencies
The Test app is a react native application. You will need to follow react-native getting started if you don't have react-native setup already.

### Clone, install & Run
`git clone https://github.com/willbenmitch/react-client-task-runner.git`
`cd TaskRunner && npm install`
`cd TestApp && npm install`
`npm start`

## Basic Usage
The intended usage is to render the `<TaskRunner />` component at the top level of where you would like tasks to be run.
`TaskRunner` accepts two properties a list of `queueNames` (unique strings to identify your different task queues), and `storage` (where you intend to store the tasks in between app sessions - should be `LocalStorage` for react or `AsyncStorage` for react-native).

```javascript
    <TaskRunner queueNames={queueNames} storage={AsyncStorage}>
        // render your Queues here
    </TaskRunner>
```

Inside `TaskRunner` you should render individual Task Queues using the `Queue` component. The structure of `Queue` is as follows:
```javascript
    <Queue
        queueName={'TEST'}
        onAction={this.handleAction}
        onDone={this.handleDone}
        onFailed={this.handleFailed}
    />
```

### Components
`TaskRunner` - default export
The TaskRunner component

### Example


`App.js`
```javascript
import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage } from 'react-native'

import TaskRunner, { addTask, PENDING, clearQueue, getQueue } from 'react-task-runner'
import type { Task } from 'react-task-runner'

import Test from './Test'

const queueNames = ['TEST']

type State = {
    success: number,
    counter: number,
    failed: number,
}

export default class App extends React.Component<{}, State> {
    state = {
        success: 0,
        counter: 0,
        failed: 0,
    }

    handleDone = (count: number) => {
        const queue = getQueue('TEST')
        const counter = queue.filter(item => !item.err).length
        this.setState(state => ({ counter, success: state.success + 1 }))
    }

    handleFailed = (task: Task) => {
        const queue = getQueue('TEST')
        const counter = queue.filter(item => !item.err).length
        const failed = queue.filter(item => item.err).length
        this.setState({ counter, failed })
    }

    handleAdd = () => {
        const id = (Math.random() * 100000).toString()
        addTask('TEST', { id, status: PENDING })
        const queue = getQueue('TEST')
        const counter = queue.filter(item => !item.err).length
        this.setState({ counter })
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{ fontSize: 30 }}>Queue: {this.state.counter}</Text>
                <Text style={{ fontSize: 30 }}>Success: {this.state.success}</Text>
                <Text style={{ fontSize: 30 }}>Failed: {this.state.failed}</Text>

                <TouchableOpacity onPress={this.handleAdd} style={{ margin: 40 }}>
                    <Text>Add Task!</Text>
                </TouchableOpacity>

                <TaskRunner queueNames={queueNames} storage={AsyncStorage}>
                    <Test onDone={this.handleDone} onFailed={this.handleFailed} />
                </TaskRunner>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
})
```

`Test.js`

```javascript
// @flow
import * as React from 'react'

import { queue } from 'react-task-runner'
import type { Task } from 'react-task-runner'

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
    // mimic an async task
    // onAction expects a promise to be returned
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

    handleDone = () => {
        // method to perform when task is done
        // task is automatically removed from queue on completion
        this.props.onDone(this.counter)
        }

    handleFailed = (task: Task) => {
        // handle task failure
        // typical actions would be  retryTask, removeTask, or clearQueue 
        this.props.onFailed(task)
        }

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

```