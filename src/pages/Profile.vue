<script setup lang="ts">
    import { computed, onMounted } from 'vue';
    import { useUsersStore } from '@/stores';

    const userStore = useUsersStore()

    const percent = (current :number, total :number) => total > 0 ? Math.ceil(current/total * 100) : 0
    const data = computed(() => {
        return userStore.statistics.map( (item :any) => item.total)
    })

    onMounted(() => {
        userStore.loadUserStat()
    })
</script>

<template>
    <va-card class="item" v-if="userStore.user">
            <va-card-title><va-icon name="person" class="card-icon"/>Информация</va-card-title>
            <va-card-content>
                <va-input class="row input" label="Отображаемое имя" :model-value="userStore.user?.name"></va-input>
                <va-button preset="primary" border-color="primary">Сменить пароль</va-button>
                <va-divider/>
            </va-card-content>
            <va-card-title><va-icon name="star" class="card-icon"/>Мои цели</va-card-title>
            <va-card-content>
                <va-slider label="Изучить слов в день" pins track-label-visible :min="20" :max="100" :step="10" class="row iput" :model-value="userStore.user?.daily_goal"></va-slider>
                <va-divider/>
            </va-card-content>
            <va-card-title><va-icon name="notifications_active" class="card-icon"/>Оповещения</va-card-title>
            <va-card-content>
                <va-divider/>
            </va-card-content>
            <va-card-actions align="right">
                <va-button color="secondary">Отмена</va-button>
                <va-button color="primary">Сохранить</va-button>
            </va-card-actions>
    </va-card>
</template>

<style>
    .input {
        margin-bottom: 0.5rem;
    }
</style>