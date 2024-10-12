<template>       
    <div class="card">
        <h2 class="flex align-items-center justify-content-center">SERVICIOS</h2>
        <Toolbar class="mb-4">
            <template v-slot:start>
                <div class="my-2">
                    <Button
                        label="Nuevo Servicio"
                        icon="pi pi-plus"
                        class="mr-2"
                        @click="funDialogNuevoServicio"
                    ></Button>
                </div>
            </template>
            <template v-slot:end>
                <Button
                    label="Export"
                    icon="pi pi-upload"
                    severity="help"
                    @click="funExportCSV($event)"
                ></Button>
            </template>
        </Toolbar>
        <DataTable
            ref="dt"
            :value="servicios"
            :totalRecords="totalRecords"
            lazy
            :loading="loading"
            @page="onPage($event)"
            dataKey="id"
            stripedRows 
            :paginator="true"
            :rows="2"
            :rowsPerPageOptions="[2, 3, 5, 10]"
            tableStyle="min-width: 15rem"
            paginatorTemplate="RowsPerPageDropdown PrevPageLink CurrentPageReport NextPageLink "
            currentPageReportTemplate="Mostrando {first} al {last} de {totalRecords} Servicios"
            responsiveLayout="scroll">
            <template #header>
                <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                    <h5 class="m-0">Gestión de Servicios</h5>
                    <IconField iconPosition="left" class="block mt-2 md:mt-0">
                        <InputIcon class="pi pi-search" />
                        <InputText
                            class="w-full sm:w-auto"
                            placeholder="Buscar..."
                            v-model="buscar"
                            @keypress.enter="funBuscar()"
                        />
                    </IconField>
                </div>
            </template>
            <template #paginatorstart>
            </template>
            <Column
                field="id"
                header="ID"
                style="width: 5%">
                <template #body="slotProps">
                    <span class="p-column-title">ID</span>
                    {{ slotProps.data.id }}
                </template>
            </Column>
            <Column
                field="nombre"
                header="NOMBRE"
                style="width: 15%">
                <template #body="slotProps">
                    <span class="p-column-title">Nombre</span>
                    {{ slotProps.data.nombre }}
                </template>
            </Column>
            <Column 
                field="precio"
                header="PRECIO"
                style="width: 10%">
                <template #body="slotProps">
                    <span class="p-column-title">Precio</span>
                    {{ slotProps.data.precio }}
                </template>
            </Column>
            <!--Column
                field="stock"
                header="STOCK"
                style="width: 10%">
                <template #body="slotProps">
                    <span class="p-column-title">Stock</span>
                    {{ slotProps.data.stock }}
                </template>
            </Column-->
            <Column
                field="descripcion"
                header="DESCRIPCION"
                style="width: 40%">
                <template #body="slotProps">
                    <span class="p-column-title">Descripcion</span>
                    {{ slotProps.data.descripcion }}
                </template>
            </Column>
            <Column
                field="clase.nombre"
                header="CATEGORIA"
                style="width: 10%">
                <template #body="slotProps">
                    <span class="p-column-title">Clase</span>
                    {{ slotProps.data.clase.nombre }}
                </template>
            </Column>
            <Column
                style="width: 20%">
                <template #body="slotProps">
                    <Button
                        icon="pi pi-pencil"
                        class="mr-2"
                        severity="success"
                        rounded
                        outlined
                        aria-label="Search"
                        @click="funEditarServicio(slotProps.data)"
                    ></Button>
                    <Button
                        icon="pi pi-trash"
                        class="mr-2"
                        severity="danger"
                        rounded
                        outlined
                        aria-label="Cancel"
                        @click="funDialogEliminarServicio(slotProps.data)"
                    ></Button>
                    <Button
                        icon="pi pi-image"
                        class="mr-2"
                        severity="info"
                        rounded
                        outlined
                        aria-label="Search"
                        @click="funDialogImagen(slotProps.data)"
                    ></Button>
                </template>
            </Column>
        </DataTable>
        <Dialog
            v-model:visible="servicioDialog" 
            :style="{ width: '450px' }" 
            header="Servicio" 
            :modal="true"
            class="p-fluid"
        >
        <!--{{ servicio }}-->
            <div class="field">
                <label for="name">Nombre</label>
                <InputText
                    id="nombre"
                    v-model.trim="servicio.nombre"
                    required="true"
                    :invalid="submitted && !servicio.nombre"
                />
                <small class="p-invalid" v-if="submitted && !servicio.nombre"
                    >Nombre Obligatorio.</small>
            </div>
            <div class="field">
                <label for="descripcion">Descripción</label>
                <Textarea
                    id="descripcion"
                    v-model="servicio.descripcion"
                    rows="6"
                    cols="20"
                    autoResize 
                ></Textarea>
            </div>
            <div class="field">
                <label class="mb-3">Clase</label>
                <div class="formgrid grid">
                    <div
                        class="field-radiobutton col-6"
                        v-for="clas in clases"
                        :key="clas.id">
                        <RadioButton
                            :value="clas.id"
                            v-model="servicio.clase_id"
                        />
                        <label for="category1">{{ clas.nombre }}</label>
                    </div>
                </div>
            </div>
            <div class="formgrid grid">
                <div class="field col">
                    <label for="price">Precio</label>
                    <InputNumber
                        id="price"
                        v-model="servicio.precio"
                        mode="currency"
                        currency="USD"
                        locale="es-US"
                        :class="{'p-invalid': submitted && !servicio.precio}"
                        :required="true"
                    />
                    <small class="p-invalid" v-if="submitted && !servicio.precio"
                        >Precio es Obligatorio.</small>
                </div>
                <!--div class="field col">
                    <label for="quantity">Stock</label>
                    <InputNumber
                        id="quantity"
                        v-model="servicio.stock"
                        integeronly
                    />
                </div-->
            </div>
            <template #footer>
                <Button
                    label="Cancelar"
                    icon="pi pi-times"
                    text @click="servicioDialog = false"
                ></Button>
                <Button
                    label="Guardar"
                    icon="pi pi-check"
                    text="" @click="funGuardarServicio"
                ></Button>
            </template>
        </Dialog>
        <Dialog
            v-model:visible="deleteServicioDialog"
            :style="{ width: '450px' }"
            header="Confirmar"
            :modal="true">
            <div class="flex align-items-center justify-content-center">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"></i>
                <span v-if="servicio"
                    >¿Esta Seguro de Eliminar el Servicio <b>{{ servicio.nombre }}</b>?</span>
            </div>
            <template #footer>
                <Button
                    label="No"
                    icon="pi pi-times"
                    text @click="deleteServicioDialog = false"
                ></Button>
                <Button
                    label="Si"
                    icon="pi pi-check"
                    text @click="funEliminarServicio"
                ></Button>
            </template>
        </Dialog>
        <!-- Subir Imagen (si sirve)-->
        <Dialog
            v-model:visible="servicioDialogImagen" 
            :style="{ width: '600px' }" 
            header="Actualizar Imagen" 
            :modal="true"
            class="p-fluid"
        >
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="`http://127.0.0.1:8000/${servicio.imagen}`" alt="" width="250">
        </div>
        <FileUpload
            customUpload
            @uploader="funSubirImagenServicio"
            @upload="onAdvancedUpload($event)"
            :multiple="true"
            accept="image/*"
            :maxFileSize="1000000"
        >
            <template #empty>
                <p>Arrastrar y Soltar para subir Imagen.</p>
            </template>
        </FileUpload>
        </Dialog>
        <Toast />
    </div>
</template>

<script setup>
// Importaciones
    import { onMounted, ref } from 'vue';
    import servicioService from '@/services/servicio.service';
    import claseService from '@/services/clase.service';
    import { useToast } from 'primevue/usetoast';

// Variables o Estados
    const servicios = ref([]);
    const clases = ref([]);
    const totalRecords = ref(0);
    const dt = ref(null);
    const servicioDialog = ref(false);
    const deleteServicioDialog = ref(false);
    const servicio = ref({});
    const submitted = ref(false);
    const toast = useToast();
    const loading = ref(false);
    const lazyParams = ref({page: 0})
    const buscar = ref("");
    const servicioDialogImagen = ref(false);

// Metodos o Funciones
onMounted(()=>{
    funListarServicios()
    funListarClases()
});

const onPage = (event) => {
    console.log(event)
    lazyParams.value = event;
    funListarServicios()
};

async function funListarServicios() {
    loading.value = true
    let page = lazyParams.value.page+1;
    let limit = lazyParams.value.rows;
    const { data } = await servicioService.funListar(page, limit, buscar.value);
    loading.value = false
    console.log(data);
    servicios.value = data.data;
    totalRecords.value = data.total;
};

async function funListarClases() {
    const { data } = await claseService.funListar();
    console.log(data);
    clases.value = data;
};

async function funGuardarServicio(){
    submitted.value = true;
    if (
        servicio.value.nombre &&
        servicio.value.nombre.trim() &&
        servicio.value.precio
    ){
        if (servicio.value.id) {
            await servicioService.funModificar(servicio.value, servicio.value.id)
            funListarServicios()
            toast.add({
                severity: 'success',
                summary: 'Modificacion Exitosa',
                detail: 'El Servicio ha sido Modificado',
                life: 4000 });
        } else {
            await servicioService.funGuardar(servicio.value)
            funListarServicios()
            toast.add({
                severity: 'success',
                summary: 'Registro Exitoso',
                detail: 'El Servicio ha sido Registrado',
                life: 4000 });
        }
        servicioDialog.value = false;
        servicio.value = {};
    }
};

async function funEditarServicio(editService){
    servicio.value = { ...editService };
    console.log(servicio);
    servicioDialog.value = true;
};

async function funEliminarServicio(){
    await servicioService.funEliminar(servicio.value.id);
    funListarServicios();
    deleteServicioDialog.value = false;
    servicio.value = {};
    toast.add({
        severity: 'success',
        summary: 'Eliminacion Exitosa',
        detail: 'El Servicio ha sido Eliminado',
        life: 4000
    });
};

const funDialogNuevoServicio = () => {
    servicio.value = {};
    submitted.value = false;
    servicioDialog.value = true;
};

const funDialogEliminarServicio = (editService) => {
    servicio.value = editService;
    deleteServicioDialog.value = true;
};

const funExportCSV = () => {
    dt.value.exportCSV();
};

const funBuscar = () => {
    funListarServicios()
};

const funDialogImagen = (serv) => {
    servicio.value = { ...serv };
    servicioDialogImagen.value = true;
};

const funSubirImagenServicio = async (event) => {
    const file = event.files[0];
    let formData = new FormData();
    formData.append("imagen",file)
    await servicioService.funActualizarImagen(servicio.value.id, formData)
    servicioDialogImagen.value = false;
    servicio.value = {};
    funListarServicios();
    toast.add({
        severity: 'success',
        summary: 'Actualizacion Exitosa',
        detail: 'La Imagen ha sido Actualizada',
        life: 4000
    });
};
</script>
