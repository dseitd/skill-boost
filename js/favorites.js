// Система управления избранными курсами
const Favorites = {
    items: JSON.parse(localStorage.getItem('favorites') || '[]'),

    // Инициализация системы избранного
    init() {
        this.updateFavoritesDisplay();
        this.bindEvents();
    },

    // Добавление/удаление курса из избранного
    toggle(courseData) {
        const courseId = courseData.id;
        const existingIndex = this.items.findIndex(item => item.id === courseId);
        
        if (existingIndex === -1) {
            // Добавляем в избранное
            this.items.push({
                ...courseData,
                addedToFavoritesAt: new Date().toISOString()
            });
            this.showNotification('Курс добавлен в избранное!', 'success');
        } else {
            // Удаляем из избранного
            this.items.splice(existingIndex, 1);
            this.showNotification('Курс удален из избранного', 'info');
        }
        
        this.saveFavorites();
        this.updateFavoritesDisplay();
        return existingIndex === -1; // возвращаем true если добавили, false если удалили
    },

    // Проверка, находится ли курс в избранном
    isFavorite(courseId) {
        return this.items.some(item => item.id === courseId);
    },

    // Получение всех избранных курсов
    getFavorites() {
        return this.items.sort((a, b) => 
            new Date(b.addedToFavoritesAt) - new Date(a.addedToFavoritesAt)
        );
    },

    // Сохранение в localStorage
    saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(this.items));
    },

    // Обновление отображения кнопок избранного
    updateFavoritesDisplay() {
        const bookmarkButtons = document.querySelectorAll('.bookmark-button');
        bookmarkButtons.forEach(button => {
            const courseId = this.extractCourseIdFromButton(button);
            if (courseId && this.isFavorite(courseId)) {
                button.classList.add('active');
                button.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"/>
                    </svg>
                `;
            } else {
                button.classList.remove('active');
                button.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
            }
        });
    },

    // Извлечение ID курса из кнопки
    extractCourseIdFromButton(button) {
        const onClickAttr = button.getAttribute('onclick');
        if (onClickAttr) {
            const match = onClickAttr.match(/toggleBookmark\(['"]([^'"]+)['"]\)/);
            return match ? match[1] : null;
        }
        return null;
    },

    // Привязка событий
    bindEvents() {
        // Глобальная функция для toggle bookmark
        window.toggleBookmark = (courseId, event) => {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            // Получаем данные курса
            const courseCard = document.querySelector(`[data-course-id="${courseId}"]`);
            const courseData = this.extractCourseData(courseCard, courseId);
            
            const wasAdded = this.toggle(courseData);
            
            // Обновляем кнопку
            const button = event ? event.currentTarget : document.querySelector(`[onclick*="toggleBookmark('${courseId}')"]`);
            if (button) {
                if (wasAdded) {
                    button.classList.add('active');
                    button.innerHTML = `
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"/>
                        </svg>
                    `;
                } else {
                    button.classList.remove('active');
                    button.innerHTML = `
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    `;
                }
            }
        };

        // Добавляем глобальную функцию для добавления в корзину из избранного
        window.addToCartFromFavorites = (courseId) => {
            this.addToCartFromFavorites(courseId);
        };
    },

    // Извлечение данных курса из DOM
    extractCourseData(courseCard, courseId) {
        if (!courseCard) {
            // Базовые данные если карточка не найдена
            return {
                id: courseId,
                title: 'Неизвестный курс',
                price: 0,
                image: 'images/placeholder.png',
                description: 'Описание недоступно'
            };
        }

        const title = courseCard.querySelector('h3')?.textContent || 'Неизвестный курс';
        const priceElement = courseCard.querySelector('.current-price');
        const price = priceElement ? parseInt(priceElement.textContent.replace(/\D/g, '')) : 0;
        const image = courseCard.querySelector('img')?.src || 'images/placeholder.png';
        const description = courseCard.querySelector('.course-description')?.textContent || 'Качественный курс для развития';

        return {
            id: courseId,
            title,
            price,
            image,
            description
        };
    },

    // Показ уведомлений
    showNotification(message, type = 'success') {
        // Используем систему уведомлений из корзины если доступна
        if (window.Cart && typeof Cart.showNotification === 'function') {
            Cart.showNotification(message, type);
            return;
        }

        // Простая альтернативная система уведомлений
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--card-bg);
            color: var(--text-primary);
            padding: 12px 20px;
            border-radius: 8px;
            border: 2px solid var(--accent-color);
            z-index: 1000;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Анимация появления
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Удаление через 3 секунды
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    // Рендер избранных курсов для страницы профиля
    renderFavoritesInProfile() {
        const favoritesContainer = document.querySelector('#favorites .favorites-grid');
        if (!favoritesContainer) return;

        const favorites = this.getFavorites();
        
        if (favorites.length === 0) {
            favoritesContainer.innerHTML = `
                <div class="empty-favorites">
                    <div class="empty-icon">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"/>
                        </svg>
                        <div class="pulse-ring"></div>
                    </div>
                    <h3>Избранные курсы отсутствуют</h3>
                    <p>Добавьте интересные курсы в избранное, и они появятся здесь</p>
                    <a href="courses.html" class="browse-courses-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                            <path d="M2 17L12 22L22 17"/>
                            <path d="M2 12L12 17L22 12"/>
                        </svg>
                        Изучить курсы
                    </a>
                </div>
            `;
            return;
        }

        favoritesContainer.innerHTML = favorites.map((course, index) => `
            <div class="favorite-course" data-course-id="${course.id}" style="animation-delay: ${index * 0.1}s">
                <div class="favorite-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"/>
                    </svg>
                </div>
                <div class="course-image">
                    <img src="${course.image}" alt="${course.title}" onerror="this.src='images/placeholder.png'">
                    <div class="course-overlay">
                        <button class="quick-preview-btn" title="Предпросмотр">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </button>
                    </div>
                    <div class="course-category">
                        ${this.getCourseCategory(course.id)}
                    </div>
                </div>
                <div class="course-content">
                    <div class="course-header">
                        <h3>${course.title}</h3>
                        <button class="remove-favorite-btn" onclick="Favorites.removeFromProfile('${course.id}')" title="Удалить из избранного">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 6H5H21"/>
                                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"/>
                            </svg>
                        </button>
                    </div>
                    <p class="course-description">${course.description}</p>
                    <div class="course-meta">
                        <div class="course-stats">
                            <span class="course-level">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 20V10"/>
                                    <path d="M18 20V4"/>
                                    <path d="M6 20V16"/>
                                </svg>
                                Продвинутый
                            </span>
                            <span class="course-duration">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="M12 6V12L16 14"/>
                                </svg>
                                ${this.getRandomDuration()} ч
                            </span>
                        </div>
                        <div class="course-price-block">
                            <span class="course-price">${course.price.toLocaleString()} ₽</span>
                        </div>
                    </div>
                    <div class="course-actions">
                        <button class="start-course-btn" onclick="window.location.href='course-details.html?id=${course.id}'">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M8 5V19L19 12L8 5Z"/>
                            </svg>
                            Начать изучение
                        </button>
                        <button class="add-to-cart-btn" onclick="addToCartFromFavorites('${course.id}')">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"/>
                                <path d="M3 6H21"/>
                                <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"/>
                            </svg>
                            В корзину
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    // Получение категории курса (простая функция для демонстрации)
    getCourseCategory(courseId) {
        const categories = {
            'blender-2023': 'Дизайн',
            'javascript-pro': 'Программирование', 
            'python-pro': 'Программирование',
            'java-spring': 'Программирование',
            'cpp-game-dev': 'Разработка игр',
            'react-typescript': 'Web-разработка',
            'python-data-science': 'Data Science'
        };
        return categories[courseId] || 'Обучение';
    },

    // Генерация случайной продолжительности курса
    getRandomDuration() {
        const durations = [12, 18, 24, 32, 40, 56, 72];
        return durations[Math.floor(Math.random() * durations.length)];
    },

    // Добавление в корзину из избранного
    addToCartFromFavorites(courseId) {
        const course = this.items.find(item => item.id === courseId);
        if (course && window.Cart) {
            Cart.addItem(course);
            
            // Обновляем кнопку
            const button = event.currentTarget;
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17L4 12"/>
                </svg>
                Добавлено
            `;
            button.classList.add('added');
            button.disabled = true;
            
            setTimeout(() => {
                button.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"/>
                        <path d="M3 6H21"/>
                        <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"/>
                    </svg>
                    В корзину
                `;
                button.classList.remove('added');
                button.disabled = false;
            }, 2000);
        }
    },

    // Удаление курса из избранного (для профиля)
    removeFromProfile(courseId) {
        const courseData = this.items.find(item => item.id === courseId);
        if (courseData) {
            this.toggle(courseData);
            this.renderFavoritesInProfile();
        }
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    Favorites.init();
    
    // Если мы на странице профиля, рендерим избранное
    if (document.querySelector('.profile-main')) {
        setTimeout(() => {
            Favorites.renderFavoritesInProfile();
        }, 100);
    }
});

// Глобальные функции
window.addToCartFromFavorites = function(courseId) {
    Favorites.addToCartFromFavorites(courseId);
}; 