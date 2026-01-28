<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue';
    import { useUsersStore } from '@/stores';

    import TaskStatistic from '@/components/TaskStatistic.vue';
    import Word from '@/components/Word.vue';

    const tabs = ref([
        {label: 'Сегодня', value: 0},
        {label: 'Неделя', value: 7},
        {label: 'Месяц', value: 30},
        {label: 'Всего', value: 1000},
    ])
    const userStore = useUsersStore()
    const stat = computed(() => {
        return userStore.dailyStats(currentStatOffset.value || 0)
    })
    const topFailed = computed( () => {
        return userStore.currentUserStat?.failed
    })
    const currentStatOffset = ref(0)

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
                <va-button-toggle v-model="currentStatOffset" grow color="backgroundSecondary" toggle-color="primary" :options="tabs" size="small"></va-button-toggle>
                <task-statistic v-model="stat"/>
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
