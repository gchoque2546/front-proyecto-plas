<template>
    <div class="grid">
        <div class="col-12 md:col-7">
            <div class="card">
                <h2>Lista Productos</h2>
                <TablaProductoComponent :nombre="nombre1" :data="productos"/>
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
                    <div class="card">Pedido</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import TablaProductoComponent from '@/components/admin/TablaProductoComponent.vue';
    import productoService from '@/services/producto.service';
    import { onMounted, ref } from 'vue';

    const nombre1 = ref ("Lista de Productos");
    const productos = ref([]);

    onMounted(()=>{
        funListarProducto()
    })

    const funListarProducto = async () => {
        const {data} = await productoService.funListar();
        productos.value = data.data
    }
</script>