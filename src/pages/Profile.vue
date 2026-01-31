<script setup lang="ts">
    import { useUsersStore } from '@/stores';

    const userStore = useUsersStore()

    const percent = (current :number, total :number) => total > 0 ? Math.ceil(current/total * 100) : 0
</script>

<template>
    <va-card class="item">
        <va-card-title><va-icon name="person" class="card-icon"/>Профиль</va-card-title>
            <va-card-title><va-icon name="star" class="card-icon"/>Цель на сегодня</va-card-title>
            <va-card-content>
                <va-progress-bar :model-value="percent(userStore.progress?.today?.learned, userStore.progress?.today.total)" showPercent></va-progress-bar>
                <va-list-item>
                    <va-list-item-section></va-list-item-section>
                    <va-list-item-section icon>{{ userStore.progress?.today?.learned }} / {{ userStore.progress?.today.total }}</va-list-item-section>
                </va-list-item>
                <va-list-item v-if="userStore.progress?.series">
                    <va-list-item-section>Серия</va-list-item-section>
                    <va-list-item-section icon><va-chip color="success" size="small">{{ userStore.progress?.series }} дней</va-chip></va-list-item-section>
                </va-list-item>
            </va-card-content>
            <va-card-title><va-icon name="hotel_class" class="card-icon"/>Всего изучено</va-card-title>
            <va-card-content>
                <va-progress-bar :model-value="percent(userStore.progress?.overall?.learned, userStore.progress?.overall?.total)" showPercent></va-progress-bar>
                <va-list-item>
                    <va-list-item-section></va-list-item-section>
                    <va-list-item-section icon>{{ userStore.progress?.overall?.learned }} / {{ userStore.progress?.overall?.total }}</va-list-item-section>
                </va-list-item>
            </va-card-content>
    </va-card>
</template>

<style>
</style>