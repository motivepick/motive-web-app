import { history } from '../index'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const handleServerError = () => {}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const handleNoResponseFromServer = () => {}

export const handleServerException = (e) => {
    const { response } = e
    if (response) {
        const { status } = response
        if (status === 401 || status === 403) {
            history.push('/login')
        } else {
            handleServerError()
        }
    } else {
        handleNoResponseFromServer()
    }
}
