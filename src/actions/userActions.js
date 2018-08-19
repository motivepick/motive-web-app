import request from 'superagent'
import { API_URL } from '../const'

export const LOGOUT = 'LOGOUT'

export const logout = () => {
    const req = request.post(`${API_URL}/users/logout`).withCredentials()
    return {
        type: LOGOUT,
        payload: req
    }
}