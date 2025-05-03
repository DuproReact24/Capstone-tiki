import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Storage bình thường (localStorage)
import logger from 'redux-logger';
import authReducer from '../features/login/loginSlice';
import cartReducer from '../features/cart/cartSlice';
import prodcutReducer from '../features/product/productSlice';
import { persistStore } from 'redux-persist';
// Các phần khác như bạn có sẵn
// ...

// Tạo noop storage cho SSR
const noopStorage = {
  getItem: (_: string) => Promise.resolve(null),
  setItem: (_: string, __: string) => Promise.resolve(),
  removeItem: (_: string) => Promise.resolve(),
};

// Kiểm tra xem có phải đang chạy trên client không (window là có trên client)
const isClient = typeof window !== 'undefined';

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  product:prodcutReducer 
});

// Cấu hình redux-persist
const persistConfig = {
  key: 'root',
  version: 1,
  storage: isClient ? storage : noopStorage, // Sử dụng noopStorage trên server
  whitelist: ['auth'], // Chỉ persist state của 'auth'
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => {
      const middleware = getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      });

      if (process.env.NODE_ENV !== 'production') {
        middleware.push(logger); // Chỉ thêm logger trong môi trường phát triển
      }

      return middleware;
    },
    devTools: process.env.NODE_ENV !== 'production', // Bật Redux DevTools trong môi trường phát triển
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export const store = makeStore();
export const persistor = persistStore(store);