<template>
    <div class="card">
        <h1>Gestion de Clases</h1>
        <!--pre>{{ clases }}</?pre-->
    </div>
    <div class="card">
        <Button
            label="Nueva Clase"
            icon="pi pi-plus-circle"
            @click="visible = true"
        ></Button>
        <Dialog
            v-model:visible="visible"
            modal
            header="Nueva Clase"
            :style="{ width: '40rem' }"
        >
            <Avatar
                image="https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp"
                class="block mx-auto"
                size="xlarge"
            />
            <span class="p-text-secondary block mb-5">Ingrese los Datos.</span>
            <div class="flex align-items-center gap-3 mb-3">
                <!--nombre-->
                <label class="font-semibold w-6rem">Nombre:</label>
                <InputText
                    class="flex-auto"
                    autocomplete="on"
                    v-model="clase.nombre"
                />
            </div>
            <div class="flex align-items-center gap-3 mb-5">
                <!--detalle-->
                <label class="font-semibold w-6rem">Detalle:</label>
                <Textarea
                    autoResize rows="5"
                    cols="52"
                    v-model="clase.detalle"
                ></Textarea>
            </div>
            <div class="flex justify-content-end gap-2">
                <Button
                    type="button"
                    label="Cancelar"
                    severity="secondary"
                    @click="funCancelarDialog()"
                ></Button>
                <Button
                    type="button"
                    label="Guardar"
                    @click="funGuardarClase()"
                ></Button>
            </div>
        </Dialog>

        <DataTable
            :value="clases"
            removableSort
            tableStyle="min-width: 20rem"
        >
            <Column field="id" header="ID" sortable style="width: 10%"></Column>
            <Column field="nombre" header="NOMBRE" sortable style="width: 20%"></Column>
            <Column field="detalle" header="DETALLE" sortable style="width: 55%"></Column>
            <Column header="GESTION" style="width: 15%">
                <template #body="slotProps">
                    <Button
                        icon="pi pi-pencil"
                        class="mr-2"
                        severity="success"
                        rounded
                        outlined
                        aria-label="Search"
                        @click="funEditarClase(slotProps.data)"
                    ></Button>
                    <Button
                        icon="pi pi-trash"
                        class="mr-2"
                        severity="danger"
                        rounded
                        outlined
                        aria-label="Cancel"
                        @click="funEliminarClase(slotProps.data.id)"
                    ></Button>
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
    const clases = ref([]);
    const clase = ref({nombre: '',detalle: ''});
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
            toast.add({
                severity: 'success',
                summary: 'Modificacion Exitosa',
                detail: 'La Clase ha sido Modificada',
                life: 4000 });
        }
        else{
            await claseService.funGuardar(clase.value);
            funListarClases()
            visible.value = false
            clase.value = {nombre: '',detalle: ''}
            toast.add({
                severity: 'success',
                summary: 'Registro Exitoso',
                detail: 'La Clase ha sido Registrada',
                life: 4000 });
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
        toast.add({
            severity: 'success',
            summary: 'Eliminacion Exitosa',
            detail: 'La Clase ha sido Eliminada',
            life: 4000 }); 
    }
}

function funCancelarDialog(){
    funListarClases()
    visible.value = false;
}

</script>