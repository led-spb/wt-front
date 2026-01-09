import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import wordsApi from '../api/words'


export const useWordsStore = defineStore('words', () => {
    const currentWord = ref()
    const task_id = ref(Math.ceil(Math.random()*5000))
    const page = ref(1)
    const wordsBank = ref([].values())
    
    function nextWord() {
        const item = wordsBank.value.next()
        if( item.done ){
            loadBank()
        }else{
            currentWord.value = item.value
        }
    }

    function loadBank(){
        wordsApi.getSpellingsWords(task_id.value, page.value, data => {
            const iter = data.values()
            wordsBank.value = iter

            const item = iter.next()
            currentWord.value = item.value
            page.value++
          }
        )
    }

    return { currentWord, nextWord}
})
