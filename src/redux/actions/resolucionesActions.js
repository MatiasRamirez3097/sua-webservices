import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import {server} from '../../Api'

const leyendaAction = createAction('leyendaAction', (val) => {
    return {
        payload: val
    }
})

const postResolucion = createAsyncThunk('postResolucion', async ({sua, anio, leyenda=''},{rejectWithValue}) => {
    try {
        const res = await server.post(`/solicitudes/resolver/${sua}-${anio}`,{
            fecha: "15/11/2025 07:00:00",
            tipo: 1,
            solucion: leyenda,
            usuario: "mramire7",
            id_area: 2098,
            id_motivo_cierre: 0,
            image: ""
        },
        {
            headers: {
                'X-Gravitee-Api-Key': import.meta.env.VITE_APIKEY,
                'Content-Type':'application/json'
            }
        })
        return res.data.response
    } catch (err) {
        return rejectWithValue(err.response ? err.response.data : 'Error desconocido');
    }
})

export {leyendaAction, postResolucion}