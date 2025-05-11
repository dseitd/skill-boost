// Функция для работы с локальным хранилищем
const Cart = {
    items: JSON.parse(localStorage.getItem('cart') || '[]'),

    // Инициализация корзины
    init() {
        this.updateCartCounter();
        this.updateCartTotal();
        this.checkEmptyCart();
    },

    // Добавление товара в корзину
    addItem(item) {
        if (!this.items.find(i => i.id === item.id)) {
            this.items.push(item);
            this.saveCart();
            this.updateCartCounter();
            this.showAddedToCartNotification();
        }
    },

    // Удаление товара из корзины
    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartCounter();
        
        // Обновляем отображение корзины
        const cartItemElement = document.querySelector(`[data-course-id="${itemId}"]`);
        if (cartItemElement) {
            cartItemElement.classList.add('removing');
            setTimeout(() => {
                cartItemElement.remove();
                this.updateCartTotal();
                this.checkEmptyCart();
            }, 300);
        }
    },

    // Очистка корзины
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartCounter();
        
        // Анимируем удаление всех элементов
        const cartItems = document.querySelectorAll('.cart-item');
        cartItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('removing');
            }, index * 100);
        });

        setTimeout(() => {
            this.checkEmptyCart();
        }, cartItems.length * 100 + 300);
    },

    // Сохранение корзины в localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    },

    // Обновление счетчика товаров в корзине
    updateCartCounter() {
        const counter = document.querySelector('.cart-counter');
        if (counter) {
            counter.textContent = this.items.length;
            
            // Анимация обновления счетчика
            counter.classList.add('update');
            setTimeout(() => counter.classList.remove('update'), 300);
        }
    },

    // Обновление общей стоимости корзины
    updateCartTotal() {
        const totalElement = document.querySelector('.cart-total-price');
        if (totalElement) {
            const total = this.items.reduce((sum, item) => sum + item.price, 0);
            totalElement.textContent = `${total.toLocaleString()} ₽`;
            
            // Анимация обновления цены
            totalElement.classList.add('update');
            setTimeout(() => totalElement.classList.remove('update'), 300);
        }
    },

    // Показ уведомления
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    },

    // Рендер корзины
    renderCart() {
        const cartItems = document.querySelector('.cart-items');
        const emptyMessage = document.querySelector('.cart-empty-message');
        const cartContent = document.querySelector('.cart-content');
        
        if (!cartItems || !emptyMessage || !cartContent) return;

        if (this.items.length === 0) {
            cartContent.style.display = 'none';
            emptyMessage.innerHTML = `
                <div class="cart-empty">
                    <svg class="cart-empty-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3H5L5.4 5M5.4 5H21L17 13H7M5.4 5L7 13M7 13L4.707 15.293C4.077 15.923 4.523 17 5.414 17H17M17 17C16.4696 17 15.9609 17.2107 15.5858 17.5858C15.2107 17.9609 15 18.4696 15 19C15 19.5304 15.2107 20.0391 15.5858 20.4142C15.9609 20.7893 16.4696 21 17 21C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19C19 18.4696 18.7893 17.9609 18.4142 17.5858C18.0391 17.2107 17.5304 17 17 17ZM9 19C9 19.5304 8.78929 20.0391 8.41421 20.4142C8.03914 20.7893 7.53043 21 7 21C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19C5 18.4696 5.21071 17.9609 5.58579 17.5858C5.96086 17.2107 6.46957 17 7 17C7.53043 17 8.03914 17.2107 8.41421 17.5858C8.78929 17.9609 9 18.4696 9 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <h2 class="cart-empty-message">Ваша корзина пуста</h2>
                    <p class="cart-empty-description">Добавьте курсы в корзину, чтобы оформить заказ</p>
                    <a href="courses.html" class="return-to-courses">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M15.8337 10H4.16699" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M10.0003 15.8334L4.16699 10L10.0003 4.16669" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Вернуться к курсам
                    </a>
                </div>
            `;
            emptyMessage.style.display = 'block';
            return;
        }

        emptyMessage.style.display = 'none';
        cartContent.style.display = 'flex';
        cartItems.innerHTML = '';

        this.items.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt)).forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.dataset.courseId = item.id;
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-info">
                    <h3>${item.title}</h3>
                    <p class="cart-item-price">${item.price.toLocaleString()} ₽</p>
                </div>
                <button class="remove-item" onclick="Cart.removeItem('${item.id}')">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            `;
            cartItems.appendChild(cartItem);
        });

        this.updateCartTotal();
    },

    checkEmptyCart() {
        const cartContent = document.querySelector('.cart-content');
        const emptyMessage = document.querySelector('.cart-empty-message');
        
        if (this.items.length === 0) {
            if (cartContent) cartContent.style.display = 'none';
            if (emptyMessage) {
                emptyMessage.style.display = 'block';
                emptyMessage.innerHTML = `
                    <div class="empty-cart-content">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                            <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 16M17 13L14.7 16M4.7 16H14.7M4.7 16L3 18H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <h2>Корзина пуста</h2>
                        <p>Добавьте курсы, которые хотите приобрести</p>
                        <a href="courses.html" class="browse-courses-btn">Перейти к курсам</a>
                    </div>
                `;
            }
        }
    },

    showAddedToCartNotification() {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.6666 5L7.49992 14.1667L3.33325 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Курс добавлен в корзину</span>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }, 100);
    }
};

// Инициализация корзины при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    Cart.init();
    
    // Если мы на странице корзины, рендерим её
    if (window.location.pathname.includes('cart.html')) {
        Cart.renderCart();
    }
}); 