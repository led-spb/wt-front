<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { wordsApi } from '@/api/words';
    import { usersApi } from '@/api/users';
    import { useWordsStore } from '@/stores';
    import WordTask from '@/components/WordTask.vue';
    import AccentExam from '@/components/AccentExam.vue';


    const statistics = ref({
        success: 0, failed: 0
    });
    const task = ref({
        count: 20,
        level: [1, 10]
    })
    const words = useWordsStore()

    function startExam(){
        statistics.value = {success: 0, failed: 0}

        wordsApi.getAccentTask(task.value.count, task.value.level[0]||1, task.value.level[1]||10)
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
        @start="startExam" @next="words.nextWord" @complete="onCompleteWord">
        <accent-exam v-model="words.currentWord"></accent-exam>
    </word-task>
</template>

<style scoped>
</style>