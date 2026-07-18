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

    login : async function (body) {
        const response = await api.request({
            url: '/users/login',
            method: "POST",
            data: body
        })

        return response;
    },

    me : async function () {
        const response = await api.request({
            url: '/users/me',
            method: "GET"
        })

        return response;
    },

    logout : async function () {
        const response = await api.request({
            url: '/users/logout',
            method: "POST"
        })

        return response;
    },
}