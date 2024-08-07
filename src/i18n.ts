import i18n from 'i18next'
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next';
import { I18N_DEBUG } from './config'

import English from './translations/en.json'
import Russian from './translations/ru.json'
import Chinese from './translations/zh.json'

const i18nOptions = {
    resources: {
        en: { translations: English },
        ru: { translations: Russian },
        zh: { translations: Chinese }
    },
    fallbackLng: 'en',
    debug: I18N_DEBUG,

    ns: ['translations'],
    defaultNS: 'translations',

    // char to separate keys. If working with a flat JSON, it's recommended to set this to false.
    keySeparator: 'false',

    interpolation: {
        escapeValue: false,
        formatSeparator: ','
    },

    react: {
        useSuspense: false
    },

    detection: {
        order: ['navigator', 'querystring', 'cookie', 'localStorage', 'htmlTag', 'path', 'subdomain']
    }
}

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        supportedLngs: ['en', 'ru', 'zh'],
        ... i18nOptions
    })

export default i18n
