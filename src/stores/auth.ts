import { computed, ref } from 'vue'
import { defineStore } from 'pinia'


export const useAuthStore = defineStore('auth', () => {
    const accessToken = ref(
        localStorage.getItem('accessToken')
    )

    const isAuthentificated = computed(() => {
        return accessToken.value ? true : false
    })

    function setAccessToken(token: string){
        accessToken.value = token
        localStorage.setItem('accessToken', token)
    }
    
    return { accessToken, isAuthentificated, setAccessToken }
})
