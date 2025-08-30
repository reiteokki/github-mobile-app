import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import rootSaga from "./sagas";
import profileReducer from "./slices/profileSlice";
import repoReducer from "./slices/repoSlice";

const createSagaMiddleware = require("redux-saga").default;

const sagaMiddleware = createSagaMiddleware();

const profilePersistConfig = {
  key: "profile",
  storage: AsyncStorage,
  whitelist: ["currentUsername", "localPhotoUri"],
};

const persistedProfileReducer = persistReducer(
  profilePersistConfig,
  profileReducer
);

export const store = configureStore({
  reducer: {
    repos: repoReducer,
    profile: persistedProfileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
