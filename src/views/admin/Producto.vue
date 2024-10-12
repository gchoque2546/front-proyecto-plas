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
        <!-- Subir Imagen (si sirve)-->
        <Dialog
            v-model:visible="productoDialogImagen" 
            :style="{ width: '600px' }" 
            header="Actualizar Imagen" 
            :modal="true"
            class="p-fluid"
        >
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="`http://127.0.0.1:8000/${producto.imagen}`" alt="" width="250">
        </div>
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
        <Toast />
    </div>
</template>

<script setup>
// Importaciones
    import { onMounted, ref } from 'vue';
    import productoService from '@/services/producto.service';
    import categoriaService from '@/services/categoria.service';
    import { useToast } from 'primevue/usetoast';

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
</script>