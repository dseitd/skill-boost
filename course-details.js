document.addEventListener('DOMContentLoaded', () => {
    // Получаем ID курса из URL
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');

    // Инициализация слайдера
    initializeSlider();
    
    // Обработчик для кнопки "В корзину"
    const purchaseButton = document.querySelector('.purchase-button');
    if (purchaseButton) {
        purchaseButton.addEventListener('click', () => {
            // Получаем данные о курсе
            const courseData = {
                id: courseId,
                title: document.querySelector('.hero-title').textContent,
                price: parseInt(document.querySelector('.current-price').textContent.replace(/[^\d]/g, '')),
                image: document.querySelector('.preview-slide.active img')?.src || 'images/placeholder.png'
            };

            // Добавляем в корзину
            if (window.Cart) {
                Cart.addItem(courseData);
            }
        });
    }

    // Обработчик для кнопки "Закладки"
    const bookmarkButton = document.querySelector('.bookmark-button');
    if (bookmarkButton) {
        bookmarkButton.addEventListener('click', () => {
            bookmarkButton.classList.toggle('active');
            const isActive = bookmarkButton.classList.contains('active');
            bookmarkButton.querySelector('svg').style.fill = isActive ? 'var(--accent-color)' : 'none';
        });
    }

    // Получаем параметр course из URL
    const courseParam = urlParams.get('course');

    // Если параметр course равен 'blender', отображаем информацию о курсе Blender
    if (courseParam === 'blender') {
        // Заголовок курса уже установлен в HTML

        // Обновляем превью изображения
        const previewSlides = document.querySelectorAll('.preview-slide img');
        previewSlides.forEach(slide => {
            slide.src = 'images/placeholder.png';
        });

        // Обновляем превью thumbnails
        const thumbnails = document.querySelectorAll('.preview-thumbnail img');
        thumbnails.forEach(thumb => {
            thumb.src = 'images/placeholder.png';
        });
    }

    // Обработка превью видео
    const videoPlaceholder = document.querySelector('.video-placeholder');
    const previewItems = document.querySelectorAll('.preview-item');
    
    // Переключение активного превью
    previewItems.forEach(item => {
        item.addEventListener('click', function() {
            // Убираем активный класс у всех превью
            previewItems.forEach(i => i.classList.remove('active'));
            // Добавляем активный класс текущему превью
            this.classList.add('active');
            // Обновляем основное изображение
            const mainImage = videoPlaceholder.querySelector('img');
            const newImage = this.querySelector('img');
            mainImage.src = newImage.src;
        });
    });

    // Обработка раскрытия/сворачивания элементов учебной программы
    const curriculumItems = document.querySelectorAll('.curriculum-item');
    
    curriculumItems.forEach(item => {
        const header = item.querySelector('.curriculum-header');
        
        header.addEventListener('click', function() {
            // Если элемент уже раскрыт, сворачиваем его
            if (item.classList.contains('expanded')) {
                item.classList.remove('expanded');
            } else {
                // Сворачиваем все остальные элементы
                curriculumItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('expanded');
                    }
                });
                // Раскрываем текущий элемент
                item.classList.add('expanded');
            }
        });
    });

    // Плавный скролл при клике на кнопку "Назад"
    const backButton = document.querySelector('.back-button a');
    
    backButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.history.back();
    });

    // Анимация при наведении на кнопку покупки
    if (purchaseButton) {
        purchaseButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        purchaseButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    }

    // Плавное появление элементов при скролле
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
        sectionObserver.observe(section);
    });

    // Обработка кликов по превью
    const previewThumbnails = document.querySelectorAll('.preview-thumbnail');
    const previewSlides = document.querySelectorAll('.preview-slide');
    const previewDots = document.querySelectorAll('.preview-dot');

    previewThumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            // Убираем активный класс у всех элементов
            previewThumbnails.forEach(t => t.classList.remove('active'));
            previewSlides.forEach(s => s.classList.remove('active'));
            previewDots.forEach(d => d.classList.remove('active'));

            // Добавляем активный класс выбранным элементам
            thumbnail.classList.add('active');
            previewSlides[index].classList.add('active');
            previewDots[index].classList.add('active');
        });
    });

    // Обработка прокрутки для анимации заголовка
    const header = document.querySelector('.course-header');
    const hero = document.querySelector('.course-hero');
    let heroBottom = hero.offsetTop + hero.offsetHeight;
    
    // Обновляем позицию героя при изменении размера окна
    window.addEventListener('resize', () => {
        heroBottom = hero.offsetTop + hero.offsetHeight;
    });
    
    // Обработка прокрутки
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        if (scrollPosition > heroBottom - header.offsetHeight) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});

// Функция инициализации слайдера
function initializeSlider() {
    const slider = document.querySelector('.preview-slider');
    const slides = document.querySelectorAll('.preview-slide');
    const dots = document.querySelectorAll('.preview-dot');
    const thumbnails = document.querySelectorAll('.preview-thumbnail');
    const prevButton = document.querySelector('.preview-arrow.prev');
    const nextButton = document.querySelector('.preview-arrow.next');
    let currentSlide = 0;

    // Функция обновления слайдера
    function updateSlider(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        thumbnails.forEach(thumb => thumb.classList.remove('active'));

        slides[index].classList.add('active');
        dots[index].classList.add('active');
        thumbnails[index].classList.add('active');
        currentSlide = index;
    }

    // Обработчики для кнопок навигации
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSlider(currentSlide);
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider(currentSlide);
        });
    }

    // Обработчики для точек навигации
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateSlider(index);
        });
    });

    // Обработчики для миниатюр
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            updateSlider(index);
        });
    });

    // Обработчик для видео
    const videoSlide = document.querySelector('.preview-slide[data-type="video"]');
    if (videoSlide) {
        const video = videoSlide.querySelector('video');
        const playButton = videoSlide.querySelector('.play-button');

        if (playButton && video) {
            playButton.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                    playButton.style.display = 'none';
                } else {
                    video.pause();
                    playButton.style.display = 'flex';
                }
            });

            video.addEventListener('ended', () => {
                playButton.style.display = 'flex';
            });

            video.addEventListener('play', () => {
                playButton.style.display = 'none';
            });

            video.addEventListener('pause', () => {
                playButton.style.display = 'flex';
            });
        }
    }
} 