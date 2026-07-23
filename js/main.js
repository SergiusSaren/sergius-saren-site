document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Прелоадер
    var preloader = document.getElementById('preloader');
    if (preloader) {
        var hidden = false;
        function hidePreloader() {
            if (hidden) return;
            hidden = true;
            preloader.classList.add('hidden');
            setTimeout(function() {
                if (preloader && preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
            }, 500);
        }
        window.addEventListener('load', hidePreloader);
        setTimeout(hidePreloader, 3000);
        if (document.readyState === 'complete') hidePreloader();
    }

    // Кастомный курсор
    var cursor = document.querySelector('.cursor');
    if (cursor && window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        var hoverEls = document.querySelectorAll('a, button, .btn, .nav__link, .modal__close');
        for (var i = 0; i < hoverEls.length; i++) {
            hoverEls[i].addEventListener('mouseenter', function() { cursor.classList.add('hover'); });
            hoverEls[i].addEventListener('mouseleave', function() { cursor.classList.remove('hover'); });
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

    // Плавный скролл для якорей (кроме модальных)
    var anchors = document.querySelectorAll('a[href^="#"]');
    for (var k = 0; k < anchors.length; k++) {
        anchors[k].addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            // Игнорируем якоря модальных окон
            if (href === '#' || href === '#contactModal' || href === '#privacyModal' || href === '#consentModal') return;
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

    // Защита от копирования
    document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S' || e.key === 'i' || e.key === 'I' || e.key === 'j' || e.key === 'J')) || e.key === 'F12') {
            e.preventDefault();
        }
    });

    console.log('Сайт готов. Модальные окна работают без JavaScript.');
});
