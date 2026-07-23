// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // === Прелоадер ===
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        preloader.classList.add('hidden');
        setTimeout(() => preloader.remove(), 500);
    });

    // === Кастомный курсор (десктоп) ===
    const cursor = document.querySelector('.cursor');
    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', e => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        const hoverElements = document.querySelectorAll('a, button, .btn, .nav__link, .modal__close');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    } else {
        cursor.style.display = 'none';
    }

    // === Бургер-меню ===
    const burger = document.getElementById('burgerBtn');
    const navList = document.getElementById('navList');
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        navList.classList.toggle('active');
        burger.setAttribute('aria-expanded', navList.classList.contains('active'));
    });
    // Закрытие меню при клике по ссылке
    navList.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('active')) {
                burger.classList.remove('active');
                navList.classList.remove('active');
                burger.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // === Плавный скролл (для якорей, кроме модальных) ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // === Параллакс hero ===
    const parallaxEl = document.querySelector('.hero__parallax');
    if (parallaxEl) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            parallaxEl.style.transform = `translateY(${scrolled * 0.4}px)`;
        });
    }

    // === Анимация появления (Intersection Observer) ===
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealElements.forEach(el => observer.observe(el));

    // === Переключение темы ===
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-toggle__icon');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });

    // === Модальные окна ===
    const modals = {
        contact: document.getElementById('contactModal'),
        privacy: document.getElementById('privacyModal'),
        consent: document.getElementById('consentModal')
    };

    function openModal(id) {
        const modal = modals[id];
        if (!modal) return;
        modal.hidden = false;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        modal.querySelector('.modal__overlay').focus();
    }
    function closeModal(modal) {
        modal.classList.remove('active');
        modal.hidden = true;
        document.body.style.overflow = '';
    }
    // Закрытие по кнопке и оверлею
    document.querySelectorAll('.modal__close, .modal__overlay').forEach(el => {
        el.addEventListener('click', () => {
            const modal = el.closest('.modal');
            if (modal) closeModal(modal);
        });
    });
    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            for (let key in modals) {
                if (modals[key].classList.contains('active')) {
                    closeModal(modals[key]);
                    break;
                }
            }
        }
    });

    // Триггеры
    document.getElementById('contactLink').addEventListener('click', (e) => {
        e.preventDefault();
        openModal('contact');
    });
    document.getElementById('heroSupportBtn').addEventListener('click', (e) => {
        e.preventDefault();
        openModal('contact');
    });
    // Ссылки на политики
    document.querySelectorAll('[data-modal]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = btn.getAttribute('data-modal');
            openModal(modalId);
        });
    });

    // === Форма обратной связи ===
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }
        const formData = new FormData(contactForm);
        // Имитация отправки (замените URL на реальный)
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                contactForm.reset();
                closeModal(modals.contact);
                alert('Сообщение отправлено! Мы свяжемся с вами.');
            } else {
                throw new Error('Ошибка сервера');
            }
        } catch (error) {
            alert('Произошла ошибка при отправке. Попробуйте позже.');
        }
    });

    // === Защита от копирования (контекстное меню) ===
    document.addEventListener('contextmenu', e => e.preventDefault());
    // Дополнительно: блокировка некоторых комбинаций клавиш
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S' || e.key === 'i' || e.key === 'I' || e.key === 'j' || e.key === 'J')) {
            e.preventDefault();
        }
        if (e.key === 'F12') e.preventDefault();
    });
});
