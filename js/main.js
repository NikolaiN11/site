/**
 * Smart Solutions — Main JavaScript
 * Интерактивность и компоненты
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initFadeAnimations();
    initSmoothScroll();
    initScrollProgress();
    initCounterAnimation();
});

/**
 * Навигация — эффект при скролле
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Проверить при загрузке
}

/**
 * Мобильное меню
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuLinks = document.querySelectorAll('.mobile-menu a');

    if (!menuBtn || !mobileMenu) return;

    const toggleMenu = () => {
        mobileMenu.classList.toggle('active');
        menuBtn.setAttribute('aria-expanded', mobileMenu.classList.contains('active'));

        // Блокировка скролла при открытом меню
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    };

    menuBtn.addEventListener('click', toggleMenu);

    // Закрытие по клику на ссылку
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
}

/**
 * Анимации появления при скролле
 */
function initFadeAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Анимация только один раз
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px 0px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
}

/**
 * Плавный скролл к якорям
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Утилита: подсветка активной страницы в навигации
 */
function highlightActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Вызываем после загрузки
document.addEventListener('DOMContentLoaded', highlightActiveNavLink);

/**
 * Scroll Progress Indicator
 * Легковесный индикатор прогресса скролла
 */
function initScrollProgress() {
    // Создаём элемент прогресса
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.prepend(progressBar);

    const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${progress}%`;
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
}

/**
 * Animated Counter
 * Анимация чисел при появлении в viewport
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-counter]');
    if (counters.length === 0) return;

    const animateCounter = (element) => {
        const target = parseInt(element.dataset.counter, 10);
        const prefix = element.dataset.prefix || '';
        const suffix = element.dataset.suffix || '';
        const duration = 1200; // ms — немного быстрее
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out quad (менее агрессивное замедление) + linear finish
            // Первые 90% — ease-out, последние 10% — линейно до конца
            let easeProgress;
            if (progress < 0.9) {
                // Ease-out quad для первых 90%
                const p = progress / 0.9;
                easeProgress = (1 - Math.pow(1 - p, 2)) * 0.95;
            } else {
                // Линейное завершение для последних 10%
                const p = (progress - 0.9) / 0.1;
                easeProgress = 0.95 + p * 0.05;
            }

            const currentValue = Math.round(easeProgress * target);

            element.textContent = `${prefix}${currentValue.toLocaleString('ru-RU')}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = `${prefix}${target.toLocaleString('ru-RU')}${suffix}`;
            }
        };

        requestAnimationFrame(updateCounter);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}
