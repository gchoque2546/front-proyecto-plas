<template>
    <div class="card">
        <h1>Gestion Clases</h1>
        <!--pre>{{ clases }}</?pre-->
    </div>
    <div class="card">
            <label>Ingrese Nombre</label>
            <input type="text" v-model="clase.nombre">
            <label>Ingrese Detalle</label>
            <textarea cols="30" rows="3" v-model="clase.detalle"></textarea>
            <button @click="funGuardarClase()">Guardar</button>
        </div>
    <div class="card">

        <Button label="Nueva Clase" @click="visible = true" />
        <Dialog v-model:visible="visible" modal header="Nueva Clase" :style="{ width: '25rem' }">
            <span class="p-text-secondary block mb-5">Ingrese los Datos.</span>
            <div class="flex align-items-center gap-3 mb-3">
                <!--nombre-->
                <label class="font-semibold w-6rem">Ingrese Nombre</label>
                <InputText class="flex-auto" autocomplete="off" v-model="clase.nombre"/>
            </div>
            <div class="flex align-items-center gap-3 mb-5">
                <!--detalle-->
                <label class="font-semibold w-6rem">Ingrese Detalle</label>
                <InputText class="flex-auto" autocomplete="off" v-model="clase.detalle"/>
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancelar" severity="secondary" @click="visible = false"></Button>
                <Button type="button" label="Guardar" @click="funGuardarClase()"></Button>
            </div>
        </Dialog>

        <DataTable :value="clases" tableStyle="min-width: 50rem">
            <Column field="id" header="ID"></Column>
            <Column field="nombre" header="NOMBRE"></Column>
            <Column field="detalle" header="DETALLE"></Column>
            <Column header="GESTION">
                <template #body="slotProps">
                    <!--<button @click="editarCat(slotProps.data)">Editar</button>
                    <button @click="eliminarCat(slotProps.data.id)">Eliminar</button>-->
                    <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="funEditarClase(slotProps.data)"/>
                    <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="funEliminarClase(slotProps.data.id)"></Button>
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
    import claseService from '@/services/clase.service';

// Variables o Estados
    const clases = ref([])
    const clase = ref({nombre: '',detalle: ''})
    const visible = ref(false);
    const toast = useToast();

// Metodos o Funciones
onMounted(() =>{
    funListarClases()
  })

async function funListarClases(){
    const datos = await claseService.funListar();
    clases.value = datos.data
  }

  async function funGuardarClase(){
    try {
        if(clase.value.id){
            await claseService.funModificar(clase.value, clase.value.id)
            funListarClases()
            visible.value = false
            clase.value = {nombre: '',detalle: ''}
            toast.add({ severity: 'info', summary: 'Clase Modificada', detail: 'La Clase ha sido Modificada', life: 8000 });
        }
        else{
            await claseService.funGuardar(clase.value);
            funListarClases()
            visible.value = false
            clase.value = {nombre: '',detalle: ''}
            toast.add({ severity: 'info', summary: 'Clase Registrada', detail: 'La Clase ha sido Registrada', life: 8000 });
        }
        
    } catch (error) {
        alert(error)
    }
}

function funEditarClase(clas){
    clase.value = clas;
    visible.value = true;
}

async function funEliminarClase(id){
    if(confirm("¿Esta seguro de eliminar la Clase?")){
        await claseService.funEliminar(id);
        funListarClases()
        toast.add({ severity: 'info', summary: 'Clase Eliminada', detail: 'La Clase ha sido Eliminada', life: 8000 });
    }
}
</script>