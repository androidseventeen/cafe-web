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

    listAllProducts : async function () {
        const response = await api.request({
            url: '/products/all',
            method: "GET"
        })

        return response;
    },

    listProducts : async function (params = {}) {
        const response = await api.request({
            url: '/products',
            method: "GET",
            params
        })

        return response;
    },

    getProduct : async function (id) {
        const response = await api.request({
            url: `/products/${id}`,
            method: "GET"
        })

        return response;
    },

    createProduct : async function (body) {
        const response = await api.request({
            url: '/products',
            method: "POST",
            data: body
        })

        return response;
    },

    updateProduct : async function (id, body) {
        const response = await api.request({
            url: `/products/${id}`,
            method: "PATCH",
            data: body
        })

        return response;
    },

    // SKU creation lives under the product route; body is always { skus: [...] }.
    createSkus : async function (productId, skus) {
        const response = await api.request({
            url: `/products/${productId}/skus`,
            method: "POST",
            data: { skus }
        })

        return response;
    },
}