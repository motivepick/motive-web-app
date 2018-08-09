import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n.use(LanguageDetector).init({
    resources: {
        en: {
            translations: {
                'welcome': 'Welcome to Motive!',
                'description': 'A minimalistic application which is going to defeat your laziness',
                'login': 'Login With Facebook',
                'logout': 'Logout',
                'loading': 'Loading...',
                'new.task': 'What should I not forget?',
                'task.description': 'Additional Details',
                'your.tasks': '{{name}}\'s Tasks'
            }
        },
        ru: {
            translations: {
                'welcome': 'Добро пожаловать в Motive!',
                'description': 'Минималистичное приложение для борьбы с ленью',
                'login': 'Войти через Facebook',
                'logout': 'Выйти',
                'loading': 'Загрузка...',
                'new.task': 'О чём нужно не забыть?',
                'task.description': 'Дополнительные подробности',
                'your.tasks': 'Ваши задачи'
            }
        }
    },
    fallbackLng: 'en',
    debug: true,

    ns: ['translations'],
    defaultNS: 'translations',

    keySeparator: false,

    interpolation: {
        escapeValue: false,
        formatSeparator: ','
    },

    react: {
        wait: true
    },

    detection: {
        order: ['navigator', 'querystring', 'cookie', 'localStorage', 'htmlTag', 'path', 'subdomain']
    }
})

export default i18n
