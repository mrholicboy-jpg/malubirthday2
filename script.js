const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const letter = document.getElementById('birthday-letter');
const envelope = document.getElementById('open-letter');
const scrollToElement = (element) => element.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });

function openLetter() {
  letter.hidden = false;
  envelope.setAttribute('aria-expanded', 'true');
  envelope.hidden = true;
  letter.focus({ preventScroll: true });
  scrollToElement(letter);
}
envelope.addEventListener('click', openLetter);
document.getElementById('character-button').addEventListener('click', openLetter);
document.getElementById('close-letter').addEventListener('click', () => {
  letter.hidden = true;
  envelope.hidden = false;
  envelope.setAttribute('aria-expanded', 'false');
  envelope.focus({ preventScroll: true });
  scrollToElement(document.getElementById('letter'));
});

const scene = document.getElementById('character-scene');
const characterButton = document.getElementById('character-button');
scene.addEventListener('pointermove', (event) => {
  if (reducedMotion.matches || event.pointerType !== 'mouse') return;
  const bounds = scene.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  characterButton.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 5}deg)`;
});
scene.addEventListener('pointerleave', () => characterButton.style.transform = '');

const notes = {
  heavy: {
    title: 'You don’t have to carry it alone.',
    body: 'Malu, take a breath. You do not have to untangle everything tonight. Let this moment be small: a sip of water, your feet on the floor, one slow breath. If you want company, reach for me. Tell me as much or as little as you can. I want to help you carry what feels too heavy today.'
  },
  doubt: {
    title: 'You have nothing to prove here.',
    body: 'A difficult day can make you forget so much about yourself. Please give yourself time before believing every unkind thought. You are allowed to learn, change your mind, and begin again. I care about the person you are while you are still figuring things out. You have nothing to prove here. Take the next step gently, Malu.'
  },
  miss: {
    title: 'A little piece of me, right here.',
    body: 'Here is a little piece of my heart you can find whenever you need it. Look at our photographs. Think of the moments that are already ours, and all the ordinary ones still waiting. Send me a little “hey” when you want to. You do not need a special reason. I will always be glad to hear from you.'
  }
};
const noteDialog = document.getElementById('note-dialog');
const photoDialog = document.getElementById('photo-dialog');
function showDialog(dialog) {
  dialog.showModal();
  document.body.classList.add('dialog-open');
}
document.querySelectorAll('[data-note]').forEach((button) => {
  button.addEventListener('click', () => {
    const note = notes[button.dataset.note];
    document.getElementById('note-dialog-title').textContent = note.title;
    document.getElementById('note-dialog-body').textContent = note.body;
    showDialog(noteDialog);
  });
});
document.querySelectorAll('[data-photo]').forEach((button) => {
  button.addEventListener('click', () => {
    const largePhoto = document.getElementById('large-photo');
    largePhoto.src = button.dataset.photo;
    largePhoto.alt = button.querySelector('img').alt;
    document.getElementById('photo-dialog-caption').textContent = button.dataset.caption;
    showDialog(photoDialog);
  });
});
document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
});

const wishButton = document.getElementById('wish-button');
const wishMessage = document.getElementById('wish-message');
const wishReset = document.getElementById('wish-reset');
function celebrate() {
  if (reducedMotion.matches) return;
  const layer = document.getElementById('confetti');
  layer.replaceChildren();
  for (let i = 0; i < 48; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.textContent = i % 3 === 0 ? '♡' : '✧';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.color = ['#dfb98b', '#e7bcd6', '#f5e5cc'][i % 3];
    piece.style.setProperty('--duration', `${3 + Math.random() * 2}s`);
    piece.style.setProperty('--delay', `${Math.random() * .6}s`);
    piece.style.setProperty('--drift', `${Math.random() * 120 - 60}px`);
    layer.appendChild(piece);
  }
  setTimeout(() => layer.replaceChildren(), 6000);
}
wishButton.addEventListener('click', () => {
  if (wishButton.getAttribute('aria-pressed') === 'true') return;
  wishButton.classList.add('blown');
  wishButton.setAttribute('aria-pressed', 'true');
  wishButton.setAttribute('aria-label', 'Your birthday wish has been made');
  wishMessage.replaceChildren();
  const title = document.createElement('p');
  title.className = 'wish-title';
  title.textContent = 'Whatever you wished for, I’m wishing it for you, too.';
  const sub = document.createElement('p');
  sub.className = 'wish-instruction';
  sub.textContent = 'May this year be gentle with your heart, Malu. ♡';
  wishMessage.append(title, sub);
  wishReset.hidden = false;
  celebrate();
});
wishReset.addEventListener('click', () => {
  wishButton.classList.remove('blown');
  wishButton.setAttribute('aria-pressed', 'false');
  wishButton.setAttribute('aria-label', 'Make a birthday wish and blow out the candle');
  wishMessage.innerHTML = '<p class="wish-title">One more thing. Make a wish.</p><p class="wish-instruction">Close your eyes for a moment. Then tap the flame.</p>';
  wishReset.hidden = true;
  wishButton.focus({ preventScroll: true });
});

// Add the supplied video here once it arrives. The section stays hidden until then.
const memoryVideoSource = '';
if (memoryVideoSource) {
  document.getElementById('memory-video').src = memoryVideoSource;
  document.getElementById('video-section').hidden = false;
}
