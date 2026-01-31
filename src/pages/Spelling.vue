<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue';
    import { wordsApi } from '@/api/words';
    import { usersApi } from '@/api/users';
    import { useWordsStore, useTagsStore, useRuleStore } from '@/stores';

    import CommonTask from '@/components/CommonTask.vue';
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
        return wordsStore?.currentWord?.rules?.map(
            (ruleId: number) => ruleStore.ruleById(ruleId)
        ).filter(
            (rule: any) => rule?.type == "spelling"
        )
    })

    const startExam = () => {
        statistics.value = {success: 0, failed: 0}

        wordsApi.getSpellingTask(task.value.tags, task.value.count, task.value.level || 10, task.value.errors)
            .then( data => {
                wordsStore.setWords(data)
                wordsStore.nextWord()
            })
    }

    const onCompleteWord = (result: boolean) => {
        if( result ) {
            usersApi.sendUserStat([wordsStore.currentWord.id], [])
        } else {
            usersApi.sendUserStat([], [wordsStore.currentWord.id])
        }
    }

    const sendUserRport = () => {
        if( wordsStore.currentWord?.id ){
            usersApi.sendReport(wordsStore.currentWord?.id)
        }
    }

    onMounted(() => {
        wordsStore.setWords([])
    })
</script>

<template>
    <common-task class="item"
        title="Орфограммы/Словарные слова" 
        v-model:statistics="statistics" 
        v-model:word="wordsStore.currentWord" 
        v-model:task="task"
        :tags="tags" :rules="currentRuleList" :total="wordsStore.totalWords" :current="wordsStore.countWord"
        @start="startExam" @next="wordsStore.nextWord" @complete="onCompleteWord" @report="sendUserRport">
        <spelling-exam v-model="wordsStore.currentWord"></spelling-exam>
    </common-task>
</template>

<style scoped>
</style>