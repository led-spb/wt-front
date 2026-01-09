<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import SpellingExam from '@/components/SpellingExam.vue';

    import { useWordsStore, useStatsStore} from '@/stores';

    import { usersApi } from '@/api/users';

    const words = useWordsStore();
    const stats = useStatsStore();

    function onRightAnswer(){
        stats.incRight()
        usersApi.sendUserStat([words.currentWord['id']], [])
    }

    function onWrongAnswer(){
        stats.incWrong()
        usersApi.sendUserStat([], [words.currentWord['id']])
    }

    onMounted(() => { words.nextWord() });
</script>

<template>
        <va-card class="align-center">
            <va-card-title>Орфограммы/Словарные слова</va-card-title>
            <va-card-content>
                <spelling-exam
                    v-model="words.currentWord" v-if="words.currentWord"
                    v-on:on-right="onRightAnswer()" v-on:on-wrong="onWrongAnswer()">
                </spelling-exam>
                <va-button preset="primary" icon-right="arrow_forward" v-on:click="words.nextWord()">Дальше</va-button>
            </va-card-content>
        </va-card>
</template>

<style scoped>
    .h-screen {
        display: flex;
    }
</style>