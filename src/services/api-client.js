import { api } from './config.js'

export const cafeApi =  {
    createUser : async function (body) {
        const response = await api.request({
            url: '/users/register',
            method: "POST",
            data: body
        })

        return response;
    },

    
}