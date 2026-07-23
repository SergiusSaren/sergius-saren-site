// js/main.js (обновлённый)
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // === Прелоадер с защитным тайм-аутом ===
    const preloader = document.getElementById('preloader');
    if (preloader) {
        let preloaderHidden = false;

        function hidePreloader() {
            if (preloaderHidden) return;
            preloaderHidden = true;
            preloader.classList.add('hidden');
            setTimeout(() => {
                if (preloader && preloader.parentNode) {
                    preloader.remove();
                }
            }, 500);
        }

        window.addEventListener('load', hidePreloader);
        setTimeout(hidePreloader, 5000); // fallback через 5 сек

        if (document.readyState === 'complete') {
            hidePreloader();
        }
    }

    try {
        // === Кастомный курсор (десктоп) ===
        const cursor = document.querySelector('.cursor');
        if (cursor && window.matchMedia('(pointer: fine)').matches) {
            document.addEventListener('mousemove', e => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            });
            document.querySelectorAll('a, button, .btn, .nav__link, .modal__close').forEach(el => {
                el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
                el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
            });
        } else if (cursor) {
            cursor.style.display = 'none';
        }

        // === Бургер-меню ===
        const burger = document.getElementById('burgerBtn');
        const navList = document.getElementById('navList');
        if (burger && navList) {
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
        }

        // === Плавный скролл ===
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

        // === Параллакс ===
        const parallaxEl = document.querySelector('.hero__parallax');
        if (parallaxEl) {
            window.addEventListener('scroll', () => {
                parallaxEl.style.transform = `translateY(${window.pageYOffset * 0.4}px)`;
            });
        }

        // === Анимация появления ===
        const revealElements = document.querySelectorAll('.reveal');
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });
            revealElements.forEach(el => observer.observe(el));
        } else {
            // Fallback для старых браузеров
            revealElements.forEach(el => el.classList.add('visible'));
        }

        // === Тема ===
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const themeIcon = themeToggle.querySelector('.theme-toggle__icon');
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
            if (themeIcon) themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

            themeToggle.addEventListener('click', () => {
                const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                if (themeIcon) themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
            });
        }

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
            const overlay = modal.querySelector('.modal__overlay');
            if (overlay) overlay.focus();
        }
        function closeModal(modal) {
            if (!modal) return;
            modal.classList.remove('active');
            modal.hidden = true;
            document.body.style.overflow = '';
        }

        document.querySelectorAll('.modal__close, .modal__overlay').forEach(el => {
            el.addEventListener('click', () => {
                const modal = el.closest('.modal');
                closeModal(modal);
            });
        });

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

        // Триггеры модалок
        const contactLink = document.getElementById('contactLink');
        const heroSupportBtn = document.getElementById('heroSupportBtn');
        if (contactLink) {
            contactLink.addEventListener('click', (e) => {
                e.preventDefault();
                openModal('contact');
            });
        }
        if (heroSupportBtn) {
            heroSupportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal('contact');
            });
        }
        document.querySelectorAll('[data-modal]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = btn.getAttribute('data-modal');
                openModal(modalId);
            });
        });

        // === Форма ===
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (!contactForm.checkValidity()) {
                    contactForm.reportValidity();
                    return;
                }
                const formData = new FormData(contactForm);
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
        }

        // === Защита ===
        document.addEventListener('contextmenu', e => e.preventDefault());
        document.addEventListener('keydown', e => {
            if ((e.ctrlKey && ['u','s','i','j'].includes(e.key.toLowerCase())) || e.key === 'F12') {
                e.preventDefault();
            }
        });

    } catch (error) {
        console.error('Ошибка в основном скрипте:', error);
    }
});
