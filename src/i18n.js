import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n.use(LanguageDetector).init({
    resources: {
        en: {
            translations: {
                'welcome': 'Motive',
                'description': 'Defeat your laziness',
                'login.facebook': 'Login With Facebook',
                'login.vk': 'Login With VK',
                'logout': 'Logout',
                'loading': 'Loading...',
                'new.task': 'What should I not forget?',
                'task.description': 'Additional Details',
                'my.tasks': 'My Tasks',
                'contactUs': 'Contact us',
                'privacyPolicy': 'Privacy Policy'
            }
        },
        ru: {
            translations: {
                'welcome': 'Motive',
                'description': 'Победи лень',
                'login.facebook': 'Войти через Facebook',
                'login.vk': 'Войти через VK',
                'logout': 'Выйти',
                'loading': 'Загрузка...',
                'new.task': 'О чём нужно не забыть?',
                'task.description': 'Дополнительные подробности',
                'my.tasks': 'Мои задачи',
                'contactUs': 'Связаться с нами',
                'privacyPolicy': 'Политика конфиденциальности'
            }
        },
        zh: {
            translations: {
                'welcome': 'Motive',
                'description': '小小工具，幫你大大打擊懶惰蟲',
                'login.facebook': '以Facebook登入',
                'login.vk': '以VK登入',
                'logout': '登出',
                'loading': '載入中',
                'new.task': '有什麼要做的?',
                'task.description': '更多細節',
                'my.tasks': '待辦事項',
                'contactUs': 'Contact us',
                'privacyPolicy': 'Privacy Policy'
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
