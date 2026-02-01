<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue';
    import { wordsApi } from '@/api/words';
    import { usersApi } from '@/api/users';
    import { useWordsStore, useTagsStore, useRuleStore } from '@/stores';
    import CommonTask from '@/components/CommonTask.vue';
    import AccentExam from '@/components/AccentExam.vue';


    const statistics = ref({
        success: 0, failed: 0
    });
    const task = ref({
        count: 20,
        level: 10,
        errors: 30,
        tags: [],
    })
    const wordsStore = useWordsStore()
    const tagsStore = useTagsStore()
    const ruleStore = useRuleStore()

    const tags = computed(() => {
        return tagsStore.tags?.filter( (tag :any) => {
            return tag?.type == "accent"
        } )
    })
    const currentRuleList = computed(() => {
        return wordsStore?.currentWord?.rules?.map(
             (ruleId: number) => ruleStore.ruleById(ruleId)
        ).filter(
            (rule: any) => rule?.type == "accent"
        )
    })

    function startExam(){
        statistics.value = {success: 0, failed: 0}

        wordsApi.getAccentTask(task.value.tags, task.value.count, task.value.level, task.value.errors)
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

    onMounted(() => {
        wordsStore.setWords([])
    })
</script>

<template>
    <common-task class="item"
        title="Ударения" 
        v-model:word="wordsStore.currentWord" v-model:statistics="statistics" v-model:task="task"
        :tags="tags" :rules="currentRuleList" :total="wordsStore.totalWords" :current="wordsStore.countWord"
        @start="startExam" @next="wordsStore.nextWord" @complete="onCompleteWord">
        <accent-exam v-model="wordsStore.currentWord"></accent-exam>
    </common-task>
</template>

<style scoped>
</style>