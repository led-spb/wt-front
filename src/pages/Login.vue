<script setup lang="ts">
    import { ref} from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { axiosInstance } from '@/api/config';
    import { UsersApiService, type UserToken } from '@/api/users';

    import { useAuthStore } from '@/stores';
    import { useToast } from 'vuestic-ui';

    const auth = useAuthStore()
    const router = useRouter()
    const route = useRoute()
    const toastManager = useToast()
    const usersApiService = new UsersApiService(axiosInstance)

    const form = ref({
        login: localStorage.getItem('username') || '',
        password: '',
    })

    const onLogin = () => {
        usersApiService.getToken(form.value.login, form.value.password)
            .then((token: UserToken) => {
                localStorage.setItem('username', form.value.login)
                auth.setAccessToken(token.accessToken);

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
            })
    }
</script>


<template>
    <va-modal :model-value="true" size="auto" withoutTransitions okText="Login" v-on:ok="onLogin()" v-on:cancel="router.back()">
        <va-input label="Логин" v-model="form.login" class="row" :rules="[(v) => Boolean(v) || 'Поле обязательно для заполнения']"/>
        <va-input label="Пароль" v-model="form.password" type="password" class="row" :rules="[(v) => Boolean(v) || 'Поле обязательно для заполнения']"/>
    </va-modal>
</template>
