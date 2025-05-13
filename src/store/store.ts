'use client';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  configureStore,
  combineReducers,
  Reducer,
  Action,
} from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { appApi } from '@/store/api/appApi';
import { aiApi } from '@/store/api/aiApi';
import dashboardReducer, {
  DashboardState,
} from '@/store/slices/dashboardSlice';
import logsReducer, { LogsState } from '@/store/slices/logsSlice';
import queryReducer, { QueryState } from '@/store/slices/querySlice';
import anomalyReducer, { AnomalyState } from './slices/anomalySlice';
import metricsReducer, { MetricsState } from '@/store/slices/metricsSlice';

const createNoopStorage = () => {
  return {
    getItem(): Promise<null> {
      return Promise.resolve(null);
    },
    setItem(value: string): Promise<string> {
      return Promise.resolve(value);
    },
    removeItem(): Promise<void> {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage();

export type RootState = {
  [appApi.reducerPath]: ReturnType<typeof appApi.reducer>;
  [aiApi.reducerPath]: ReturnType<typeof aiApi.reducer>;
  dashboard: DashboardState;
  metrics: MetricsState;
  logs: LogsState;
  anomaly: AnomalyState;
  query: QueryState;
};

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
  whitelist: ['dashboard', 'logs', 'anomaly', 'query', 'metrics'],
};

const appReducer = combineReducers({
  [appApi.reducerPath]: appApi.reducer,
  [aiApi.reducerPath]: aiApi.reducer,
  dashboard: dashboardReducer,
  metrics: metricsReducer,
  logs: logsReducer,
  anomaly: anomalyReducer,
  query: queryReducer,
});

const rootReducer: Reducer<RootState, Action> = (state, action) => {
  if (action.type === 'anomaly/resetFilters') {
    state = undefined;
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(appApi.middleware, aiApi.middleware),
  devTools: true,
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
