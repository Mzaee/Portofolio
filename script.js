const year = document.getElementById('year');
const loader = document.querySelector('.page-loader');
const progress = document.querySelector('.loader-progress span');
const counter = document.querySelector('.loader-meta strong');
const menu = document.querySelector('.mobile-menu');
const menuToggle = document.querySelector('.menu-toggle');
const menuClose = document.querySelector('.menu-close');
const modal = document.querySelector('.contact-modal');
const modalClose = document.querySelector('.modal-close');
const contactForm = document.querySelector('.modal-card form');
const successMessage = document.querySelector('.form-success');

if (year) year.textContent = new Date().getFullYear();

const projectCarousel = document.getElementById('projectCarousel');
const projectButtons = document.querySelectorAll('.project-scroll-btn');

projectButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (!projectCarousel) return;
    const direction = button.dataset.dir === 'next' ? 1 : -1;
    const cardWidth = projectCarousel.querySelector('.project-card')?.getBoundingClientRect().width || 340;
    projectCarousel.scrollBy({ left: direction * (cardWidth + 20), behavior: 'smooth' });
  });
});

const openModal = (event) => {
  if (event) event.preventDefault();
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
};

const closeModal = () => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  if (contactForm) contactForm.reset();
  if (successMessage) successMessage.style.display = 'none';
  if (contactForm) contactForm.style.display = 'grid';
};

document.querySelectorAll('a[href="#contact"]').forEach((link) => link.addEventListener('click', openModal));
modalClose?.addEventListener('click', closeModal);
modal?.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  contactForm.style.display = 'none';
  successMessage.style.display = 'block';
});

const toggleMenu = (isOpen) => {
  menu.classList.toggle('open', isOpen);
  menu.setAttribute('aria-hidden', String(!isOpen));
  menuToggle?.setAttribute('aria-expanded', String(isOpen));
};

menuToggle?.addEventListener('click', () => toggleMenu(true));
menuClose?.addEventListener('click', () => toggleMenu(false));
menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => toggleMenu(false)));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    toggleMenu(false);
    closeModal();
  }
});

if (loader && progress && counter) {
  const startedAt = performance.now();
  const duration = 1300;
  const tick = (now) => {
    const t = Math.min((now - startedAt) / duration, 1);
    const eased = t < 0.5 ? 4 * t ** 3 : 1 - ((-2 * t + 2) ** 3) / 2;
    const value = Math.round(eased * 100);
    progress.style.width = `${value}%`;
    counter.textContent = String(value).padStart(3, '0');
    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      loader.classList.add('done');
      window.setTimeout(() => loader.remove(), 750);
    }
  };
  requestAnimationFrame(tick);
}
