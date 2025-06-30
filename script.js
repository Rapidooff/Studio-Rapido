// Compteurs animés dans la section stats (toutes pages)
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  let count = 0;
  const speed = target / 60;

  const update = () => {
    count += speed;
    if (count < target) {
      el.textContent = Math.floor(count);
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  };
  update();
}

document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll('.counter');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => {
    observer.observe(counter);
  });

  // Ajout d'une gestion active du bouton de navigation selon la page
  const currentPage = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach(link => {
    const linkHref = link.getAttribute("href");
    if (linkHref === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});

// Empêche le rechargement de la page d'accueil si on clique sur le lien "Accueil"
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if ((window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '') && href === 'index.html') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});