<script setup lang="ts">
    import { ref, computed, onMounted, watch } from 'vue';
    import { wordsApi } from '@/api/words';
  
    import AccentExam from '@/components/AccentExam.vue';
    import SpellingExam from '@/components/SpellingExam.vue';
    import Word from '@/components/Word.vue';


    const word = ref()
    const searchValue = ref()

    const findWord = () => {
        if( searchValue.value ){
            const wordId = parseInt(searchValue.value);
            if( !Number.isNaN(wordId)) {
                wordsApi.getWordById(wordId).then( (data) => {
                    word.value = data
                })
            }else{
                wordsApi.getWordByName(searchValue.value).then( (data) => {
                    word.value = data
                })
            }
        }
    }
</script>

<template>
    <va-card>
        <va-card-title>admin</va-card-title>
        <va-card-content>
            <va-input label="слово/id" class="row" v-model="searchValue"></va-input>
        </va-card-content>

        <va-card-content>
            <div class="row justify-center"><va-button @click="findWord">Найти</va-button></div>
        </va-card-content>

        <va-divider />

        <va-card-content><div class="row justify-center"><word :value="word"/></div></va-card-content>
        <va-card-content><div class="row justify-center"><SpellingExam  v-model="word" v-if="word?.spellings?.length"/></div></va-card-content>
        <va-card-content><div class="row justify-center"><AccentExam  v-model="word" v-if="word?.accents?.length"/></div></va-card-content>
    </va-card>
</template>

<style scoped>
</style>