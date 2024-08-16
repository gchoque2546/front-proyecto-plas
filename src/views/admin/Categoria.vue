<template>
    <div class="card">
        <h1>Gestion Categorias</h1>
        <!--pre>{{ categorias }}</?pre-->
        <div class="card">
            <label>Ingrese Nombre</label>
            <input type="text" v-model="categoria.nombre">
            <label>Ingrese Detalle</label>
            <textarea cols="30" rows="3" v-model="categoria.detalle"></textarea>
            <button @click="funGuardarCategoria()">Guardar</button>
        </div>
    </div>
    <div class="card">

        <Button label="Nueva Categoria" @click="visible = true" />
        <Dialog v-model:visible="visible" modal header="Nueva Categoria" :style="{ width: '25rem' }">
            <span class="p-text-secondary block mb-5">Ingrese los Datos.</span>
            <div class="flex align-items-center gap-3 mb-3">
                <!--nombre-->
                <label class="font-semibold w-6rem">Ingrese Nombre</label>
                <InputText class="flex-auto" autocomplete="off" v-model="categoria.nombre"/>
            </div>
            <div class="flex align-items-center gap-3 mb-5">
                <!--detalle-->
                <label class="font-semibold w-6rem">Ingrese Detalle</label>
                <InputText class="flex-auto" autocomplete="off" v-model="categoria.detalle"/>
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancelar" severity="secondary" @click="visible = false"></Button>
                <Button type="button" label="Guardar" @click="funGuardarCategoria()"></Button>
            </div>
        </Dialog>

        <DataTable :value="categorias" tableStyle="min-width: 50rem">
            <Column field="id" header="ID"></Column>
            <Column field="nombre" header="NOMBRE"></Column>
            <Column field="detalle" header="DETALLE"></Column>
            <Column header="GESTION">
                <template #body="slotProps">
                    <!--<button @click="editarCat(slotProps.data)">Editar</button>
                    <button @click="eliminarCat(slotProps.data.id)">Eliminar</button>-->
                    <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="funEditarCategoria(slotProps.data)"/>
                    <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="funEliminarCategoria(slotProps.data.id)"></Button>
                </template>
            </Column>
        </DataTable>
        <Toast />
    </div>
</template>

<script setup>
// Importaciones
    import { ref, onMounted } from 'vue';
    import { useToast } from 'primevue/usetoast';
    import categoriaService from '@/services/categoria.service';

// Variables o Estados
    const categorias = ref([])
    const categoria = ref({nombre: '',detalle: ''})
    const visible = ref(false);
    const toast = useToast();

// Metodos o Funciones
onMounted(() =>{
    funListarCategorias()
})

async function funListarCategorias(){
    const datos = await categoriaService.funListar();
    categorias.value = datos.data
}

async function funGuardarCategoria(){
    try {
        if(categoria.value.id){
            await categoriaService.funModificar(categoria.value, categoria.value.id)
            funListarCategorias()
            visible.value = false
            categoria.value = {nombre: '',detalle: ''}
            toast.add({ severity: 'info', summary: 'Categoria Modificada', detail: 'La Categoria ha sido Modificada', life: 8000 });
        }
        else{
            await categoriaService.funGuardar(categoria.value);
            funListarCategorias()
            visible.value = false
            categoria.value = {nombre: '',detalle: ''}
            toast.add({ severity: 'info', summary: 'Categoria Registrada', detail: 'La Categoria ha sido Registrada', life: 8000 });
        }
        
    } catch (error) {
        alert(error)
    }
}

function funEditarCategoria(cat){
    categoria.value = cat;
    visible.value = true;
}

async function funEliminarCategoria(id){
    if(confirm("¿Esta seguro de eliminar la Categoria?")){
        await categoriaService.funEliminar(id);
        funListarCategorias()
        toast.add({ severity: 'info', summary: 'Categoria Eliminada', detail: 'La Categoria ha sido Eliminada', life: 8000 });
    }
}
</script>