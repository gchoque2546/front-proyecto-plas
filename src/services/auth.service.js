import { funHttp } from "./Http"

export default {
    funLogin(credenciales){
        return funHttp().post("v1/auth/login", credenciales);
    },
    funRegistro(datos){
        return funHttp().post("v1/auth/register", datos);
    },
    funGetPerfil: function() {
        return funHttp().get("v1/auth/perfil");
    },
    funSalir:() => {
        return funHttp().post("v1/auth/logout");
    }
}