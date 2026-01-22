<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue';
    import { wordsApi } from '@/api/words';
    import { usersApi } from '@/api/users';
    import { useWordsStore, useTagsStore } from '@/stores';


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
    const words = useWordsStore()
    const tagsStore = useTagsStore()

    const tags = computed(() => {
        return tagsStore.tags?.filter( (tag :any) => {
            return tag?.type == "spelling"
        } )
    })

    function startExam(){
        statistics.value = {success: 0, failed: 0}

        wordsApi.getSpellingTask(task.value.tags, task.value.count, task.value.level || 10, task.value.errors)
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

    function sendUserRport(){
        if( words.currentWord?.id ){
            usersApi.sendReport(words.currentWord?.id)
        }
    }

    onMounted(() => {
        words.setWords([])
    })
</script>

<template>
    <word-task class="item"
        title="Орфограммы/Словарные слова" 
        v-model:statistics="statistics" 
        v-model:word="words.currentWord" 
        v-model:task="task"
        v-model:tags="tags"
        @start="startExam" @next="words.nextWord" @complete="onCompleteWord" @report="sendUserRport">
        <spelling-exam v-model="words.currentWord"></spelling-exam>
    </word-task>
</template>

<style scoped>
</style>