import { ref, computed } from 'vue'
import { defineStore } from 'pinia'


export const useWordsStore = defineStore('words', () => {
    const word = ref()
    const wordsBank = ref([])

    function nextWord() {
        const index = Math.trunc(Math.random()*wordsBank.value.length)
        word.value = wordsBank.value.splice(index, 1).pop()
    }

    function setWords(values: Array<never>){
        word.value = undefined
        wordsBank.value = values
    }

    const currentWord = computed(() => word.value)

    return { currentWord, nextWord, setWords }
})
