import { configureStore } from '@reduxjs/toolkit'
import resolucionesReducer from './reducers/resolucionesReducer'

export const store = configureStore({
    reducer: {
        resolucionesReducer
    }
})