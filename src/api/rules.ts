import { axiosInstance } from './config'

const rulesApi = {
    async getRuleById(ruleId :number){
        const response = await axiosInstance({
            method: 'get',
            url: `rules/${ruleId}`,
        })
        return response.data
    },
}

export { rulesApi }
