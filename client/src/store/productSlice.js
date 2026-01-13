import {createSlice} from "@reduxjs/toolkit";

 const intialValue={
    allcategory:[],
    loadingCategory:false,
    allsubCategory:[],
    product:[]
 }

 const productSlice=createSlice({
    name:"product",
    initialState:intialValue,
    reducers:{
        setAllCategory:(state,action)=>{
            state.allcategory=[...action.payload]
        },
        
        setLoadingCategory:(state,action)=>{
            state.loadingCategory=action.payload
        }
        ,
        
        setAllsubCategory:(state,action)=>{
            state.allsubCategory=[...action.payload]
        }
    }
    
 })

 export const {setAllCategory,setAllsubCategory,setLoadingCategory}=productSlice.actions

 export default productSlice.reducer