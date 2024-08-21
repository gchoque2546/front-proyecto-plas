import { funHttp } from "./Http.js"

export default {
    funListar(page=1, limit=10, q=""){
        return funHttp().get(`/producto?page=${page}&limit=${limit}&q=${q}`);
    },
    funGuardar(datos){
        return funHttp().post("/producto", datos);
    },
    funMostrar(id){
        return funHttp().get(`/producto/${id}`);
    },
    funModificar(datos, id){
        return funHttp().put(`/producto/${id}`, datos);
    },
    funEliminar(id){
        return funHttp().delete(`/producto/${id}`);
    },
    funActualizarImagen(id, datos){
        return funHttp().post(`/producto/${id}/actualizar-imagen`, datos)
    }
}