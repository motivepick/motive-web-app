import request from 'superagent'
import { API_URL } from '../const'

export const fetchUser = async () => {
    const response = await request.get(`${API_URL}/user`).withCredentials()
    return response.body
}
