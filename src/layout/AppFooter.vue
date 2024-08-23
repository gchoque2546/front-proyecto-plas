<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed } from 'vue';

const { layoutConfig } = useLayout();

const logoUrl = computed(() => {
    //return `/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
    return `/img/${layoutConfig.darkTheme.value ? 'logoPlas00' : 'logoPlas01'}.webp`;
});
</script>

<template>
    <div class="layout-footer">
        <img :src="logoUrl" alt="Logo Plas" height="20" class="mr-2" />
        <!--Image src="../img/logoPlas01.webp" alt="Logo Plas" height="40" /-->
        por
        <span class="font-medium ml-2">Constructora Plas</span>
    </div>
</template>
<style lang="scss" scoped></style>
