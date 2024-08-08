import i18n, { InitOptions } from 'i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { I18N_DEBUG } from './config'

const i18nOptions: InitOptions = {
    backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    load: 'languageOnly',
    fallbackLng: 'en',
    debug: I18N_DEBUG,

    keySeparator: 'false',

    interpolation: {
        escapeValue: false,
        formatSeparator: ','
    },

    detection: {
        order: ['navigator', 'querystring', 'cookie', 'localStorage', 'htmlTag', 'path', 'subdomain']
    }
}

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init(i18nOptions)
    .then(() => document.documentElement.lang = i18n.resolvedLanguage || i18n.language)

export default i18n
