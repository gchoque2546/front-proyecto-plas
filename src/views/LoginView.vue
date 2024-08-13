<template>
    <div>
         {{ usuario }}
        <h1>Login</h1>
        <label for="e">Ingresar Correo:</label>
        <input type="email" v-model="usuario.email">
        <span>{{ errors.email }}</span>
        <br>
        <label>Ingresar Contraseña:</label>
        <input type="password" v-model="usuario.password">
        <span>{{ errors.password }}</span>
        <br>
        <input type="button" value="Ingresar" v-on:click="funIngresar">
        
    </div>
</template>

<script setup>
import { ref } from 'vue';
//import axios from 'axios';
import { useRouter, useRoute } from "vue-router";
import authService from '@/services/auth.service';

    //variables
    const usuario = ref({email:"", password:""})
    const errors = ref({})
    const router = useRouter()

    //metodos
    async function funIngresar() {
        try {
            const { data } = await authService.funLogin(usuario.value)
            console.log("CON INTERCEPTOR", data)
            errors.value = {}

            //auth.setUsuario(data.usuario.email)

            localStorage.setItem("access_token", data.access_token);
            //localStorage.setItem("auth", data.usuario.email);
            router.push("/about")
        } catch (error) {
            console.log(error.response.data)
            errors.value = error.response.data.errors
        }
    }
</script>
