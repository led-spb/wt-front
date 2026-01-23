import { axiosInstance } from './config'

const wordsApi = {

    async getSpellingTask(tags: any, count :number, maxLevel :number, errors :number){
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


    async getWordByName(name: string){
        const response = await axiosInstance({
            method: 'get',
            url: 'words',
            params: { name }
        })
        return response.data
    },

    async getWordById(id: number){
        const response = await axiosInstance({
            method: 'get',
            url: `words/${id}`,
        })
        return response.data
    },

}

export { wordsApi }
