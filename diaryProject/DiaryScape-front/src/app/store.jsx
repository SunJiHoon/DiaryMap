import { configureStore } from "@reduxjs/toolkit"
import userSlice from '../reducer/user_slice'
import tripSlice from '../reducer/trip_slice'
import startnodeSlice from "../reducer/startnode_slice"
import { combineReducers } from "@reduxjs/toolkit"

const reducer = combineReducers({
    user: userSlice,
    trip: tripSlice,
    startnode: startnodeSlice,
})

export const store = configureStore({
    reducer
})