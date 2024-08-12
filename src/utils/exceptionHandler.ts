import { ResponseError } from 'superagent'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const handleAuthorizationError = () => {}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const handleServerError = () => {}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const handleNoResponseFromServer = () => {}

export const handleServerException = (e: unknown | ResponseError) => {
    const { response } = e as ResponseError
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
