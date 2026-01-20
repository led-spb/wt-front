import { axiosInstance } from './config'

const wordsApi = {

    async getSpellingTask(count :number, maxLevel :number, errors :number){
        const response = await axiosInstance({
            method: 'get',
            url: 'spellings/task',
            params: {
                count: count,
                level: maxLevel,
                errors: Math.trunc(count*errors/100)
            }
        })
        return response.data
    },

    async getAccentTask(count :number, maxLevel :number, errors :number){
        const response = await axiosInstance({
            method: 'get',
            url: 'accents/task',
            params: {
                count: count,
                level: maxLevel,
            }
        })
        return response.data
    },

}

export { wordsApi }

