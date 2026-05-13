export const RU = {
  appName: "SapaSpeakers",
  navigation: {
    home: "Главная",
    about: "О нас",
    projects: "Проекты",
    join: "Стать волонтёром",
    teamApplication: "Заявка в команду",
    contacts: "Контакты",
    login: "Войти",
    register: "Зарегистрироваться"
  },
  pages: {
    home: {
      title: "Волонтёрская организация нового уровня",
      description:
        "SapaSpeakers помогает волонтёрам участвовать в реальных проектах, получать подтверждённый опыт, сертификаты и достижения."
    },
    about: {
      title: "О нас",
      description:
        "SapaSpeakers строит структурную и ответственную волонтёрскую систему с понятными ролями, проектами и результатами."
    },
    projects: {
      title: "Проекты",
      description:
        "Здесь будут опубликованные проекты, доступные для подачи заявки после входа и заполнения профиля."
    },
    join: {
      title: "Стать волонтёром",
      description:
        "Регистрация открыта для всех, но участие в каждом проекте требует отдельной заявки и одобрения."
    },
    teamApplication: {
      title: "Заявка в команду",
      description:
        "HR-менеджер рассматривает заявку и может рекомендовать кандидата. Финальное решение принимает Founder/CEO или CTO."
    },
    contacts: {
      title: "Контакты",
      description:
        "Мы открыты к волонтёрам, партнёрам и новым проектам."
    },
    login: {
      title: "Вход",
      description: "Войдите, чтобы перейти в личный кабинет."
    },
    register: {
      title: "Регистрация",
      description:
        "Создайте аккаунт волонтёра. После регистрации нужно заполнить профиль."
    },
    app: {
      title: "Личный кабинет",
      description:
        "Здесь вы можете отслеживать заявки, проекты, сертификаты и достижения."
    },
    admin: {
      title: "Панель управления",
      description:
        "Рабочая зона для управления волонтёрами, проектами, заявками и операционными процессами."
    }
  },
  buttons: {
    becomeVolunteer: "Стать волонтёром",
    viewProjects: "Посмотреть проекты",
    applyToTeam: "Подать заявку в команду",
    login: "Войти",
    register: "Создать аккаунт",
    saveProfile: "Сохранить профиль",
    submitApplication: "Подать заявку",
    fillQuestionnaire: "Заполнить анкету",
    createProject: "Создать проект",
    uploadCertificate: "Загрузить сертификат",
    downloadCertificate: "Скачать сертификат"
  },
  emptyStates: {
    projects:
      "Сейчас нет доступных проектов. Новые проекты появятся здесь после публикации.",
    applications:
      "У вас пока нет заявок. Откройте раздел «Проекты» и подайте заявку на подходящий проект.",
    certificates:
      "У вас пока нет сертификатов. Сертификаты появятся здесь после участия в проектах.",
    achievements:
      "У вас пока нет достижений. После участия в проектах ваши достижения появятся здесь.",
    announcements:
      "Пока нет объявлений. Новые сообщения организации появятся здесь.",
    admin:
      "Данные появятся здесь после подключения Supabase и серверных проверок доступа."
  },
  messages: {
    phaseZero:
      "Это placeholder Phase 0. Реальная логика, данные и проверки доступа будут добавлены в следующих фазах.",
    adminPermissionNotice:
      "Реальные серверные проверки прав доступа будут добавлены в следующей фазе.",
    profileRequired:
      "Заполните профиль перед подачей заявки.",
    controlledParticipation:
      "Регистрация не означает автоматическое участие в проекте. Для каждого проекта нужно подать отдельную заявку и получить одобрение."
  },
  roles: {
    founder_ceo: "Founder/CEO",
    cto: "CTO",
    operations_manager: "Операционный менеджер",
    hr_manager: "HR-менеджер",
    volunteer_teamlead: "Тимлид волонтёров",
    training_manager: "Менеджер по обучению",
    language_coordinator: "Координатор лингвистического сопровождения",
    eco_coordinator: "Эко-координатор",
    logistics_manager: "Logistics Manager",
    pr_smm_manager: "PR/SMM-менеджер",
    partnership_manager: "Partnership Manager",
    mun_coordinator: "Координатор MUN",
    secretary: "Секретарь",
    volunteer: "Волонтёр"
  },
  projectStatuses: {
    draft: "Черновик",
    pending_moderation: "На модерации",
    needs_revision: "На доработке",
    published: "Опубликован",
    recruitment_closed: "Набор закрыт",
    completed: "Завершён",
    cancelled: "Отменён",
    rejected: "Отклонён"
  },
  applicationStatuses: {
    pending: "На рассмотрении",
    approved: "Одобрено",
    waitlisted: "В резерве",
    rejected: "Отклонено",
    cancelled_by_user: "Отменено пользователем",
    attended: "Участвовал",
    no_show: "Не пришёл"
  },
  projectCategories: {
    educational: "Образовательный",
    diplomatic: "Дипломатический",
    ecological: "Экологический",
    sports: "Спортивный",
    cultural: "Культурный",
    exhibition: "Выставка",
    mun: "MUN",
    training: "Обучение",
    other: "Другое"
  }
} as const;
