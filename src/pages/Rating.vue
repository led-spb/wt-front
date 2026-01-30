<script setup lang="ts">
    import { onMounted, computed } from 'vue';
    import { useUsersStore } from '@/stores';

    const userStore = useUsersStore();
    function displayPercent(item: any){
        return item.total == 0 ? 0 : Math.ceil(item.success / item.total * 1000)/10
    }

    onMounted(() => {
        userStore.loadCurrentUserStat()
    })

    const ratingByProgress = computed(() => {
        return userStore.rating?.toSorted( (a :any, b :any) => {
            return b.progress_pct - a.progress_pct
        })
    })

    const ratingBySuccess = computed(() => {
        return userStore.rating?.toSorted( (a :any, b :any) => {
            const a_value = a.total == 0 ? 0 : a.success / a.total
            const b_value = b.total == 0 ? 0 : b.success / b.total
            return b_value - a_value
        })
    })

</script>


<template>
    <va-card class="item">
        <va-card-title><va-icon name="leaderboard" class="card-icon"/>Рейтинг обучения</va-card-title>
        <va-card-content>
            <div class="va-table-responsive">
                    <table class="va-table" width="100%">
                    <thead>
                        <tr>
                            <th>Имя</th>
                            <th class="va-text-right">Изучено слов</th>
                            <th class="va-text-right">% изучено</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item, index in ratingByProgress" :key="item.user.id">
                        <td>{{ item.user.name }}</td>
                        <td class="va-text-right">{{ item.progress }}</td>
                        <td class="va-text-right">{{ Math.ceil(item.progress_pct*1000)/10 }}</td>
                        </tr>
                    </tbody>
                    </table>
            </div>   
        </va-card-content>
    </va-card>

    <va-card class="item">
        <va-card-title><va-icon name="leaderboard" class="card-icon"/>Рейтинг за неделю</va-card-title>
        <va-card-content>
            <div class="va-table-responsive">
                    <table class="va-table" width="100%">
                    <thead>
                        <tr>
                            <th>Имя</th>
                            <th class="va-text-right">Правильно</th>
                            <th class="va-text-right">Всего</th>
                            <th class="va-text-right">%</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item, index in ratingBySuccess" :key="item.user.id">
                        <td>{{ item.user.name }}</td>
                        <td class="va-text-right">{{ item.success }}</td>
                        <td class="va-text-right">{{ item.success + item.failed }}</td>
                        <td class="va-text-right"><span v-if="item.total == 0">-</span><span v-else>{{ displayPercent(item) }}</span></td>
                        </tr>
                    </tbody>
                    </table>
            </div>   
        </va-card-content>
    </va-card>

</template>