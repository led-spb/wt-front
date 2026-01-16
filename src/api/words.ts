import { axiosInstance } from './config'

const wordsApi = {

    async getSpellingTask(count :Number, minLevel :Number, maxLevel :Number){
        const response = await axiosInstance({
            method: 'get',
            url: 'spellings/task',
            params: {
                count: count,
                min: minLevel,
                max: maxLevel,
            }
        })
        return response.data
    },

    async getAccentTask(count :Number, minLevel :Number, maxLevel :Number){
        const response = await axiosInstance({
            method: 'get',
            url: 'accents/task',
            params: {
                count: count,
                min: minLevel,
                max: maxLevel,
            }
        })
        return response.data
    },

}

export { wordsApi }

