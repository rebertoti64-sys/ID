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
let sidebar; // Будет инициализирован при загрузке

// Эти функции должны быть глобальными, чтобы работать в onclick
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
    sidebar = document.getElementById('sidebar'); // Теперь доступно в функциях
    const openBtn = document.querySelector('.open-btn');

    if (!sidebar) {
        console.error('❌ #sidebar не найден. Проверь HTML');
        return;
    }

    // Закрытие при клике мимо
    document.addEventListener('click', (e) => {
        const isClickInside = sidebar.contains(e.target);