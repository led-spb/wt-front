<script setup lang="ts">
    import { ref, computed, onMounted, watch } from 'vue';
    import { wordsApi } from '@/api/words';
    import { usersApi } from '@/api/users';
    import { useWordsStore, useTagsStore, useRuleStore } from '@/stores';


    import WordTask from '@/components/WordTask.vue';
    import SpellingExam from '@/components/SpellingExam.vue';

    const statistics = ref({
        success: 0, failed: 0
    });
    const task = ref({
        count: 20,
        errors: 50,
        level: 10,
        tags: Array(),
    })
    const wordsStore = useWordsStore()
    const tagsStore = useTagsStore()
    const ruleStore = useRuleStore()

    const tags = computed(() => {
        return tagsStore.tags?.filter( (tag :any) => {
            return tag?.type == "spelling"
        } )
    })
    const currentRuleList = computed(() => {
        return wordsStore?.currentWord?.rules?.map( (ruleId: number) => ruleStore.ruleById(ruleId) )
    })

    function startExam(){
        statistics.value = {success: 0, failed: 0}

        wordsApi.getSpellingTask(task.value.tags, task.value.count, task.value.level || 10, task.value.errors)
            .then( data => {
                wordsStore.setWords(data)
                wordsStore.nextWord()
            })
    }

    function onCompleteWord(result: boolean){
        if( result ) {
            usersApi.sendUserStat([wordsStore.currentWord.id], [])
        } else {
            usersApi.sendUserStat([], [wordsStore.currentWord.id])
        }
    }

    function sendUserRport(){
        if( wordsStore.currentWord?.id ){
            usersApi.sendReport(wordsStore.currentWord?.id)
        }
    }

    onMounted(() => {
        wordsStore.setWords([])
    })
</script>

<template>
    <word-task class="item"
        title="Орфограммы/Словарные слова" 
        v-model:statistics="statistics" 
        v-model:word="wordsStore.currentWord" 
        v-model:task="task"
        :tags="tags" :rules="currentRuleList"
        @start="startExam" @next="wordsStore.nextWord" @complete="onCompleteWord" @report="sendUserRport">
        <spelling-exam v-model="wordsStore.currentWord"></spelling-exam>
    </word-task>
</template>

<style scoped>
</style>