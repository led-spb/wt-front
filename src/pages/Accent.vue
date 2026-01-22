<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue';
    import { wordsApi } from '@/api/words';
    import { usersApi } from '@/api/users';
    import { useWordsStore, useTagsStore } from '@/stores';
    import WordTask from '@/components/WordTask.vue';
    import AccentExam from '@/components/AccentExam.vue';


    const statistics = ref({
        success: 0, failed: 0
    });
    const task = ref({
        count: 20,
        level: 10,
        errors: 50,
        tags: [],
    })
    const words = useWordsStore()
    const tagsStore = useTagsStore()
    const tags = computed(() => {
        return tagsStore.tags?.filter( (tag :any) => {
            return tag?.type == "accent"
        } )
    })

    function startExam(){
        statistics.value = {success: 0, failed: 0}

        wordsApi.getAccentTask(task.value.tags, task.value.count, task.value.level, task.value.errors)
            .then( data => {
                words.setWords(data)
                words.nextWord()
            })
    }

    function onCompleteWord(result: boolean){
        if( result ) {
            usersApi.sendUserStat([words.currentWord.id], [])
        } else {
            usersApi.sendUserStat([], [words.currentWord.id])
        }
    }

    onMounted(() => {
        words.setWords([])
    })
</script>

<template>
    <word-task class="item"
        title="Ударения" 
        v-model:statistics="statistics" 
        v-model:word="words.currentWord"
        v-model:task="task"
        v-model:tags="tags"
        @start="startExam" @next="words.nextWord" @complete="onCompleteWord">
        <accent-exam v-model="words.currentWord"></accent-exam>
    </word-task>
</template>

<style scoped>
</style>