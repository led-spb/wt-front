import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { usersApi } from '@/api/users'


export const useUsersStore = defineStore('users', () => {
    const user = ref()
    const statistics = ref()
    const progress = ref()
    const troubles = ref()
    const rating = ref()

    function loadUserInfo(){
        usersApi.getCurrentUser().then( data => {
            user.value = data
            localStorage.setItem('user', user.value.name)
        })
        usersApi.getUserProgress().then( data => {
            progress.value = data
        })
    }

    function loadUserStat(){
        usersApi.getUserStat().then( data => {
            statistics.value = data.map( (value: any) => {
                value.recorded_at = new Date(value.recorded_at)
                return value
            })
        })
        usersApi.getUserTrobles().then( data => {
            troubles.value = data
        })
    }

    function loadUserRating(){
        usersApi.getUserRating().then( data => {
            rating.value = data
        })
    }

    function accumulateStatistics(fromDate :Date){
        const days = statistics.value?.filter( (item: any) => {
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
        return (offset :number) => {
            const fromDate = new Date()
            fromDate.setHours(0)
            fromDate.setMinutes(0)
            fromDate.setSeconds(0)
            fromDate.setMilliseconds(0)

            fromDate.setDate(fromDate.getDate() - offset)
            return accumulateStatistics(fromDate)
        }
    })

    return { user, progress, troubles, statistics, aggregateStat: dailyStats, rating, loadUserInfo, loadUserStat, loadUserRating}
})
