import { funHttp } from "./Http"

export default {
    funListar(){
        return funHttp().get("/clase");
    },
    funGuardar(datos){
        return funHttp().post("/clase", datos);
    },
    funMostrar(id){
        return funHttp().get(`/clase/${id}`);
    },
    funModificar(datos, id){
        return funHttp().put(`/clase/${id}`, datos);
    },
    funEliminar(id){
        return funHttp().delete(`/clase/${id}`);
    }
}