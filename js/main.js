/**
 * Поморсофт — основной JavaScript
 * Прелоадер, кастомный курсор, меню, скролл,
 * анимации появления, тёмная тема, модальные окна, форма связи.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ----- Прелоадер -----
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    preloader.classList.add('preloader--hidden');
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
    const hoverElements = document.querySelectorAll('a, button, .btn, .product-card, .team-card');
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

  // ----- Мобильное меню -----
  const burger = document.getElementById('burgerBtn');
  const navMenu = document.getElementById('navMenu');
  if (burger && navMenu) {
    burger.addEventListener('click', () => {
      const expanded = burger.getAttribute('aria-expanded') === 'true' || false;
      burger.setAttribute('aria-expanded', !expanded);
      burger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navMenu.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        navMenu.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ----- Плавный скролл (кроме модальных триггеров) -----
  document.querySelectorAll('a[href^="#"]:not([href="#contactModalTrigger"])').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target && !target.classList.contains('modal')) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ----- Intersection Observer: анимация появления -----
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  revealElements.forEach(el => observer.observe(el));

  // ----- Переключение темы (исправлено) -----
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      body.setAttribute('data-theme', 'dark');
    } else {
      body.removeAttribute('data-theme');
    }
  };

  // Установка сохранённой темы
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // ----- Модальные окна (общая функция) -----
  function setupModal(modalId, triggerSelector) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const closeBtn = modal.querySelector('.modal__close');
    const overlay = modal.querySelector('.modal__overlay');
    const triggers = document.querySelectorAll(triggerSelector);

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

  // Политика и согласие
  setupModal('policyModal', '#policyLink');
  setupModal('consentModal', '#consentLink');
  // Контакты
  setupModal('contactModal', '#contactTrigger, #heroContactBtn');

  // ----- Форма обратной связи (внутри contactModal) -----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
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

      const formAction = contactForm.getAttribute('action') || 'https://formspree.io/f/ваш_id';
      try {
        const formData = new FormData(contactForm);
        const response = await fetch(formAction, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          alert('Сообщение успешно отправлено! Мы скоро свяжемся с вами.');
          contactForm.reset();
          // Закрываем модалку контактов после отправки
          document.getElementById('contactModal').classList.remove('active');
          document.body.style.overflow = '';
        } else {
          const data = await response.json();
          alert('Ошибка: ' + (data.error || 'Попробуйте позже.'));
        }
      } catch (error) {
        alert('Ошибка сети. Проверьте подключение.');
        console.error(error);
      }
    });
  }

  // ----- Параллакс Hero-фона -----
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      heroBg.style.transform = `translateY(${window.scrollY * 0.4}px)`;
    });
  }

});
