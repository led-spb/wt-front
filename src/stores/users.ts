import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { usersApi } from '@/api/users'


export const useUsersStore = defineStore('users', () => {
    const currentUser = ref()
    const currentUserStat = ref()

    function loadCurrentUser(){
        usersApi.getCurrentUser( data => {
            currentUser.value = data
            localStorage.setItem('user', currentUser.value.name)
        })
        usersApi.getUserStat( data => {
            data.days = data.days.map( (value: any) => {
                value.recorded_at = new Date(value.recorded_at)
                return value
            } )
            currentUserStat.value = data
        })
    }


    function accumulateStatistics(fromDate :Date){
        const days = currentUserStat.value?.days.filter( (item: any) => {
             return item.recorded_at >= fromDate
        })
        return days?.reduce(
            (acc: any, item: any) => {
                acc.success += item.success
                acc.failed += item.failed

                return acc
            },
            {
                success: 0,
                failed: 0,
            }
        )
    }

    const dailyStats = computed(() => {
        return (offset:number) => {
            const fromDate = new Date()
            fromDate.setHours(0)
            fromDate.setMinutes(0)
            fromDate.setSeconds(0)
            fromDate.setMilliseconds(0)

            fromDate.setDate(fromDate.getDate() - offset)
            return accumulateStatistics(fromDate)
        }
    })

    return { currentUser, currentUserStat, loadCurrentUser, dailyStats}
})
