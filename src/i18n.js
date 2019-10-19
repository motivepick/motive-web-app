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
                'tryWithoutLogin': 'Try Without Login',
                'logout': 'Logout',
                'deleteTasksAndLogout': 'Delete Tasks And Logout',
                'loading': 'Loading...',
                'new.task': 'What should I not forget?',
                'task.description': 'Additional Details',
                'contactUs': 'Contact us',
                'privacyPolicy': 'Privacy Policy',
                'numberOfTasks': '{{count}} task',
                'numberOfTasks_plural': '{{count}} tasks',
                'showOpenTasks': 'Show open',
                'showClosedTasks': 'Show closed',
                'allTasks': 'Tasks',
                'schedule': 'Schedule',
                'futureTasks': 'Future Tasks',
                'overdueTasks': 'Overdue Tasks'
            }
        },
        ru: {
            translations: {
                'welcome': 'Motive',
                'description': 'Победи лень',
                'login.facebook': 'Войти через Facebook',
                'login.vk': 'Войти через VK',
                'tryWithoutLogin': 'Попробовать без логина',
                'logout': 'Выйти',
                'deleteTasksAndLogout': 'Удалить задачи и выйти',
                'loading': 'Загрузка...',
                'new.task': 'О чём нужно не забыть?',
                'task.description': 'Дополнительные подробности',
                'contactUs': 'Связаться с нами',
                'privacyPolicy': 'Политика конфиденциальности',
                'numberOfTasks_0': '{{count}} задача',
                'numberOfTasks_1': '{{count}} задачи',
                'numberOfTasks_2': '{{count}} задач',
                'showOpenTasks': 'Показать открытые',
                'showClosedTasks': 'Показать закрытые',
                'allTasks': 'Задачи',
                'schedule': 'Расписание',
                'futureTasks': 'Будущие задачи',
                'overdueTasks': 'Просроченные задачи'
            }
        },
        zh: {
            translations: {
                'welcome': 'Motive',
                'description': '小小工具，幫你大大打擊懶惰蟲',
                'login.facebook': '以Facebook登入',
                'login.vk': '以VK登入',
                'tryWithoutLogin': 'Try Without Login',
                'logout': '登出',
                'deleteTasksAndLogout': 'Delete Tasks And Logout',
                'loading': '載入中',
                'new.task': '有什麼要做的?',
                'task.description': '更多細節',
                'contactUs': 'Contact us',
                'privacyPolicy': 'Privacy Policy',
                'numberOfTasks': '{{count}} 個待辦事項',
                'showOpenTasks': '顯示進行中事項',
                'showClosedTasks': '顯示已完成事項',
                'allTasks': 'Tasks',
                'schedule': 'Schedule',
                'futureTasks': 'Future Tasks',
                'overdueTasks': 'Overdue Tasks'
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
