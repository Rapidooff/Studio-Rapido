// Base de questions/réponses locales par mots-clés
// Base de questions/réponses locales
const faqMapping = {
  "quels services proposez-vous": 
    "Studio Rapido propose des sites vitrines, e‑commerce, prototypes iOS, intégration d’IA sur-mesure, animations Web et refontes UX/UI.",
  "délais moyens de livraison": 
    "Nos délais vont de 2 jours pour un site simple à 2 semaines pour un projet complet avec IA et animations avancées.",
  "comment demander un devis": 
    "Rien de plus simple : clique sur “Demander un devis”, choisis ta formule et ajoute tes options. Tu recevras un email récapitulatif immédiatement.",
  "qu'est-ce qu'un site vitrine": 
    "Un site vitrine est une présence web de 1 à 6 pages, idéale pour présenter ton activité ou ton portfolio.",
  "technologies utilisées": 
    "Nous utilisons HTML5, CSS3, JavaScript (ES6+), animations ScrollReveal et intégrons des IA via l’API OpenAI ou des solutions locales LLaMA.",
  "qui est raphaël haddad":
    "Raphaël Haddad est le fondateur et développeur principal de Studio Rapido, passionné de web, design et IA.",
  "fondateur de studio rapido":
    "Studio Rapido a été fondé par Raphaël Haddad pour offrir des sites web modernes, animés et intelligents.",
  "qui est raphael":
    "Raphaël Haddad, c’est moi ! Je crée des expériences web stylées, animées et intégrant de l’IA sur mesure.",
  "qui est raphaël":
    "Raphaël Haddad est un développeur web et IA basé en Île-de-France, fondateur de Studio Rapido."
};
const faqKeywords = [
  {
    keywords: ["services", "proposez", "propositions", "offres"],
    answer: "Studio Rapido propose des sites vitrines, e‑commerce, prototypes iOS, intégration d’IA sur-mesure, animations Web et refontes UX/UI."
  },
  {
    keywords: ["délais", "livraison", "temps", "délai"],
    answer: "Nos délais vont de 2 jours pour un site simple à 2 semaines pour un projet complet avec IA et animations avancées."
  },
  {
    keywords: ["devis", "demander", "commande"],
    answer: "Clique sur “Demander un devis”, choisis ta formule et ajoute tes options. Tu recevras un email récapitulatif immédiatement."
  },
  {
    keywords: ["site vitrine", "présentation", "présenter", "mini site"],
    answer: "Un site vitrine est une présence web de 1 à 6 pages, idéale pour présenter ton activité ou ton portfolio."
  },
  {
    keywords: ["technologies", "tech", "langages", "outils"],
    answer: "Nous utilisons HTML5, CSS3, JavaScript (ES6+), animations ScrollReveal et intégrons des IA via l’API OpenAI ou des solutions locales LLaMA."
  },
  {
    keywords: ["raphaël", "raphael", "haddad", "fondateur", "créateur", "studio rapido"],
    answer: "Raphaël Haddad est le fondateur de Studio Rapido, passionné de web, design et IA basé en Île-de-France."
  }
];

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
  if (!counters.length) return;
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
  const links = document.querySelectorAll('nav a');
  if (!links.length) return;
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
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
  const links = document.querySelectorAll('nav a[href="index.html"]');
  if (!links.length) return;
  links.forEach(link => {
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

// ==== INIT AURION ====
function initAurion() {
  const panel       = document.getElementById('aurion-panel');
  const overlay     = document.getElementById('aurion-overlay');
  const toggleBtn   = document.getElementById('aurion-toggle');
  const notifBubble = document.getElementById('aurion-notif');
  const chatInput   = document.getElementById('chat-input');
  const chatSend    = document.getElementById('chat-send');
  const chatArea    = document.getElementById('chat-messages');

  // Ouvre ou ferme le panneau Aurion
  function togglePanel(open) {
    panel.classList.toggle('show', open);
    panel.classList.toggle('hidden', !open);
    overlay.classList.toggle('show', open);
    notifBubble?.classList.add('hidden');
    if (open) chatInput.focus();
  }

  // Ajoute une bulle de message
  function appendMessage(who, text) {
    const msg = document.createElement('div');
    msg.classList.add('chat-message', who);
    msg.textContent = text;
    chatArea.append(msg);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  // Envoie du message
  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    appendMessage('user', text);
    chatInput.value = '';

    // --- Réponse instantanée depuis la base FAQ par mots-clés ---
    const match = faqKeywords.find(entry =>
      entry.keywords.some(k => text.toLowerCase().includes(k))
    );
    if (match) {
      appendMessage('bot', match.answer);
      return;
    }

    // bulle « en attente »
    const loader = document.createElement('div');
    loader.classList.add('chat-message', 'bot');
    loader.textContent = '⏳ Aurion réfléchit…';
    chatArea.append(loader);
    chatArea.scrollTop = chatArea.scrollHeight;

    try {
      const reply = await askAurion(text);           // votre fetch
      loader.remove();
      appendMessage('bot', reply);
    } catch (e) {
      loader.remove();
      appendMessage('bot', "Oops, une erreur est survenue.");
      console.error(e);
    }
  }

  // Clic sur le toggle 🤖
  toggleBtn.addEventListener('click', e => {
    e.stopPropagation();
    togglePanel(!panel.classList.contains('show'));
  });

  // Clic hors du panneau ou sur l’overlay ferme
  overlay.addEventListener('click', () => togglePanel(false));
  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && e.target !== toggleBtn) {
      togglePanel(false);
    }
  });

  // Envoi au clic sur le bouton « Envoyer »
  chatSend.addEventListener('click', sendMessage);

  // Envoi à la touche Enter
  chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  });

  // Timer de notification si inactif…
  let notified = false, timer;
  function notify() {
    if (!notified && panel.classList.contains('hidden')) {
      notifBubble?.classList.remove('hidden');
      notified = true;
    }
  }
  function resetNotifTimer() {
    clearTimeout(timer);
    if (!notified) timer = setTimeout(notify, 30000);
  }
  ['mousemove','keydown','scroll','click'].forEach(evt =>
    window.addEventListener(evt, resetNotifTimer)
  );
  resetNotifTimer();
}

// ==== APPEL À L’API AURION ====
async function askAurion(question) {
  const res = await fetch('https://ton-proxy.replit.app/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: question })
  });
  const data = await res.json();
  if (!data.reply) throw new Error('Pas de réponse');
  return data.reply;
}

// Au chargement de la page
document.addEventListener('DOMContentLoaded', initAurion);

// 8. Redirect "Choisir cette formule" Buttons
function initFormRedirect() {
  const sections = document.querySelectorAll('.cta-choisir');
  if (!sections.length) return;
  sections.forEach(button => {
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

// 9. Aurion Close Button
document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.querySelector(".aurion-popup .close-btn");
  const popup = document.querySelector(".aurion-popup");

  if (closeBtn && popup) {
    closeBtn.addEventListener("click", () => {
      popup.classList.add("hidden");
    });
  }
});

// Initialize everything once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initCounters();
  initActiveNavLink();
  initPrefillContact();
  initSmoothScroll();
  initDarkMode();
  initFormRedirect();
});
// Update triggered - Aurion logic synced
// 🔄 Commit déclenché - Sync Aurion logique
var sidenav = document.getElementById("mySidenav");
var openBtn = document.getElementById("openBtn");
var closeBtn = document.getElementById("closeBtn");

openBtn.onclick = openNav;
closeBtn.onclick = closeNav;

// Ouvre le menu burger
function openNav() {
  sidenav.classList.add("active");
}

// Ferme le menu burger
function closeNav() {
  sidenav.classList.remove("active");
}