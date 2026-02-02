import { axiosInstance } from './config'

const usersApi = {

    async getCurrentUser(){
        const response = await axiosInstance({
            method: 'get',
            url: 'user',
        })
        return response.data
    },

    async getToken(login :string, password: string ): Promise<any> {
        const response = await axiosInstance({
            method: 'post',
            url: 'auth/token',
            data: {
                login: login,
                password: password,
            },
            validateStatus: (status) => {
                return status == 200 || status == 401
            }
        })
        if( response.status == 401 )
            throw "User unauthorized"
        return response.data
    },

    async getUserStat() {
        const response = await axiosInstance({
            method: 'get',
            url: 'user/stat',
        })
        return response.data
    },

    async getUserProgress(){
        const response = await axiosInstance({
            method: 'get',
            url: 'user/progress',
        })
        return response.data
    },

    async getUserTrobles(){
        const response = await axiosInstance({
            method: 'get',
            url: 'user/troubles',
        })
        return response.data
    },

    async getUserRating() {
        const response = await axiosInstance({
            method: 'get',
            url: 'user/rating'
        })
        return response.data
    },

    sendUserStat(success: Array<Number>, failed: Array<Number> ){
        return axiosInstance({
            method: 'put',
            url: 'user/stat',
            data: {success: success, failed: failed}
        })
    },

    async checkInvite(invite :String): Promise<boolean> {
        const response = await axiosInstance({
            method: 'get',
            url: 'invites/'+String(invite)
        })
        return response.data.status
    },

    sendReport(word_id :number){
        return axiosInstance({
            method: 'put',
            url: 'user/report',
            data: {
                word: word_id
            }
        })
    },

    async registerUser(
        login: string, password: string, invite: string
    ): Promise<boolean> {
        const response = await axiosInstance({
            method: 'post',
            url: 'user/register',
            data: { login, password, invite },

            validateStatus: (status) => {
                return status == 204 || status == 400
            }
        })
        return response.status == 204
    },

    async getSubscriptionKey(): Promise<string> {
        const response = await axiosInstance({
            method: 'get', url: 'user/subscription/key'
        })

        return response.data?.publicKey;
    },

    async updateUserInfo(
        name: string|undefined,
        dailyGoal: number|undefined,
    ): Promise<any> {
        const response = await axiosInstance({
            method: 'put',
            url: 'user',
            data: {name, dailyGoal}
        })

        return response.data
    },

    async setUserNotifyInfo(
        notifyInfo: string|null
    ){
        const response = await axiosInstance({
            method: 'put',
            url: 'user',
            data: {notifyInfo}
        })
        return response.data
    },
}

export { usersApi }