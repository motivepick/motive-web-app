import { history } from '../index'

export const handleServerException = (e) => {
    const { response } = e
    const { status } = response
    if (status === 401) {
        history.push('/login')
    }
}
