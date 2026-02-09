<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue';

    import { axiosInstance } from '@/api/config';
    import { WordsApiService, type Word } from '@/api/words';

    import { useWordsStore, useTagsStore, useRuleStore, useStatisticsStore } from '@/stores';

    import CommonTask from '@/components/CommonTask.vue';
    import SpellingExam from '@/components/SpellingExam.vue';

    
    const wordsApiService = new WordsApiService(axiosInstance)

    const task = ref({
        count: 20,
        errors: 30,
        level: 10,
        tags: Array(),
    })
    const wordsStore = useWordsStore()
    const tagsStore = useTagsStore()
    const ruleStore = useRuleStore()
    const statisticsStore = useStatisticsStore()

    const tags = computed(() => {
        return tagsStore.tags?.filter( (tag :any) => {
            return tag?.type == "spelling"
        } )
    })
    const currentRuleList = computed(() => {
        return wordsStore?.currentWord?.rules?.map(
            (ruleId: number) => ruleStore.ruleById(ruleId)
        ).filter(
            (rule: any) => rule?.type == "spelling"
        )
    })

    const startExam = () => {
        statisticsStore.clear()

        wordsApiService.getSpellingTask(task.value.tags, task.value.count, task.value.errors)
            .then( (data: Word[]) => {
                wordsStore.setWords(data)
                wordsStore.nextWord()
            })
    }

    const onCompleteWord = (result: boolean) => {
        if( wordsStore.currentWord ){
            if( result ) statisticsStore.storeSuccess(wordsStore.currentWord)
            else statisticsStore.storeFailed(wordsStore.currentWord)
        }
    }

    const sendUserRport = () => {
        if( wordsStore.currentWord ) wordsApiService.sendWordReport(wordsStore.currentWord)
    }

    onMounted(() => {
        if( !wordsStore.currentWord?.spellings ){
            wordsStore.setWords([])
        }
    })
</script>

<template>
    <common-task class="item"
        title="Орфограммы/Словарные слова" 
        v-model:statistics="statisticsStore.statistic"
        v-model:word="wordsStore.currentWord"
        v-model:task="task"
        :tags="tags" :rules="currentRuleList" :total="wordsStore.totalWords" :current="wordsStore.countWord"
        @start="startExam" @next="wordsStore.nextWord" @complete="onCompleteWord" @report="sendUserRport">

        <spelling-exam v-model="wordsStore.currentWord"></spelling-exam>
    </common-task>
</template>