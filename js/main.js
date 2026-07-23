// main.js
document.addEventListener('DOMContentLoaded', () => {

  // --- Прелоадер ---
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    preloader.classList.add('hidden');
    // Удаляем совсем через 0.5с после анимации
    setTimeout(() => { if (preloader) preloader.style.display = 'none'; }, 600);
  });

  // --- Кастомный курсор ---
  const cursor = document.querySelector('.cursor-dot');
  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    // Скрываем при уходе с окна
    document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
    document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
  }

  // --- Переключение темы ---
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // --- Мобильное меню ---
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  burger.addEventListener('click', () => {
    const expanded = burger.getAttribute('aria-expanded') === 'true' || false;
    burger.setAttribute('aria-expanded', !expanded);
    burger.classList.toggle('active');
    nav.classList.toggle('active');
  });
  // Закрытие при клике на ссылку
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      nav.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  // --- Плавный скролл для якорных ссылок (доп. точность) ---
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

  // --- Анимация появления при скролле (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  revealElements.forEach(el => observer.observe(el));

  // --- Фильтр портфолио ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Обновление активной кнопки
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');
      portfolioItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = '';
          // Перезапуск анимации reveal, если она была скрыта
          item.classList.add('reveal');
          observer.observe(item);
        } else {
          item.style.display = 'none';
          item.classList.remove('visible');
        }
      });
    });
  });

  // --- Лайтбокс ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox__close');
  const portfolioGrid = document.querySelector('.portfolio__grid');

  portfolioGrid.addEventListener('click', (e) => {
    const item = e.target.closest('.portfolio-item');
    if (!item) return;
    const img = item.querySelector('img');
    const caption = item.querySelector('.portfolio-item__caption')?.textContent || '';
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox__overlay').addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
  });

  // --- Карусель отзывов ---
  const track = document.getElementById('carousel-track');
  const slides = Array.from(track.children);
  const dots = document.querySelectorAll('.carousel__dot');
  let currentSlide = 0;
  const slideCount = slides.length;

  function updateCarousel(index) {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    currentSlide = index;
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.getAttribute('data-slide'));
      updateCarousel(slideIndex);
      resetAutoSlide();
    });
  });

  let autoSlideInterval = setInterval(() => {
    const next = (currentSlide + 1) % slideCount;
    updateCarousel(next);
  }, 5000);

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
      const next = (currentSlide + 1) % slideCount;
      updateCarousel(next);
    }, 5000);
  }

  // Пауза при наведении
  const carousel = document.querySelector('.carousel');
  carousel.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
  carousel.addEventListener('mouseleave', () => {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
      const next = (currentSlide + 1) % slideCount;
      updateCarousel(next);
    }, 5000);
  });

  // --- Валидация и отправка формы (AJAX через Formspree) ---
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');

  function showError(input, message) {
    const errorSpan = input.parentElement.querySelector('.error-msg');
    errorSpan.textContent = message;
  }
  function clearErrors() {
    form.querySelectorAll('.error-msg').forEach(span => span.textContent = '');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    let valid = true;

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    if (!name.value.trim()) {
      showError(name, 'Введите имя');
      valid = false;
    }
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      showError(email, 'Введите корректный email');
      valid = false;
    }
    if (!message.value.trim()) {
      showError(message, 'Сообщение не может быть пустым');
      valid = false;
    }

    if (!valid) return;

    // Отправка через fetch (Formspree)
    const formData = new FormData(form);
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        form.reset();
        successMsg.style.display = 'block';
        setTimeout(() => successMsg.style.display = 'none', 5000);
      } else {
        showError(email, 'Ошибка отправки, попробуйте позже');
      }
    } catch (err) {
      showError(email, 'Сетевая ошибка');
    }
  });

  // --- Установка года в футере ---
  document.getElementById('year').textContent = new Date().getFullYear();

});
