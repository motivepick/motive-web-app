export const API_URL: string | undefined = process.env.REACT_APP_API_URL
export const GITHUB_REPOSITORY_URL = 'https://github.com/motivepick/motive-web-app'
export const GITHUB_AUTH_URL = `${API_URL}/oauth2/authorization/github`
export const VK_AUTH_URL = `${API_URL}/oauth2/authorization/vk`
export const I18N_DEBUG: boolean = process.env.REACT_APP_I18N_DEBUG === 'true'
export const REDUX_DEV_TOOLS_ENABLED: boolean = process.env.REACT_APP_REDUX_DEV_TOOLS_ENABLED === 'true'

export const DEFAULT_LIMIT = 40
export const TASK_NAME_LIMIT = 500
export const TASK_DESCRIPTION_LIMIT = 10000
