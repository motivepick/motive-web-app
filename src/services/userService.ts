import request from 'superagent'
import { API_URL } from '../config'
import { IUser } from '../models/appModel'

export const fetchUser = async (): Promise<IUser> => {
    const response = await request.get(`${API_URL}/user`).withCredentials()
    return response.body as IUser
}
