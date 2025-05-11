document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-bar input');
    const searchResults = document.querySelector('.search-results');
    
    // Создаем контейнер для результатов поиска, если его нет
    if (!searchResults) {
        const searchResultsDiv = document.createElement('div');
        searchResultsDiv.className = 'search-results';
        document.querySelector('.search-bar').appendChild(searchResultsDiv);
    }

    // Функция для форматирования цены
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    // Функция поиска курсов
    const searchCourses = (query) => {
        query = query.toLowerCase();
        return coursesData.filter(course => {
            return course.title.toLowerCase().includes(query) ||
                   course.description.toLowerCase().includes(query) ||
                   course.category.toLowerCase().includes(query);
        });
    };

    // Функция отображения результатов
    const displayResults = (results) => {
        const searchResults = document.querySelector('.search-results');
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">Ничего не найдено</div>';
            searchResults.style.display = 'block';
            return;
        }

        const html = results.map(course => `
            <a href="${course.url}" class="search-result-item">
                <img src="${course.image}" alt="${course.title}">
                <div class="search-result-info">
                    <h4>${course.title}</h4>
                    <p>${course.description}</p>
                    <div class="search-result-meta">
                        <span class="search-result-category">${course.category}</span>
                        <span class="search-result-price">${formatPrice(course.price)} ₽</span>
                    </div>
                </div>
            </a>
        `).join('');

        searchResults.innerHTML = html;
        searchResults.style.display = 'block';
    };

    // Обработчик ввода в поле поиска
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();
        
        if (query.length === 0) {
            document.querySelector('.search-results').style.display = 'none';
            return;
        }

        // Добавляем задержку для предотвращения частых запросов
        debounceTimer = setTimeout(() => {
            const results = searchCourses(query);
            displayResults(results);
        }, 300);
    });

    // Закрытие результатов поиска при клике вне
    document.addEventListener('click', (e) => {
        const searchBar = document.querySelector('.search-bar');
        const searchResults = document.querySelector('.search-results');
        
        if (!searchBar.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}); 