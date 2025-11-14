import {createReducer} from '@reduxjs/toolkit'
import { leyendaAction } from '../actions/resolucionesActions'

const initialState = {
    leyenda: ''
}

const resolucionesReducer = createReducer(initialState, 
    (builder) => builder
        .addCase(leyendaAction,(state, action) => {
            const newState = { ...state, leyenda: action.payload}
            return newState    
        })
)

export default resolucionesReducer