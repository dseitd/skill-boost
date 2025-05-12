// Класс для работы с избранными курсами
class Favorites {
    constructor() {
        this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        this.initializeEventListeners();
    }

    // Инициализация обработчиков событий
    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.updateUI();
        });
    }

    // Получить все избранные курсы
    getFavorites() {
        return this.favorites;
    }

    // Добавить курс в избранное
    addToFavorites(course) {
        if (!this.favorites.find(item => item.id === course.id)) {
            this.favorites.push(course);
            this.saveFavorites();
            this.updateUI();
            this.showNotification('Курс добавлен в избранное');
            return true;
        }
        return false;
    }

    // Удалить курс из избранного
    async removeFromFavorites(courseId) {
        const card = document.querySelector(`.favorite-card[data-course-id="${courseId}"]`);
        if (card) {
            // Показываем подтверждение
            if (!await this.showConfirmation('Вы уверены, что хотите удалить курс из избранного?')) {
                return;
            }

            // Анимация удаления
            card.style.transition = 'all 0.3s ease';
            card.style.transform = 'scale(0.9)';
            card.style.opacity = '0';

            setTimeout(() => {
                this.favorites = this.favorites.filter(item => item.id !== courseId);
                this.saveFavorites();
                this.updateUI();
                this.showNotification('Курс удален из избранного');
            }, 300);
        }
    }

    // Показать подтверждение
    showConfirmation(message) {
        return new Promise((resolve) => {
            const result = confirm(message);
            resolve(result);
        });
    }

    // Показать уведомление
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Анимация появления
        setTimeout(() => notification.classList.add('show'), 100);

        // Автоматическое скрытие
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Проверить, находится ли курс в избранном
    isInFavorites(courseId) {
        return this.favorites.some(item => item.id === courseId);
    }

    // Сохранить избранное в localStorage
    saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }

    // Обновить UI на всех страницах
    updateUI() {
        // Обновляем иконки избранного на странице курсов
        document.querySelectorAll('.bookmark-button').forEach(button => {
            const courseId = button.closest('.course-card')?.dataset.courseId;
            if (courseId) {
                if (this.isInFavorites(courseId)) {
                    button.classList.add('active');
                    button.innerHTML = `
                        <svg width="24" height="24">
                            <use href="#icon-bookmark-filled"/>
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
        });

        // Обновляем раздел избранного в профиле
        const favoritesSection = document.querySelector('#favorites .favorites-grid');
        if (favoritesSection) {
            if (this.favorites.length === 0) {
                favoritesSection.innerHTML = `
                    <div class="empty-favorites">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"/>
                        </svg>
                        <h3>В избранном пока пусто</h3>
                        <p>Добавляйте курсы в избранное, чтобы не потерять их</p>
                        <a href="courses.html" class="browse-courses-btn">Перейти к курсам</a>
                    </div>
                `;
            } else {
                favoritesSection.innerHTML = this.favorites.map(course => `
                    <div class="favorite-card" data-course-id="${course.id}">
                        <div class="course-image">
                            <img src="${course.image}" alt="${course.title}" loading="lazy">
                            <button class="remove-favorite" onclick="FavoritesManager.removeFromFavorites('${course.id}')">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M18 6L6 18"></path>
                                    <path d="M6 6L18 18"></path>
                                </svg>
                            </button>
                            <div class="course-badge">В избранном</div>
                        </div>
                        <div class="course-content">
                            <div class="course-info">
                                <h3>${course.title}</h3>
                                <p class="course-description">${course.description}</p>
                            </div>
                            <div class="course-footer">
                                <div class="course-meta">
                                    <div class="course-stats">
                                        <span class="lessons-count">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M12 2L2 7L12 12L22 7L12 2Z"></path>
                                                <path d="M2 17L12 22L22 17"></path>
                                                <path d="M2 12L12 17L22 12"></path>
                                            </svg>
                                            ${course.lessons} уроков
                                        </span>
                                        <span class="course-duration">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <path d="M12 6L12 12L16 14"></path>
                                            </svg>
                                            ${course.duration || '40 часов'}
                                        </span>
                                    </div>
                                </div>
                                <div class="course-actions">
                                    <a href="course-details.html?id=${course.id}" class="view-course-btn">
                                        Подробнее
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M5 12H19"></path>
                                            <path d="M12 5L19 12L12 19"></path>
                                        </svg>
                                    </a>
                                    <a href="course-details.html?id=${course.id}" class="start-btn">
                                        Начать обучение
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
    }
}

// Создаем глобальный экземпляр класса Favorites
const FavoritesManager = new Favorites(); 