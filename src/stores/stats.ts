import { computed, ref } from 'vue'
import { defineStore } from 'pinia'


export const useStatsStore = defineStore('stats', () => {
    const totalAnswers = ref(0)
    const rightAnswers = ref(0)
    const wrongAnswers = computed(() => { totalAnswers.value - rightAnswers.value })

    function incRight(){
        totalAnswers.value++;
        rightAnswers.value++;
    }

    function incWrong(){
        totalAnswers.value++;
    }
    
    return { totalAnswers, rightAnswers, wrongAnswers, incRight, incWrong }
})
