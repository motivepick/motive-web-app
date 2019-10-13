import { history } from '../index'

export const handleServerException = (e) => {
    const { response } = e
    const { status } = response
    if (status === 401 || status === 403) {
        history.push('/login')
    }
}
