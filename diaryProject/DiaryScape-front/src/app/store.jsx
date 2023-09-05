import { configureStore } from "@reduxjs/toolkit"
import userReducer, {loginUser, clearUser} from '../reducer/user_slice'

export const store = configureStore({
    reducer: {
        loginUser,
        clearUser,
    }
})