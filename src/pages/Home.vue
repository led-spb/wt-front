<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue';
    import { useUsersStore } from '@/stores';
    import WordsStatistic from '@/components/WordsStatistic.vue';

    const tabs = ref([
        {label: 'Сегодня', offset: 0},
        {label: 'Неделя', offset: 7},
        {label: 'Месяц', offset: 30},
        {label: 'Всего', offset: 1000},
    ])
    const userStore = useUsersStore()
    const stat = computed(() => {
        const selected = currentTab.value
        const offset = tabs.value[selected]?.offset
        return userStore.dailyStats(offset || 0)
    })
    const topFailed = computed( () => {
        return userStore.currentUserStat?.failed
    })
    const currentTab = ref(0)

    function displayPercent(item: any){
        return (item.success + item.failed) == 0 ? 0 : Math.ceil(item.success / (item.success + item.failed) * 100)
    }

    onMounted(() => {
        userStore.loadCurrentUser()
    })
</script>


<template>
        <va-card class="item">
            <va-card-title>Статистика</va-card-title>
            <va-card-content>
                <va-tabs vertical v-model="currentTab">
                    <template #tabs>
                        <va-tab :key="tab.label" v-for="tab in tabs">{{ tab.label }}</va-tab>
                    </template>
                    <words-statistic v-model="stat"/>
                </va-tabs>
                </va-card-content>
        </va-card>

        <va-card class="item"> 
            <va-card-title>Топ ошибок</va-card-title>
            <va-card-content>
                <div class="va-table-responsive">
                        <table class="va-table" width="100%">
                        <thead>
                            <tr>
                            <th>Слово</th>
                            <th>Ошибок</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in topFailed" :key="item.word.id">
                            <td>{{ item.word.fullword }}</td>
                            <td>{{ item.failed }}</td>
                            </tr>
                        </tbody>
                        </table>
                </div>   
            </va-card-content>                 
        </va-card>

        <va-card class="item">
            <va-card-title>Рейтинг за месяц</va-card-title>
            <va-card-content>
                <div class="va-table-responsive">
                        <table class="va-table" width="100%">
                        <thead>
                            <tr>
                                <th>Имя</th>
                                <th>Попыток</th>
                                <th>% успешных</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in userStore.rating" :key="item.user.id">
                            <td>{{ item.user.name }}</td>
                            <td>{{ item.success + item.failed }}</td>
                            <td>{{ displayPercent(item) }} %</td>
                            </tr>
                        </tbody>
                        </table>
                </div>   
            </va-card-content>
        </va-card>

</template>
