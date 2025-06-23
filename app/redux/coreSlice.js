import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    value: "",
    datetime: ""
};

export const coreSlice = createSlice({
    name: "core",
    initialState,
    reducers: {
        setValue: (state, action)=>{
            // console.log("action.payload", action.payload);
            state.value = action.payload
        },
        setDatetime: (state, action)=>{
            // console.log("action.payload", action.payload);
            state.datetime = action.payload
        },
        reset: (state)=>{
            state.datetime = ""
            state.value = ""
        },  
    },
})

export const { setValue, setDatetime, reset } = coreSlice.actions

export default coreSlice.reducer