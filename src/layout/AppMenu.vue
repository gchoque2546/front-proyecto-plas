<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Administración',
        items: [{ label: 'admin', icon: 'pi pi-fw pi-home', to: '/' },
                { label: 'perfil', icon: 'pi pi-fw pi-user', to: '/about' }
        ]
    },
    {
        label: 'Gestión de Productos',
        items: [
            { label: 'Categorias', icon: 'pi pi-fw pi-id-card', to: '/categoria' },
            { label: 'Productos', icon: 'pi pi-fw pi-check-square', to: '/producto' },
            { label: 'Pedidos', icon: 'pi pi-fw pi-globe', to: '/pedido'},
            { label: 'Nuevo Pedido', icon: 'pi pi-fw pi-globe', to: '/pedido/nuevo'}
        ]
    },
    {
        label: 'Gestion de Contratos',
        items: [
        { label: 'Clases', icon: 'pi pi-fw pi-id-card', to: '/clase' },
        { label: 'Servicios', icon: 'pi pi-fw pi-check-square', to: '/servicio' },
            { label: 'Contratos', icon: 'pi pi-fw pi-globe', to: '/contrato'},
            { label: 'Nuevo Contrato', icon: 'pi pi-fw pi-globe', to: '/contrato/nuevo'}
        ]
    },
    {
        label: 'Gestión de Usuarios',
        items: [
            { label: 'Clientes', icon: 'pi pi-fw pi-eye', to: '/cliente'},
            { label: 'Usuarios', icon: 'pi pi-fw pi-prime', to: '/usuario' },
        ]
    },
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
