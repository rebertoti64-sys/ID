// === Консоль-приветствие ===
console.log("👋 Привет! 😊");
console.log("💡 Все данные загружаются динамически.");

// === Переключение темы ===
document.addEventListener('DOMContentLoaded', () => {
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

    // === Глобальные переменные ===
    let sidebar = document.getElementById('sidebar');

    // === Функции меню ===
    window.openSidebar = () => {
        if (sidebar) {
            sidebar.classList.add('open');
        } else {
            console.error('❌ #sidebar не найден');
        }
    };

    window.closeSidebar = () => {
        if (sidebar) {
            sidebar.classList.remove('open');
        }
    };

    // Закрытие при клике мимо
    document.addEventListener('click', (e) => {
        const isClickInside = sidebar?.contains(e.target);
        const isClickOnButton = document.querySelector('.open-btn')?.contains(e.target);

        if (!isClickInside && !isClickOnButton && sidebar?.classList.contains('open')) {
            closeSidebar();
        }
    });

    // === Генерация QR-кода ===
    const sidebarQR = document.getElementById('sidebar-qrcode');
    if (sidebarQR && typeof QRious !== 'undefined') {
        const canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = 120;
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

    // === Модальное окно: схемы ===
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
    const aiChat = document.getElementById('ai-chat');

    if (aiBtn && aiModal && aiInput && aiChat) {
        aiBtn.addEventListener('click', () => {
            aiModal.style.display = 'block';
            aiInput.focus();
        });

        window.closeAIModal = () => {
            aiModal.style.display = 'none';
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

            Array.from(items).forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(filter) ? '' : 'none';
            });
        });
    }

    // === Профиль ===
    window.openProfileModal = () => {
        const modal = document.getElementById('profile-modal');
        if (modal) {
            updateProfile();
            modal.style.display = 'block';
        }
    };

    window.closeProfileModal = () => {
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
                document.getElementById('profile-ip').textContent = 'Не удалось';
            });

        const userAgent = navigator.userAgent;
        let browser = 'Chrome';
        if (userAgent.includes('Firefox')) browser = 'Firefox';
        else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
        else if (userAgent.includes('Edg')) browser = 'Edge';
        document.getElementById('profile-browser').textContent = browser;

        let os = 'Windows';
        if (userAgent.includes('Mac')) os = 'macOS';
        else if (userAgent.includes('Linux')) os = 'Linux';
        else if (userAgent.includes('Android')) os = 'Android';
        else if (userAgent.includes('iPhone')) os = 'iOS';
        document.getElementById('profile-os').textContent = os;

        document.getElementById('profile-resolution').textContent = `${window.innerWidth} × ${window.innerHeight}`;
        document.getElementById('profile-theme').textContent = 
            document.body.getAttribute('data-theme') === 'dark' ? 'Тёмная' : 'Светлая';

        updateAIHistory();
    }

    function updateAIHistory() {
        const history = JSON.parse(localStorage.getItem('aiHistory')) || [];
        const list = document.getElementById('ai-history');
        if (history.length === 0) {
            list.innerHTML = '<li>Пока нет</li>';
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

    // === Лента ===
    window.openPostModal = () => {
        const modal = document.createElement('div');
        modal.id = 'post-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;';
        modal.innerHTML = `
            <div style="background:var(--card-bg);padding:20px;border-radius:12px;width:90%;max-width:500px;color:white;">
                <h3>📝 Новый пост</h3>
                <textarea id="post-input" rows="4" placeholder="Что у вас нового?" style="width:100%;padding:10px;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:black;"></textarea>
                <div style="text-align:right;margin-top:10px;">
                    <button onclick="closePostModal()" style="background:#555;padding:8px 16px;border:none;border-radius:6px;cursor:pointer;margin-right:10px;">Отмена</button>
                    <button onclick="submitPost()" style="background:var(--button-bg);padding:8px 16px;border:none;border-radius:6px;cursor:pointer;">Опубликовать</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('post-input').focus();
    };

    window.closePostModal = () => {
        const modal = document.getElementById('post-modal');
        if (modal) modal.remove();
    };

    window.submitPost = () => {
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
            feedContainer.innerHTML = '<p style="color:#888">Пока нет записей</p>';
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

    // Обновляем ленту при загрузке
    updateFeed();
});

// === Чат с ИИ ===
function askAI() {
    const aiInput = document.getElementById('ai-input');
    const aiChat = document.getElementById('ai-chat');
    const query = aiInput?.value.trim();

    if (!query) return;

    const userMsg = document.createElement('div');
    userMsg.className = 'user-message';
    userMsg.textContent = query;
    aiChat.appendChild(userMsg);

    aiInput.value = '';
    aiChat.scrollTop = aiChat.scrollHeight;

    const botMsg = document.createElement('div');
    botMsg.className = 'bot-message';
    botMsg.textContent = '🧠 Пишу...';
    aiChat.appendChild(botMsg);
    aiChat.scrollTop = aiChat.scrollHeight;

    setTimeout(() => {
        const lower = query.toLowerCase();
        let answer = "";

        if (lower.includes('лампа') || lower.includes('свет')) {
            answer = "💡 Схема: Фаза → Выключатель → Лампа → Ноль\n• Кабель: 1.5 мм²\n• Автомат: 10 А";
        } else if (lower.includes('розетка')) {
            answer = "🔌 Розетка: Фаза → Автомат 16 А → Розетка\n• Ноль и Земля — напрямую\n• Обязательно УЗО 30 мА";
        } else if (lower.includes('узо')) {
            answer = "🛡️ УЗО — обязательно для розеток, ванных, кухонь\n• Номинал: 30 мА\n• ПУЭ п. 7.1.73";
        } else {
            answer = "📌 Я помогу с ПУЭ, ГОСТами, схемами. Напиши: «розетка», «лампа», «УЗО»";
        }

        botMsg.textContent = answer;
        aiChat.scrollTop = aiChat.scrollHeight;
    }, 800);

    saveToHistory(query);
}

// === Функции ГОСТОВ ===
function showPUERules() { alert("📘 ПУЭ — подробности в модальном окне"); }
function showGOST50571() { alert("📘 ГОСТ Р 50571 — подробности в модальном окне"); }
function showGOST2702() { alert("📘 ГОСТ 2.702-2011 — подробности в модальном окне"); }
function showGOST121004() { alert("📘 ГОСТ 12.1.004 — подробности в модальном окне"); }
function showGOST50571_5_52() { alert("📘 ГОСТ Р 50571.5.52 — подробности в модальном окне"); }

function showSettings() {
    alert('⚙️ Настройки скоро будут!');
}