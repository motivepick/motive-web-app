import { ResponseError } from 'superagent'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const handleAuthorizationError = () => {}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const handleServerError = () => {}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const handleNoResponseFromServer = () => {}

export const handleServerException = (e: ResponseError) => {
    const { response } = e
    if (response) {
        const { status } = response
        if (status === 401 || status === 403) {
            handleAuthorizationError()
        } else {
            handleServerError()
        }
    } else {
        handleNoResponseFromServer()
    }
}
