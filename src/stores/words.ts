import { ref, computed } from 'vue'
import { defineStore } from 'pinia'


export const useWordsStore = defineStore('words', () => {
    const word = ref()
    const wordsBank = ref([])
    const totalWords = ref(0)
    const countWord = ref(0)

    function nextWord() {
        const index = Math.trunc(Math.random()*wordsBank.value.length)
        word.value = wordsBank.value.splice(index, 1).pop()
        countWord.value = Math.min(countWord.value+1, totalWords.value)
    }

    function setWords(values: Array<never>){
        word.value = undefined
        wordsBank.value = values
        
        totalWords.value = values.length
        countWord.value = 0
    }

    const currentWord = computed(() => word.value)

    return { currentWord, countWord, totalWords, nextWord, setWords }
})
