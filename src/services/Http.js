import axios from "axios";

const url_base = "http://127.0.0.1:8000/api";
export const funHttp = () =>{
    let token = localStorage.getItem("access_token")

    const api = axios.create({
        baseURL: url_base,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+token
        }
    })
    // interceptar errores 401, 403
    api.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if(error.response.status === 401){
                // no autenticado o el token caduco o esta mal
                localStorage.removeItem("access_token");
                window.location = "/login"
            }
            if(error.response.status === 403){
                //roles o permisos
            }
            return Promise.reject(error)
        },
    )
    return api;
}