// js/main.js (исправленный — изолированные блоки)
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // === Прелоадер ===
    (function() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;
        let hidden = false;
        function hide() {
            if (hidden) return;
            hidden = true;
            preloader.classList.add('hidden');
            setTimeout(() => { if (preloader.parentNode) preloader.remove(); }, 500);
        }
        window.addEventListener('load', hide);
        setTimeout(hide, 5000);
        if (document.readyState === 'complete') hide();
    })();

    // === Кастомный курсор (десктоп) ===
    (function() {
        const cursor = document.querySelector('.cursor');
        if (!cursor || !window.matchMedia('(pointer: fine)').matches) {
            if (cursor) cursor.style.display = 'none';
            return;
        }
        document.addEventListener('mousemove', e => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        const hoverEls = document.querySelectorAll('a, button, .btn, .nav__link, .modal__close');
        hoverEls.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    })();

    // === Бургер-меню ===
    (function() {
        const burger = document.getElementById('burgerBtn');
        const navList = document.getElementById('navList');
        if (!burger || !navList) return;
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            navList.classList.toggle('active');
            burger.setAttribute('aria-expanded', navList.classList.contains('active'));
        });
        navList.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                navList.classList.remove('active');
                burger.setAttribute('aria-expanded', 'false');
            });
        });
    })();

    // === Плавный скролл ===
    (function() {
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
    })();

    // === Параллакс ===
    (function() {
        const parallax = document.querySelector('.hero__parallax');
        if (!parallax) return;
        window.addEventListener('scroll', () => {
            parallax.style.transform = `translateY(${window.pageYOffset * 0.4}px)`;
        });
    })();

    // === Анимация появления ===
    (function() {
        const revealEls = document.querySelectorAll('.reveal');
        if (!revealEls.length) return;
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });
            revealEls.forEach(el => observer.observe(el));
        } else {
            revealEls.forEach(el => el.classList.add('visible'));
        }
    })();

    // === Тема ===
    (function() {
        const toggle = document.getElementById('themeToggle');
        if (!toggle) return;
        const icon = toggle.querySelector('.theme-toggle__icon');
        const saved = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', saved);
        if (icon) icon.textContent = saved === 'dark' ? '☀️' : '🌙';
        toggle.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            if (icon) icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
    })();

    // === Модальные окна (критически важный блок) ===
    (function() {
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
            const overlay = modal.querySelector('.modal__overlay');
            if (overlay) overlay.focus();
        }
        function closeModal(modal) {
            if (!modal) return;
            modal.classList.remove('active');
            modal.hidden = true;
            document.body.style.overflow = '';
        }

        // Закрытие по крестику и оверлею
        document.querySelectorAll('.modal__close, .modal__overlay').forEach(el => {
            el.addEventListener('click', () => {
                const modal = el.closest('.modal');
                closeModal(modal);
            });
        });

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                for (const key in modals) {
                    if (modals[key] && modals[key].classList.contains('active')) {
                        closeModal(modals[key]);
                        break;
                    }
                }
            }
        });

        // Триггеры открытия
        const contactLink = document.getElementById('contactLink');
        const heroSupportBtn = document.getElementById('heroSupportBtn');
        if (contactLink) {
            contactLink.addEventListener('click', (e) => { e.preventDefault(); openModal('contact'); });
        }
        if (heroSupportBtn) {
            heroSupportBtn.addEventListener('click', (e) => { e.preventDefault(); openModal('contact'); });
        }

        // Кнопки с data-modal (Политика, Согласие)
        document.querySelectorAll('[data-modal]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = btn.getAttribute('data-modal');
                openModal(modalId);
            });
        });
    })();

    // === Форма обратной связи ===
    (function() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            const formData = new FormData(form);
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    form.reset();
                    const contactModal = document.getElementById('contactModal');
                    if (contactModal) {
                        contactModal.classList.remove('active');
                        contactModal.hidden = true;
                        document.body.style.overflow = '';
                    }
                    alert('Сообщение отправлено! Мы свяжемся с вами.');
                } else {
                    throw new Error('Ошибка сервера');
                }
            } catch (error) {
                alert('Произошла ошибка при отправке. Попробуйте позже.');
            }
        });
    })();

    // === Защита от копирования ===
    (function() {
        document.addEventListener('contextmenu', e => e.preventDefault());
        document.addEventListener('keydown', e => {
            if ((e.ctrlKey && ['u','s','i','j'].includes(e.key.toLowerCase())) || e.key === 'F12') {
                e.preventDefault();
            }
        });
    })();

});
