<script setup lang="ts">
    import { ref } from 'vue';

    const showSidebar = ref()
</script>


<template>
    <div class="container">
        <va-navbar color="primary" class="py-2">
            <template #left>
            <va-button :icon="showSidebar ? 'menu_open' : 'menu'" @click="showSidebar = !showSidebar"/>
            </template>
            <template #center>
                <va-navbar-item class="font-bold text-lg"></va-navbar-item>
            </template>
        </va-navbar>

        <div class="content">
            <va-content>
                <router-view></router-view>
            </va-content>
        </div>
    </div>    

</template>


<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    .content {
        flex-grow: 1;
    }
</style>
