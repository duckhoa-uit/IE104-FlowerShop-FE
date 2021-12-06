import orderApi from '@/api/orderApi'
import { payloadCreator } from '@/utils/helper'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const getOrder = createAsyncThunk(
   'order/getOrder',
   payloadCreator(orderApi.get)
)
export const createOrder = createAsyncThunk(
   'order/createOrder',
   payloadCreator(orderApi.create)
)
const order = createSlice({
   name: 'order',
   initialState: {
      isPaid: false,
      current: null
   },
   reducers: {
      payOrder: (state, action) => {
         state.isPaid = true
      }
   },
   extraReducers: {
      [getOrder.fulfilled]: (state, action) => {
         console.log('get order', action.payload.data)
         state.current = action.payload.data
      },
      [getOrder.rejected]: (state, action) => {
         console.log('error to get order', action.payload.data)
      },
      [createOrder.fulfilled]: (state, action) => {
         console.log('create order', action.payload.data)
         state.current = action.payload.data
      }
   }
})

const orderReducer = order.reducer
export const { payOrder } = order.actions
export default orderReducer
