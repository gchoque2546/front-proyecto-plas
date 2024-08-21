<template>
    <div class="card">
        <h1>Servicios</h1>
        {{ servicios }}
    </div>
</template>

<script setup>
// Importaciones
    import { onMounted, ref } from 'vue';
    import servicioService from '@/services/servicio.service';

// Variables o Estados
    const servicios = ref([])

// Metodos o Funciones
onMounted(()=>{
    funListarServicios()
})

async function funListarServicios() {
    //loading.value = true

    //let page = lazyParams.value.page+1;
    //let limit = lazyParams.value.rows;

    const { data } = await servicioService.funListar();
    //loading.value = false
    console.log(data);
    servicios.value = data.data;
    //totalRecords.value = data.total;
};
</script>