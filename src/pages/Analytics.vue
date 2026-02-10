<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue';
    import { useUsersStore } from '@/stores';
    import { StatisticsApiService } from '@/api/statistics';
    import { axiosInstance } from '@/api/config';

    const statisticsApiService = new StatisticsApiService(axiosInstance);
    const userStore = useUsersStore()
    const tagsStatistcs = ref<any[]>()

    onMounted(() => {
        statisticsApiService.getTagsStat().then( data => {
            tagsStatistcs.value = data
        })
    })

    const percent = (current :any, total :any) => total > 0 ? Math.ceil(current/total * 100) : 0
</script>

<template>
    <va-card class="item" v-for="info in tagsStatistcs">
        <va-card-title>{{ info.tag.title }}</va-card-title>
        <va-card-content>
            <va-list class="stat">
                <va-list-item>
                    <va-list-item-section>Попыток</va-list-item-section>
                    <va-list-item-section icon>{{ info.total }}</va-list-item-section>
                </va-list-item>
                <va-list-item>
                    <va-list-item-section>Правильно</va-list-item-section>
                    <va-list-item-section icon>{{ info.total-info.failed }}</va-list-item-section>
                </va-list-item>
                <va-list-item>
                    <va-list-item-section>Ошибок</va-list-item-section>
                    <va-list-item-section icon>{{ info.failed }}</va-list-item-section>
                </va-list-item>
                <va-list-item>
                    <va-list-item-section>Процент</va-list-item-section>
                    <va-list-item-section icon>{{ percent(info.total-info.failed, info.total) }}%</va-list-item-section>
                </va-list-item>
            </va-list>
        </va-card-content>
    </va-card>
</template>
