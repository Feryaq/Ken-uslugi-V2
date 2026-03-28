const { v4: uuidv4 } = require('uuid');

const services = [

  // --- Гражданство ---
  {
    id: uuidv4(),
    title: 'Получение гражданства Кендрессии',
    category: 'Гражданство',
    description: 'Оформление гражданства Союза Партии Бомжей и Богачей (СПБ). Гражданство даёт право проживать на территории Кендрессии, пользоваться её инфраструктурой и участвовать в жизни государства.',
    duration: '1-3 дня',
    cost: 'Бесплатно',
    requiredDocs: ['Ник в Minecraft', 'Возраст', 'Город проживания'],
    formFields: [
      { name: 'nickname', label: 'Ник в Minecraft', type: 'text', required: true },
      { name: 'age', label: 'Возраст', type: 'text', required: true },
      { name: 'city', label: 'Город проживания', type: 'text', required: true },
      { name: 'reason', label: 'Почему хочешь стать гражданином?', type: 'text', required: true }
    ],
    popular: true
  },
  {
    id: uuidv4(),
    title: 'Смена никнейма в реестре граждан',
    category: 'Гражданство',
    description: 'Обновление официального ника гражданина в государственном реестре Кендрессии в связи со сменой игрового имени.',
    duration: '1 день',
    cost: 'Бесплатно',
    requiredDocs: ['Старый ник', 'Новый ник'],
    formFields: [
      { name: 'old_nickname', label: 'Старый ник', type: 'text', required: true },
      { name: 'new_nickname', label: 'Новый ник', type: 'text', required: true },
      { name: 'reason', label: 'Причина смены', type: 'select', required: true, options: ['Смена ника в Minecraft', 'Ошибка при регистрации', 'Другое'] }
    ],
    popular: false
  },
  {
    id: uuidv4(),
    title: 'Выход из гражданства',
    category: 'Гражданство',
    description: 'Добровольный отказ от гражданства Кендрессии. Заявление рассматривается Великим Правителем лично.',
    duration: '3-7 дней',
    cost: 'Бесплатно',
    requiredDocs: ['Ник в Minecraft', 'Письменное обоснование'],
    formFields: [
      { name: 'nickname', label: 'Ник в Minecraft', type: 'text', required: true },
      { name: 'reason', label: 'Причина выхода из гражданства', type: 'text', required: true },
      { name: 'confirm', label: 'Подтверждение', type: 'select', required: true, options: ['Да, я осознаю последствия'] }
    ],
    popular: false
  },

  // --- Строительство и земля ---
  {
    id: uuidv4(),
    title: 'Разрешение на строительство',
    category: 'Строительство и земля',
    description: 'Получение официального разрешения на возведение постройки на территории Кендрессии. Согласно Статье 14 Конституции, любое строительство требует разрешения уполномоченных органов власти.',
    duration: '2-5 дней',
    cost: 'Бесплатно',
    requiredDocs: ['Ник в Minecraft', 'Координаты участка', 'Описание постройки'],
    formFields: [
      { name: 'nickname', label: 'Ник в Minecraft', type: 'text', required: true },
      { name: 'coords', label: 'Координаты участка (X, Z)', type: 'text', required: true },
      { name: 'build_type', label: 'Тип постройки', type: 'select', required: true, options: ['Жилой дом', 'Торговая точка', 'Склад', 'Общественное здание', 'Укрепление', 'Другое'] },
      { name: 'build_desc', label: 'Краткое описание', type: 'text', required: true },
      { name: 'size', label: 'Примерный размер (блоков)', type: 'text', required: false }
    ],
    popular: true
  },
  {
    id: uuidv4(),
    title: 'Регистрация земельного участка',
    category: 'Строительство и земля',
    description: 'Официальное оформление прав на земельный участок на территории Кендрессии. Зарегистрированный участок защищён государством от незаконного захвата.',
    duration: '3 дня',
    cost: 'Бесплатно',
    requiredDocs: ['Ник в Minecraft', 'Координаты границ участка'],
    formFields: [
      { name: 'nickname', label: 'Ник в Minecraft', type: 'text', required: true },
      { name: 'coords_min', label: 'Координата угла 1 (X Z)', type: 'text', required: true },
      { name: 'coords_max', label: 'Координата угла 2 (X Z)', type: 'text', required: true },
      { name: 'purpose', label: 'Назначение участка', type: 'select', required: true, options: ['Жильё', 'Торговля', 'Фермерство', 'Производство', 'Другое'] }
    ],
    popular: true
  },
  {
    id: uuidv4(),
    title: 'Оспаривание захвата территории',
    category: 'Строительство и земля',
    description: 'Подача жалобы на незаконный захват или повреждение вашей территории другими игроками. Рассматривается государством в соответствии со Статьёй 12 Конституции.',
    duration: '1-3 дня',
    cost: 'Бесплатно',
    requiredDocs: ['Ник заявителя', 'Ник нарушителя', 'Доказательства'],
    formFields: [
      { name: 'nickname', label: 'Ваш ник', type: 'text', required: true },
      { name: 'offender', label: 'Ник нарушителя', type: 'text', required: true },
      { name: 'coords', label: 'Координаты места нарушения', type: 'text', required: true },
      { name: 'description', label: 'Описание нарушения', type: 'text', required: true }
    ],
    popular: false
  },

  // --- Бизнес и торговля ---
  {
    id: uuidv4(),
    title: 'Открытие торгового предприятия',
    category: 'Бизнес и торговля',
    description: 'Регистрация магазина, лавки или торговой точки на территории Кендрессии. После регистрации предприятие вносится в государственный торговый реестр.',
    duration: '2 дня',
    cost: 'Бесплатно',
    requiredDocs: ['Ник владельца', 'Название предприятия', 'Координаты'],
    formFields: [
      { name: 'nickname', label: 'Ник владельца', type: 'text', required: true },
      { name: 'shop_name', label: 'Название предприятия', type: 'text', required: true },
      { name: 'shop_type', label: 'Тип бизнеса', type: 'select', required: true, options: ['Магазин ресурсов', 'Оружейная лавка', 'Еда и фермерство', 'Строительные материалы', 'Зелья и зачарование', 'Услуги (крафт, строительство)', 'Другое'] },
      { name: 'coords', label: 'Координаты магазина', type: 'text', required: true }
    ],
    popular: true
  },
  {
    id: uuidv4(),
    title: 'Получение торговой лицензии',
    category: 'Бизнес и торговля',
    description: 'Оформление лицензии на определённый вид торговли. Некоторые товары (оружие, зелья, взрывчатка) требуют специального разрешения от государства.',
    duration: '3-5 дней',
    cost: 'Бесплатно',
    requiredDocs: ['Ник', 'Действующее предприятие'],
    formFields: [
      { name: 'nickname', label: 'Ник в Minecraft', type: 'text', required: true },
      { name: 'license_type', label: 'Вид лицензии', type: 'select', required: true, options: ['Торговля оружием', 'Торговля взрывчаткой', 'Торговля зельями', 'Торговля зачарованными предметами', 'Торговля редкими ресурсами'] },
      { name: 'shop_name', label: 'Название предприятия', type: 'text', required: true },
      { name: 'justification', label: 'Обоснование необходимости лицензии', type: 'text', required: true }
    ],
    popular: false
  },

  // --- Военная служба ---
  {
    id: uuidv4(),
    title: 'Запись на военную службу по контракту',
    category: 'Военная служба',
    description: 'Вступление в ряды Военно-диверсионного корпуса армии СПБ. Служба подразумевает защиту территории Кендрессии и выполнение приказов командования.',
    duration: '1-3 дня',
    cost: 'Бесплатно',
    requiredDocs: ['Ник в Minecraft', 'Возраст', 'Опыт PvP'],
    formFields: [
      { name: 'nickname', label: 'Ник в Minecraft', type: 'text', required: true },
      { name: 'age', label: 'Возраст', type: 'text', required: true },
      { name: 'pvp_exp', label: 'Опыт PvP (оцени себя)', type: 'select', required: true, options: ['Новичок', 'Средний', 'Опытный', 'Профессионал'] },
      { name: 'role', label: 'Желаемая должность', type: 'select', required: true, options: ['Рядовой', 'Разведчик', 'Сапёр', 'Строитель укреплений', 'Офицер (на усмотрение командования)'] },
      { name: 'motivation', label: 'Почему хочешь служить?', type: 'text', required: true }
    ],
    popular: true
  },
  {
    id: uuidv4(),
    title: 'Запрос на отсрочку от мобилизации',
    category: 'Военная служба',
    description: 'Подача заявления об освобождении от всеобщей мобилизации по уважительной причине. Рассматривается лично Великим Правителем.',
    duration: '1-2 дня',
    cost: 'Бесплатно',
    requiredDocs: ['Ник в Minecraft', 'Обоснование'],
    formFields: [
      { name: 'nickname', label: 'Ник в Minecraft', type: 'text', required: true },
      { name: 'reason', label: 'Причина отсрочки', type: 'select', required: true, options: ['Офлайн в период мобилизации', 'Нейтральный статус', 'Работа на нужды государства', 'Другое'] },
      { name: 'details', label: 'Подробности', type: 'text', required: true }
    ],
    popular: false
  },

  // --- Обращения и жалобы ---
  {
    id: uuidv4(),
    title: 'Жалоба на игрока / организацию',
    category: 'Обращения',
    description: 'Официальная жалоба на действия другого игрока или организации, нарушающие законы Кендрессии. Государство обязано рассмотреть каждое обращение.',
    duration: '1-5 дней',
    cost: 'Бесплатно',
    requiredDocs: ['Ник заявителя', 'Ник ответчика', 'Описание нарушения'],
    formFields: [
      { name: 'nickname', label: 'Ваш ник', type: 'text', required: true },
      { name: 'accused', label: 'Ник ответчика', type: 'text', required: true },
      { name: 'violation', label: 'Статья Конституции (если знаешь)', type: 'text', required: false },
      { name: 'description', label: 'Описание нарушения', type: 'text', required: true },
      { name: 'evidence', label: 'Доказательства (ссылка на скриншот/видео)', type: 'text', required: false }
    ],
    popular: true
  },
  {
    id: uuidv4(),
    title: 'Запрос на помилование',
    category: 'Обращения',
    description: 'Официальное прошение о снятии санкций, розыска или иных наказаний. Рассматривается лично Великим Правителем. Одобрение не гарантируется.',
    duration: 'На усмотрение Правителя',
    cost: 'Бесплатно',
    requiredDocs: ['Ник в Minecraft', 'Суть обвинения', 'Обоснование помилования'],
    formFields: [
      { name: 'nickname', label: 'Ник в Minecraft', type: 'text', required: true },
      { name: 'charge', label: 'За что наказан?', type: 'text', required: true },
      { name: 'plea', label: 'Просьба к Великому Правителю', type: 'text', required: true },
      { name: 'promise', label: 'Обязательство перед государством', type: 'text', required: true }
    ],
    popular: false
  },
  {
    id: uuidv4(),
    title: 'Обращение к Великому Правителю',
    category: 'Обращения',
    description: 'Личное обращение к Кен Флишу по вопросам, не охваченным другими услугами. Любые предложения, просьбы или важные сведения для государства.',
    duration: 'По усмотрению',
    cost: 'Бесплатно',
    requiredDocs: ['Ник в Minecraft'],
    formFields: [
      { name: 'nickname', label: 'Ник в Minecraft', type: 'text', required: true },
      { name: 'subject', label: 'Тема обращения', type: 'select', required: true, options: ['Предложение', 'Просьба', 'Важная информация', 'Союз / дипломатия', 'Другое'] },
      { name: 'message', label: 'Текст обращения', type: 'text', required: true }
    ],
    popular: true
  }

];

module.exports = services;
