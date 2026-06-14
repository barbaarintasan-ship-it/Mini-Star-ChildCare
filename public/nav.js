const pages = document.querySelectorAll('.page');
const navButtons = document.querySelectorAll('[data-page]');
function goTo(name){
  pages.forEach(p => p.classList.toggle('active', p.id === 'page-' + name));
  navButtons.forEach(b => b.classList.toggle('active', b.dataset.page === name));
  window.scrollTo({top:0, behavior:'smooth'});
}
navButtons.forEach(btn => btn.addEventListener('click', () => goTo(btn.dataset.page)));
