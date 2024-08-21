<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <Image src="src/img/logoPlas01.webp" alt="Logo Plas" width="175" />
            <div style="border-radius: 36px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-4">
                        <div class="text-900 text-3xl font-medium mb-3">Bienvenido</div>
                        <span class="text-600 font-medium">Ingresar para continuar</span>
                    </div>
                    <div>
                        <div>
                            <label
                                class="block text-900 text-xl font-medium mb-2 mt-4"
                                for="email"
                            >Correo Electronico</label>
                            <InputText
                                id="email"
                                class="w-full md:w-30rem mb-2"
                                placeholder="Ingrese Correo Electronico"
                                v-model="usuario.email"
                            />
                            <Message
                                class="w-full md:w-30rem mb-2"
                                v-show="errors.email"
                                severity="error"
                            >{{ errors.email }}</Message>
                        </div>
                        <div>
                            <label
                                class="block text-900 text-xl font-medium mb-2 mt-4"
                                for="password"
                            >Contraseña</label>
                            <Password
                                v-model="usuario.password"
                                placeholder="Ingrese Contraseña" 
                                toggleMask
                                class="w-full md:w-30rem mb-2"
                                inputClass="w-full"
                                :inputStyle="{ padding: '1rem' }"
                            ></Password>
                            <Message
                                class="w-full md:w-30rem mb-2"
                                v-show="errors.password"
                                severity="error"
                            >{{ errors.password }}</Message>
                        </div>
                      
                        <div class="flex align-items-center justify-content-between mt-5 gap-5">
                        <Button
                            label="Ingresar"
                            class="w-full md:w-30rem text-xl"
                            v-on:click="funIngresar"
                        ></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
