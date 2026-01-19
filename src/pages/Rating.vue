<script setup lang="ts">
    import { useUsersStore } from '@/stores';

    const userStore = useUsersStore();
    function displayPercent(item: any){
        return item.total == 0 ? 0 : Math.ceil(item.success / item.total * 100)
    }

</script>


<template>
    <va-card class="item">
        <va-card-title>Рейтинг за неделю</va-card-title>
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
                        <td v-if="item.total == 0">-</td><td v-else>{{ displayPercent(item) }} %</td>
                        </tr>
                    </tbody>
                    </table>
            </div>   
        </va-card-content>
    </va-card>

</template>