// === Консоль-приветствие ===
console.log("👋 Привет! 😊");
console.log("💡 Все данные загружаются динамически.");

// === Переключение темы ===
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
} else {
    body.setAttribute('data-theme', 'light');
}

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// === Время и дата ===
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');

function updateClock() {
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString();
    dateEl.textContent = now.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
setInterval(updateClock, 1000);
updateClock();

// === Публичный IP ===
fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
        document.getElementById('ip').textContent = data.ip;
    })
    .catch(() => {
        document.getElementById('ip').textContent = 'Не удалось загрузить';
    });

// === Информация о браузере ===
document.getElementById('browser').textContent = navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                                                  navigator.userAgent.includes('Firefox') ? 'Firefox' :
                                                  'Другой';

document.getElementById('os').textContent = navigator.userAgent.includes('Win') ? 'Windows' :
                                           navigator.userAgent.includes('Mac') ? 'macOS' :
                                           navigator.userAgent.includes('Linux') ? 'Linux' :
                                           navigator.userAgent.includes('Android') ? 'Android' :
                                           navigator.userAgent.includes('iPhone') ? 'iOS' : 'Неизвестно';

function updateResolution() {
    document.getElementById('resolution').textContent = `${window.innerWidth} × ${window.innerHeight}`;
}
window.addEventListener('resize', updateResolution);
updateResolution();

// === Глобальные функции для сайдбара ===
let sidebar;

function openSidebar() {
    if (!sidebar) {
        console.error('❌ #sidebar не найден. Проверь HTML.');
        return;
    }
    sidebar.classList.add('open');
    console.log('✅ Меню открыто');
}

function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('open');
    console.log('✅ Меню закрыто');
}

// === Инициализация после загрузки DOM ===
document.addEventListener('DOMContentLoaded', () => {
    sidebar = document.getElementById('sidebar');
    const openBtn = document.querySelector('.open-btn');

    if (!sidebar) {
        console.error('❌ #sidebar не найден. Проверь HTML');
        return;
    }

    // Закрытие при клике мимо
    document.addEventListener('click', (e) => {
        const isClickInside = sidebar.contains(e.target);
        const isClickOnButton = openBtn && openBtn.contains(e.target);

        if (!isClickInside && !isClickOnButton && sidebar.classList.contains('open')) {
            closeSidebar();
        }
    });

    // === Генерация QR-кода ===
    const qrcodeContainer = document.getElementById('qrcode');
    if (qrcodeContainer && typeof QRious !== 'undefined') {
        const canvas = document.createElement('canvas');
        qrcodeContainer.innerHTML = '';
        qrcodeContainer.appendChild(canvas);

        new QRious({
            element: canvas,
            value: window.location.href,
            size: 180,
            level: 'H',
            background: '#fff',
            foreground: '#4a6fa5'
        });
    } else if (qrcodeContainer) {
        console.warn('QRious не загружена. Проверь подключение библиотеки.');
    }

    // === Модальное окно: типовые схемы ===
    const schemesBtn = document.getElementById('schemes-btn');
    const schemesModal = document.getElementById('schemes-modal');

    if (schemesBtn && schemesModal) {
        schemesBtn.addEventListener('click', () => {
            schemesModal.style.display = 'block';
        });

        window.closeModal = () => {
            schemesModal.style.display = 'none';
        };

        window.addEventListener('click', (e) => {
            if (e.target === schemesModal) {
                closeModal();
            }
        });
    }

    // === Модальное окно: ИИ ===
    const aiBtn = document.getElementById('ai-btn');
    const aiModal = document.getElementById('ai-modal');
    const aiInput = document.getElementById('ai-input');
    const aiResponse = document.getElementById('ai-response');

    if (aiBtn && aiModal) {
        aiBtn.addEventListener('click', () => {
            aiModal.style.display = 'block';
            aiInput.focus();
        });

        window.closeAIModal = () => {
            aiModal.style.display = 'none';
            aiResponse.textContent = '';
            aiInput.value = '';
        };

        window.addEventListener('click', (e) => {
            if (e.target === aiModal) {
                closeAIModal();
            }
        });
    }

    // === Поиск по ГОСТам ===
    const searchInput = document.getElementById('gost-search');
    const gostList = document.getElementById('gost-list');
    const items = gostList ? gostList.getElementsByTagName('li') : [];

    if (searchInput && gostList) {
        searchInput.addEventListener('input', () => {
            const filter = searchInput.value.toLowerCase();

            // Подсказки
            const hints = {
                'зуо': 'Наверное, вы имели в виду: УЗО (устройство защитного отключения)',
                'заземление': 'ПУЭ п. 1.7.5 — обязательное заземление металлических корпусов',
                'автомат': 'ПУЭ п. 3.1.5 — автомат должен защищать от перегрузки и КЗ',
                'розетка': 'ПУЭ п. 7.1.22 — розетки в ванных должны быть защищены УЗО 10 мА',
                'кабель': 'ГОСТ Р 50571.5.52 — выбор сечения кабеля по току',
                'сечение': 'Для розеток — 2.5 мм², для освещения — 1.5 мм² (ПУЭ)',
                'щит': 'ГОСТ 2.702-2011 — правила оформления схем щитов',
                'схема': 'ГОСТ 2.702-2011 — обозначения на электрических схемах'
            };

            const hintBox = document.getElementById('search-hint');
            if (!hintBox) {
                const hint = document.createElement('div');
                hint.id = 'search-hint';
                hint.style.padding = '10px 15px';
                hint.style.color = '#2196F3';
                hint.style.fontSize = '14px';
                hint.style.fontStyle = 'italic';
                hint.style.display = 'none';
                gostList.parentNode.insertBefore(hint, gostList);
            }

            const hintElement = document.getElementById('search-hint');
            let foundHint = false;

            for (const key in hints) {
                if (filter.includes(key)) {
                    hintElement.textContent = hints[key];
                    hintElement.style.display = 'block';
                    foundHint = true;
                    break;
                }
            }
            if (!foundHint) {
                hintElement.style.display = 'none';
            }

            // Фильтр списка
            Array.from(items).forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(filter) ? '' : 'none';
            });
        });
    }
});

// === Действия в меню ===
function showProfile() {
    alert('👤 Здесь будет профиль');
    closeSidebar();
}

function showSettings() {
    alert('⚙️ Настройки');
    closeSidebar();
}

// === Функции ГОСТов ===
function showPUERules() {
    alert(`📘 ПУЭ (Правила устройства электроустановок) — Полное руководство

🔹 Глава 1.7 — Заземление и защитные меры
• П. 1.7.5: Все металлические корпуса оборудования (светильники, розетки, щиты) должны быть заземлены.
• П. 1.7.79: УЗО обязательно при напряжении >50 В переменного тока (в жилых и общественных зданиях).
• П. 1.7.144: Розетки в ванных комнатах защищаются УЗО 10 мА.

🔹 Глава 3.1 — Защита от перегрузок и КЗ
• Автоматический выключатель должен обеспечивать:
   - Защиту от короткого замыкания (электромагнитный расцепитель)
   - Защиту от перегрузки (тепловой расцепитель)
• Пример: Для розеточной группы 2.5 мм² → автомат 16 А.

🔹 Глава 7.1 — Электрооборудование жилых зданий
• Розетки защищаются УЗО 30 мА.
• Освещение — можно без УЗО, но рекомендуется.
• Сечение кабеля:
   - Освещение: 1.5 мм²
   - Розетки: 2.5 мм²
   - Электроплита: 6 мм²

📌 Практика:
- В деревянном доме — кабель ВВГнг-LS, прокладка в металлической трубе.
- В квартире — штробление, кабель в гофре.

👉 Источник: https://docs.cntd.ru/document/1200092693`);
}

function showGOST50571() {
    alert(`📘 ГОСТ Р 50571 — Электроустановки зданий (серия стандартов)

🔹 Раздел 4-41: Защита от поражения электрическим током
• Требуется УЗО (ВДТ) для:
   - Розеток до 32 А (в жилых, детских, ванных)
   - Наружного освещения
   - Подвалов и влажных помещений
• Номинал УЗО: 30 мА (для защиты человека)

🔹 Раздел 5-52: Выбор и монтаж кабелей
• Допустимый ток зависит от:
   - Сечения
   - Метода прокладки (в трубе, в воздухе, в земле)
   - Температуры окружающей среды
• Пример: Кабель ВВГ 2.5 мм² — до 25 А (при прокладке в воздухе)

🔹 Раздел 8-82: Энергоэффективность
• Рекомендации по выбору LED-освещения
• Учёт потерь в кабелях
• Оптимизация схемы питания

📌 Применение:
- При проектировании щитов
- При модернизации электропроводки
- В строительстве новых зданий

👉 Официальный текст: https://docs.cntd.ru/document/1200092693`);
}

function showGOST2702() {
    alert(`📘 ГОСТ 2.702-2011 — Правила выполнения электрических схем

🔹 Что регулирует:
• Формат оформления схем
• Условные обозначения
• Правила нанесения позиционных обозначений
• Типы схем: структурные, функциональные, принципиальные, монтажные

🔹 Основные обозначения:
• QF — автоматический выключатель
• KM — магнитный пускатель
• FU — предохранитель
• SB — кнопка
• HL — лампа
• SA — переключатель

🔹 Правила:
• Линии связи — сплошные, без разрывов
• Пересечения — с точкой (соединение), без точки — пересечение
• Надписи — чёткие, без сокращений
• Потенциалы (L1, L2, L3, N, PE) — подписываются

📌 Пример:
Схема щита:
QF1 — вводной автомат
QF2 — розетки
QF3 — освещение
→ Все с подписями и нумерацией

👉 Официальный текст: https://docs.cntd.ru/document/1200089517`);
}

function showGOST121004() {
    alert(`📘 ГОСТ 12.1.004-91 — Пожарная безопасность при эксплуатации электроустановок

🔹 Основные требования:
• Запрещено использовать горючие кабели (ПУНП, ПУГНП)
• Обязательно применение негорючих кабелей: ВВГнг-LS, NYM
• Запрещена прокладка кабелей в деревянных конструкциях без защиты

🔹 Требования к прокладке:
• В деревянных домах — кабель в металлической трубе или коробе
• В штробах — заделка огнестойким составом
• Отступ от деревянных поверхностей — не менее 10 мм

🔹 Температурные режимы:
• Длительная допустимая температура: +70 °C
• При перегрузке — не более +90 °C
• При КЗ — не более +160 °C

📌 Практика:
- В бане, сауне — кабель с термостойкой изоляцией (например, ПВКВ)
- В квартире — ВВГнг-LS в гофре

👉 Официальный текст: https://docs.cntd.ru/document/1200003710`);
}

function showGOST50571_5_52() {
    alert(`📘 ГОСТ Р 50571.5.52-2011 — Выбор и монтаж кабелей

🔹 Методы прокладки:
• В трубах ПНД, металлорукаве, гофре
• В кабельных каналах
• Открыто по стенам (в плинтусах, лотках)
• В земле (в защитной трубе)

🔹 Минимальные радиусы изгиба:
• Для кабеля 3×2.5 мм² — не менее 5 внешних диаметров
• Пример: Если Ø = 8 мм → радиус ≥ 40 мм

🔹 Расчёт сечения:
• По допустимому току (в зависимости от нагрузки)
• По потере напряжения (не более 5%)
• По механической прочности (мин. 1.5 мм² для освещения)

🔹 Пример расчёта:
Нагрузка: 3.5 кВт (розетки на кухне)
Ток: I = P/U = 3500 / 220 ≈ 16 А
→ Выбираем кабель 2.5 мм² и автомат 16 А

📌 Важно:
- Не используй алюминиевый кабель в жилых помещениях (ПУЭ запрещает)
- Все соединения — только в распредкоробках

👉 Официальный текст: https://docs.cntd.ru/document/1200092694`);
}

// === Чат с ИИ ===
function askAI() {
    const aiInput = document.getElementById('ai-input');
    const chatBox = document.getElementById('ai-chat');
    const query = aiInput?.value.trim();

    if (!query) return;

    // Добавляем сообщение пользователя
    const userMsg = document.createElement('div');
    userMsg.className = 'user-message';
    userMsg.textContent = query;
    chatBox.appendChild(userMsg);

    // Очищаем поле ввода
    aiInput.value = '';

    // Прокручиваем вниз
    chatBox.scrollTop = chatBox.scrollHeight;

    // Добавляем "печатающий" эффект
    const botMsg = document.createElement('div');
    botMsg.className = 'bot-message';
    botMsg.textContent = '🧠 Пишу...';
    chatBox.appendChild(botMsg);

    // Прокрутка
    chatBox.scrollTop = chatBox.scrollHeight;

    // Ответ через задержку
    setTimeout(() => {
        const lower = query.toLowerCase();
        let answer = "";

        if (lower.includes('лампа') || lower.includes('свет')) {
            answer = "💡 Вот схема подключения лампы:\n\n" +
                     "• Фаза → Выключатель → Лампа → Ноль\n" +
                     "• Сечение кабеля: 1.5 мм² (ПУЭ п. 7.1.35)\n" +
                     "• Автомат: 10 А (тип B)\n" +
                     "• Заземление не требуется (если не металлический корпус)";
        }
        else if (lower.includes('розетка')) {
            answer = "🔌 Подключение розетки:\n\n" +
                     "• Фаза → Автомат 16 А → Розетка\n" +
                     "• Ноль → Розетка\n" +
                     "• Земля → Розетка (обязательно! ПУЭ п. 1.7.144)\n" +
                     "• Сечение: 2.5 мм² медный кабель";
        }
        else if (lower.includes('двигатель') || lower.includes('мотор')) {
            answer = "⚙️ Подключение трёхфазного двигателя:\n\n" +
                     "• Схема: «звезда» или «треугольник»\n" +
                     "• Тепловое реле + магнитный пускатель\n" +
                     "• Защита: автомат + УЗО 30 мА\n" +
                     "• Сечение: 4 мм² (для 5.5 кВт)";
        }
        else if (lower.includes('заземление')) {
            answer = "⚡ Заземление — обязательно!\n\n" +
                     "• ПУЭ п. 1.7.5 — все металлические корпуса должны быть заземлены\n" +
                     "• Используйте провод PE жёлто-зелёного цвета\n" +
                     "• Сопротивление контура — не более 4 Ом (для 220 В)";
        }
        else if (lower.includes('узо') || lower.includes('узо')) {
            answer = "🛡️ УЗО (устройство защитного отключения)\n\n" +
                     "• Устанавливается для защиты от утечки тока\n" +
                     "• Номинал: 30 мА для жилых помещений\n" +
                     "• Обязательно в ванных, кухнях, наружных установках\n" +
                     "• ПУЭ п. 7.1.73 — требование к установке УЗО";
        }
        else {
            answer = "📌 Я не нашёл точного совпадения, но вот общие правила:\n\n" +
                     "• Все цепи должны быть защищены автоматами.\n" +
                     "• Заземление обязательно для розеток и металлических корпусов.\n" +
                     "• Используйте кабель ВВГнг-LS.\n" +
                     "• См. ПУЭ глава 7, ГОСТ Р 50571.";
        }

        botMsg.textContent = answer;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 800);
}

// === Управление модальным окном ИИ ===
const aiBtn = document.getElementById('ai-btn');
const aiModal = document.getElementById('ai-modal');

if (aiBtn && aiModal) {
    aiBtn.addEventListener('click', () => {
        aiModal.style.display = 'block';
        document.getElementById('ai-input')?.focus();
    });

    window.closeAIModal = () => {
        aiModal.style.display = 'none';
    };

    // Закрытие при клике вне
    window.addEventListener('click', (e) => {
        if (e.target === aiModal) {
            closeAIModal();
        }
    });
}