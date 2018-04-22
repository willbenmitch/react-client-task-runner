import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage } from 'react-native'

import TaskRunner, { addTask, PENDING, clearQueue, getQueue } from '../src'
import type { Task } from '../src'

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

    handleClear = () => {
        clearQueue('TEST')
        const queue = getQueue('TEST')
        const counter = queue.filter(item => !item.err).length
        const success = queue.filter(item => !item.err).length
        const failed = queue.filter(task => task.err).length
        this.setState({ counter, failed, success })
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
                <TouchableOpacity onPress={this.handleClear} style={{ margin: 40 }}>
                    <Text>Clear Queue!</Text>
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
