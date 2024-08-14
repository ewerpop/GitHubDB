import { configureStore } from '@reduxjs/toolkit'
import parserReducer from '../features/parser/parserSlice'

const store = configureStore({
  reducer: {
    parse: parserReducer,
  },
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch