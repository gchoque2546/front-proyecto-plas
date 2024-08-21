import { funHttp } from "./Http.js"

export default {
    funListar(page=1, limit=10, q=""){
        return funHttp().get(`/servicio?page=${page}&limit=${limit}&q=${q}`);
    },
    funGuardar(datos){
        return funHttp().post("/servicio", datos);
    },
    funMostrar(id){
        return funHttp().get(`/servicio/${id}`);
    },
    funModificar(datos, id){
        return funHttp().put(`/servicio/${id}`, datos);
    },
    funEliminar(id){
        return funHttp().delete(`/servicio/${id}`);
    },
    funActualizarImagen(id, datos){
        return funHttp().post(`/servicio/${id}/actualizar-imagen`, datos)
    }
}