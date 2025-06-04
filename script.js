document.addEventListener('DOMContentLoaded', () => {
    // === УЛУЧШЕННАЯ МОБИЛЬНАЯ ФУНКЦИОНАЛЬНОСТЬ ===
    
    // Определение мобильного устройства
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Установка CSS переменных для мобильных
    if (isMobile) {
        document.documentElement.style.setProperty('--mobile-vh', `${window.innerHeight * 0.01}px`);
        document.body.classList.add('mobile-device');
    }
    
    // Создание улучшенной кнопки мобильного поиска
    function createMobileSearchToggle() {
        if (window.innerWidth <= 480) {
            const icons = document.querySelector('.icons');
            const searchBar = document.querySelector('.search-bar');
            
            // Проверяем, есть ли уже кнопка
            if (!document.querySelector('.mobile-search-toggle')) {
                const searchToggle = document.createElement('button');
                searchToggle.className = 'mobile-search-toggle';
                searchToggle.setAttribute('aria-label', 'Открыть поиск');
                searchToggle.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
                
                // Вставляем кнопку перед иконками
                icons.insertBefore(searchToggle, icons.firstChild);
                
                // Улучшенный обработчик клика на кнопку поиска
                searchToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isActive = searchBar.classList.contains('mobile-active');
                    
                    if (isActive) {
                        closeSearch();
                    } else {
                        openSearch();
                    }
                });
                
                function openSearch() {
                    searchBar.classList.add('mobile-active');
                    searchToggle.setAttribute('aria-expanded', 'true');
                    
                    // Фокус на input с задержкой для анимации
                    setTimeout(() => {
                        const input = searchBar.querySelector('input');
                        if (input) {
                            input.focus();
                            // Показываем клавиатуру на iOS
                            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                                input.click();
                            }
                        }
                    }, 300);
                }
                
                function closeSearch() {
                    searchBar.classList.remove('mobile-active');
                    searchToggle.setAttribute('aria-expanded', 'false');
                    
                    // Скрываем клавиатуру
                    const input = searchBar.querySelector('input');
                    if (input) {
                        input.blur();
                    }
                }
                
                // Закрытие поиска при клике вне его
                document.addEventListener('click', (e) => {
                    if (!searchBar.contains(e.target) && !searchToggle.contains(e.target)) {
                        closeSearch();
                    }
                });
                
                // Закрытие поиска при нажатии Escape
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && searchBar.classList.contains('mobile-active')) {
                        closeSearch();
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
    
    // Улучшенные Touch-события для карточек
    function addTouchEvents() {
        const cards = document.querySelectorAll('.category-card, .course-card');
        
        cards.forEach(card => {
            let touchStartTime = 0;
            let touchStartY = 0;
            let touchMoved = false;
            
            // Touch start
            card.addEventListener('touchstart', (e) => {
                touchStartTime = Date.now();
                touchStartY = e.touches[0].clientY;
                touchMoved = false;
                
                // Добавляем визуальную обратную связь
                card.style.transform = 'scale(0.98)';
                card.style.transition = 'transform 0.1s ease';
                
                // Легкая вибрация на поддерживаемых устройствах
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            }, { passive: true });
            
            // Touch move
            card.addEventListener('touchmove', (e) => {
                const currentY = e.touches[0].clientY;
                const deltaY = Math.abs(currentY - touchStartY);
                
                // Если пользователь двигает палец больше чем на 10px - это скролл
                if (deltaY > 10) {
                    touchMoved = true;
                    card.style.transform = 'scale(1)';
                }
            }, { passive: true });
            
            // Touch end
            card.addEventListener('touchend', (e) => {
                const touchEndTime = Date.now();
                const touchDuration = touchEndTime - touchStartTime;
                
                card.style.transform = 'scale(1)';
                card.style.transition = 'transform 0.3s ease';
                
                // Если это быстрый тап без движения
                if (touchDuration < 500 && !touchMoved) {
                    e.preventDefault();
                    
                    // Находим ссылку в карточке
                    const link = card.querySelector('a[href]') || card.closest('a[href]');
                    if (link) {
                        // Добавляем небольшую задержку для визуального эффекта
                        setTimeout(() => {
                            if (link.href) {
                                window.location.href = link.href;
                            }
                        }, 100);
                    }
                }
            });
            
            // Touch cancel
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
        
        // Улучшенная обработка прокрутки
        let scrollTimeout;
        let isScrolling = false;
        
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                isScrolling = true;
                document.body.classList.add('scrolling');
            }
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
                document.body.classList.remove('scrolling');
            }, 150);
        }, { passive: true });
        
        // Предотвращение bounce эффекта на iOS при необходимости
        let startY = 0;
        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].pageY;
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            const y = e.touches[0].pageY;
            const scrollTop = window.pageYOffset;
            const scrollHeight = document.body.scrollHeight;
            const clientHeight = window.innerHeight;
            
            // Если прокручиваем в области поиска или модальных окон - разрешаем
            if (e.target.closest('.search-results') || 
                e.target.closest('.mobile-active') ||
                e.target.closest('.modal')) {
                return;
            }
            
            // Предотвращаем overscroll только на краях страницы
            if ((scrollTop <= 0 && y > startY) || 
                (scrollTop + clientHeight >= scrollHeight && y < startY)) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    // Оптимизированная загрузка изображений
    function handleImageLoading() {
        const images = document.querySelectorAll('.course-image img, .category-card img');
        
        // Создаем intersection observer для lazy loading
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Заменяем data-src на src
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    // Добавляем обработчики загрузки
                    img.addEventListener('load', () => {
                        img.style.opacity = '1';
                        img.classList.add('loaded');
                    });
                    
                    img.addEventListener('error', () => {
                        img.src = 'images/placeholder.png';
                        img.style.opacity = '0.7';
                        img.classList.add('error');
                    });
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        images.forEach(img => {
            // Если у изображения нет src, но есть data-src - наблюдаем за ним
            if (!img.src && img.dataset.src) {
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                imageObserver.observe(img);
            } else {
                // Для изображений с src - просто добавляем обработчики
                img.addEventListener('load', () => {
                    img.style.opacity = '1';
                });
                
                img.addEventListener('error', () => {
                    img.src = 'images/placeholder.png';
                    img.style.opacity = '0.7';
                });
            }
        });
    }
    
    // Улучшенные фильтры для мобильных
    function improveMobileFilters() {
        const filterGroup = document.querySelector('.filter-group');
        if (!filterGroup) return;
        
        // Добавляем индикаторы прокрутки для фильтров
        const scrollIndicatorLeft = document.createElement('div');
        const scrollIndicatorRight = document.createElement('div');
        
        scrollIndicatorLeft.className = 'scroll-indicator left';
        scrollIndicatorRight.className = 'scroll-indicator right';
        
        filterGroup.parentNode.insertBefore(scrollIndicatorLeft, filterGroup);
        filterGroup.parentNode.insertBefore(scrollIndicatorRight, filterGroup.nextSibling);
        
        function updateScrollIndicators() {
            const canScrollLeft = filterGroup.scrollLeft > 0;
            const canScrollRight = filterGroup.scrollLeft < filterGroup.scrollWidth - filterGroup.clientWidth;
            
            scrollIndicatorLeft.style.opacity = canScrollLeft ? '1' : '0';
            scrollIndicatorRight.style.opacity = canScrollRight ? '1' : '0';
        }
        
        filterGroup.addEventListener('scroll', updateScrollIndicators, { passive: true });
        updateScrollIndicators();
        
        // Улучшенные touch события для фильтров
        const filters = filterGroup.querySelectorAll('.filter');
        filters.forEach(filter => {
            filter.addEventListener('touchstart', () => {
                filter.style.transform = 'scale(0.95)';
            }, { passive: true });
            
            filter.addEventListener('touchend', () => {
                filter.style.transform = 'scale(1)';
            }, { passive: true });
        });
    }
    
    // Обработчик изменения размера окна с debounce
    function handleResize() {
        let resizeTimeout;
        return function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                createMobileSearchToggle();
                
                // Пересчитываем высоты для мобильной верстки
                if (window.innerWidth <= 480) {
                    document.documentElement.style.setProperty('--mobile-vh', `${window.innerHeight * 0.01}px`);
                }
                
                // Переинициализируем touch события
                addTouchEvents();
                improveMobileFilters();
            }, 250);
        };
    }
    
    const debouncedResize = handleResize();
    
    // Обработчик изменения ориентации
    function handleOrientationChange() {
        // Небольшая задержка для корректного пересчета размеров
        setTimeout(() => {
            if (window.innerWidth <= 768) {
                document.documentElement.style.setProperty('--mobile-vh', `${window.innerHeight * 0.01}px`);
            }
            debouncedResize();
        }, 100);
    }
    
    // Инициализация при загрузке
    createMobileSearchToggle();
    addTouchEvents();
    improveMobileScrolling();
    handleImageLoading();
    improveMobileFilters();
    
    // Обработчики событий
    window.addEventListener('resize', debouncedResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Дополнительно для iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        window.addEventListener('scroll', () => {
            // Скрываем address bar на iOS
            if (window.pageYOffset > 50) {
                document.body.classList.add('ios-scrolled');
            } else {
                document.body.classList.remove('ios-scrolled');
            }
        }, { passive: true });
    }

    // === ОСНОВНАЯ ФУНКЦИОНАЛЬНОСТЬ (УЛУЧШЕННАЯ) ===
    
    // Анимация при наведении на карточки (только для desktop)
    if (!isTouch && window.innerWidth > 768) {
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

    // Улучшенный поиск курсов
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            
            searchTimeout = setTimeout(() => {
                const searchTerm = e.target.value.toLowerCase().trim();
                const categoryItems = document.querySelectorAll('.category-item');
                
                categoryItems.forEach(item => {
                    const categoryName = item.querySelector('.category-name')?.textContent?.toLowerCase() || '';
                    const courseCount = item.querySelector('.course-count')?.textContent?.toLowerCase() || '';
                    
                    if (categoryName.includes(searchTerm) || courseCount.includes(searchTerm)) {
                        item.style.display = 'flex';
                        item.style.opacity = '1';
                    } else {
                        item.style.opacity = '0';
                        setTimeout(() => {
                            if (item.style.opacity === '0') {
                                item.style.display = 'none';
                            }
                        }, 300);
                    }
                });
            }, 300);
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

        // Обработчик для кнопок фильтрации с улучшенной анимацией
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Убираем активный класс у всех кнопок
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Добавляем активный класс текущей кнопке
                button.classList.add('active');

                const selectedCategory = button.textContent;
                
                // Фильтруем курсы с улучшенной анимацией
                courses.forEach((course, index) => {
                    if (selectedCategory === 'Все курсы' || course.category === selectedCategory) {
                        course.element.style.display = '';
                        
                        // Анимация появления с задержкой
                        setTimeout(() => {
                            course.element.style.opacity = '0';
                            course.element.style.transform = 'translateY(20px)';
                            
                            requestAnimationFrame(() => {
                                course.element.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                                course.element.style.opacity = '1';
                                course.element.style.transform = 'translateY(0)';
                            });
                        }, index * 50);
                    } else {
                        course.element.style.transition = 'all 0.3s ease';
                        course.element.style.opacity = '0';
                        course.element.style.transform = 'translateY(-20px)';
                        
                        setTimeout(() => {
                            course.element.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });

        // Обработчик для сортировки с анимацией
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

                // Очищаем и заполняем grid отсортированными курсами с анимацией
                if (coursesGrid) {
                    // Сначала анимируем исчезновение
                    courses.forEach(course => {
                        course.element.style.transition = 'all 0.3s ease';
                        course.element.style.opacity = '0';
                        course.element.style.transform = 'translateY(-20px)';
                    });
                    
                    setTimeout(() => {
                        coursesGrid.innerHTML = '';
                        
                        // Затем добавляем отсортированные элементы с анимацией появления
                        sortedCourses.forEach((course, index) => {
                            coursesGrid.appendChild(course.element);
                            
                            setTimeout(() => {
                                course.element.style.opacity = '0';
                                course.element.style.transform = 'translateY(20px)';
                                
                                requestAnimationFrame(() => {
                                    course.element.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                                    course.element.style.opacity = '1';
                                    course.element.style.transform = 'translateY(0)';
                                });
                            }, index * 50);
                        });
                    }, 300);
                }
            });
        }

        // Добавляем анимацию при загрузке страницы
        courses.forEach((course, index) => {
            course.element.style.opacity = '0';
            course.element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                course.element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                course.element.style.opacity = '1';
                course.element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Анимация для кнопок (только на desktop)
    if (!isTouch && window.innerWidth > 768) {
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

    // Плавное появление элементов при скролле с оптимизацией
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Убираем элемент из наблюдения после анимации
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.category-card, .category-item');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(element);
    });

    // Обработчик клика на иконку профиля с улучшенной анимацией
    const profileIcon = document.querySelector('.profile-icon');
    if (profileIcon) {
        profileIcon.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Добавляем эффект нажатия
            this.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                window.location.href = 'profile.html';
            }, 150);
        });
    }
    
    // Предзагрузка важных страниц
    if ('IntersectionObserver' in window) {
        const preloadLinks = document.querySelectorAll('a[href*="profile.html"], a[href*="cart.html"], a[href*="courses.html"]');
        preloadLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                if (!isTouch) {
                    const linkElement = document.createElement('link');
                    linkElement.rel = 'prefetch';
                    linkElement.href = link.href;
                    document.head.appendChild(linkElement);
                }
            }, { once: true });
        });
    }
}); 