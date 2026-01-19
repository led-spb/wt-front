<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue';
    import { useUsersStore } from '@/stores';
    import WordsStatistic from '@/components/WordsStatistic.vue';
    import Word from '@/components/Word.vue';

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

    onMounted(() => {
        userStore.loadCurrentUser()
    })

    const progressWordsPct = computed(() => {
        return Math.ceil(userStore.currentUserStat?.progress?.learned / userStore.currentUserStat?.progress?.total * 100)
    })
    const progressWordsLearned = computed(() => userStore.currentUserStat?.progress?.learned)
    const progressWordsTotal = computed(() => userStore.currentUserStat?.progress?.total)
</script>


<template>
        <va-card class="item">
            <va-card-title><va-icon name="bar_chart" class="card-icon"/>Статистика</va-card-title>
            <va-card-content>
                <va-list-item>
                    <va-list-item-section>
                        Изучено слов:
                    </va-list-item-section>
                    <va-list-item-section icon>{{ progressWordsLearned }} / {{ progressWordsTotal }}</va-list-item-section>
                </va-list-item>

                <va-progress-bar :model-value="progressWordsPct" showPercent></va-progress-bar>
                <va-divider/>

                <va-tabs v-model="currentTab" :center="false">
                    <template #tabs>
                        <va-tab :key="tab.label" v-for="tab in tabs">{{ tab.label }}</va-tab>
                    </template>
                </va-tabs>
                <words-statistic v-model="stat"/>
                </va-card-content>
        </va-card>

        <va-card class="item"> 
            <va-card-title><va-icon name="tour" class="card-icon"/>Топ ошибок</va-card-title>
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
                            <td><word :value="item.word"/></td>
                            <td>{{ item.failed }}</td>
                            </tr>
                        </tbody>
                        </table>
                </div>   
            </va-card-content>                 
        </va-card>

</template>
