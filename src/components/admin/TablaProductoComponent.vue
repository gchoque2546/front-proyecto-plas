<template>
    <h1>Tabla componente de Producto</h1>
    <!--p>{{ props }}</p-->
    
    <DataTable
        :value="props.data"
        lazy
        stripedRows>
        <Column field="id" header="ID"></Column>
        <Column field="nombre" header="NOMBRE"></Column>
        <Column field="precio" header="PRECIO"></Column>
        <Column field="categoria.nombre" header="CATEGORIA"></Column>
        <Column field="stock" header="STOCK"></Column>
        <Column headerStyle="min-width:3rem;">
            <template #body="slotProps">
                <Button
                    icon="pi pi-plus"
                    class="mr-2"
                    severity="warning"
                    rounded
                    @click="agregar(slotProps.data)"
                ></Button>
            </template>
        </Column>
    </DataTable> 

</template>
<script setup>
    const props = defineProps(['nombre', 'data'])
</script>