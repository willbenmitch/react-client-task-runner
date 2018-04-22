// @flow
import * as React from 'react'
import { createStore, combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'

import queues from './reducer'

const persistConfig = (storage: React.Node) => ({
    key: 'root',
    storage,
    whitelist: ['queues'],
})

const persistedReducer = (queueNames: string[], storage: React.Node) => {
    return persistReducer(persistConfig(storage), combineReducers({ queues: queues(queueNames) }))
}

export default (queueNames: string[], storage: React.Node) => {
    let store = createStore(persistedReducer(queueNames, storage))
    let persistor = persistStore(store)
    return { store, persistor }
}
