
import { createStore, persist } from 'easy-peasy';
import { AsyncStorage } from 'react-native'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import auth from './models/auth'
import items from './models/items'

const persistConfig = {
  key: 'real-estate-app',
  storage: storage,
  mergeStrategy: autoMergeLevel2,
}

const root = {
  auth,
  items,
}


export const store = createStore(root, {
  reducerEnhancer: reducer => {
    const persisted = persistReducer( persistConfig, reducer)
    return persisted
  }
})

export const persistor = persistStore(store)