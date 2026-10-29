/* ==========================================================================
   ROMANTIC BIRTHDAY WEBSITE — JAVASCRIPT ENGINE
   All configurable details, interactions, audio handling, and confetti
   ========================================================================== */

'use strict';

/**
 * CONFIGURATION OBJECT:
 * Edit the values here to personalize the entire website.
 */
const SURPRISE_CONFIG = {
  // 1. His Name
  boyfriendName: "Alex",

  // 2. Your Name or Nickname (for letter sign-off)
  senderName: "Your Girl 💗",

  // 3. Hero Subtitle under Happy Birthday
  heroSubtitle: "Today is all about celebrating you, your kindness, your sweet smile, and the endless warmth you bring into my life every single day.",

  // 4. Romantic Letter Content (Each array entry is a paragraph)
  letter: {
    salutation: "My Dearest Alex,",
    dateText: "On Your Special Day 🌸",
    paragraphs: [
      "Happy Birthday to the man who makes my ordinary world feel completely magical. Every laugh we share, every quiet evening we spend together, and every little moment in between has become one of my favorite memories.",
      "Thank you for being so patient, supportive, and kind. You inspire me with how hard you work and the gentle way you love. Being by your side has brought more peace and joy into my life than words could ever describe.",
      "As you step into another year, my hope for you is simple: endless happiness, health, success in everything your heart desires, and the realization of just how deeply loved you are. I will always be right here, cheering you on through every dream you chase."
    ]
  },

  // 5. Photo Captions (Corresponds to images/photo1.jpg - photo6.jpg)
  photoCaptions: [
    "Your handsome smile that always brightens my day ✨",
    "My favorite place in the whole world is with you 💕",
    "The sweet laughter and inside jokes we will never forget 💫",
    "Every road trip and adventure is better by your side 🌅",
    "The peaceful warmth and comfort you always bring me 🧸",
    "Celebrating you today, tomorrow, and every year to come 🥂"
  ],

  // 6. Section 5 Hidden Surprise Message
  hiddenSurpriseMessage: "No matter how many birthdays pass, I will always be cheering for your happiness. You deserve all the love, peace, and beautiful things life has to offer. Happy Birthday, My Love! ❤️"
};

/* ==========================================================================
   INITIALIZATION & DOM POPULATION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  populatePersonalDetails();
  initWelcomeScreen();
  initMusicPlayer();
  initPhotoGallery();
  initLetterInteraction();
  initSurpriseBox();
  initConfetti();
  initBackgroundHearts();
  initReplayAction();
});

/**
 * Populates all configured strings into the DOM safely.
 */
function populatePersonalDetails() {
  // Update Hero Name
  const heroNameEl = document.getElementById('heroRecipientName');
  if (heroNameEl) heroNameEl.textContent = SURPRISE_CONFIG.boyfriendName;

  // Update Hero Subtitle
  const heroSubtitleEl = document.getElementById('heroSubtitle');
  if (heroSubtitleEl) heroSubtitleEl.textContent = SURPRISE_CONFIG.heroSubtitle;

  // Update Footer Name
  const footerNameEl = document.getElementById('footerRecipientName');
  if (footerNameEl) footerNameEl.textContent = SURPRISE_CONFIG.boyfriendName;

  // Update Letter
  const letterSalutation = document.getElementById('letterSalutation');
  if (letterSalutation) letterSalutation.textContent = SURPRISE_CONFIG.letter.salutation;

  const letterDate = document.getElementById('letterDate');
  if (letterDate) letterDate.textContent = SURPRISE_CONFIG.letter.dateText;

  const letterSender = document.getElementById('letterSenderName');
  if (letterSender) letterSender.textContent = SURPRISE_CONFIG.senderName;

  const letterBody = document.getElementById('letterBody');
  if (letterBody) {
    letterBody.innerHTML = '';
    SURPRISE_CONFIG.letter.paragraphs.forEach(paragraphText => {
      const p = document.createElement('p');
      p.textContent = paragraphText;
      letterBody.appendChild(p);
    });
  }

  // Update Captions
  SURPRISE_CONFIG.photoCaptions.forEach((captionText, index) => {
    const captionEl = document.getElementById(`caption-${index}`);
    if (captionEl) captionEl.textContent = captionText;
  });

  // Update Hidden Surprise
  const surpriseTextEl = document.getElementById('hiddenSurpriseText');
  if (surpriseTextEl) surpriseTextEl.textContent = SURPRISE_CONFIG.hiddenSurpriseMessage;
}

/* ==========================================================================
   SECTION 1: WELCOME SCREEN REVEAL
   ========================================================================== */
function initWelcomeScreen() {
  const welcomeScreen = document.getElementById('welcomeScreen');
  const mainContent = document.getElementById('mainContent');
  const openSurpriseBtn = document.getElementById('openSurpriseBtn');
  const scrollToGalleryBtn = document.getElementById('scrollToGalleryBtn');

  if (!openSurpriseBtn) return;

  openSurpriseBtn.addEventListener('click', () => {
    // Reveal main page
    welcomeScreen.classList.add('is-dismissed');
    mainContent.classList.remove('is-hidden');
    mainContent.removeAttribute('aria-hidden');

    // Trigger celebratory confetti on reveal
    triggerConfetti(60);

    // Attempt gentle music start if permitted by user agent
    const bgAudio = document.getElementById('bgMusic');
    if (bgAudio) {
      bgAudio.play().then(() => {
        updateMusicPlayerState(true);
      }).catch(() => {
        // Autoplay restrictions handle gracefully
        updateMusicPlayerState(false);
      });
    }
  });

  // Scroll to gallery button
  if (scrollToGalleryBtn) {
    scrollToGalleryBtn.addEventListener('click', () => {
      const gallery = document.getElementById('gallerySection');
      if (gallery) {
        gallery.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/* ==========================================================================
   SECTION 6: BACKGROUND MUSIC PLAYER
   ========================================================================== */
let isMusicPlaying = false;

function initMusicPlayer() {
  const audio = document.getElementById('bgMusic');
  const toggleBtn = document.getElementById('musicToggleBtn');
  const statusLabel = document.getElementById('musicStatus');

  if (!audio || !toggleBtn) return;

  // Handle missing audio gracefully without console spam
  audio.addEventListener('error', () => {
    if (statusLabel) statusLabel.textContent = 'Add audio/our-song.mp3';
    toggleBtn.setAttribute('disabled', 'true');
    toggleBtn.style.opacity = '0.5';
    toggleBtn.style.cursor = 'not-allowed';
  });

  toggleBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => {
        updateMusicPlayerState(true);
      }).catch(() => {
        if (statusLabel) statusLabel.textContent = 'Audio not available';
      });
    } else {
      audio.pause();
      updateMusicPlayerState(false);
    }
  });

  audio.addEventListener('ended', () => {
    updateMusicPlayerState(false);
  });
}

function updateMusicPlayerState(playing) {
  isMusicPlaying = playing;
  const player = document.getElementById('musicPlayer');
  const btnIcon = document.getElementById('musicBtnIcon');
  const statusLabel = document.getElementById('musicStatus');
  const toggleBtn = document.getElementById('musicToggleBtn');

  if (playing) {
    player?.classList.add('is-playing');
    if (btnIcon) btnIcon.textContent = '⏸';
    if (statusLabel) statusLabel.textContent = 'Now Playing 💕';
    if (toggleBtn) toggleBtn.setAttribute('aria-label', 'Pause background music');
  } else {
    player?.classList.remove('is-playing');
    if (btnIcon) btnIcon.textContent = '▶';
    if (statusLabel) statusLabel.textContent = 'Music paused';
    if (toggleBtn) toggleBtn.setAttribute('aria-label', 'Play background music');
  }
}

/* ==========================================================================
   SECTION 3: PHOTO GALLERY & LIGHTBOX
   ========================================================================== */
let activePhotoIndex = 0;

function initPhotoGallery() {
  const cards = document.querySelectorAll('.polaroid-card');
  const images = document.querySelectorAll('.polaroid-img');

  // Handle missing photo fallbacks gracefully
  images.forEach(img => {
    img.addEventListener('error', function () {
      this.classList.add('has-error');
    });
  });

  // Lightbox elements
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const prevBtn = document.getElementById('lightboxPrevBtn');
  const nextBtn = document.getElementById('lightboxNextBtn');

  function openLightbox(index) {
    activePhotoIndex = index;
    const currentCard = cards[index];
    const imgEl = currentCard.querySelector('.polaroid-img');
    const captionEl = currentCard.querySelector('.polaroid-caption');

    if (!lightbox || !lightboxImg || !lightboxCaption) return;

    lightboxImg.src = imgEl.src;
    lightboxImg.alt = imgEl.alt || `Memory ${index + 1}`;
    lightboxCaption.textContent = captionEl ? captionEl.textContent : '';

    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    lightboxCloseBtn?.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
    cards[activePhotoIndex]?.focus();
  }

  function navigateLightbox(step) {
    let nextIndex = activePhotoIndex + step;
    if (nextIndex < 0) nextIndex = cards.length - 1;
    if (nextIndex >= cards.length) nextIndex = 0;
    openLightbox(nextIndex);
  }

  // Click & keyboard triggers on cards
  cards.forEach((card, idx) => {
    card.addEventListener('click', () => openLightbox(idx));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(idx);
      }
    });
  });

  lightboxCloseBtn?.addEventListener('click', closeLightbox);
  lightboxOverlay?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', () => navigateLightbox(-1));
  nextBtn?.addEventListener('click', () => navigateLightbox(1));

  // Global keyboard shortcuts for lightbox
  window.addEventListener('keydown', (e) => {
    if (!lightbox || lightbox.hasAttribute('hidden')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

/* ==========================================================================
   SECTION 4: INTERACTIVE LETTER & ENVELOPE
   ========================================================================== */
function initLetterInteraction() {
  const envelope = document.getElementById('envelopeContainer');
  const toggleBtn = document.getElementById('letterToggleBtn');

  if (!envelope || !toggleBtn) return;

  function toggleEnvelope() {
    const isOpen = envelope.classList.toggle('is-open');
    envelope.setAttribute('aria-expanded', isOpen.toString());

    if (isOpen) {
      toggleBtn.textContent = 'Fold the Letter Back ✉️';
      triggerConfetti(35);
    } else {
      toggleBtn.textContent = 'Tap to Open Letter ✉️';
    }
  }

  envelope.addEventListener('click', toggleEnvelope);
  toggleBtn.addEventListener('click', toggleEnvelope);

  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleEnvelope();
    }
  });
}

/* ==========================================================================
   SECTION 5: HIDDEN SURPRISE BOX
   ========================================================================== */
function initSurpriseBox() {
  const triggerBtn = document.getElementById('surpriseRevealBtn');
  const revealBox = document.getElementById('surpriseRevealBox');
  const resetBtn = document.getElementById('resetSurpriseBtn');

  if (!triggerBtn || !revealBox) return;

  triggerBtn.addEventListener('click', () => {
    revealBox.classList.add('is-revealed');
    triggerBtn.style.display = 'none';
    triggerConfetti(80);
  });

  resetBtn?.addEventListener('click', () => {
    revealBox.classList.remove('is-revealed');
    setTimeout(() => {
      triggerBtn.style.display = 'inline-flex';
    }, 400);
  });
}

/* ==========================================================================
   SECTION 7: REPLAY EXPERIENCE ACTION
   ========================================================================== */
function initReplayAction() {
  const replayBtn = document.getElementById('replayWebsiteBtn');
  const welcomeScreen = document.getElementById('welcomeScreen');
  const envelope = document.getElementById('envelopeContainer');
  const letterToggleBtn = document.getElementById('letterToggleBtn');
  const surpriseBox = document.getElementById('surpriseRevealBox');
  const surpriseTriggerBtn = document.getElementById('surpriseRevealBtn');

  if (!replayBtn) return;

  replayBtn.addEventListener('click', () => {
    // Reset Envelope
    envelope?.classList.remove('is-open');
    envelope?.setAttribute('aria-expanded', 'false');
    if (letterToggleBtn) letterToggleBtn.textContent = 'Tap to Open Letter ✉️';

    // Reset Surprise Box
    surpriseBox?.classList.remove('is-revealed');
    if (surpriseTriggerBtn) surpriseTriggerBtn.style.display = 'inline-flex';

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Show welcome screen again after brief delay
    setTimeout(() => {
      welcomeScreen?.classList.remove('is-dismissed');
    }, 500);
  });
}

/* ==========================================================================
   CONFETTI ENGINE (LIGHTWEIGHT VANILLA CANVAS)
   ========================================================================== */
let confettiParticles = [];
let confettiAnimationId = null;

function initConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.007;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.opacity);

      if (p.isHeart) {
        // Draw delicate heart confetti
        const hSize = p.size;
        ctx.beginPath();
        ctx.moveTo(0, -hSize / 2);
        ctx.bezierCurveTo(-hSize / 2, -hSize, -hSize, -hSize / 3, 0, hSize);
        ctx.bezierCurveTo(hSize, -hSize / 3, hSize / 2, -hSize, 0, -hSize / 2);
        ctx.fill();
      } else {
        // Draw rectangular confetti petal
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      }
      ctx.restore();

      if (p.opacity <= 0 || p.y > canvas.height + 20) {
        confettiParticles.splice(i, 1);
      }
    }

    if (confettiParticles.length > 0) {
      confettiAnimationId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(confettiAnimationId);
      confettiAnimationId = null;
    }
  }

  window.triggerConfetti = function(count = 50) {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const colors = ['#e63946', '#e05780', '#ffccd5', '#ffb703', '#ff758f', '#ffffff'];

    for (let i = 0; i < count; i++) {
      confettiParticles.push({
        x: window.innerWidth * 0.5 + (Math.random() * 200 - 100),
        y: window.innerHeight * 0.45 + (Math.random() * 100 - 50),
        size: Math.random() * 10 + 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 1.4) * 10,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        opacity: 1,
        isHeart: Math.random() > 0.4
      });
    }

    if (!confettiAnimationId) {
      confettiAnimationId = requestAnimationFrame(render);
    }
  };
}

/* ==========================================================================
   FLOATING BACKGROUND HEARTS (LIGHTWEIGHT PETALS)
   ========================================================================== */
function initBackgroundHearts() {
  const container = document.getElementById('floatingHeartsBg');
  if (!container) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const heartSymbols = ['💗', '🤍', '🌸', '✨', '💖'];
  const totalHearts = 15;

  for (let i = 0; i < totalHearts; i++) {
    const heart = document.createElement('span');
    heart.className = 'heart-particle';
    heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.animationDelay = `${Math.random() * 10}s`;
    heart.style.animationDuration = `${10 + Math.random() * 8}s`;
    heart.style.fontSize = `${0.8 + Math.random() * 0.9}rem`;
    container.appendChild(heart);
  }
}