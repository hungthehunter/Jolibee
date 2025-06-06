import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE
} from 'redux-persist'
import persistStore from 'redux-persist/es/persistStore'
import storage from 'redux-persist/lib/storage'
import orderReducer from './slices/orderSlice'
import productReducer from './slices/productSlice'
import userReducer from './slices/userSlice'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['user', 'order'], // các reducer cần lưu
}

const rootReducer = combineReducers({
  product: productReducer,
  user:   userReducer,
  order:  orderReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export let persistor  =  persistStore(store)
