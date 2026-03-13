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

    // === Генерация QR-кода в сайдбаре ===
    const sidebarQR = document.getElementById('sidebar-qrcode');
    if (sidebarQR && typeof QRious !== 'undefined') {
        const canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = 120;
        sidebarQR.innerHTML = '';
        sidebarQR.appendChild(canvas);

        new QRious({
            element: canvas,
            value: window.location.href,
            size: 120,
            level: 'H',
            background: '#fff',
            foreground: '#4a6fa5'
        });
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

    if (aiBtn && aiModal) {
        aiBtn.addEventListener('click', () => {
            aiModal.style.display = 'block';
            aiInput.focus();
        });

        window.closeAIModal = () => {
            aiModal.style.display = 'none';
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

    // === Профиль и лента: все функции внутри DOMContentLoaded ===
    window.openProfileModal = function() {
        const modal = document.getElementById('profile-modal');
        if (modal) {
            updateProfile();
            modal.style.display = 'block';
        }
    };

    window.closeProfileModal = function() {
        const modal = document.getElementById('profile-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    };

    function updateProfile() {
        document.getElementById('profile-name').textContent = 'Reberto';

        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                document.getElementById('profile-ip').textContent = data.ip;
            })
            .catch(() => {
                document.getElementById('profile-ip').textContent = 'Не удалось загрузить';
            });

        const userAgent = navigator.userAgent;
        let browser = 'Неизвестно';
        if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) browser = 'Chrome';
        else if (userAgent.includes('Firefox')) browser = 'Firefox';
        else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
        else if (userAgent.includes('Edg')) browser = 'Edge';
        document.getElementById('profile-browser').textContent = browser;

        let os = 'Неизвестно';
        if (userAgent.includes('Win')) os = 'Windows';
        else if (userAgent.includes('Mac')) os = 'macOS';
        else if (userAgent.includes('Linux')) os = 'Linux';
        else if (userAgent.includes('Android')) os = 'Android';
        else if (userAgent.includes('iPhone')) os = 'iOS';
        document.getElementById('profile-os').textContent = os;

        document.getElementById('profile-resolution').textContent = `${window.innerWidth} × ${window.innerHeight}`;
        const theme = document.body.getAttribute('data-theme') === 'dark' ? 'Тёмная' : 'Светлая';
        document.getElementById('profile-theme').textContent = theme;

        updateAIHistory();
    }

    function updateAIHistory() {
        const history = JSON.parse(localStorage.getItem('aiHistory')) || [];
        const list = document.getElementById('ai-history');
        if (history.length === 0) {
            list.innerHTML = '<li>Пока нет запросов</li>';
            return;
        }
        list.innerHTML = '';
        history.slice(-5).reverse().forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.query;
            list.appendChild(li);
        });
    }

    function saveToHistory(query) {
        const history = JSON.parse(localStorage.getItem('aiHistory')) || [];
        history.push({ query, timestamp: new Date().toISOString() });
        if (history.length > 20) history.shift();
        localStorage.setItem('aiHistory', JSON.stringify(history));
        if (document.getElementById('profile-modal').style.display === 'block') {
            updateAIHistory();
        }
    }

    window.openPostModal = function() {
        const modal = document.createElement('div');
        modal.id = 'post-modal';
        modal.style.position = 'fixed';
        modal.style.top = 0;
        modal.style.left = 0;
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = 9999;

        modal.innerHTML = `
            <div style="background: var(--card-bg); padding: 20px; border-radius: 12px; width: 90%; max-width: 500px; color: var(--text); box-shadow: 0 4px 20px rgba(0,0,0,0.2); border: 1px solid var(--border);">
                <h3>📝 Новый пост</h3>
                <textarea id="post-input" rows="4" placeholder="Что у вас нового? Поделились ли вы схемой? Получилось ли подключить УЗО?" 
                          style="width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg); color: var(--text); margin: 10px 0; resize: vertical;"></textarea>
                <div style="text-align: right;">
                    <button onclick="closePostModal()" style="background: #555; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-right: 10px;">Отмена</button>
                    <button onclick="submitPost()" style="background: var(--button-bg); color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Опубликовать</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('post-input').focus();
    };

    window.closePostModal = function() {
        const modal = document.getElementById('post-modal');
        if (modal) modal.remove();
    };

    window.submitPost = function() {
        const input = document.getElementById('post-input');
        const text = input?.value.trim();
        if (!text) return;

        const feed = JSON.parse(localStorage.getItem('feed')) || [];
        feed.push({
            author: 'Reberto',
            avatar: 'https://http.cat/200',
            content: text,
            timestamp: new Date().toISOString()
        });

        if (feed.length > 50) feed.shift();
        localStorage.setItem('feed', JSON.stringify(feed));
        closePostModal();
        updateFeed();
    };

    function updateFeed() {
        const feedContainer = document.getElementById('feed-container');
        if (!feedContainer) return;

        const feed = JSON.parse(localStorage.getItem('feed')) || [];
        if (feed.length === 0) {
            feedContainer.innerHTML = '<p style="color: #888; font-style: italic;">Пока нет записей. Будьте первым!</p>';
            return;
        }

        feedContainer.innerHTML = '';
        feed.slice(-20).reverse().forEach(item => {
            const time = new Date(item.timestamp).toLocaleString('ru-RU');
            const div = document.createElement('div');
            div.className = 'feed-item';
            div.innerHTML = `
                <div class="feed-item-header">
                    <img src="${item.avatar}" alt="Аватар" class="feed-avatar">
                    <span class="feed-author">${item.author}</span>
                    <span class="feed-time">${time}</span>
                </div>
                <div class="feed-content">${item.content}</div>
            `;
            feedContainer.appendChild(div);
        });
    }

    // Первое обновление ленты
    updateFeed();
});

// === Функции ГОСТОВ и askAI() остаются снаружи — они вызываются по клику
function askAI() {
    const aiInput = document.getElementById('ai-input');
    const chatBox = document.getElementById('ai-chat');
    const query = aiInput?.value.trim();

    if (!query) return;

    const userMsg = document.createElement('div');
    userMsg.className = 'user-message';
    userMsg.textContent = query;
    chatBox.appendChild(userMsg);

    aiInput.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    const botMsg = document.createElement('div');
    botMsg.className = 'bot-message';
    botMsg.textContent = '🧠 Пишу...';
    chatBox.appendChild(botMsg);
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
        const lower = query.toLowerCase();
        let answer = "";

        if (lower.includes('лампа') || lower.includes('свет')) {
            answer = "💡 Вот схема подключения лампы:\n\n• Фаза → Выключатель → Лампа → Ноль\n• Сечение кабеля: 1.5 мм² (ПУЭ п. 7.1.35)\n• Автомат: 10 А (тип B)\n• Заземление не требуется";
        } else if (lower.includes('розетка')) {
            answer = "🔌 Подключение розетки:\n\n• Фаза → Автомат 16 А → Розетка\n• Ноль → Розетка\n• Земля → Розетка (обязательно! ПУЭ п. 1.7.144)\n• Сечение: 2.5 мм² медный кабель";
        } else if (lower.includes('двигатель') || lower.includes('мотор')) {
            answer = "⚙️ Подключение трёхфазного двигателя:\n\n• Схема: «звезда» или «треугольник»\n• Тепловое реле + магнитный пускатель\n• Защита: автомат + УЗО 30 мА\n• Сечение: 4 мм² (для 5.5 кВт)";
        } else if (lower.includes('заземление')) {
            answer = "⚡ Заземление — обязательно!\n\n• ПУЭ п. 1.7.5 — все металлические корпуса должны быть заземлены\n• Используйте провод PE жёлто-зелёного цвета\n• Сопротивление контура — не более 4 Ом";
        } else if (lower.includes('узо') || lower.includes('узо')) {
            answer = "🛡️ УЗО (устройство защитного отключения)\n\n• Устанавливается для защиты от утечки тока\n• Номинал: 30 мА для жилых помещений\n• Обязательно в ванных, кухнях, наружных установках\n• ПУЭ п. 7.1.73 — требование к установке УЗО";
        } else {
            answer = "📌 Я не нашёл точного совпадения, но вот общие правила:\n\n• Все цепи должны быть защищены автоматами.\n• Заземление обязательно для розеток и металлических корпусов.\n• Используйте кабель ВВГнг-LS.\n• См. ПУЭ глава 7, ГОСТ Р 50571.";
        }

        botMsg.textContent = answer;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 800);
}

// Функции ГОСТОВ остаются как есть
// showPUERules(), showGOST50571(), и т.д.