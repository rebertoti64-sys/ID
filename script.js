document.getElementById('btn').addEventListener('click', function () {
    const userInfo = document.getElementById('user-info');

    fetch('user-id.txt')
        .then(response => {
            if (!response.ok) throw new Error('Не удалось загрузить user-id.txt');
            return response.text();
        })
        .then(id => {
            userInfo.textContent = 'Твой ID: ' + id.trim();
            userInfo.style.opacity = 1;
        })
        .catch(error => {
            userInfo.textContent = 'Ошибка: ' + error.message;
            userInfo.style.opacity = 1;
            userInfo.style.color = 'red';
        });
});