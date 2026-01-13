<script setup lang="ts">
    import { ref, computed } from 'vue';
    import { useAuthStore, useUsersStore } from '@/stores';
    import { useRouter, useRoute} from 'vue-router'
    import { useColors } from 'vuestic-ui';

    const showSidebar = ref(false)
    const auth = useAuthStore()
    const user = useUsersStore()
    const router = useRouter()
    const colorManager = useColors()

    const darkTheme = computed({
        get() {
            return colorManager.currentPresetName.value == 'dark'
        },
        set(value: boolean) {
            colorManager.applyPreset(value ? 'dark': 'light')
            localStorage.setItem('darkMode', JSON.stringify(value))
        }
    })

    const links = [
        {name: 'Домой', route: 'home', icon: 'home', visible: () => auth.isAuthentificated},
        {name: 'Орфограммы', route: 'spelling', icon: 'format_color_text', visible: () => auth.isAuthentificated},
        {name: 'Вход', route: 'login', icon: 'login', visible: () => !auth.isAuthentificated},
        {name: 'Выход', route: 'logout', icon: 'logout', visible: () => auth.isAuthentificated },
    ]
    const panelItems = computed( () => {
        return links.filter(item => item.visible())
    })

    function setLinkActive(link: any){
        showSidebar.value = false
        router.push( {name: link.route} )
    }

    function isLinkActive(link: any){
        return useRoute().name == link.route
    }
</script>


<template>

    <va-layout style="min-height: 100vh;" :left="{ fixed: true }" :top="{ fixed: true }">
        <template #top>
            <va-app-bar top>
                <va-button :icon="showSidebar ? 'menu_open' : 'menu'" @click="showSidebar = !showSidebar" style="margin-right: 10px;"/>
                <va-navbar-item class="font-bold va-h6">Тренажер слов</va-navbar-item>
                <va-spacer/>
                <va-navbar-item style="margin-right: 10px;" v-if="user.currentUser">{{ user.currentUser.name  }}</va-navbar-item>
            </va-app-bar>
        </template>

        <template #left>

            <va-sidebar v-model="showSidebar">
                <va-sidebar-item v-for="(item, idx) in panelItems" 
                    :active="isLinkActive(item)" @click="setLinkActive(item)">
                    <va-sidebar-item-content>
                        <va-icon :name="item.icon" v-if="item.icon"/>
                        <va-sidebar-item-title>{{ item.name }}</va-sidebar-item-title>
                    </va-sidebar-item-content>

                </va-sidebar-item>

                <va-spacer/>
                <va-sidebar-item>
                    <va-sidebar-item-content>
                        <va-switch size="small" v-model="darkTheme">
                            <template #innerLabel>
                                <va-icon :name="darkTheme ? 'dark_mode' : 'light_mode'"></va-icon>
                            </template>
                        </va-switch>
                    </va-sidebar-item-content>
                </va-sidebar-item>
                <va-sidebar-item>
                    <va-sidebar-item-content>
                        <va-icon name="settings"/>
                        <va-sidebar-item-title>Настройки</va-sidebar-item-title>
                    </va-sidebar-item-content>
                </va-sidebar-item>
            </va-sidebar>

        </template>

        <template #content>
            <div style="min-height: 5vh;"></div>
            <div class="container">
                <router-view></router-view>
            </div>
        </template>
    </va-layout>

</template>


<style scoped>
    .container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        justify-content: space-evenly;
        align-items: stretch;
        align-content: center;

        gap: 20px;
    }
</style>


<style>
    .item {
        min-width: 360px;
    }
</style>