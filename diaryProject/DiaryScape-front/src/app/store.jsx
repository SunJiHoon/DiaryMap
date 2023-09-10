import { configureStore } from "@reduxjs/toolkit"
import userSlice from '../reducer/user_slice'

export const store = configureStore({
    reducer: {
        user: userSlice
    }
})