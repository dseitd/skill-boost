// Функционал табов
document.addEventListener('DOMContentLoaded', () => {
    // Обработка навигации по вкладкам
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.profile-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Убираем активный класс у всех кнопок и секций
            navItems.forEach(btn => btn.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));

            // Добавляем активный класс выбранной кнопке и секции
            item.classList.add('active');
            const targetSection = document.getElementById(item.dataset.tab);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // Обработка загрузки аватара
    const editAvatarBtn = document.querySelector('.edit-avatar');
    const avatarImg = document.querySelector('.avatar-image');

    if (avatarImg) {
        // Обработка ошибок загрузки изображения
        avatarImg.addEventListener('error', function() {
            console.error('Ошибка загрузки аватара');
            this.src = 'https://via.placeholder.com/120'; // Fallback изображение
            showNotification('Ошибка загрузки аватара', 'error');
        });

        // Подтверждение успешной загрузки
        avatarImg.addEventListener('load', function() {
            console.log('Аватар успешно загружен');
        });
    }

    if (editAvatarBtn && avatarImg) {
        editAvatarBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*,.gif';

            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    // Проверяем размер файла (максимум 5MB)
                    if (file.size > 5 * 1024 * 1024) {
                        showNotification('Файл слишком большой. Максимальный размер: 5MB', 'error');
                        return;
                    }

                    const reader = new FileReader();
                    reader.onload = (e) => {
                        avatarImg.src = e.target.result;
                        localStorage.setItem('userAvatar', e.target.result);
                        showNotification('Аватар успешно обновлен');
                    };
                    reader.onerror = () => {
                        showNotification('Ошибка при загрузке файла', 'error');
                    };
                    reader.readAsDataURL(file);
                }
            });

            input.click();
        });
    }

    // Загружаем сохраненный аватар при загрузке страницы
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar && avatarImg) {
        avatarImg.src = savedAvatar;
    }

    // Проверяем загрузку текущего аватара
    if (avatarImg) {
        console.log('Текущий путь к аватару:', avatarImg.src);
        if (!avatarImg.complete) {
            console.log('Аватар загружается...');
        }
    }

    // Обработка фильтрации курсов
    const courseFilter = document.querySelector('.course-status-filter');
    const courseCards = document.querySelectorAll('.course-card');

    if (courseFilter) {
        courseFilter.addEventListener('change', (e) => {
            const selectedValue = e.target.value;
            
            courseCards.forEach(card => {
                const progress = parseInt(card.querySelector('.progress-bar').style.width);
                
                switch(selectedValue) {
                    case 'active':
                        card.style.display = progress < 100 ? 'block' : 'none';
                        break;
                    case 'completed':
                        card.style.display = progress === 100 ? 'block' : 'none';
                        break;
                    default:
                        card.style.display = 'block';
                }
            });
        });
    }

    // Обработка формы настроек
    const settingsForm = document.querySelector('.settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Собираем данные формы
            const formData = {
                fullName: settingsForm.querySelector('#fullName').value,
                email: settingsForm.querySelector('#email').value,
                phone: settingsForm.querySelector('#phone').value,
                bio: settingsForm.querySelector('#bio').value,
                notifications: Array.from(settingsForm.querySelectorAll('input[type="checkbox"]'))
                    .map(checkbox => ({
                        type: checkbox.nextElementSibling.textContent,
                        enabled: checkbox.checked
                    }))
            };

            // Здесь можно добавить логику для отправки данных на сервер
            console.log('Сохраняем настройки:', formData);

            // Показываем уведомление об успешном сохранении
            showNotification('Настройки успешно сохранены');
        });
    }

    // Обработка изменения обложки профиля
    const editCoverBtn = document.querySelector('.edit-cover');
    const profileCover = document.querySelector('.profile-cover');

    if (editCoverBtn && profileCover) {
        editCoverBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';

            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        profileCover.style.backgroundImage = `url(${e.target.result})`;
                        profileCover.style.backgroundSize = 'cover';
                        profileCover.style.backgroundPosition = 'center';
                    };
                    reader.readAsDataURL(file);
                }
            });

            input.click();
        });
    }

    // График активности
    const chartContainer = document.querySelector('.chart-container');
    if (chartContainer) {
        // Подключаем Chart.js если еще не подключен
        if (!window.Chart) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = initActivityChart;
            document.head.appendChild(script);
        } else {
            initActivityChart();
        }
    }

    function initActivityChart() {
        // Генерируем тестовые данные
        const dates = Array.from({length: 30}, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            return date.toLocaleDateString('ru-RU', {day: '2-digit', month: '2-digit'});
        });

        const hours = Array.from({length: 30}, () => Math.floor(Math.random() * 6));

        const ctx = chartContainer.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Часов обучения',
                    data: hours,
                    backgroundColor: 'rgba(142, 255, 0, 0.2)',
                    borderColor: 'rgba(142, 255, 0, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Обработка категорий достижений
    const achievementCategories = document.querySelectorAll('.category-btn');
    const achievementCards = document.querySelectorAll('.achievement-card');

    achievementCategories.forEach(category => {
        category.addEventListener('click', () => {
            // Убираем активный класс у всех категорий
            achievementCategories.forEach(cat => cat.classList.remove('active'));
            // Добавляем активный класс выбранной категории
            category.classList.add('active');

            const selectedCategory = category.textContent.toLowerCase();

            // Фильтруем достижения
            achievementCards.forEach(card => {
                if (selectedCategory === 'все') {
                    card.style.display = 'flex';
                } else {
                    // Здесь нужно добавить логику фильтрации по категориям
                    // Например, проверять data-атрибут с категорией
                    const cardCategory = card.dataset.category;
                    card.style.display = cardCategory === selectedCategory ? 'flex' : 'none';
                }
            });
        });
    });

    // Обработка табов настроек
    const settingsTabs = document.querySelectorAll('.settings-tab');
    const settingsPanels = document.querySelectorAll('.settings-panel');

    settingsTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Убираем активный класс у всех табов и панелей
            settingsTabs.forEach(t => t.classList.remove('active'));
            settingsPanels.forEach(p => p.classList.remove('active'));

            // Добавляем активный класс выбранному табу и панели
            tab.classList.add('active');
            const targetPanel = document.getElementById(`${tab.dataset.settings}-settings`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // Обработка формы безопасности
    const securityForm = document.querySelector('#security-settings form');
    if (securityForm) {
        securityForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const currentPassword = securityForm.querySelector('#currentPassword').value;
            const newPassword = securityForm.querySelector('#newPassword').value;
            const confirmPassword = securityForm.querySelector('#confirmPassword').value;
            const twoFactorEnabled = securityForm.querySelector('#2fa').checked;

            // Проверка паролей
            if (newPassword !== confirmPassword) {
                showNotification('Пароли не совпадают', 'error');
                return;
            }

            // Здесь должна быть логика обновления настроек безопасности
            console.log('Обновление настроек безопасности:', {
                currentPassword,
                newPassword,
                twoFactorEnabled
            });

            showNotification('Настройки безопасности обновлены');
            securityForm.reset();
        });
    }

    // Обработка настроек приватности
    const privacyForm = document.querySelector('#privacy-settings form');
    if (privacyForm) {
        privacyForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const visibility = privacyForm.querySelector('.profile-visibility').value;
            const privacySettings = Array.from(privacyForm.querySelectorAll('.privacy-settings input[type="checkbox"]'))
                .map(checkbox => ({
                    feature: checkbox.nextElementSibling.textContent,
                    visible: checkbox.checked
                }));

            // Здесь должна быть логика обновления настроек приватности
            console.log('Обновление настроек приватности:', {
                visibility,
                privacySettings
            });

            showNotification('Настройки приватности обновлены');
        });
    }

    // Улучшенная функция показа уведомлений
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Стили для уведомления
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.background = type === 'success' ? 'var(--accent-color)' : '#ff4444';
        notification.style.color = 'var(--primary-color)';
        notification.style.padding = '12px 24px';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        notification.style.zIndex = '1000';
        notification.style.animation = 'slideIn 0.3s ease, fadeOut 0.3s ease 2.7s';

        document.body.appendChild(notification);

        // Удаляем уведомление через 3 секунды
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Обработка кнопок действий с сертификатами
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const certificateCard = this.closest('.certificate-card');
            const certificateName = certificateCard.querySelector('h3').textContent;
            // Здесь можно добавить логику для скачивания сертификата
            console.log(`Скачивание сертификата: ${certificateName}`);
        });
    });

    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const certificateCard = this.closest('.certificate-card');
            const certificateName = certificateCard.querySelector('h3').textContent;
            // Здесь можно добавить логику для шаринга сертификата
            console.log(`Шаринг сертификата: ${certificateName}`);
        });
    });

    // Обработка продолжения курса
    document.querySelectorAll('.continue-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const courseCard = this.closest('.course-card');
            const courseName = courseCard.querySelector('h3').textContent;
            // Здесь можно добавить логику для перехода к последнему уроку курса
            console.log(`Продолжение курса: ${courseName}`);
        });
    });

    // Обработка ошибок загрузки изображений
    document.querySelectorAll('.course-image img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = '@placeholder.png';
        });
    });
});

// Загрузка избранных курсов
function loadFavorites() {
    const favoritesGrid = document.querySelector('.favorites-grid');
    if (!favoritesGrid) return;

    // Получаем избранные курсы из localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (favorites.length === 0) {
        favoritesGrid.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                    <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <h3>Нет избранных курсов</h3>
                <p>Добавьте курсы в избранное, чтобы они отображались здесь</p>
            </div>
        `;
        favoritesGrid.style.display = 'flex';
        favoritesGrid.style.alignItems = 'center';
        favoritesGrid.style.justifyContent = 'center';
        favoritesGrid.style.minHeight = '300px';
        return;
    }

    // Отображаем избранные курсы
    favoritesGrid.innerHTML = favorites.map(course => `
        <div class="course-card">
            <div class="course-image">
                <img src="${course.image}" alt="${course.title}">
            </div>
            <div class="course-content">
                <h3>${course.title}</h3>
                <div class="course-meta">
                    <span class="lessons-count">${course.lessons} уроков</span>
                    <span class="duration">${course.duration}</span>
                </div>
                <a href="course.html?id=${course.id}" class="continue-button">Перейти к курсу</a>
            </div>
        </div>
    `).join('');
}

// Загружаем избранные курсы при открытии соответствующей вкладки
document.querySelector('[data-tab="favorites"]')?.addEventListener('click', loadFavorites); 