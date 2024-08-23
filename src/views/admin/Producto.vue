<template>       
    <div class="card">
        <h2 class="flex align-items-center justify-content-center">PRODUCTOS</h2>
        <Toolbar class="mb-4">
            <template v-slot:start>
                <div class="my-2">
                    <Button
                        label="Nuevo Producto"
                        icon="pi pi-plus"
                        class="mr-2"
                        @click="funDialogNuevoProducto"
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
            :value="productos"
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
            currentPageReportTemplate="Mostrando {first} al {last} de {totalRecords} Productos"
            responsiveLayout="scroll">
            <template #header>
                <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                    <h5 class="m-0">Gestión de Productos</h5>
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
            <Column
                field="stock"
                header="STOCK"
                style="width: 10%">
                <template #body="slotProps">
                    <span class="p-column-title">Stock</span>
                    {{ slotProps.data.stock }}
                </template>
            </Column>
            <Column
                field="descripcion"
                header="DESCRIPCION"
                style="width: 30%">
                <template #body="slotProps">
                    <span class="p-column-title">Descripcion</span>
                    {{ slotProps.data.descripcion }}
                </template>
            </Column>
            <Column
                field="categoria.nombre"
                header="CATEGORIA"
                style="width: 10%">
                <template #body="slotProps">
                    <span class="p-column-title">Categoria</span>
                    {{ slotProps.data.categoria.nombre }}
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
                        @click="funEditarProducto(slotProps.data)"
                    ></Button>
                    <Button
                        icon="pi pi-trash"
                        class="mr-2"
                        severity="danger"
                        rounded
                        outlined
                        aria-label="Cancel"
                        @click="funDialogEliminarProducto(slotProps.data)"
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
            v-model:visible="productoDialog" 
            :style="{ width: '450px' }" 
            header="Producto" 
            :modal="true"
            class="p-fluid"
        >
        <!--{{ producto }}-->
            <div class="field">
                <label for="name">Nombre</label>
                <InputText
                    id="nombre"
                    v-model.trim="producto.nombre"
                    required="true"
                    :invalid="submitted && !producto.nombre"
                />
                <small class="p-invalid" v-if="submitted && !producto.nombre"
                    >Nombre Obligatorio.</small>
            </div>
            <div class="field">
                <label for="descripcion">Descripción</label>
                <Textarea
                    id="descripcion"
                    v-model="producto.descripcion"
                    rows="6"
                    cols="20"
                    autoResize 
                ></Textarea>
            </div>
            <div class="field">
                <label class="mb-3">Categoria</label>
                <div class="formgrid grid">
                    <div
                        class="field-radiobutton col-6"
                        v-for="cat in categorias"
                        :key="cat.id">
                        <RadioButton
                            :value="cat.id"
                            v-model="producto.categoria_id"
                        />
                        <label for="category1">{{ cat.nombre }}</label>
                    </div>
                </div>
            </div>
            <div class="formgrid grid">
                <div class="field col">
                    <label for="price">Precio</label>
                    <InputNumber
                        id="price"
                        v-model="producto.precio"
                        mode="currency"
                        currency="USD"
                        locale="es-US"
                        :class="{'p-invalid': submitted && !producto.precio}"
                        :required="true"
                    />
                    <small class="p-invalid" v-if="submitted && !producto.precio"
                        >Precio es Obligatorio.</small>
                </div>
                <div class="field col">
                    <label for="quantity">Stock</label>
                    <InputNumber
                        id="quantity"
                        v-model="producto.stock"
                        integeronly
                    />
                </div>
            </div>
            <template #footer>
                <Button
                    label="Cancelar"
                    icon="pi pi-times"
                    text @click="productoDialog = false"
                ></Button>
                <Button
                    label="Guardar"
                    icon="pi pi-check"
                    text="" @click="funGuardarProducto"
                ></Button>
            </template>
        </Dialog>
        <Dialog
            v-model:visible="deleteProductoDialog"
            :style="{ width: '450px' }"
            header="Confirmar"
            :modal="true">
            <div class="flex align-items-center justify-content-center">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"></i>
                <span v-if="producto"
                    >¿Esta Seguro de Eliminar el Producto <b>{{ producto.nombre }}</b>?</span>
            </div>
            <template #footer>
                <Button
                    label="No"
                    icon="pi pi-times"
                    text @click="deleteProductoDialog = false"
                ></Button>
                <Button
                    label="Si"
                    icon="pi pi-check"
                    text @click="funEliminarProducto"
                ></Button>
            </template>
        </Dialog>
        <Dialog
            v-model:visible="productoDialogImagen" 
            :style="{ width: '600px' }" 
            header="Imagen" 
            :modal="true"
            class="p-fluid"
        >
        <img :src="`http://127.0.0.1:8000/${producto.imagen}`" alt="" width="250">
        <FileUpload
            customUpload
            @uploader="funSubirImagenProducto"
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
        <!--Dialog
            v-model:visible="productoDialogImagen" 
            :style="{ width: '600px' }" 
            header="Imagen" 
            :modal="true"
            
        >
        <img :src="`http://127.0.0.1:8000/${producto.imagen}`" alt="" width="250">
        <FileUpload name="demo[]" url="/api/upload" @upload="onTemplatedUpload($event)" :multiple="true" accept="image/*" :maxFileSize="1000000" @select="onSelectedFiles">
            <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
                <div class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2">
                    <div class="flex gap-2">
                        <Button @click="chooseCallback()" icon="pi pi-images" rounded outlined></Button>
                        <Button @click="funSubirImagenProducto(uploadCallback)" icon="pi pi-cloud-upload" rounded outlined severity="success" :disabled="!files || files.length === 0"></Button>
                        <Button @click="clearCallback()" icon="pi pi-times" rounded outlined severity="danger" :disabled="!files || files.length === 0"></Button>
                    </div>
                    <ProgressBar :value="totalSizePercent" :showValue="false" :class="['md:w-20rem h-1rem w-full md:ml-auto', { 'exceeded-progress-bar': totalSizePercent > 100 }]"
                        ><span class="white-space-nowrap">{{ totalSize }}B / 1Mb</span></ProgressBar
                    >
                </div>
            </template>
            <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
                <div v-if="files.length > 0">
                    <h5>Pending</h5>
                    <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                        <div v-for="(file, index) of files" :key="file.name + file.type + file.size" class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                            <div>
                                <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" />
                            </div>
                            <span class="font-semibold">{{ file.name }}</span>
                            <div>{{ formatSize(file.size) }}</div>
                            <Badge value="Pending" severity="warning" />
                            <Button icon="pi pi-times" @click="onRemoveTemplatingFile(file, removeFileCallback, index)" outlined rounded  severity="danger" />
                        </div>
                    </div>
                </div>

                <div v-if="uploadedFiles.length > 0">
                    <h5>Completed</h5>
                    <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                        <div v-for="(file, index) of uploadedFiles" :key="file.name + file.type + file.size" class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                            <div>
                                <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" />
                            </div>
                            <span class="font-semibold">{{ file.name }}</span>
                            <div>{{ formatSize(file.size) }}</div>
                            <Badge value="Completed" class="mt-3" severity="success" />
                            <Button icon="pi pi-times" @click="removeUploadedFileCallback(index)" outlined rounded  severity="danger" />
                        </div>
                    </div>
                </div>
            </template>
            <template #empty>
                <div class="flex align-items-center justify-content-center flex-column">
                    <i class="pi pi-cloud-upload border-2 border-circle p-5 text-8xl text-400 border-400" />
                    <p class="mt-4 mb-0">Drag and drop files to here to upload.</p>
                </div>
            </template>
        </FileUpload>
        </Dialog-->
        <Toast />
    </div>
</template>

<script setup>
// Importaciones
    import { onMounted, ref } from 'vue';
    import productoService from '@/services/producto.service';
    import categoriaService from '@/services/categoria.service';
    import { useToast } from 'primevue/usetoast';

    //import { usePrimeVue } from 'primevue/config';

// Variables o Estados
    const productos = ref([]);
    const categorias = ref([]);
    const totalRecords = ref(0);
    const dt = ref(null);
    const productoDialog = ref(false);
    const deleteProductoDialog = ref(false);
    const producto = ref({});
    const submitted = ref(false);
    const toast = useToast();
    const loading = ref(false);
    const lazyParams = ref({page: 0})
    const buscar = ref("");
    const productoDialogImagen = ref(false);

    //const $primevue = usePrimeVue();
    //const totalSize = ref(0);
    //const totalSizePercent = ref(0);
    //const files = ref([]);

// Metodos o Funciones
onMounted(()=>{
    funListarProductos()
    funListarCategorias()
});

const onPage = (event) => {
    console.log(event)
    lazyParams.value = event;
    funListarProductos()
};

async function funListarProductos() {
    loading.value = true
    let page = lazyParams.value.page+1;
    let limit = lazyParams.value.rows;
    const { data } = await productoService.funListar(page, limit, buscar.value);
    loading.value = false
    console.log(data);
    productos.value = data.data;
    totalRecords.value = data.total;
};

async function funListarCategorias() {
    const { data } = await categoriaService.funListar();
    console.log(data);
    categorias.value = data;
};

async function funGuardarProducto(){
    submitted.value = true;
    if (
        producto.value.nombre &&
        producto.value.nombre.trim() &&
        producto.value.precio
    ){
        if (producto.value.id) {
            await productoService.funModificar(producto.value, producto.value.id)
            funListarProductos()
            toast.add({
                severity: 'success',
                summary: 'Modificacion Exitosa',
                detail: 'El Producto ha sido Modificado',
                life: 4000 });
        } else {
            await productoService.funGuardar(producto.value)
            funListarProductos()
            toast.add({
                severity: 'success',
                summary: 'Registro Exitoso',
                detail: 'El Producto ha sido Registrado',
                life: 4000 });
        }
        productoDialog.value = false;
        producto.value = {};
    }
};

async function funEditarProducto(editProduct){
    producto.value = { ...editProduct };
    console.log(producto);
    productoDialog.value = true;
};

async function funEliminarProducto(){
    await productoService.funEliminar(producto.value.id);
    funListarProductos();
    deleteProductoDialog.value = false;
    producto.value = {};
    toast.add({
        severity: 'success',
        summary: 'Eliminacion Exitosa',
        detail: 'El Producto ha sido Eliminado',
        life: 4000
    });
};

const funDialogNuevoProducto = () => {
    producto.value = {};
    submitted.value = false;
    productoDialog.value = true;
};

const funDialogEliminarProducto = (editProduct) => {
    producto.value = editProduct;
    deleteProductoDialog.value = true;
};

const funExportCSV = () => {
    dt.value.exportCSV();
};

const funBuscar = () => {
    funListarProductos()
};

const funDialogImagen = (prod) => {
    producto.value = { ...prod };
    productoDialogImagen.value = true;
};

const funSubirImagenProducto = async (event) => {
    const file = event.files[0];
    let formData = new FormData();
    formData.append("imagen",file)
    await productoService.funActualizarImagen(producto.value.id, formData)
    productoDialogImagen.value = false;
    producto.value = {};
    funListarProductos();
    toast.add({
        severity: 'success',
        summary: 'Actualizacion Exitosa',
        detail: 'La Imagen ha sido Actualizada',
        life: 4000
    });
};





//NO SIRVE
const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
    removeFileCallback(index);
    totalSize.value -= parseInt(formatSize(file.size));
    totalSizePercent.value = totalSize.value / 10;
};

const onClearTemplatingUpload = (clear) => {
    clear();
    totalSize.value = 0;
    totalSizePercent.value = 0;
};

const onSelectedFiles = (event) => {
    files.value = event.files;
    files.value.forEach((file) => {
        totalSize.value += parseInt(formatSize(file.size));
    });
};

const uploadEvent = (callback) => {
    totalSizePercent.value = totalSize.value / 10;
    callback();
};

const onTemplatedUpload = () => {
    toast.add({ severity: "info", summary: "Success", detail: "File Uploaded", life: 3000 });
};

const formatSize = (bytes) => {
    const k = 1024;
    const dm = 3;
    const sizes = $primevue.config.locale.fileSizeTypes;

    if (bytes === 0) {
        return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
};
</script>