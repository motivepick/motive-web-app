import axios, { AxiosInstance } from 'axios'

const fetchClient = (): AxiosInstance => {
    const defaultOptions = {
        baseURL: process.env.REACT_APP_API_URL,
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    }

    return axios.create(defaultOptions)
}

export default fetchClient()
