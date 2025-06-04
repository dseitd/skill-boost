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
            totalElement.textContent = total.toLocaleString();
            
            // Анимация обновления цены
            totalElement.classList.add('update');
            setTimeout(() => totalElement.classList.remove('update'), 600);
        }
    },

    // Показ уведомления
    showNotification(message, type = 'success') {
        // Удаляем предыдущие уведомления
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    ${type === 'success' ? 
                        '<path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' :
                        '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M15 9L9 15" stroke="currentColor" stroke-width="2"/><path d="M9 9L15 15" stroke="currentColor" stroke-width="2"/>'
                    }
                </svg>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 400);
        }, 3000);
    },

    // Рендер корзины
    renderCart() {
        const cartItems = document.querySelector('.cart-items');
        const emptyMessage = document.querySelector('.cart-empty-message');
        const cartContent = document.querySelector('.cart-content');
        
        if (!cartItems || !emptyMessage || !cartContent) return;

        if (this.items.length === 0) {
            cartContent.style.display = 'none';
            emptyMessage.style.display = 'block';
            return;
        }

        emptyMessage.style.display = 'none';
        cartContent.style.display = 'grid';
        cartItems.innerHTML = '';

        this.items.sort((a, b) => new Date(b.addedAt || Date.now()) - new Date(a.addedAt || Date.now())).forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.dataset.courseId = item.id;
            cartItem.style.animationDelay = `${index * 0.1}s`;
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image || 'images/placeholder.png'}" alt="${item.title}">
                </div>
                <div class="cart-item-info">
                    <h3>${item.title}</h3>
                    <p class="cart-item-description">${item.description || 'Качественный курс для вашего развития'}</p>
                    <div class="cart-item-price">${item.price.toLocaleString()}</div>
                </div>
                <button class="remove-item" onclick="Cart.removeItem('${item.id}')" title="Удалить из корзины">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M2.5 5H17.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M15.8337 5V16.6667C15.8337 17.5 15.0003 18.3333 14.167 18.3333H5.83366C5.00033 18.3333 4.16699 17.5 4.16699 16.6667V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6.66699 5V3.33333C6.66699 2.5 7.50033 1.66667 8.33366 1.66667H11.667C12.5003 1.66667 13.3337 2.5 13.3337 3.33333V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            `;
            cartItems.appendChild(cartItem);
        });

        this.updateCartTotal();
    },

    checkEmptyCart() {
        const cartItems = document.querySelectorAll('.cart-item');
        if (cartItems.length === 0) {
            setTimeout(() => {
                this.renderCart();
            }, 500);
        }
    },

    showAddedToCartNotification() {
        // Анимация счетчика корзины
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.classList.add('animate');
            setTimeout(() => cartIcon.classList.remove('animate'), 500);
        }

        // Показываем уведомление
        this.showNotification('Курс добавлен в корзину!', 'success');
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    Cart.init();
    
    // Если мы на странице корзины, рендерим корзину
    if (document.querySelector('.cart-page')) {
        Cart.renderCart();
        
        // Обработчик для кнопки оформления заказа
        const checkoutButton = document.querySelector('.checkout-button');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', function() {
                if (Cart.items.length === 0) {
                    Cart.showNotification('Корзина пуста! Добавьте курсы для оформления заказа.', 'error');
                    return;
                }
                
                // Здесь будет логика оформления заказа
                Cart.showNotification('Функция оформления заказа будет добавлена позже', 'success');
            });
        }
        
        // Обработчик для кнопки очистки корзины
        const clearButton = document.querySelector('.clear-cart');
        if (clearButton) {
            clearButton.addEventListener('click', function() {
                if (Cart.items.length === 0) {
                    Cart.showNotification('Корзина уже пуста!', 'error');
                    return;
                }
                
                if (confirm('Вы уверены, что хотите очистить корзину?')) {
                    Cart.clearCart();
                    Cart.showNotification('Корзина очищена', 'success');
                }
            });
        }
    }
}); 