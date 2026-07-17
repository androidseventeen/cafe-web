import axios from 'axios'

let apiURI = process.env.REACT_APP_SERVERAPI

export const api = axios.create({
    baseURL: apiURI,
    withCredentials: true,
})