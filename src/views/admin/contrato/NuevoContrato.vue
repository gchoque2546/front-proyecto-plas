<template>
    <div class="grid">
        <div class="col-12 md:col-7">
            <div class="card">
                <h2>Lista Servicios</h2>
                <TablaServicioComponent/>
            </div>
        </div>
        <div class="col-12 md:col-5">
            <div class="grid">
                <div class="col-12">
                    <div class="card">Carrito</div>
                </div>
                <div class="col-12">
                    <div class="card">Cliente</div>
                </div>
                <div class="col-12">
                    <div class="card">Contrato</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import TablaServicioComponent from '@/components/admin/TablaServicioComponent.vue';
</script>