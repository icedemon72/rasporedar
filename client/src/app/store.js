import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { apiSlice } from './api/apiSlice';
import storage from 'redux-persist/lib/storage';

import sessionReducer from './slices/sessionSlice';
import scheduleReducer from './slices/scheduleSlice';

const persistConfig = {
  key: 'root',
  storage: storage,
}

const rootReducer = combineReducers({
  session: persistReducer(persistConfig, sessionReducer),
  schedule: scheduleReducer,
  [apiSlice.reducerPath]: apiSlice.reducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleWare => 
    getDefaultMiddleWare({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);