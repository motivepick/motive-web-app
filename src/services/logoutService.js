import request from 'superagent'
import { API_URL } from '../const'

export const logout = async () => await request.post(`${API_URL}/logout`)
