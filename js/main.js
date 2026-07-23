// js/main.js (полный, без ошибок)
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // === Прелоадер (обязательно) ===
    const preloader = document.getElementById('preloader');
    if (preloader) {
        let hidden = false;
        function hidePreloader() {
            if (hidden) return;
            hidden = true;
            preloader.classList.add('hidden');
            setTimeout(() => { if (preloader.parentNode) preloader.remove(); }, 500);
        }
        window.addEventListener('load', hidePreloader);
        setTimeout(hidePreloader, 5000);
        if (document.readyState === 'complete') hidePreloader();
    }

    // === Кастомный курсор (не мешает) ===
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
    const parallax = document.querySelector('.hero__parallax');
    if (parallax) {
        window.addEventListener('scroll', () => {
            parallax.style.transform = `translateY(${window.pageYOffset * 0.4}px)`;
        });
    }

    // === Анимация появления ===
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length) {
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
    }

    // === Тема ===
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('.theme-toggle__icon');
        const saved = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', saved);
        if (icon) icon.textContent = saved === 'dark' ? '☀️' : '🌙';
        themeToggle.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            if (icon) icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }

    // === Модальные окна (исправлено!) ===
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
        if (overlay) setTimeout(() => overlay.focus(), 100);
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

    const contactLink = document.getElementById('contactLink');
    const heroSupportBtn = document.getElementById('heroSupportBtn');
    if (contactLink) contactLink.addEventListener('click', (e) => { e.preventDefault(); openModal('contact'); });
    if (heroSupportBtn) heroSupportBtn.addEventListener('click', (e) => { e.preventDefault(); openModal('contact'); });

    document.querySelectorAll('[data-modal]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
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

});
