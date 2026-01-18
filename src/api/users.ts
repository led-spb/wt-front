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

    async checkInvite(invite :String): Promise<Boolean> {
        const response = await axiosInstance({
            method: 'get',
            url: 'invites/'+String(invite)
        })
        return response.data.status
    }
}

export { usersApi }