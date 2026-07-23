// === Модальные окна ===
(function() {
    const modals = {
        contact: document.getElementById('contactModal'),
        privacy: document.getElementById('privacyModal'),
        consent: document.getElementById('consentModal')
    };

    // Диагностика
    for (const [key, modal] of Object.entries(modals)) {
        if (!modal) console.error('Модалка ' + key + ' не найдена!');
    }

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

    // Закрытие (крестик и оверлей)
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

    // Кнопки "Контакты" и "Поддержать проект"
    const contactLink = document.getElementById('contactLink');
    const heroSupportBtn = document.getElementById('heroSupportBtn');
    if (contactLink) contactLink.addEventListener('click', (e) => { e.preventDefault(); openModal('contact'); });
    if (heroSupportBtn) heroSupportBtn.addEventListener('click', (e) => { e.preventDefault(); openModal('contact'); });

    // Все data-modal кнопки (Политика, Согласие)
    document.querySelectorAll('[data-modal]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            console.log('Клик по data-modal, открываем:', modalId); // ← смотрите в консоли
            openModal(modalId);
        });
    });

})();
