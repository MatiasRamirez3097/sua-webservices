import {createReducer} from '@reduxjs/toolkit'
import { leyendaAction, postResolucion } from '../actions/resolucionesActions'

const initialState = {
    csvResoluciones: null,
    leyenda: '',
    postStatus: ''
}

const resolucionesReducer = createReducer(initialState, 
    (builder) => builder
        .addCase(leyendaAction,(state, action) => {
            const newState = { ...state, leyenda: action.payload}
            return newState    
        })
        .addCase(postResolucion.fulfilled, (state, action) => {
            const newState = { ...state, postStatus: action.payload }
            return newState
        })
        .addCase(postResolucion.rejected, (state, action) => {
            const newState = { ...state, postStatus: action.payload }
            return newState
        })
)

export default resolucionesReducer