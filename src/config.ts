export const API_URL: string | undefined = process.env.REACT_APP_API_URL
export const FACEBOOK_AUTH_URL = `${API_URL}/oauth2/authorization/facebook`
export const VK_AUTH_URL = `${API_URL}/oauth2/authorization/vk`
export const I18N_DEBUG: boolean = process.env.REACT_APP_I18N_DEBUG === 'true'
