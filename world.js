// GEOSTRAT - World Data
// Real-world countries with simplified province assignments

const IDEOLOGIES = {
  democratic: { name: 'Демократия', color: '#4a9eff', bgColor: 'rgba(74,158,255,0.15)', borderColor: 'rgba(74,158,255,0.35)' },
  authoritarian: { name: 'Авторитаризм', color: '#e0a530', bgColor: 'rgba(224,165,48,0.15)', borderColor: 'rgba(224,165,48,0.35)' },
  communist: { name: 'Коммунизм', color: '#e05555', bgColor: 'rgba(224,85,85,0.15)', borderColor: 'rgba(224,85,85,0.35)' },
  fascist: { name: 'Фашизм', color: '#888888', bgColor: 'rgba(136,136,136,0.15)', borderColor: 'rgba(136,136,136,0.35)' },
  theocratic: { name: 'Теократия', color: '#3dba7e', bgColor: 'rgba(61,186,126,0.15)', borderColor: 'rgba(61,186,126,0.35)' },
};

// Country fill colors for map
const COUNTRY_COLORS = {
  USA: '#1a3a5c', CAN: '#1e3d1e', MEX: '#3a2d0e',
  BRA: '#1a3a2a', ARG: '#1e2a50', COL: '#3a2010',
  VEN: '#2a1040', PER: '#401a1a', CHL: '#1a2a40',
  ECU: '#2a3010', BOL: '#3a1a10', PRY: '#102a1a',
  URY: '#102040', GUY: '#0a2a1a', SUR: '#1a2a0a',
  GBR: '#2a1a3a', FRA: '#1a2040', DEU: '#2a2a2a',
  ITA: '#1a3020', ESP: '#3a1a10', PRT: '#2a1020',
  POL: '#3a1020', UKR: '#1a2040', ROU: '#2a1010',
  BLR: '#1a3020', CZE: '#2a2010', SVK: '#102030',
  HUN: '#30200a', AUT: '#202010', CHE: '#1a1a2a',
  BEL: '#101a30', NLD: '#1a1040', DNK: '#2a100a',
  SWE: '#102020', NOR: '#0a1a2a', FIN: '#0a2020',
  GRC: '#1a200a', SRB: '#200a10', HRV: '#1a0a20',
  BGR: '#200a0a', SVN: '#0a200a', BIH: '#0a1010',
  MKD: '#100a20', ALB: '#1a100a', MNE: '#0a0a20',
  LTU: '#0a1a10', LVA: '#100a10', EST: '#0a0a1a',
  MDA: '#1a0a10', KOS: '#0a100a',
  RUS: '#3a1010', TUR: '#3a1010', IRN: '#2a1a0a',
  SAU: '#1a2a10', ISR: '#102040', IRQ: '#2a1010',
  SYR: '#1a1010', JOR: '#2a1a0a', LBN: '#1a0a10',
  YEM: '#1a0a0a', OMN: '#0a1a10', ARE: '#1a2a1a',
  KWT: '#101a0a', QAT: '#1a1010', BHR: '#0a1010',
  AFG: '#2a1a0a', PAK: '#0a2a10', IND: '#2a1a0a',
  BGD: '#0a2a0a', NPL: '#1a0a0a', LKA: '#1a1a0a',
  MMR: '#1a0a1a', THA: '#1a1a1a', VNM: '#2a0a0a',
  KHM: '#1a0a0a', LAO: '#0a1a0a', MYS: '#0a1a1a',
  IDN: '#2a0808', PHL: '#0a0a1a', SGP: '#1a1a0a',
  CHN: '#3a0808', MNG: '#1a1a0a', PRK: '#2a0a1a',
  KOR: '#0a0a2a', JPN: '#0a1a2a', TWN: '#0a102a',
  KAZ: '#1a1a0a', UZB: '#0a1a0a', TKM: '#0a0a1a',
  KGZ: '#1a0a1a', TJK: '#0a1a1a', AZE: '#1a0a0a',
  GEO: '#0a1a0a', ARM: '#1a0a0a',
  EGY: '#2a1a0a', LBY: '#1a1a0a', TUN: '#2a0a0a',
  DZA: '#1a2a0a', MAR: '#2a0a1a', SDN: '#1a0a0a',
  ETH: '#0a1a0a', SOM: '#0a0a1a', KEN: '#0a1a10',
  TZA: '#0a0a10', UGA: '#0a100a', RWA: '#100a0a',
  NGA: '#0a1a0a', GHA: '#1a0a0a', CMR: '#0a0a10',
  COD: '#0a1a0a', AGO: '#100a0a', MOZ: '#0a1010',
  ZMB: '#0a0a1a', ZWE: '#100a0a', BWA: '#0a1a1a',
  ZAF: '#0a0a2a', NAM: '#1a0a0a', MDG: '#0a1a0a',
  AUS: '#0a1a2a', NZL: '#0a0a2a', PNG: '#0a1a0a',
  FJI: '#0a0a10',
};

const WORLD_COUNTRIES = [
  // === NORTH AMERICA ===
  { id:'USA', name:'США', flag:'🇺🇸', ideology:'democratic', leader:'Джейк Харрис', pop:331, econ:230, brigades:50, capital:'Вашингтон', traits:['nato','g7','p5'] },
  { id:'CAN', name:'Канада', flag:'🇨🇦', ideology:'democratic', leader:'Мари Дюбуа', pop:38, econ:100, brigades:14, capital:'Оттава', traits:['nato','g7'] },
  { id:'MEX', name:'Мексика', flag:'🇲🇽', ideology:'authoritarian', leader:'Карлос Мендоза', pop:130, econ:58, brigades:20, capital:'Мехико', traits:[] },

  // === SOUTH AMERICA ===
  { id:'BRA', name:'Бразилия', flag:'🇧🇷', ideology:'democratic', leader:'Луис Силва', pop:215, econ:85, brigades:24, capital:'Бразилиа', traits:['brics'] },
  { id:'ARG', name:'Аргентина', flag:'🇦🇷', ideology:'democratic', leader:'Мариана Гомес', pop:45, econ:45, brigades:12, capital:'Буэнос-Айрес', traits:[] },
  { id:'COL', name:'Колумбия', flag:'🇨🇴', ideology:'democratic', leader:'Педро Рамирес', pop:51, econ:32, brigades:10, capital:'Богота', traits:[] },
  { id:'VEN', name:'Венесуэла', flag:'🇻🇪', ideology:'authoritarian', leader:'Эмилио Чавес', pop:28, econ:14, brigades:9, capital:'Каракас', traits:[] },
  { id:'PER', name:'Перу', flag:'🇵🇪', ideology:'democratic', leader:'Хуан Кастро', pop:33, econ:28, brigades:8, capital:'Лима', traits:[] },
  { id:'CHL', name:'Чили', flag:'🇨🇱', ideology:'democratic', leader:'Андрес Вара', pop:19, econ:30, brigades:7, capital:'Сантьяго', traits:[] },
  { id:'ECU', name:'Эквадор', flag:'🇪🇨', ideology:'democratic', leader:'Мигель Флорес', pop:18, econ:22, brigades:6, capital:'Кито', traits:[] },
  { id:'BOL', name:'Боливия', flag:'🇧🇴', ideology:'authoritarian', leader:'Эво Рикас', pop:12, econ:15, brigades:5, capital:'Ла-Пас', traits:[] },
  { id:'PRY', name:'Парагвай', flag:'🇵🇾', ideology:'authoritarian', leader:'Санти Альварес', pop:7, econ:12, brigades:4, capital:'Асунсьон', traits:[] },
  { id:'URY', name:'Уругвай', flag:'🇺🇾', ideology:'democratic', leader:'Хосе Лопес', pop:4, econ:16, brigades:3, capital:'Монтевидео', traits:[] },

  // === EUROPE ===
  { id:'RUS', name:'Россия', flag:'🇷🇺', ideology:'authoritarian', leader:'Дмитрий Волков', pop:145, econ:130, brigades:65, capital:'Москва', traits:['p5','brics'] },
  { id:'GBR', name:'Великобритания', flag:'🇬🇧', ideology:'democratic', leader:'Элизабет Гарднер', pop:67, econ:115, brigades:24, capital:'Лондон', traits:['nato','g7','p5'] },
  { id:'FRA', name:'Франция', flag:'🇫🇷', ideology:'democratic', leader:'Жак Мартен', pop:67, econ:120, brigades:22, capital:'Париж', traits:['nato','g7','p5'] },
  { id:'DEU', name:'Германия', flag:'🇩🇪', ideology:'democratic', leader:'Хельга Мюллер', pop:83, econ:135, brigades:26, capital:'Берлин', traits:['nato','g7'] },
  { id:'ITA', name:'Италия', flag:'🇮🇹', ideology:'democratic', leader:'Марко Россини', pop:60, econ:100, brigades:18, capital:'Рим', traits:['nato','g7'] },
  { id:'ESP', name:'Испания', flag:'🇪🇸', ideology:'democratic', leader:'Хорхе Гарсиа', pop:47, econ:88, brigades:16, capital:'Мадрид', traits:['nato'] },
  { id:'POL', name:'Польша', flag:'🇵🇱', ideology:'democratic', leader:'Анджей Ковальски', pop:38, econ:55, brigades:18, capital:'Варшава', traits:['nato'] },
  { id:'UKR', name:'Украина', flag:'🇺🇦', ideology:'democratic', leader:'Олег Шевченко', pop:44, econ:42, brigades:35, capital:'Киев', traits:[] },
  { id:'TUR', name:'Турция', flag:'🇹🇷', ideology:'authoritarian', leader:'Мустафа Демир', pop:84, econ:72, brigades:30, capital:'Анкара', traits:['nato'] },
  { id:'NLD', name:'Нидерланды', flag:'🇳🇱', ideology:'democratic', leader:'Виллем ван Дейк', pop:17, econ:60, brigades:8, capital:'Амстердам', traits:['nato'] },
  { id:'BEL', name:'Бельгия', flag:'🇧🇪', ideology:'democratic', leader:'Луи Дюмон', pop:11, econ:55, brigades:7, capital:'Брюссель', traits:['nato'] },
  { id:'SWE', name:'Швеция', flag:'🇸🇪', ideology:'democratic', leader:'Эрик Линдгрен', pop:10, econ:65, brigades:10, capital:'Стокгольм', traits:['nato'] },
  { id:'NOR', name:'Норвегия', flag:'🇳🇴', ideology:'democratic', leader:'Олаф Берг', pop:5, econ:55, brigades:8, capital:'Осло', traits:['nato'] },
  { id:'FIN', name:'Финляндия', flag:'🇫🇮', ideology:'democratic', leader:'Сари Мяккинен', pop:5, econ:45, brigades:8, capital:'Хельсинки', traits:['nato'] },
  { id:'GRC', name:'Греция', flag:'🇬🇷', ideology:'democratic', leader:'Никос Пападопулос', pop:11, econ:40, brigades:10, capital:'Афины', traits:['nato'] },
  { id:'ROU', name:'Румыния', flag:'🇷🇴', ideology:'democratic', leader:'Константин Попеску', pop:19, econ:35, brigades:12, capital:'Бухарест', traits:['nato'] },
  { id:'SRB', name:'Сербия', flag:'🇷🇸', ideology:'authoritarian', leader:'Мирко Йованович', pop:7, econ:22, brigades:8, capital:'Белград', traits:[] },
  { id:'HUN', name:'Венгрия', flag:'🇭🇺', ideology:'authoritarian', leader:'Виктор Орбань', pop:10, econ:35, brigades:8, capital:'Будапешт', traits:['nato'] },
  { id:'CZE', name:'Чехия', flag:'🇨🇿', ideology:'democratic', leader:'Петр Новак', pop:11, econ:40, brigades:7, capital:'Прага', traits:['nato'] },
  { id:'PRT', name:'Португалия', flag:'🇵🇹', ideology:'democratic', leader:'Жозе Соуза', pop:10, econ:38, brigades:6, capital:'Лиссабон', traits:['nato'] },
  { id:'AUT', name:'Австрия', flag:'🇦🇹', ideology:'democratic', leader:'Анна Вебер', pop:9, econ:45, brigades:6, capital:'Вена', traits:[] },
  { id:'CHE', name:'Швейцария', flag:'🇨🇭', ideology:'democratic', leader:'Ханс Мюллер', pop:9, econ:55, brigades:5, capital:'Берн', traits:[] },
  { id:'DNK', name:'Дания', flag:'🇩🇰', ideology:'democratic', leader:'Кристина Хансен', pop:6, econ:48, brigades:6, capital:'Копенгаген', traits:['nato'] },
  { id:'BLR', name:'Беларусь', flag:'🇧🇾', ideology:'authoritarian', leader:'Александр Лукас', pop:9, econ:28, brigades:12, capital:'Минск', traits:[] },
  { id:'BGR', name:'Болгария', flag:'🇧🇬', ideology:'democratic', leader:'Боян Петров', pop:7, econ:28, brigades:7, capital:'София', traits:['nato'] },
  { id:'HRV', name:'Хорватия', flag:'🇭🇷', ideology:'democratic', leader:'Марко Хорват', pop:4, econ:25, brigades:5, capital:'Загреб', traits:['nato'] },
  { id:'UZB', name:'Узбекистан', flag:'🇺🇿', ideology:'authoritarian', leader:'Шавкат Миров', pop:35, econ:20, brigades:12, capital:'Ташкент', traits:[] },
  { id:'KAZ', name:'Казахстан', flag:'🇰🇿', ideology:'authoritarian', leader:'Касым Токаев', pop:19, econ:45, brigades:14, capital:'Астана', traits:[] },
  { id:'AZE', name:'Азербайджан', flag:'🇦🇿', ideology:'authoritarian', leader:'Ильхам Алиев', pop:10, econ:28, brigades:10, capital:'Баку', traits:[] },
  { id:'GEO', name:'Грузия', flag:'🇬🇪', ideology:'democratic', leader:'Саломе Зурабишвили', pop:4, econ:18, brigades:6, capital:'Тбилиси', traits:[] },

  // === MIDDLE EAST ===
  { id:'IRN', name:'Иран', flag:'🇮🇷', ideology:'theocratic', leader:'Али Хосейни', pop:85, econ:55, brigades:28, capital:'Тегеран', traits:[] },
  { id:'SAU', name:'Саудовская Аравия', flag:'🇸🇦', ideology:'theocratic', leader:'Мухаммад ас-Сауд', pop:35, econ:90, brigades:22, capital:'Эр-Рияд', traits:['g20'] },
  { id:'ISR', name:'Израиль', flag:'🇮🇱', ideology:'democratic', leader:'Давид Коэн', pop:9, econ:65, brigades:20, capital:'Иерусалим', traits:[] },
  { id:'IRQ', name:'Ирак', flag:'🇮🇶', ideology:'authoritarian', leader:'Мустафа аль-Казими', pop:41, econ:28, brigades:14, capital:'Багдад', traits:[] },
  { id:'SYR', name:'Сирия', flag:'🇸🇾', ideology:'authoritarian', leader:'Ахмад Шараа', pop:21, econ:10, brigades:18, capital:'Дамаск', traits:[] },
  { id:'JOR', name:'Иордания', flag:'🇯🇴', ideology:'authoritarian', leader:'Абдалла II', pop:10, econ:22, brigades:8, capital:'Амман', traits:[] },
  { id:'ARE', name:'ОАЭ', flag:'🇦🇪', ideology:'authoritarian', leader:'Мухаммад Наян', pop:10, econ:75, brigades:12, capital:'Абу-Даби', traits:[] },
  { id:'AFG', name:'Афганистан', flag:'🇦🇫', ideology:'theocratic', leader:'Хибатулла Ахундзада', pop:40, econ:8, brigades:20, capital:'Кабул', traits:[] },
  { id:'YEM', name:'Йемен', flag:'🇾🇪', ideology:'authoritarian', leader:'Рашад аль-Алими', pop:33, econ:5, brigades:15, capital:'Сана', traits:[] },

  // === SOUTH ASIA ===
  { id:'PAK', name:'Пакистан', flag:'🇵🇰', ideology:'authoritarian', leader:'Имран Бхатти', pop:225, econ:35, brigades:22, capital:'Исламабад', traits:[] },
  { id:'IND', name:'Индия', flag:'🇮🇳', ideology:'democratic', leader:'Раджив Гупта', pop:1400, econ:145, brigades:54, capital:'Нью-Дели', traits:['brics','g20'] },
  { id:'BGD', name:'Бангладеш', flag:'🇧🇩', ideology:'authoritarian', leader:'Мухаммад Юнус', pop:170, econ:24, brigades:12, capital:'Дакка', traits:[] },
  { id:'NPL', name:'Непал', flag:'🇳🇵', ideology:'democratic', leader:'Пушпа Дахал', pop:30, econ:10, brigades:8, capital:'Катманду', traits:[] },
  { id:'LKA', name:'Шри-Ланка', flag:'🇱🇰', ideology:'authoritarian', leader:'Раниль Викремасингхе', pop:22, econ:14, brigades:6, capital:'Коломбо', traits:[] },
  { id:'MMR', name:'Мьянма', flag:'🇲🇲', ideology:'authoritarian', leader:'Мин Аун Хлаинг', pop:55, econ:20, brigades:18, capital:'Нейпьидо', traits:[] },

  // === SOUTHEAST ASIA ===
  { id:'THA', name:'Таиланд', flag:'🇹🇭', ideology:'authoritarian', leader:'Прает Чанок', pop:70, econ:45, brigades:16, capital:'Бангкок', traits:[] },
  { id:'VNM', name:'Вьетнам', flag:'🇻🇳', ideology:'communist', leader:'Нгуен Ван Минь', pop:98, econ:38, brigades:22, capital:'Ханой', traits:[] },
  { id:'KHM', name:'Камбоджа', flag:'🇰🇭', ideology:'authoritarian', leader:'Хун Манет', pop:17, econ:12, brigades:8, capital:'Пномпень', traits:[] },
  { id:'MYS', name:'Малайзия', flag:'🇲🇾', ideology:'authoritarian', leader:'Анвар Ибрагим', pop:33, econ:42, brigades:12, capital:'Куала-Лумпур', traits:[] },
  { id:'IDN', name:'Индонезия', flag:'🇮🇩', ideology:'democratic', leader:'Прабово Субианто', pop:276, econ:62, brigades:20, capital:'Джакарта', traits:['g20'] },
  { id:'PHL', name:'Филиппины', flag:'🇵🇭', ideology:'democratic', leader:'Фердинанд Маркос', pop:110, econ:38, brigades:14, capital:'Манила', traits:[] },

  // === EAST ASIA ===
  { id:'CHN', name:'Китай', flag:'🇨🇳', ideology:'communist', leader:'Си Цзиньпин', pop:1411, econ:210, brigades:85, capital:'Пекин', traits:['p5','brics','g20'] },
  { id:'MNG', name:'Монголия', flag:'🇲🇳', ideology:'democratic', leader:'Ухнаагийн Хурэлсух', pop:3, econ:14, brigades:6, capital:'Улан-Батор', traits:[] },
  { id:'PRK', name:'Сев. Корея', flag:'🇰🇵', ideology:'communist', leader:'Ким Чен Ын', pop:26, econ:10, brigades:28, capital:'Пхеньян', traits:[] },
  { id:'KOR', name:'Юж. Корея', flag:'🇰🇷', ideology:'democratic', leader:'Ли Чжэ Мён', pop:52, econ:95, brigades:18, capital:'Сеул', traits:['g20'] },
  { id:'JPN', name:'Япония', flag:'🇯🇵', ideology:'democratic', leader:'Исиба Сигэру', pop:125, econ:135, brigades:22, capital:'Токио', traits:['g7','g20'] },
  { id:'TWN', name:'Тайвань', flag:'🇹🇼', ideology:'democratic', leader:'Лай Цин-дэ', pop:24, econ:80, brigades:14, capital:'Тайбэй', traits:[] },

  // === AFRICA ===
  { id:'EGY', name:'Египет', flag:'🇪🇬', ideology:'authoritarian', leader:'Абдель Фаттах ас-Сиси', pop:104, econ:42, brigades:24, capital:'Каир', traits:[] },
  { id:'LBY', name:'Ливия', flag:'🇱🇾', ideology:'authoritarian', leader:'Абдул-Хамид Дбейба', pop:7, econ:18, brigades:10, capital:'Триполи', traits:[] },
  { id:'TUN', name:'Тунис', flag:'🇹🇳', ideology:'authoritarian', leader:'Каис Саид', pop:12, econ:18, brigades:8, capital:'Тунис', traits:[] },
  { id:'DZA', name:'Алжир', flag:'🇩🇿', ideology:'authoritarian', leader:'Абдельмаджид Теббун', pop:45, econ:32, brigades:18, capital:'Алжир', traits:[] },
  { id:'MAR', name:'Марокко', flag:'🇲🇦', ideology:'authoritarian', leader:'Мухаммад VI', pop:37, econ:30, brigades:14, capital:'Рабат', traits:[] },
  { id:'SDN', name:'Судан', flag:'🇸🇩', ideology:'authoritarian', leader:'Абдель Фаттах аль-Бурхан', pop:44, econ:14, brigades:16, capital:'Хартум', traits:[] },
  { id:'ETH', name:'Эфиопия', flag:'🇪🇹', ideology:'authoritarian', leader:'Абий Ахмед', pop:117, econ:22, brigades:15, capital:'Аддис-Абеба', traits:[] },
  { id:'SOM', name:'Сомали', flag:'🇸🇴', ideology:'authoritarian', leader:'Хасан Шейх Махмуд', pop:17, econ:5, brigades:8, capital:'Могадишо', traits:[] },
  { id:'KEN', name:'Кения', flag:'🇰🇪', ideology:'democratic', leader:'Уильям Руто', pop:55, econ:28, brigades:10, capital:'Найроби', traits:[] },
  { id:'TZA', name:'Танзания', flag:'🇹🇿', ideology:'authoritarian', leader:'Самия Хасан', pop:63, econ:20, brigades:10, capital:'Додома', traits:[] },
  { id:'UGA', name:'Уганда', flag:'🇺🇬', ideology:'authoritarian', leader:'Йовери Мусевени', pop:48, econ:14, brigades:10, capital:'Кампала', traits:[] },
  { id:'NGA', name:'Нигерия', flag:'🇳🇬', ideology:'authoritarian', leader:'Бола Тинубу', pop:220, econ:38, brigades:18, capital:'Абуджа', traits:[] },
  { id:'GHA', name:'Гана', flag:'🇬🇭', ideology:'democratic', leader:'Джон Махама', pop:32, econ:18, brigades:8, capital:'Аккра', traits:[] },
  { id:'CMR', name:'Камерун', flag:'🇨🇲', ideology:'authoritarian', leader:'Поль Бийя', pop:27, econ:16, brigades:8, capital:'Яунде', traits:[] },
  { id:'COD', name:'Конго (ДРК)', flag:'🇨🇩', ideology:'authoritarian', leader:'Феликс Чисекеди', pop:100, econ:14, brigades:12, capital:'Киншаса', traits:[] },
  { id:'AGO', name:'Ангола', flag:'🇦🇴', ideology:'authoritarian', leader:'Жоан Лоуренсу', pop:34, econ:20, brigades:10, capital:'Луанда', traits:[] },
  { id:'MOZ', name:'Мозамбик', flag:'🇲🇿', ideology:'authoritarian', leader:'Даниэл Чапо', pop:32, econ:10, brigades:8, capital:'Мапуту', traits:[] },
  { id:'ZMB', name:'Замбия', flag:'🇿🇲', ideology:'democratic', leader:'Хакаинде Хичилема', pop:19, econ:12, brigades:6, capital:'Лусака', traits:[] },
  { id:'ZWE', name:'Зимбабве', flag:'🇿🇼', ideology:'authoritarian', leader:'Эммерсон Мнангагва', pop:16, econ:10, brigades:8, capital:'Харэ', traits:[] },
  { id:'ZAF', name:'ЮАР', flag:'🇿🇦', ideology:'democratic', leader:'Сирил Рамафоса', pop:60, econ:48, brigades:12, capital:'Претория', traits:['brics','g20'] },
  { id:'NAM', name:'Намибия', flag:'🇳🇦', ideology:'democratic', leader:'Нетумбо Нанди-Ндайтва', pop:3, econ:12, brigades:4, capital:'Виндхук', traits:[] },
  { id:'MDG', name:'Мадагаскар', flag:'🇲🇬', ideology:'authoritarian', leader:'Андри Радзоэлина', pop:28, econ:8, brigades:5, capital:'Антананариву', traits:[] },

  // === OCEANIA ===
  { id:'AUS', name:'Австралия', flag:'🇦🇺', ideology:'democratic', leader:'Энтони Альбанезе', pop:26, econ:85, brigades:12, capital:'Канберра', traits:['g20'] },
  { id:'NZL', name:'Новая Зеландия', flag:'🇳🇿', ideology:'democratic', leader:'Кристофер Люксон', pop:5, econ:45, brigades:5, capital:'Веллингтон', traits:[] },
  { id:'PNG', name:'Папуа Н.Г.', flag:'🇵🇬', ideology:'democratic', leader:'Джеймс Марапе', pop:10, econ:12, brigades:5, capital:'Порт-Морсби', traits:[] },
];

// Province definitions - each country has 1-3 provinces
// Province data: { id, owner, name }
function generateProvinces() {
  const provinces = {};
  WORLD_COUNTRIES.forEach(c => {
    const count = c.econ > 100 ? 3 : c.econ > 50 ? 2 : 1;
    for (let i = 0; i < count; i++) {
      const pid = `${c.id}_${i}`;
      provinces[pid] = { id: pid, owner: c.id, name: `${c.name} (${i+1})` };
    }
  });
  return provinces;
}

// Relations initializer
function initRelations(countries) {
  const ids = Object.keys(countries);
  ids.forEach(a => {
    if (!countries[a].relations) countries[a].relations = {};
    ids.forEach(b => {
      if (a === b) return;
      if (countries[a].relations[b] !== undefined) return;
      const ca = countries[a], cb = countries[b];
      let rel = 10;
      if (ca.ideology === cb.ideology) rel += 25;
      // Ideology conflicts
      const conflicts = [
        ['democratic','communist'], ['democratic','fascist'],
        ['communist','fascist'], ['theocratic','democratic']
      ];
      conflicts.forEach(([x,y]) => {
        if ((ca.ideology===x&&cb.ideology===y)||(ca.ideology===y&&cb.ideology===x)) rel -= 30;
      });
      // Trait bonuses
      if (ca.traits && cb.traits) {
        if (ca.traits.includes('nato') && cb.traits.includes('nato')) rel += 20;
        if (ca.traits.includes('brics') && cb.traits.includes('brics')) rel += 15;
      }
      rel += Math.floor(Math.random() * 30) - 15;
      rel = Math.max(-100, Math.min(100, rel));
      countries[a].relations[b] = rel;
      countries[b].relations[a] = rel;
    });
  });
}

if (typeof module !== 'undefined') {
  module.exports = { WORLD_COUNTRIES, COUNTRY_COLORS, IDEOLOGIES, generateProvinces, initRelations };
}
