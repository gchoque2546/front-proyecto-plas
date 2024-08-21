<template>
    <div class="card">
        <h1>Productos</h1>
        {{ productos }}
    </div>
        
    <div class="card">
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
                <FileUpload
                    mode="basic"
                    accept="image/*"
                    :maxFileSize="1000000"
                    label="Import"
                    chooseLabel="Import"
                    class="mr-2 inline-block" />
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
            dataKey="id"
            removableSort
            Striped Rows
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            tableStyle="min-width: 15rem"
            paginatorTemplate="RowsPerPageDropdown PrevPageLink CurrentPageReport NextPageLink "
            currentPageReportTemplate="Mostrando {first} al {last} de {totalRecords} Productos"
            responsiveLayout="scroll">
            <template #paginatorstart>
                <!--Button
                    type="button"
                    icon="pi pi-refresh"
                    text
                    @click="funListarProductos()"
                ></Button-->
            </template>
            <Column
                field="id"
                header="ID"
                sortable
                style="width: 5%">
                <template #body="slotProps">
                    <span class="p-column-title">ID</span>
                    {{ slotProps.data.id }}
                </template>
            </Column>
            <Column
                field="nombre"
                header="NOMBRE"
                sortable
                style="width: 15%">
                <template #body="slotProps">
                    <span class="p-column-title">Nombre</span>
                    {{ slotProps.data.nombre }}
                </template>
            </Column>
            <Column 
                field="precio"
                header="PRECIO"
                sortable
                style="width: 10%">
                <template #body="slotProps">
                    <span class="p-column-title">Precio</span>
                    {{ slotProps.data.precio }}
                </template>
            </Column>
            <Column
                field="stock"
                header="STOCK"
                sortable
                style="width: 10%">
                <template #body="slotProps">
                    <span class="p-column-title">Stock</span>
                    {{ slotProps.data.stock }}
                </template>
            </Column>
            <Column
                field="descripcion"
                header="DESCRIPCION"
                sortable
                style="width: 30%">
                <template #body="slotProps">
                    <span class="p-column-title">Descripcion</span>
                    {{ slotProps.data.descripcion }}
                </template>
            </Column>
            <Column
                field="categoria.nombre"
                header="CATEGORIA"
                sortable
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
                        @click="imagenProducto(slotProps.data)"
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

// Metodos o Funciones
onMounted(()=>{
    funListarProductos()
    funListarCategorias()
})

async function funListarProductos() {
    //loading.value = true

    //let page = lazyParams.value.page+1;
    //let limit = lazyParams.value.rows;

    const { data } = await productoService.funListar();
    //loading.value = false
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
//const deleteProduct = async () => {
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
</script>