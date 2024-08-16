import { funHttp } from "./Http"

export default {
    funListar(){
        return funHttp().get("/categoria");
    },
    funGuardar(datos){
        return funHttp().post("/categoria", datos);
    },
    funMostrar(id){
        return funHttp().get(`/categoria/${id}`);
    },
    funModificar(datos, id){
        return funHttp().put(`/categoria/${id}`, datos);
    },
    funEliminar(id){
        return funHttp().delete(`/categoria/${id}`);
    }
}