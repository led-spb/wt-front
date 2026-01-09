import { axiosInstance } from './config'

const wordsApi = {
    async getSpellingsWords(task_id: number, page: number, callback: ((data: any) => void) | undefined){
        const response = await axiosInstance({
            method: 'get',
            url: 'spellings/task/' + task_id,
            params: {
                page: page
            }
        })

        if (callback)
            callback(response.data)
    }
}

export default wordsApi
