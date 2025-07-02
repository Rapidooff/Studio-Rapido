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

// Gestion du thème clair/sombre
document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('darkModeToggle');
  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      document.body.classList.toggle('light-mode');
    });
  }
});

let aurionNotifTimer;
let hasNotified = false;

function resetAurionNotifTimer() {
  clearTimeout(aurionNotifTimer);
  if (hasNotified) return;

  aurionNotifTimer = setTimeout(() => {
    const aurionPanel = document.getElementById("aurion-panel");
    const notifBubble = document.getElementById("aurion-notif");
    if (aurionPanel && notifBubble && aurionPanel.classList.contains("hidden")) {
      notifBubble.classList.remove("hidden");
      hasNotified = true;
    }
  }, 30000); // 30 sec
}

["mousemove", "keydown", "scroll", "click"].forEach(event => {
  window.addEventListener(event, resetAurionNotifTimer);
});

const aurionBtn = document.getElementById("aurion-toggle");
if (aurionBtn) {
  aurionBtn.addEventListener('click', () => {
    const notifBubble = document.getElementById("aurion-notif");
    if (notifBubble) {
      notifBubble.classList.add("hidden");
    }
    hasNotified = false;
    resetAurionNotifTimer();
  });
}

resetAurionNotifTimer();

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

const aurionForm = document.getElementById("aurion-form");
if (aurionForm) {
  aurionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("aurion-input");
    const question = input.value.trim();
    if (question) {
      document.getElementById("aurion-response").textContent = "⏳ Aurion réfléchit...";
      askAurion(question);
      input.value = "";
    }
  });
}