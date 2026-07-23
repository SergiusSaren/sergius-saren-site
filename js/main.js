// js/main.js (финальная версия с гарантированным скрытием прелоадера)
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ===== Прелоадер: скрываем в любом случае =====
    var preloader = document.getElementById('preloader');
    if (preloader) {
        // Функция скрытия вызывается один раз
        var hidden = false;
        function hidePreloader() {
            if (hidden) return;
            hidden = true;
            preloader.classList.add('hidden');
            // Удаляем элемент после анимации
            setTimeout(function() {
                if (preloader && preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
            }, 500);
        }

        // 1. Прячем, когда всё загружено
        window.addEventListener('load', hidePreloader);

        // 2. Прячем через 3 секунды, если load не сработал (быстрее, чем раньше)
        setTimeout(hidePreloader, 3000);

        // 3. Если DOMContentLoaded сработал позже, чем complete (редко)
        if (document.readyState === 'complete') {
            hidePreloader();
        }

        // Дополнительно: выводим в консоль, чтобы понять, жив ли скрипт
        console.log('Прелоадер запущен, скроется автоматически');
    }

    // ===== Остальной код (без изменений) =====
    // Кастомный курсор
    var cursor = document.querySelector('.cursor');
    if (cursor && window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        var hoverElements = document.querySelectorAll('a, button, .btn, .nav__link, .modal__close');
        for (var i = 0; i < hoverElements.length; i++) {
            hoverElements[i].addEventListener('mouseenter', function() { cursor.classList.add('hover'); });
            hoverElements[i].addEventListener('mouseleave', function() { cursor.classList.remove('hover'); });
        }
    } else if (cursor) {
        cursor.style.display = 'none';
    }

    // Бургер-меню
    var burger = document.getElementById('burgerBtn');
    var navList = document.getElementById('navList');
    if (burger && navList) {
        burger.addEventListener('click', function() {
            burger.classList.toggle('active');
            navList.classList.toggle('active');
            burger.setAttribute('aria-expanded', navList.classList.contains('active'));
        });
        var navLinks = navList.querySelectorAll('.nav__link');
        for (var j = 0; j < navLinks.length; j++) {
            navLinks[j].addEventListener('click', function() {
                burger.classList.remove('active');
                navList.classList.remove('active');
                burger.setAttribute('aria-expanded', 'false');
            });
        }
    }

    // Плавный скролл
    var anchors = document.querySelectorAll('a[href^="#"]');
    for (var k = 0; k < anchors.length; k++) {
        anchors[k].addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Параллакс
    var parallax = document.querySelector('.hero__parallax');
    if (parallax) {
        window.addEventListener('scroll', function() {
            parallax.style.transform = 'translateY(' + (window.pageYOffset * 0.4) + 'px)';
        });
    }

    // Анимация появления
    var revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length > 0) {
        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });
            for (var m = 0; m < revealEls.length; m++) {
                observer.observe(revealEls[m]);
            }
        } else {
            for (var n = 0; n < revealEls.length; n++) {
                revealEls[n].classList.add('visible');
            }
        }
    }

    // Переключение темы
    var themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        var icon = themeToggle.querySelector('.theme-toggle__icon');
        var savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (icon) icon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        themeToggle.addEventListener('click', function() {
            var newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            if (icon) icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }

    // Модальные окна
    var modals = {
        contact: document.getElementById('contactModal'),
        privacy: document.getElementById('privacyModal'),
        consent: document.getElementById('consentModal')
    };

    function openModal(id) {
        var modal = modals[id];
        if (!modal) return;
        modal.hidden = false;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        var overlay = modal.querySelector('.modal__overlay');
        if (overlay) setTimeout(function() { overlay.focus(); }, 100);
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('active');
        modal.hidden = true;
        document.body.style.overflow = '';
    }

    var closeButtons = document.querySelectorAll('.modal__close, .modal__overlay');
    for (var p = 0; p < closeButtons.length; p++) {
        closeButtons[p].addEventListener('click', function() {
            var modal = this.closest('.modal');
            closeModal(modal);
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            for (var key in modals) {
                if (modals[key] && modals[key].classList.contains('active')) {
                    closeModal(modals[key]);
                    break;
                }
            }
        }
       // Открытие модалок через data-modal (на случай если старое не работает)
    document.querySelectorAll('[data-modal]').forEach(btn => {
        // Снимаем старые обработчики, чтобы не дублировать (не обязательно)
        btn.removeEventListener('click', () => {});
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.hidden = false;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    });

    var contactLink = document.getElementById('contactLink');
    var heroSupportBtn = document.getElementById('heroSupportBtn');
    if (contactLink) contactLink.addEventListener('click', function(e) { e.preventDefault(); openModal('contact'); });
    if (heroSupportBtn) heroSupportBtn.addEventListener('click', function(e) { e.preventDefault(); openModal('contact'); });

    var dataModalBtns = document.querySelectorAll('[data-modal]');
    for (var q = 0; q < dataModalBtns.length; q++) {
        dataModalBtns[q].addEventListener('click', function(e) {
            e.preventDefault();
            var modalId = this.getAttribute('data-modal');
            openModal(modalId);
        });
    }

    // Форма обратной связи
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }
            var formData = new FormData(contactForm);
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(function(response) {
                if (response.ok) {
                    contactForm.reset();
                    closeModal(modals.contact);
                    alert('Сообщение отправлено! Мы свяжемся с вами.');
                } else {
                    throw new Error('Ошибка сервера');
                }
            }).catch(function(error) {
                alert('Произошла ошибка при отправке. Попробуйте позже.');
            });
        });
    }

    // Защита от копирования
    document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S' || e.key === 'i' || e.key === 'I' || e.key === 'j' || e.key === 'J')) || e.key === 'F12') {
            e.preventDefault();
        }
    });

    console.log('Все скрипты инициализированы');
});
