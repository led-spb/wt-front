import { ref } from 'vue'
import { defineStore } from 'pinia'
import { wordsApi } from '../api/words'


export const useWordsStore = defineStore('words', () => {
    const currentWord = ref()
    const wordsBank = ref([])

    function nextWord() {
        const index = Math.trunc(Math.random()*wordsBank.value.length)
        currentWord.value = wordsBank.value.splice(index, 1).pop()
    }

    function getWords(count: Number, minLevel :Number, maxLevel :Number){
        wordsApi.getSpellingTask(count, minLevel, maxLevel, data => {
            wordsBank.value = data
            nextWord()
        })
    }

    return { currentWord, getWords, nextWord}
})
