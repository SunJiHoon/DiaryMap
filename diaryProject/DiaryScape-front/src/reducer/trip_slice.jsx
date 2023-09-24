import { createSlice } from "@reduxjs/toolkit"

const tripSlice = createSlice({
    name: "user",
    initialState: {
        title: "",
        mapId: "",
        x: 0,
        y: 0,
    },
    reducers: {
        selectTrip: (state, action) => {
        state.title = action.payload.title
        state.mapId = action.payload.mapId
        state.x = action.payload.x
        state.y = action.payload.y
        return state
        },
        clearTrip: (state) => {
        state.title = ""
        state.mapId = ""
        state.x = action.payload.x
        state.y = action.payload.y
        return state
        },
    },
})

export const { selectTrip, clearTrip } = tripSlice.actions
export default tripSlice.reducer