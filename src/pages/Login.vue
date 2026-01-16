<script setup lang="ts">
    import {ref} from 'vue'
    import {useRouter, useRoute} from 'vue-router'
    import {usersApi} from '@/api/users'
    import {useAuthStore} from '@/stores';
    import {useToast } from 'vuestic-ui';

    const auth = useAuthStore()
    const router = useRouter()
    const route = useRoute()
    const toastManager = useToast()

    const form = ref({
        login: localStorage.getItem('username') || '',
        password: ''
    })

    async function onLogin(){
        usersApi.getToken(form.value.login, form.value.password)
            .then((data) => {
                localStorage.setItem('username', form.value.login)
                auth.setAccessToken(data.access_token);

                const redirectPath = route.query.redirect;
                if( redirectPath ){
                    router.push({path: String(redirectPath)})
                }else{
                    router.push({name: "home"})
                }
            })
            .catch((error) => {
                toastManager.notify({
                    message: 'Неверные логин/пароль',
                    color: "warning",
                })
                console.log(error)
            })
    }
</script>


<template>
    <VaModal :model-value="true" size="auto" withoutTransitions okText="Login" v-on:ok="onLogin()" v-on:cancel="router.back()">
        <VaForm class="flex">
            <VaInput label="Login" v-model="form.login" class="row" :rules="[(v) => Boolean(v) || 'Login is required']"/>
            <VaInput label="Password" v-model="form.password" type="password" class="row" :rules="[(v) => Boolean(v) || 'Password is required']"/>
        </VaForm>
    </VaModal>
</template>
