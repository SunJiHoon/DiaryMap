import { configureStore } from "@reduxjs/toolkit"
import userSlice from '../reducer/user_slice'
import tripSlice from '../reducer/trip_slice'
import startnodeSlice from "../reducer/startnode_slice"
import { combineReducers } from "@reduxjs/toolkit"
import sessionStorage from 'redux-persist/lib/storage/session'
import { persistReducer } from "redux-persist"
const persistConfig = {
    key: "root",
    storage: sessionStorage,
    whitelist: ["user", "trip", "startnode"],
}
const reducer = combineReducers({
    user: userSlice,
    trip: tripSlice,
    startnode: startnodeSlice,
})

const persistedReducer = persistReducer(persistConfig, reducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
})