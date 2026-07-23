/**
 * NexaForge — основной JavaScript
 * Включает: прелоадер, кастомный курсор, меню, скролл,
 * анимации появления, фильтр портфолио, лайтбокс,
 * карусель отзывов, переключение темы, форму связи.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ----- Прелоадер -----
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    preloader.classList.add('preloader--hidden');
    // Удаляем прелоадер из DOM после анимации
    preloader.addEventListener('transitionend', () => {
      preloader.remove();
    });
  });

  // ----- Кастомный курсор (только десктоп) -----
  const cursorDot = document.getElementById('cursorDot');
  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
    });
    // Эффект при наведении на ссылки и кнопки
    const hoverElements = document.querySelectorAll('a, button, .btn, .portfolio-card');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.style.width = '32px';
        cursorDot.style.height = '32px';
        cursorDot.style.background = 'var(--color-accent-end)';
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.style.width = '16px';
        cursorDot.style.height = '16px';
        cursorDot.style.background = 'var(--color-accent-start)';
      });
    });
  } else {
    cursorDot.style.display = 'none';
  }

  // ----- Мобильное меню (бургер) -----
  const burger = document.getElementById('burgerBtn');
  const navMenu = document.getElementById('navMenu');
  if (burger && navMenu) {
    burger.addEventListener('click', () => {
      const expanded = burger.getAttribute('aria-expanded') === 'true' || false;
      burger.setAttribute('aria-expanded', !expanded);
      burger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Закрывать меню при клике на ссылку
    const navLinks = navMenu.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        navMenu.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ----- Плавный скролл для всех якорных ссылок -----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });

  // ----- Intersection Observer: анимация появления -----
  const revealElements = document.querySelectorAll('.reveal');
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px',
  };

  const revealCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Для повторной анимации не отключаем наблюдение, но если нужно один раз — можно unobserve
        // observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(revealCallback, observerOptions);
  revealElements.forEach(el => observer.observe(el));

  // ----- Фильтр портфолио -----
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Сброс активного класса
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');

      const filterValue = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ----- Лайтбокс для портфолио -----
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.querySelector('.lightbox__close');
  const lightboxOverlay = document.querySelector('.lightbox__overlay');

  function openLightbox(imgSrc, title, desc) {
    lightboxImg.src = imgSrc;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    lightboxDesc.textContent = desc;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  portfolioCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const imgSrc = img.getAttribute('src');
      const title = card.getAttribute('data-title');
      const desc = card.getAttribute('data-desc');
      openLightbox(imgSrc, title, desc);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // ----- Карусель отзывов -----
  const testimonials = document.querySelectorAll('.testimonial');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  let currentTestimonial = 0;
  let carouselInterval;

  function showTestimonial(index) {
    testimonials.forEach((t, i) => {
      t.classList.toggle('active', i === index);
    });
  }

  function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
  }

  function prevTestimonialFunc() {
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentTestimonial);
  }

  if (testimonials.length > 0) {
    showTestimonial(0);
    carouselInterval = setInterval(nextTestimonial, 5000);

    nextBtn.addEventListener('click', () => {
      clearInterval(carouselInterval);
      nextTestimonial();
      carouselInterval = setInterval(nextTestimonial, 5000);
    });

    prevBtn.addEventListener('click', () => {
      clearInterval(carouselInterval);
      prevTestimonialFunc();
      carouselInterval = setInterval(nextTestimonial, 5000);
    });
  }

  // ----- Переключение темы (светлая / тёмная) -----
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  // Проверяем сохранённую тему
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.setAttribute('data-theme', 'dark');
  }

  themeToggle.addEventListener('click', () => {
    if (body.getAttribute('data-theme') === 'dark') {
      body.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      body.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });

  // ----- Модальные окна для политик -----
  function setupModal(modalId, triggerSelector) {
    const modal = document.getElementById(modalId);
    const triggers = document.querySelectorAll(triggerSelector);
    const closeBtn = modal.querySelector('.modal__close');
    const overlay = modal.querySelector('.modal__overlay');

    function openModal(e) {
      e.preventDefault();
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    triggers.forEach(trigger => trigger.addEventListener('click', openModal));
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  setupModal('policyModal', '#policyLink');
  setupModal('consentModal', '#consentLink');

  // ----- Отправка формы (пример с Formspree) -----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Простая валидация
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const consent = document.getElementById('consent').checked;

      if (!name || !email || !message) {
        alert('Пожалуйста, заполните все обязательные поля.');
        return;
      }
      if (!consent) {
        alert('Необходимо дать согласие на обработку данных.');
        return;
      }

      // Замените URL на ваш реальный endpoint (Formspree, Яндекс.Формы и т.п.)
      const formAction = contactForm.getAttribute('action') || 'https://formspree.io/f/ваш_id';
      
      try {
        const formData = new FormData(contactForm);
        const response = await fetch(formAction, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          alert('Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.');
          contactForm.reset();
        } else {
          const data = await response.json();
          alert('Ошибка при отправке: ' + (data.error || 'Попробуйте позже.'));
        }
      } catch (error) {
        alert('Ошибка сети. Проверьте подключение и попробуйте снова.');
        console.error('Ошибка отправки формы:', error);
      }
    });
  }

  // ----- Параллакс-эффект для Hero-фона (лёгкий) -----
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrollValue = window.scrollY;
      heroBg.style.transform = `translateY(${scrollValue * 0.4}px)`;
    });
  }

});
