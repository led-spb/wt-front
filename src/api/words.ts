import { axiosInstance } from './config'

const wordsApi = {

    async getSpellingTask(tags: any, count :number, maxLevel :number, errors :number){
        console.log('tags '+tags);

        const response = await axiosInstance({
            method: 'get',
            url: 'spellings/task',
            params: {
                tags: tags,
                count: count,
                level: maxLevel,
                errors: Math.trunc(count*errors/100),
            }
        })
        return response.data
    },

    async getAccentTask(tags: any, count :number, maxLevel :number, errors :number){
        const response = await axiosInstance({
            method: 'get',
            url: 'accents/task',
            params: {
                tags: tags,
                count: count,
                level: maxLevel,
                errors: Math.trunc(count*errors/100),
            }
        })
        return response.data
    },

}

export { wordsApi }

