import { createSlice } from "@reduxjs/toolkit"

const startnodeSlice = createSlice({
    name: "startnode",
    initialState: {
        reviewTitle: "",
        mapId: "",
        contentId: "",
        contentTypeId: "",
        title: "",
        tel: "",
        mapX: 0,
        mapY: 0,
        relativeX: 0,
        relativeY: 0,
        addr1: "",
    },
    reducers: {
        selectStartnode: (state, action) => {
            state.reviewTitle = action.payload.reviewTitle
            state.mapId = action.payload.mapId
            state.contentId =action.payload.contentId
            state.contentTypeId = action.payload.contentTypeId
            state.title = action.payload.title
            state.tel = action.payload.tel
            state.mapX = action.payload.mapX
            state.mapY = action.payload.mapY
            state.relativeX = action.payload.relativeX
            state.relativeY = action.payload.relativeY
            state.addr1 = action.payload.addr1
            return state
        },
        clearStartnode: (state) => {
            state.reviewTitle = ""
            state.mapId = ""
            state.contentId = ""
            state.contentTypeId = ""
            state.title = ""
            state.tel = ""
            state.mapX = 0,
            state.mapY = 0,
            state.relativeX = 0
            state.relativeY = 0
            state.addr1 = ""
            return state
        },
    },
})

export const { selectStartnode, clearStartnode } = startnodeSlice.actions
export default startnodeSlice.reducer