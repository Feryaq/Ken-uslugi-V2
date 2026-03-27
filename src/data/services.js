const { v4: uuidv4 } = require('uuid');

const services = [
  // --- Документы и регистрация ---
  {
    id: uuidv4(),
    title: 'Получение паспорта гражданина РК',
    category: 'Документы и регистрация',
    description: 'Оформление нового паспорта или замена паспорта гражданина Республики Казахстан. Услуга доступна для граждан РК, достигших 16 лет. Паспорт выдаётся сроком на 10 лет.',
    duration: '15 рабочих дней',
    cost: '4 200 ₽',
    requiredDocs: ['Удостоверение личности', 'Свидетельство о рождении', 'Фото 3.5×4.5 (2 шт.)', 'Квитанция об оплате госпошлины'],
    formFields: [
      { name: 'reason', label: 'Причина получения', type: 'select', required: true, options: ['Первичное получение', 'Замена (истёк срок)', 'Замена (смена данных)', 'Утеря/кража'] },
      { name: 'delivery_type', label: 'Способ получения', type: 'select', required: true, options: ['В центре обслуживания', 'Курьерская доставка'] },
      { name: 'address', label: 'Адрес проживания', type: 'text', required: true },
      { name: 'birth_place', label: 'Место рождения', type: 'text', required: true }
    ],
    popular: true
  },
  {
    id: uuidv4(),
    title: 'Получение удостоверения личности',
    category: 'Документы и регистрация',
    description: 'Оформление удостоверения личности гражданина Республики Казахстан. Основной документ, удостоверяющий личность на территории РК.',
    duration: '5 рабочих дней',
    cost: '1 600 ₽',
    requiredDocs: ['Свидетельство о рождении', 'Фото 3.5×4.5 (2 шт.)', 'Квитанция об оплате госпошлины', 'Заявление установленной формы'],
    formFields: [
      { name: 'reason', label: 'Причина получения', type: 'select', required: true, options: ['Первичное получение', 'Замена (истёк срок)', 'Замена (смена данных)', 'Утеря'] },
      { name: 'address', label: 'Адрес регистрации', type: 'text', required: true },
      { name: 'center', label: 'Центр обслуживания', type: 'select', required: true, options: ['ЦОН Алматы', 'ЦОН Астана', 'ЦОН Шымкент', 'ЦОН Актобе', 'ЦОН Атырау'] }
    ],
    popular: true
  },
  {
    id: uuidv4(),
    title: 'Регистрация по месту жительства (прописка)',
    category: 'Документы и регистрация',
    description: 'Регистрация гражданина по месту постоянного жительства. Необходима для подтверждения места проживания.',
    duration: '1 рабочий день',
    cost: 'Бесплатно',
    requiredDocs: ['Удостоверение личности', 'Правоустанавливающий документ на жильё', 'Заявление'],
    formFields: [
      { name: 'address', label: 'Новый адрес регистрации', type: 'text', required: true },
      { name: 'city', label: 'Город/населённый пункт', type: 'text', required: true },
      { name: 'ownership', label: 'Тип жилья', type: 'select', required: true, options: ['Собственное жильё', 'Аренда', 'Жильё родственников'] }
    ],
    popular: true
  },
  {
    id: uuidv4(),
    title: 'Регистрация рождения ребёнка',
    category: 'Документы и регистрация',
    description: 'Государственная регистрация рождения ребёнка и получение свидетельства о рождении. Регистрация производится в течение 1 месяца со дня рождения.',
    duration: '1 рабочий день',
    cost: 'Бесплатно',
    requiredDocs: ['Документ из роддома (справка о рождении)', 'Удостоверения личности обоих родителей', 'Свидетельство о браке (при наличии)'],
    formFields: [
      { name: 'child_name', label: 'Имя ребёнка', type: 'text', required: true },
      { name: 'birth_date', label: 'Дата рождения', type: 'date', required: true },
      { name: 'birth_place', label: 'Место рождения', type: 'text', required: true },
      { name: 'father_name', label: 'ФИО отца', type: 'text', required: false },
      { name: 'mother_name', label: 'ФИО матери', type: 'text', required: true }
    ],
    popular: false
  },
  {
    id: uuidv4(),
    title: 'Регистрация смерти',
    category: 'Документы и регистрация',
    description: 'Государственная регистрация смерти гражданина и получение свидетельства о смерти.',
    duration: '1 рабочий день',
    cost: 'Бесплатно',
    requiredDocs: ['Медицинское свидетельство о смерти', 'Удостоверение личности заявителя', 'Удостоверение личности умершего (при наличии)'],
    formFields: [
      { name: 'deceased_name', label: 'ФИО умершего', type: 'text', required: true },
      { name: 'death_date', label: 'Дата смерти', type: 'date', required: true },
      { name: 'death_place', label: 'Место смерти', type: 'text', required: true },
      { name: 'applicant_relation', label: 'Кем приходитесь умершему', type: 'select', required: true, options: ['Супруг/супруга', 'Родитель', 'Ребёнок', 'Другой родственник'] }
    ],
    popular: false
  },

  // --- Транспорт ---
  {
    id: uuidv4(),
    title: 'Получение водительского удостоверения',
    category: 'Транспорт',
    description: 'Выдача водительского удостоверения после сдачи экзамена в органах дорожной полиции. Действует для категорий A, B, C, D.',
    duration: '5 рабочих дней',
    cost: '2 100 ₽',
    requiredDocs: ['Удостоверение личности', 'Медицинская справка формы 083', 'Документ о сдаче экзамена', 'Квитанция об оплате'],
    formFields: [
      { name: 'category', label: 'Категория прав', type: 'select', required: true, options: ['A', 'B', 'C', 'D', 'B+E', 'C+E'] },
      { name: 'reason', label: 'Причина получения', type: 'select', required: true, options: ['Первичное получение', 'Замена (истёк срок)', 'Восстановление после лишения', 'Утеря'] },
      { name: 'exam_date', label: 'Дата сдачи экзамена', type: 'date', required: true }
    ],
    popular: true
  },
  {
    id: uuidv4(),
    title: 'Регистрация транспортного средства',
    category: 'Транспорт',
    description: 'Постановка транспортного средства на учёт в органах дорожной полиции. Получение государственных номерных знаков и техпаспорта.',
    duration: '1 рабочий день',
    cost: '5 800 ₽',
    requiredDocs: ['Удостоверение личности', 'Договор купли-продажи', 'Технический паспорт ТС', 'Полис страхования (ОГПО)', 'Квитанция об оплате'],
    formFields: [
      { name: 'vin', label: 'VIN-номер автомобиля', type: 'text', required: true },
      { name: 'brand', label: 'Марка автомобиля', type: 'text', required: true },
      { name: 'model', label: 'Модель', type: 'text', required: true },
      { name: 'year', label: 'Год выпуска', type: 'text', required: true },
      { name: 'color', label: 'Цвет', type: 'text', required: true }
    ],
    popular: false
  },
  {
    id: uuidv4(),
    title: 'Технический осмотр транспортного средства',
    category: 'Транспорт',
    description: 'Прохождение обязательного технического осмотра транспортного средства. Подача заявки для записи на технический осмотр.',
    duration: '1 рабочий день',
    cost: '1 500 ₽',
    requiredDocs: ['Технический паспорт ТС', 'Удостоверение личности владельца', 'Полис страхования ОГПО'],
    formFields: [
      { name: 'gov_number', label: 'Гос. номер автомобиля', type: 'text', required: true },
      { name: 'inspection_date', label: 'Желаемая дата осмотра', type: 'date', required: true },
      { name: 'station', label: 'Станция техосмотра', type: 'select', required: true, options: ['СТО Алматы-1', 'СТО Алматы-2', 'СТО Астана-1', 'СТО Астана-2', 'СТО Шымкент'] }
    ],
    popular: false
  },

  // --- Бизнес ---
  {
    id: uuidv4(),
    title: 'Регистрация индивидуального предпринимателя (ИП)',
    category: 'Бизнес',
    description: 'Государственная регистрация физического лица в качестве индивидуального предпринимателя. Быстрое оформление через портал ЕГов.',
    duration: '1 рабочий день',
    cost: 'Бесплатно',
    requiredDocs: ['Удостоверение личности', 'Заявление установленной формы'],
    formFields: [
      { name: 'business_name', label: 'Наименование ИП', type: 'text', required: true },
      { name: 'activity', label: 'Вид деятельности (ОКЭД)', type: 'text', required: true },
      { name: 'tax_regime', label: 'Налоговый режим', type: 'select', required: true, options: ['Упрощённая декларация', 'Общеустановленный порядок', 'Патент'] },
      { name: 'address', label: 'Адрес места деятельности', type: 'text', required: true }
    ],
    popular: true
  },
  {
    id: uuidv4(),
    title: 'Регистрация ТОО (товарищество с ограниченной ответственностью)',
    category: 'Бизнес',
    description: 'Государственная регистрация юридического лица в форме ТОО. Включает выдачу свидетельства о государственной регистрации.',
    duration: '3 рабочих дня',
    cost: 'Бесплатно',
    requiredDocs: ['Удостоверения личности учредителей', 'Устав ТОО', 'Решение об учреждении', 'Сведения о юридическом адресе'],
    formFields: [
      { name: 'company_name', label: 'Наименование ТОО', type: 'text', required: true },
      { name: 'legal_address', label: 'Юридический адрес', type: 'text', required: true },
      { name: 'charter_capital', label: 'Размер уставного капитала (₽)', type: 'text', required: true },
      { name: 'activity', label: 'Основной вид деятельности', type: 'text', required: true },
      { name: 'founders_count', label: 'Количество учредителей', type: 'select', required: true, options: ['1', '2', '3', '4', '5 и более'] }
    ],
    popular: false
  },
  {
    id: uuidv4(),
    title: 'Получение лицензии на вид деятельности',
    category: 'Бизнес',
    description: 'Получение разрешительного документа (лицензии) на осуществление лицензируемых видов деятельности.',
    duration: '15 рабочих дней',
    cost: '10 MRP',
    requiredDocs: ['Удостоверение личности / документы юридического лица', 'Заявление', 'Документы, подтверждающие соответствие требованиям'],
    formFields: [
      { name: 'license_type', label: 'Вид лицензии', type: 'select', required: true, options: ['Медицинская деятельность', 'Образовательная деятельность', 'Строительство', 'Торговля алкоголем', 'Охранная деятельность', 'Другое'] },
      { name: 'company', label: 'Наименование организации / ФИО ИП', type: 'text', required: true },
      { name: 'address', label: 'Адрес осуществления деятельности', type: 'text', required: true }
    ],
    popular: false
  },

  // --- Социальная защита ---
  {
    id: uuidv4(),
    title: 'Назначение пособия по безработице',
    category: 'Социальная защита',
    description: 'Назначение государственного пособия гражданам, потерявшим работу и стоящим на учёте в центре занятости.',
    duration: '10 рабочих дней',
    cost: 'Бесплатно',
    requiredDocs: ['Удостоверение личности', 'Трудовая книжка (выписка)', 'Справка с последнего места работы', 'Заявление'],
    formFields: [
      { name: 'last_employer', label: 'Последнее место работы', type: 'text', required: true },
      { name: 'dismissal_date', label: 'Дата увольнения', type: 'date', required: true },
      { name: 'dismissal_reason', label: 'Причина увольнения', type: 'select', required: true, options: ['Сокращение штата', 'Ликвидация организации', 'По собственному желанию', 'Соглашение сторон'] },
      { name: 'bank_account', label: 'Номер банковского счёта', type: 'text', required: true }
    ],
    popular: false
  },
  {
    id: uuidv4(),
    title: 'Назначение пенсии по возрасту',
    category: 'Социальная защита',
    description: 'Назначение трудовой пенсии по достижении пенсионного возраста (63 года для мужчин и женщин с 2027 года). Выплаты из ГЦВП.',
    duration: '15 рабочих дней',
    cost: 'Бесплатно',
    requiredDocs: ['Удостоверение личности', 'Трудовая книжка', 'Справки о стаже работы', 'Банковские реквизиты'],
    formFields: [
      { name: 'retirement_date', label: 'Желаемая дата выхода на пенсию', type: 'date', required: true },
      { name: 'bank', label: 'Банк для перечисления', type: 'select', required: true, options: ['Kaspi Bank', 'Halyk Bank', 'Народный Банк', 'БЦК', 'Forte Bank'] },
      { name: 'bank_account', label: 'Номер счёта / карты', type: 'text', required: true }
    ],
    popular: false
  },
  {
    id: uuidv4(),
    title: 'Получение адресной социальной помощи (АСП)',
    category: 'Социальная защита',
    description: 'Назначение адресной социальной помощи малообеспеченным семьям и гражданам, чей доход ниже черты бедности.',
    duration: '20 рабочих дней',
    cost: 'Бесплатно',
    requiredDocs: ['Удостоверения личности всех членов семьи', 'Справки о доходах', 'Документы на жильё', 'Свидетельства о рождении детей'],
    formFields: [
      { name: 'family_members', label: 'Количество членов семьи', type: 'select', required: true, options: ['1', '2', '3', '4', '5', '6 и более'] },
      { name: 'monthly_income', label: 'Среднемесячный доход семьи (₽)', type: 'text', required: true },
      { name: 'address', label: 'Адрес проживания', type: 'text', required: true },
      { name: 'bank_account', label: 'Банковский счёт для выплат', type: 'text', required: true }
    ],
    popular: false
  },

  // --- Образование ---
  {
    id: uuidv4(),
    title: 'Запись ребёнка в школу',
    category: 'Образование',
    description: 'Запись детей в 1-й класс общеобразовательных школ. Приём заявлений в электронной форме через портал ЕГов.',
    duration: '3 рабочих дня',
    cost: 'Бесплатно',
    requiredDocs: ['Удостоверение личности родителя', 'Свидетельство о рождении ребёнка', 'Справка о прописке'],
    formFields: [
      { name: 'child_name', label: 'ФИО ребёнка', type: 'text', required: true },
      { name: 'child_birth_date', label: 'Дата рождения ребёнка', type: 'date', required: true },
      { name: 'school', label: 'Желаемая школа', type: 'text', required: true },
      { name: 'language', label: 'Язык обучения', type: 'select', required: true, options: ['Казахский', 'Русский', 'Смешанный'] },
      { name: 'address', label: 'Адрес проживания', type: 'text', required: true }
    ],
    popular: true
  },
  {
    id: uuidv4(),
    title: 'Справка об обучении в учебном заведении',
    category: 'Образование',
    description: 'Получение электронной справки, подтверждающей факт обучения в государственном учебном заведении.',
    duration: '1 рабочий день',
    cost: 'Бесплатно',
    requiredDocs: ['Удостоверение личности'],
    formFields: [
      { name: 'institution', label: 'Наименование учебного заведения', type: 'text', required: true },
      { name: 'study_year', label: 'Текущий учебный год', type: 'text', required: true },
      { name: 'purpose', label: 'Цель получения справки', type: 'select', required: true, options: ['По месту требования', 'Для банка', 'Для работодателя', 'Для военкомата', 'Другое'] }
    ],
    popular: false
  },

  // --- Здоровье ---
  {
    id: uuidv4(),
    title: 'Запись к врачу (поликлиника)',
    category: 'Здоровье',
    description: 'Онлайн-запись на приём к врачу первичной медико-санитарной помощи в государственную поликлинику по месту прикрепления.',
    duration: 'В день обращения',
    cost: 'Бесплатно',
    requiredDocs: ['Удостоверение личности (для идентификации)'],
    formFields: [
      { name: 'clinic', label: 'Поликлиника', type: 'text', required: true },
      { name: 'doctor_type', label: 'Специальность врача', type: 'select', required: true, options: ['Терапевт', 'Педиатр', 'Хирург', 'Кардиолог', 'Невролог', 'ЛОР', 'Офтальмолог', 'Другое'] },
      { name: 'visit_date', label: 'Желаемая дата приёма', type: 'date', required: true },
      { name: 'complaint', label: 'Описание жалоб (кратко)', type: 'text', required: false }
    ],
    popular: true
  },
  {
    id: uuidv4(),
    title: 'Получение справки о состоянии здоровья',
    category: 'Здоровье',
    description: 'Оформление медицинской справки о состоянии здоровья для предоставления по месту требования (работа, учёба, ГИБДД и др.).',
    duration: '3 рабочих дня',
    cost: '500 ₽',
    requiredDocs: ['Удостоверение личности', 'Полис обязательного медицинского страхования (ОСМС)'],
    formFields: [
      { name: 'purpose', label: 'Цель получения справки', type: 'select', required: true, options: ['Для работы', 'Для учёбы', 'Для водительских прав', 'Для оружия', 'По месту требования'] },
      { name: 'clinic', label: 'Прикреплённая поликлиника', type: 'text', required: true }
    ],
    popular: false
  },

  // --- Налоги и финансы ---
  {
    id: uuidv4(),
    title: 'Получение справки об отсутствии задолженности по налогам',
    category: 'Налоги и финансы',
    description: 'Выдача справки об отсутствии (наличии) задолженности перед бюджетом по налогам и обязательным платежам.',
    duration: '1 рабочий день',
    cost: 'Бесплатно',
    requiredDocs: ['Удостоверение личности'],
    formFields: [
      { name: 'purpose', label: 'Цель получения справки', type: 'select', required: true, options: ['Для нотариуса', 'Для банка', 'Для тендера', 'По месту требования'] },
      { name: 'tax_organ', label: 'Налоговый орган', type: 'select', required: true, options: ['УГД по г. Алматы', 'УГД по г. Астана', 'УГД по г. Шымкент', 'По месту регистрации'] }
    ],
    popular: true
  },
  {
    id: uuidv4(),
    title: 'Подача индивидуальной декларации об активах и обязательствах',
    category: 'Налоги и финансы',
    description: 'Подача обязательной декларации физического лица об активах и обязательствах в рамках всеобщего декларирования.',
    duration: '1 рабочий день',
    cost: 'Бесплатно',
    requiredDocs: ['Удостоверение личности', 'ЭЦП (электронная цифровая подпись)'],
    formFields: [
      { name: 'declaration_year', label: 'Год декларирования', type: 'select', required: true, options: ['2024', '2025', '2026'] },
      { name: 'has_property', label: 'Наличие недвижимости', type: 'select', required: true, options: ['Да', 'Нет'] },
      { name: 'has_vehicle', label: 'Наличие транспортных средств', type: 'select', required: true, options: ['Да', 'Нет'] },
      { name: 'has_business', label: 'Участие в бизнесе', type: 'select', required: true, options: ['Да', 'Нет'] }
    ],
    popular: false
  },

  // --- Жильё и ЖКХ ---
  {
    id: uuidv4(),
    title: 'Приватизация жилья',
    category: 'Жильё и ЖКХ',
    description: 'Передача государственного жилья в собственность нанимателю. Возможна для граждан, проживающих в государственном жилищном фонде.',
    duration: '30 рабочих дней',
    cost: 'Расчётная стоимость',
    requiredDocs: ['Удостоверения личности всех членов семьи', 'Договор найма жилья', 'Справка о регистрации', 'Справка об отсутствии другого жилья'],
    formFields: [
      { name: 'address', label: 'Адрес приватизируемого жилья', type: 'text', required: true },
      { name: 'area', label: 'Общая площадь (кв.м)', type: 'text', required: true },
      { name: 'residents', label: 'Количество зарегистрированных жильцов', type: 'select', required: true, options: ['1', '2', '3', '4', '5 и более'] }
    ],
    popular: false
  },
  {
    id: uuidv4(),
    title: 'Назначение жилищной субсидии',
    category: 'Жильё и ЖКХ',
    description: 'Назначение государственной жилищной субсидии для малообеспеченных граждан на оплату коммунальных услуг и аренды жилья.',
    duration: '10 рабочих дней',
    cost: 'Бесплатно',
    requiredDocs: ['Удостоверения личности членов семьи', 'Справка о доходах', 'Договор аренды / документы на жильё', 'Квитанции ЖКУ'],
    formFields: [
      { name: 'address', label: 'Адрес проживания', type: 'text', required: true },
      { name: 'housing_type', label: 'Тип жилья', type: 'select', required: true, options: ['Арендованное', 'Собственное', 'Государственное'] },
      { name: 'monthly_payment', label: 'Ежемесячный платёж за ЖКУ (₽)', type: 'text', required: true },
      { name: 'family_income', label: 'Совокупный доход семьи в месяц (₽)', type: 'text', required: true },
      { name: 'bank_account', label: 'Банковский счёт для субсидии', type: 'text', required: true }
    ],
    popular: false
  }
];

module.exports = services;
