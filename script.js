document.addEventListener('DOMContentLoaded', () => {
    // === МОБИЛЬНАЯ ФУНКЦИОНАЛЬНОСТЬ ===
    
    // Создание кнопки мобильного поиска
    function createMobileSearchToggle() {
        if (window.innerWidth <= 480) {
            const icons = document.querySelector('.icons');
            const searchBar = document.querySelector('.search-bar');
            
            // Проверяем, есть ли уже кнопка
            if (!document.querySelector('.mobile-search-toggle')) {
                const searchToggle = document.createElement('button');
                searchToggle.className = 'mobile-search-toggle';
                searchToggle.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
                
                // Вставляем кнопку перед иконками
                icons.insertBefore(searchToggle, icons.firstChild);
                
                // Обработчик клика на кнопку поиска
                searchToggle.addEventListener('click', () => {
                    searchBar.classList.toggle('mobile-active');
                    
                    // Фокус на input при открытии
                    if (searchBar.classList.contains('mobile-active')) {
                        setTimeout(() => {
                            searchBar.querySelector('input').focus();
                        }, 300);
                    }
                });
                
                // Закрытие поиска при клике вне его
                document.addEventListener('click', (e) => {
                    if (!searchBar.contains(e.target) && !searchToggle.contains(e.target)) {
                        searchBar.classList.remove('mobile-active');
                    }
                });
            }
        } else {
            // Удаляем кнопку на больших экранах
            const mobileToggle = document.querySelector('.mobile-search-toggle');
            if (mobileToggle) {
                mobileToggle.remove();
            }
            
            // Убираем mobile-active класс
            const searchBar = document.querySelector('.search-bar');
            if (searchBar) {
                searchBar.classList.remove('mobile-active');
            }
        }
    }
    
    // Touch-события для карточек
    function addTouchEvents() {
        const cards = document.querySelectorAll('.category-card');
        
        cards.forEach(card => {
            let touchStartTime = 0;
            
            card.addEventListener('touchstart', (e) => {
                touchStartTime = Date.now();
                card.style.transform = 'scale(0.98)';
                card.style.transition = 'transform 0.1s ease';
            });
            
            card.addEventListener('touchend', (e) => {
                const touchEndTime = Date.now();
                const touchDuration = touchEndTime - touchStartTime;
                
                card.style.transform = 'scale(1)';
                card.style.transition = 'transform 0.3s ease';
                
                // Если это быстрый тап (не долгое нажатие)
                if (touchDuration < 500) {
                    // Получаем ссылку из карточки
                    const link = card.querySelector('a[href]');
                    if (link && !e.defaultPrevented) {
                        setTimeout(() => {
                            window.location.href = link.href;
                        }, 100);
                    }
                }
            });
            
            card.addEventListener('touchcancel', () => {
                card.style.transform = 'scale(1)';
                card.style.transition = 'transform 0.3s ease';
            });
        });
    }
    
    // Улучшенная прокрутка для мобильных
    function improveMobileScrolling() {
        // Добавляем momentum scrolling для iOS
        document.body.style.webkitOverflowScrolling = 'touch';
        
        // Предотвращаем bounce эффект на iOS
        document.addEventListener('touchmove', (e) => {
            if (e.target.closest('.search-results') || e.target.closest('.mobile-active')) {
                return; // Разрешаем скролл в результатах поиска
            }
            
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            const clientHeight = document.documentElement.clientHeight || window.innerHeight;
            
            // Если на самом верху или внизу страницы, предотвращаем скролл
            if ((scrollTop === 0 && e.touches[0].clientY > 0) || 
                (scrollTop + clientHeight >= scrollHeight && e.touches[0].clientY < 0)) {
                // Не предотвращаем, позволяем нативное поведение
            }
        }, { passive: false });
    }
    
    // Адаптивные размеры изображений
    function handleImageLoading() {
        const images = document.querySelectorAll('.course-image img');
        
        images.forEach(img => {
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
            
            img.addEventListener('error', () => {
                img.src = 'images/placeholder.png';
                img.style.opacity = '0.7';
            });
            
            // Lazy loading для изображений
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');
                                imageObserver.unobserve(img);
                            }
                        }
                    });
                });
                
                if (img.dataset.src) {
                    imageObserver.observe(img);
                }
            }
        });
    }
    
    // Обработчик изменения размера окна
    function handleResize() {
        createMobileSearchToggle();
        
        // Пересчитываем высоты для мобильной верстки
        if (window.innerWidth <= 480) {
            document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
        }
        
        // Переинициализируем touch события
        addTouchEvents();
    }
    
    // Инициализация при загрузке
    createMobileSearchToggle();
    addTouchEvents();
    improveMobileScrolling();
    handleImageLoading();
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
        setTimeout(handleResize, 100);
    });

    // === ОСНОВНАЯ ФУНКЦИОНАЛЬНОСТЬ ===
    
    // Анимация при наведении на карточки (только для desktop)
    if (window.innerWidth > 768) {
        const cards = document.querySelectorAll('.category-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    // Поиск курсов
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const categoryItems = document.querySelectorAll('.category-item');
            
            categoryItems.forEach(item => {
                const categoryName = item.querySelector('.category-name')?.textContent?.toLowerCase() || '';
                if (categoryName.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // Получаем все необходимые элементы
    const filterButtons = document.querySelectorAll('.filter');
    const sortSelect = document.querySelector('.sort-dropdown select');
    const coursesGrid = document.querySelector('.courses-grid');
    const courseCards = document.querySelectorAll('.course-card');

    // Данные о курсах (если есть)
    if (courseCards.length > 0) {
        const courses = Array.from(courseCards).map(card => ({
            element: card,
            title: card.querySelector('h3')?.textContent || '',
            price: parseFloat(card.querySelector('.current-price')?.textContent?.replace(/[^0-9]/g, '') || '0'),
            rating: parseFloat(card.querySelector('.rating')?.textContent || '0'),
            category: getCategory(card.querySelector('h3')?.textContent || ''),
            students: parseInt(card.querySelector('.students')?.textContent?.replace(/[^0-9]/g, '') || '0')
        }));

        // Определяем категорию курса по заголовку
        function getCategory(title) {
            if (title.toLowerCase().includes('python')) return 'Python';
            if (title.toLowerCase().includes('javascript')) return 'JavaScript';
            if (title.toLowerCase().includes('java')) return 'Java';
            if (title.toLowerCase().includes('c++')) return 'C++';
            return 'Другое';
        }

        // Обработчик для кнопок фильтрации
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Убираем активный класс у всех кнопок
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Добавляем активный класс текущей кнопке
                button.classList.add('active');

                const selectedCategory = button.textContent;
                
                // Фильтруем курсы
                courses.forEach(course => {
                    if (selectedCategory === 'Все курсы' || course.category === selectedCategory) {
                        course.element.style.display = '';
                        // Добавляем анимацию появления
                        course.element.style.opacity = '0';
                        course.element.style.transform = 'translateY(20px)';
                        requestAnimationFrame(() => {
                            course.element.style.transition = 'all 0.3s ease';
                            course.element.style.opacity = '1';
                            course.element.style.transform = 'translateY(0)';
                        });
                    } else {
                        course.element.style.display = 'none';
                    }
                });
            });
        });

        // Обработчик для сортировки
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                const sortType = sortSelect.value;
                const sortedCourses = [...courses].sort((a, b) => {
                    switch (sortType) {
                        case 'price-low':
                            return a.price - b.price;
                        case 'price-high':
                            return b.price - a.price;
                        case 'rating':
                            return b.rating - a.rating;
                        case 'popular':
                            return b.students - a.students;
                        default:
                            return 0;
                    }
                });

                // Очищаем и заполняем grid отсортированными курсами
                if (coursesGrid) {
                    coursesGrid.innerHTML = '';
                    sortedCourses.forEach(course => {
                        coursesGrid.appendChild(course.element);
                        // Добавляем анимацию появления
                        course.element.style.opacity = '0';
                        course.element.style.transform = 'translateY(20px)';
                        requestAnimationFrame(() => {
                            course.element.style.transition = 'all 0.3s ease';
                            course.element.style.opacity = '1';
                            course.element.style.transform = 'translateY(0)';
                        });
                    });
                }
            });
        }

        // Добавляем анимацию при загрузке страницы
        courses.forEach((course, index) => {
            course.element.style.opacity = '0';
            course.element.style.transform = 'translateY(20px)';
            setTimeout(() => {
                course.element.style.transition = 'all 0.3s ease';
                course.element.style.opacity = '1';
                course.element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Анимация для кнопок (только на desktop)
    if (window.innerWidth > 768) {
        const buttons = document.querySelectorAll('.view-all, .filter');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });
    }

    // Плавное появление элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.category-card, .category-item');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease-out';
        observer.observe(element);
    });

    // Обработчик клика на иконку профиля
    const profileIcon = document.querySelector('.profile-icon');
    if (profileIcon) {
        profileIcon.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'profile.html';
        });
    }
}); 