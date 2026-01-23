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
    initLazyImages();
    initWebpSwap();
    initLightbox();
    initSectionScrollSpy();
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
    const fadeElements = document.querySelectorAll('.fade-in:not(.fade-in-late)');
    const lateElements = document.querySelectorAll('.fade-in-late');
    if (fadeElements.length === 0 && lateElements.length === 0) return;

    if (fadeElements.length > 0) {
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

    if (lateElements.length > 0) {
        const lateObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
                    entry.target.classList.add('visible');
                    lateObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: [0, 0.15],
            rootMargin: '0px 0px 10% 0px'
        });

        lateElements.forEach(el => lateObserver.observe(el));
    }
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

/**
 * Lazy loading for images outside hero/navbar/footer
 */
function initLazyImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.closest('.hero') || img.closest('.navbar')) {
            return;
        }
        if (!img.getAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        if (!img.getAttribute('decoding')) {
            img.setAttribute('decoding', 'async');
        }
    });
}

/**
 * Swap to WebP when supported (fallback to original on error)
 */
function initWebpSwap() {
    const supportsWebP = (() => {
        try {
            const canvas = document.createElement('canvas');
            return canvas.toDataURL('image/webp').startsWith('data:image/webp');
        } catch (e) {
            return false;
        }
    })();

    if (!supportsWebP) return;

    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.closest('.hero') || img.closest('.navbar')) {
            return;
        }

        if (img.complete && img.naturalWidth > 0) {
            return;
        }

        const src = img.getAttribute('src');
        if (!src || src.startsWith('data:') || src.endsWith('.svg') || src.endsWith('.webp')) {
            return;
        }

        const webpSrc = src.replace(/\.(png|jpe?g)$/i, '.webp');
        if (webpSrc === src) return;

        const probe = new Image();
        probe.onload = () => {
            img.dataset.srcOriginal = src;
            img.setAttribute('src', webpSrc);
        };
        probe.onerror = () => {
            // Keep original if WebP is missing
        };
        probe.src = webpSrc;
    });
}

/**
 * Lightbox for images
 */
function initLightbox() {
    const images = document.querySelectorAll('img[data-lightbox]');
    if (images.length === 0) return;

    let lightbox = document.querySelector('.lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <img alt="">
            <button class="lightbox-close" aria-label="Закрыть">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18"></path>
                    <path d="M6 6l12 12"></path>
                </svg>
            </button>
        `;
        document.body.appendChild(lightbox);
    }

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    const close = () => {
        lightbox.classList.remove('open');
        document.body.classList.remove('lightbox-open');
        lightboxImg.removeAttribute('src');
    };

    const open = (img) => {
        const src = img.dataset.srcOriginal || img.currentSrc || img.getAttribute('src');
        lightboxImg.setAttribute('src', src);
        lightboxImg.setAttribute('alt', img.getAttribute('alt') || '');
        lightbox.classList.add('open');
        document.body.classList.add('lightbox-open');
    };

    images.forEach(img => {
        const frame = img.closest('.image-frame');
        if (frame) {
            frame.classList.add('is-clickable');
        }
        const windowFrame = img.closest('.software-window');
        if (windowFrame) {
            windowFrame.classList.add('is-clickable');
        }
        if (!img.getAttribute('tabindex')) {
            img.setAttribute('tabindex', '0');
        }
        img.setAttribute('role', 'button');
        img.addEventListener('click', () => open(img));
        img.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open(img);
            }
        });
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            close();
        }
    });

    closeBtn.addEventListener('click', close);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('open')) {
            close();
        }
    });
}

/**
 * Scrollspy for section nav cards
 */
function initSectionScrollSpy() {
    const navCards = Array.from(document.querySelectorAll('.nav-card[href^="#"]'));
    if (navCards.length === 0) return;

    const map = new Map();
    navCards.forEach(card => {
        const id = card.getAttribute('href').slice(1);
        const section = document.getElementById(id);
        if (section) {
            map.set(section, card);
        }
    });

    if (map.size === 0) return;

    const setActive = (section) => {
        navCards.forEach(card => card.classList.remove('active'));
        const active = map.get(section);
        if (active) active.classList.add('active');
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActive(entry.target);
            }
        });
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0.2 });

    map.forEach((_, section) => observer.observe(section));

    if (window.location.hash) {
        const section = document.getElementById(window.location.hash.slice(1));
        if (section && map.has(section)) {
            setActive(section);
        }
    }
}
