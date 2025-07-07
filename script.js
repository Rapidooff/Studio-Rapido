// Utility: debounce function
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// 1. Animated Counters
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        let count = 0;
        const speed = target / 60;
        (function update() {
          count += speed;
          if (count < target) {
            el.textContent = Math.floor(count);
            requestAnimationFrame(update);
          } else {
            el.textContent = target;
          }
        })();
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

// 2. Active Nav Link Highlight
function initActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === currentPage);
  });
}

// 3. Prefill Contact Page from URL
function initPrefillContact() {
  const params = new URLSearchParams(window.location.search);
  const formula = params.get('formule');
  const options = params.get('options');
  const total = params.get('total');
  if (!formula && !options && !total) return;

  const labels = {
    starter: "🚀 Formule Starter",
    pro: "⚡ Formule Pro",
    surmesure: "🎨 Formule Sur-Mesure",
    ultra: "🌟 Formule Ultra"
  };
  const formulaField = document.getElementById('projectType');
  const budgetField = document.getElementById('budget');
  const messageField = document.getElementById('message');
  const banner = document.getElementById('formula-selected');

  if (formula && formulaField) {
    const opt = [...formulaField.options].find(o => o.value === formula.toLowerCase());
    if (opt) {
      formulaField.value = opt.value;
      formulaField.dispatchEvent(new Event('change'));
    }
    if (banner && labels[formula]) {
      banner.textContent = `Tu as choisi la ${labels[formula]} — tout est prérempli 👌`;
      banner.style.display = 'block';
    }
  }
  if (total && budgetField) {
    budgetField.value = total;
    budgetField.readOnly = true;
  }
  if (options && messageField) {
    messageField.value = `📌 Options sélectionnées : ${options}\n\n${messageField.value}`;
  }
}

// 4. Smooth Scroll for Home Link
function initSmoothScroll() {
  document.querySelectorAll('nav a[href="index.html"]').forEach(link => {
    link.addEventListener('click', e => {
      if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}

// 5. Dark Mode Toggle
function initDarkMode() {
  const toggle = document.getElementById('darkModeToggle');
  if (!toggle) return;
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    document.querySelectorAll('section').forEach(s => s.classList.add('visible'));
  }
  toggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.querySelectorAll('section').forEach(s => s.classList.add('visible'));
  });
}

// 6. Burger Menu Mobile
function initBurgerMenu() {
  const burger = document.getElementById('menu-toggle');
  const menu = document.getElementById('main-menu');
  const overlay = document.getElementById('menu-overlay');
  const pageContent = document.getElementById('page-content');
  if (!burger || !menu) return;

  function closeMenu() {
    burger.classList.remove('open');
    burger.textContent = '☰';
    menu.classList.remove('show');
    overlay && overlay.classList.remove('show');
    document.body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    if (pageContent) {
      pageContent.classList.remove('hidden');
      pageContent.classList.add('visible');
    }
  }

  burger.setAttribute('aria-controls', 'main-menu');
  burger.setAttribute('aria-expanded', 'false');

  burger.addEventListener('click', () => {
    if (window.innerWidth > 768) return;
    const open = menu.classList.toggle('show');
    burger.classList.toggle('open', open);
    burger.textContent = open ? '✖' : '☰';
    burger.setAttribute('aria-expanded', open.toString());
    document.body.classList.toggle('menu-open', open);
    overlay && overlay.classList.toggle('show', open);
    if (pageContent) {
      pageContent.classList.toggle('hidden', open);
      pageContent.classList.toggle('visible', !open);
    }
  });

  overlay && overlay.addEventListener('click', closeMenu);
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  window.addEventListener('resize', debounce(() => {
    if (window.innerWidth > 768) closeMenu();
  }, 200));
}

// 7. Aurion Notification Timer and Chat
function initAurion() {
  let hasNotified = false;
  let timer;
  const panel = document.getElementById('aurion-panel');
  const bubble = document.getElementById('aurion-notif');
  const btn = document.getElementById('aurion-toggle');

  function notify() {
    if (panel && bubble && panel.classList.contains('hidden') && !hasNotified) {
      bubble.classList.remove('hidden');
      hasNotified = true;
    }
  }

  function resetTimer() {
    clearTimeout(timer);
    if (hasNotified) return;
    timer = setTimeout(notify, 30000);
  }

  ['mousemove', 'keydown', 'scroll', 'click'].forEach(evt => window.addEventListener(evt, resetTimer));
  resetTimer();

  btn && btn.addEventListener('click', () => {
    bubble && bubble.classList.add('hidden');
    hasNotified = false;
    resetTimer();
  });

  const form = document.getElementById('aurion-form');
  form && form.addEventListener('submit', e => {
    e.preventDefault();
    const input = document.getElementById('aurion-input');
    const msg = input.value.trim();
    if (msg) {
      document.getElementById('aurion-response').textContent = '⏳ Aurion réfléchit...';
      askAurion(msg);
      input.value = '';
    }
  });
}

// Aurion fetch logic (unchanged)
async function askAurion(question) {
  try {
    const response = await fetch("https://ton-proxy.replit.app/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: question })
    });

    const data = await response.json();
    if (data.reply) {
      document.getElementById("aurion-response").textContent = data.reply;
    } else {
      document.getElementById("aurion-response").textContent = "Une erreur est survenue.";
    }
  } catch (error) {
    console.error("Erreur Aurion:", error);
    document.getElementById("aurion-response").textContent = "Erreur de connexion à l'IA.";
  }
}

// 8. Redirect "Choisir cette formule" Buttons
function initFormRedirect() {
  document.querySelectorAll('.cta-choisir').forEach(button => {
    button.addEventListener('click', e => {
      e.preventDefault();
      const section = button.closest('.tarif-content');
      const formula = section.id.toLowerCase();
      const base = parseInt(section.querySelector('.price strong').textContent.replace(/\D/g, ''), 10) || 0;
      let optsTotal = 0;
      const selected = [];
      section.querySelectorAll('.option').forEach(cb => {
        if (cb.checked) {
          selected.push(cb.parentElement.textContent.trim());
          optsTotal += parseInt(cb.dataset.price, 10) || 0;
        }
      });
      const total = `${base + optsTotal}€`;
      const url = new URL('contact.html', window.location.origin);
      url.searchParams.set('formule', formula);
      selected.length && url.searchParams.set('options', selected.join(', '));
      url.searchParams.set('total', total);
      window.location.href = url.toString();
    });
  });
}

// Initialize everything once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initCounters();
  initActiveNavLink();
  initPrefillContact();
  initSmoothScroll();
  initDarkMode();
  initBurgerMenu();
  initAurion();
  initFormRedirect();
});