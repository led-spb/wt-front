<script setup lang="ts">
    import { onMounted, ref, computed } from 'vue';
    import { useRoute } from 'vue-router';
    import { usersApi } from '@/api/users';

    const route = useRoute()

    const invite = ref({
        hash: "",
        status: false,
    })

    const form = ref({
        login: "",
        password: "",
        retype: "",
    })
    const isInviteValid = computed( () => {
        return invite.value.status

    })

    onMounted(() => {
        const invite_hash = String(route.params.invite)
        invite.value.hash = invite_hash

        usersApi.checkInvite(invite_hash).then(
            status => {
                invite.value.status = !!status
            }
        )
    })
</script>

<template>
    <template v-if="!isInviteValid">
        <va-alert color="info"
            description="Регистрация новых пользователей недоступна"
        />
    </template>
    <template v-else>
        <va-card class="item">
            <va-card-title>Регистрация</va-card-title>
            <va-card-content>
                <va-input label="Логин" v-model="form.login" class="row" :rules="[(v) => Boolean(v) || 'Поле обязательно для заполнения']"/>
                <va-input label="Пароль" v-model="form.password" type="password" class="row" :rules="[(v) => Boolean(v) || 'Поле обязательно для заполнения']"/>
                <va-input label="Поворите пароль" v-model="form.retype" type="password" class="row" 
                   :rules="[(v) => Boolean(v) || 'Поле обязательно для заполнения', (v) => v == form.password || 'Пароли должны совпадать']"/>
            </va-card-content>
            <va-card-actions align="right">
                <va-button preset="secondary">Отмена</va-button>
                <va-button>Регистрация</va-button>
            </va-card-actions>
        </va-card>
    </template>
</template>