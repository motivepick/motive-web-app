import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
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

    keySeparator: 'false',

    interpolation: {
        escapeValue: false,
        formatSeparator: ','
    },

    react: {
        wait: true,
        useSuspense: false
    },

    detection: {
        order: ['navigator', 'querystring', 'cookie', 'localStorage', 'htmlTag', 'path', 'subdomain']
    }
}

i18n
    .use(LanguageDetector)
    .init({
        supportedLngs: ['en', 'ru', 'zh'],
        ... i18nOptions
    })

export default i18n
