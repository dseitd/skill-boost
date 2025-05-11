document.addEventListener('DOMContentLoaded', () => {
    // Анимация при наведении на карточки
    const cards = document.querySelectorAll('.category-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Поиск курсов
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const categoryItems = document.querySelectorAll('.category-item');
        
        categoryItems.forEach(item => {
            const categoryName = item.querySelector('.category-name').textContent.toLowerCase();
            if (categoryName.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Получаем все необходимые элементы
    const filterButtons = document.querySelectorAll('.filter');
    const sortSelect = document.querySelector('.sort-dropdown select');
    const coursesGrid = document.querySelector('.courses-grid');
    const courseCards = document.querySelectorAll('.course-card');

    // Данные о курсах
    const courses = Array.from(courseCards).map(card => ({
        element: card,
        title: card.querySelector('h3').textContent,
        price: parseFloat(card.querySelector('.current-price').textContent.replace(/[^0-9]/g, '')),
        rating: parseFloat(card.querySelector('.rating').textContent),
        category: getCategory(card.querySelector('h3').textContent),
        students: parseInt(card.querySelector('.students').textContent.replace(/[^0-9]/g, ''))
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
    });

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

    // Анимация для кнопок
    const buttons = document.querySelectorAll('.view-all, .filter');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });

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
            e.preventDefault(); // Предотвращаем стандартное поведение ссылки
            window.location.href = 'profile.html'; // Перенаправляем на страницу профиля
        });
    }
}); 