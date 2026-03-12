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

// === Работа с ID ===
const btn = document.getElementById('btn');
const userInfo = document.getElementById('user-info');
const copyBtn = document.getElementById('copy-btn');

const USER_ID = '81ca416fa38d1554a71344fb6ca8a5803937fed5c59e3e32040d2401f5935b19';

btn.addEventListener('click', () => {
    userInfo.textContent = 'Твой ID: ' + USER_ID;
    userInfo.style.opacity = 1;
    copyBtn.style.display = 'inline-block';
});

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(USER_ID).then(() => {
        copyBtn.textContent = 'Скопировано!';
        setTimeout(() => {
            copyBtn.textContent = 'Скопировать ID';
        }, 2000);
    }).catch(err => {
        alert('Ошибка копирования: ' + err);
    });
});

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
});

// === Действия в меню ===
function showProfile() {
    alert('👤 Здесь будет профиль');
    closeSidebar();
}

function showSettings() {
    alert('⚙️ Настройки');
    closeSidebar();
}// === Модальное окно — схемы ===
const schemesBtn = document.getElementById('schemes-btn');
const schemesModal = document.getElementById('schemes-modal');

if (schemesBtn && schemesModal) {
    schemesBtn.addEventListener('click', () => {
        schemesModal.style.display = 'block';
    });

    window.closeModal = () => {
        schemesModal.style.display = 'none';
    };

    // Закрытие при клике вне
    window.addEventListener('click', (e) => {
        if (e.target === schemesModal) {
            closeModal();
        }
    });
}// === Управление модальным окном ИИ ===
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

    // Закрытие при клике вне
    window.addEventListener('click', (e) => {
        if (e.target === aiModal) {
            closeAIModal();
        }
    });
}

// === Функция запроса к ИИ (демо-версия) ===
window.askAI = () => {
    const query = aiInput.value.trim();
    if (!query) {
        aiResponse.textContent = 'Введите запрос, например: "лампа с выключателем"';
        return;
    }

    aiResponse.textContent = '🧠 ИИ думает...';

    // Демо-ответ (в реальности здесь будет API)
    setTimeout(() => {
        const lower = query.toLowerCase();

        let answer = "На основе ПУЭ и ГОСТ Р 50571:\n\n";

        if (lower.includes('лампа') || lower.includes('свет')) {
            answer += "💡 Схема подключения лампы:\n";
            answer += "• Фаза → Выключатель → Лампа → Ноль\n";
            answer += "• Сечение кабеля: 1.5 мм² (ПУЭ п. 7.1.35)\n";
            answer += "• Автомат: 10 А (тип B)\n";
            answer += "• Заземление не требуется (если не металлический корпус)\n\n";
        }

        if (lower.includes('розетка')) {
            answer += "🔌 Схема розеточной группы:\n";
            answer += "• Фаза → Автомат 16 А → Розетка\n";
            answer += "• Ноль → Розетка\n";
            answer += "• Земля → Розетка (обязательно! ПУЭ п. 1.7.144)\n";
            answer += "• Сечение: 2.5 мм² медный кабель\n\n";
        }

        if (lower.includes('двигатель') || lower.includes('мотор')) {
            answer += "⚙️ Подключение трёхфазного двигателя:\n";
            answer += "• Схема: «звезда» или «треугольник»\n";
            answer += "• Тепловое реле + магнитный пускатель\n";
            answer += "• Защита: автомат по току + УЗО 30 мА\n";
            answer += "• Сечение: 4 мм² (для 5.5 кВт)\n\n";
        }

        if (answer === "На основе ПУЭ и ГОСТ Р 50571:\n\n") {
            answer += "📌 Я не нашёл точного совпадения, но вот общие правила:\n";
            answer += "• Все цепи должны быть защищены автоматами.\n";
            answer += "• Заземление обязательно для розеток и металлических корпусов.\n";
            answer += "• Используйте кабель ВВГнг-LS.\n";
            answer += "• См. ПУЭ глава 7, ГОСТ Р 50571.";
        }

        aiResponse.textContent = answer;
    }, 1000);
};// === Функции для отображения нормативов ===

function showPUERules() {
    alert(`📘 ПУЭ (Правила устройства электроустановок)

🔹 Глава 1.7 — Заземление и защитные меры безопасности
• П. 1.7.5 — Обязательное заземление металлических корпусов
• П. 1.7.79 — УЗО при напряжении > 50 В переменного тока

🔹 Глава 3.1 — Защита электрических сетей
• Автоматы должны обеспечивать защиту от перегрузки и КЗ

🔹 Глава 7.1 — Электрооборудование жилых зданий
• Розетки должны быть защищены УЗО (30 мА)
• Сечение кабеля: не менее 2.5 мм² для розеток

👉 Источник: https://ru.wikipedia.org/wiki/ПУЭ`);
}

function showGOST50571() {
    alert(`📘 ГОСТ Р 50571 — Электроустановки зданий

• Раздел 4-41 — Защита от поражения электрическим током
• Раздел 5-52 — Выбор и монтаж кабелей
• Раздел 8-82 — Энергоэффективность

📌 Требует применения УЗО в ванных, кухнях, наружных установках.

👉 Официальный текст: https://docs.cntd.ru/document/1200092693`);
}

function showGOST2702() {
    alert(`📘 ГОСТ 2.702-2011 — Правила выполнения электрических схем

• Устанавливает правила оформления
• Обозначения элементов (QF — автомат, KM — пускатель)
• Правила нанесения потенциалов
• Требования к структурным, принципиальным и монтажным схемам

📌 Применяется при проектировании всех типов схем.

👉 Официальный текст: https://docs.cntd.ru/document/1200089517`);
}

function showGOST121004() {
    alert(`📘 ГОСТ 12.1.004-91 — Пожарная безопасность

• Требования к прокладке кабелей
• Запрет на использование горючих материалов
• Требования к огнестойкости кабельных линий

📌 Особенно важен при монтаже в деревянных домах.

👉 Официальный текст: https://docs.cntd.ru/document/1200003710`);
}

function showGOST50571_5_52() {
    alert(`📘 ГОСТ Р 50571.5.52-2011 — Выбор и монтаж кабелей

• Методы прокладки (в трубах, коробах, открыто)
• Минимальные радиусы изгиба
• Температурные режимы
• Расчет сечения по допустимому току

📌 Используется при проектировании электропроводок.

👉 Официальный текст: https://docs.cntd.ru/document/1200092694`);
}