'use client';

import { useRef, useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '../lib/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>();
  const [persistor, setPersistor] = useState<any>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
    const newPersistor = persistStore(storeRef.current);
    setPersistor(newPersistor);
  }

  if (!persistor) return null; // Tránh render sớm khi persistor chưa sẵn sàng

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
