/* ─── LINE NUMBERS ──────────────────────────────────────── */
function renderLineNumbers() {
  const lines = document.querySelectorAll('.code-line');
  const gutter = document.getElementById('lineNums');
  if (!gutter) return;
  gutter.innerHTML = Array.from({ length: lines.length }, (_, i) =>
    `<div>${i + 1}</div>`
  ).join('');
}
renderLineNumbers();

/* ─── TYPING ANIMATION ──────────────────────────────────── */
const nameEl = document.getElementById('typedName');
const nameText = '# Puranjay Haldankar';
let charIdx = 0;
function typeChar() {
  if (!nameEl) return;
  if (charIdx < nameText.length) {
    nameEl.textContent += nameText[charIdx++];
    setTimeout(typeChar, 55 + Math.random() * 30);
  } else {
    // hide cursor after done
    setTimeout(() => {
      const cur = document.querySelector('.ln-h1 + .cursor, #typedName + .cursor');
      if (cur) cur.style.opacity = '0';
    }, 800);
  }
}
setTimeout(typeChar, 500);

/* ─── COUNTER ANIMATION ─────────────────────────────────── */
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  function tick() {
    start += step;
    if (start >= target) {
      el.textContent = target.toLocaleString() + '+';
      return;
    }
    el.textContent = Math.floor(start).toLocaleString();
    requestAnimationFrame(tick);
  }
  tick();
}
const counterEl = document.querySelector('.counter');
if (counterEl) {
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCounter(counterEl, parseInt(counterEl.dataset.target));
      obs.disconnect();
    }
  });
  obs.observe(counterEl);
}

/* ─── SCROLL REVEAL ─────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.06 });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 8) * 0.06}s`;
  revealObserver.observe(el);
});

/* ─── STAGGER DELAYS ────────────────────────────────────── */
document.querySelectorAll('.work-entry').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.05}s`;
});

/* ─── EXPANDABLE PROJECTS ───────────────────────────────── */
function toggleProject(id) {
  const block = document.querySelector(`[data-proj="${id}"]`);
  if (!block) return;
  block.classList.toggle('expanded');
}

/* ─── FILE / SECTION MAP ────────────────────────────────── */
const fileMap = {
  'about':    { file: 'about.md',    lang: 'Markdown' },
  'work':     { file: 'work.json',   lang: 'JSON' },
  'projects': { file: 'projects.ts', lang: 'TypeScript' },
  'awards':   { file: 'awards.yml',  lang: 'YAML' },
  'life':     { file: 'hobbies.jsx', lang: 'JavaScript JSX' },
  'contact':  { file: 'contact.sh',  lang: 'Shell Script' },
};

const sections     = document.querySelectorAll('.code-section[id]');
const treeFiles    = document.querySelectorAll('.tree-file');
const tabBar       = document.getElementById('tabBar');
const bcFile       = document.getElementById('breadcrumbFile');
const statusFile   = document.getElementById('statusFile');
const openEditorEl = document.querySelector('.open-editor');

let currentFile = 'about.md';
const openTabs  = new Set(['about.md']);

function setActiveFile(id) {
  const meta = fileMap[id];
  if (!meta) return;
  const { file, lang } = meta;

  treeFiles.forEach(f => f.classList.toggle('active', f.dataset.file === file));
  if (bcFile) bcFile.textContent = file;
  if (statusFile) statusFile.textContent = lang;

  if (!openTabs.has(file)) {
    openTabs.add(file);
    const ext = file.split('.').pop();
    const tab = document.createElement('div');
    tab.className = 'tab';
    tab.dataset.file = file;
    tab.innerHTML = `<span class="file-icon ${ext}"></span>${file}<span class="tab-close">✕</span>`;
    // insert before cmd-hint-tab
    const hint = document.getElementById('cmdHint');
    tabBar.insertBefore(tab, hint);
  }

  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('active', t.dataset.file === file);
  });

  if (openEditorEl) {
    const ext = file.split('.').pop();
    openEditorEl.innerHTML = `<span class="file-icon ${ext}"></span>${file}<span class="editor-close">✕</span>`;
  }

  currentFile = file;
}

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setActiveFile(entry.target.id);
  });
}, {
  root: document.querySelector('.editor-content'),
  threshold: 0.2
});
sections.forEach(s => sectionObserver.observe(s));

/* ─── STATUS BAR — line tracking ───────────────────────── */
const editorContent = document.querySelector('.editor-content');
const statusLn = document.getElementById('statusLn');
const lines = document.querySelectorAll('.code-line');
if (editorContent && statusLn && lines.length) {
  editorContent.addEventListener('scroll', () => {
    const lineH = editorContent.scrollHeight / lines.length;
    const ln = Math.max(1, Math.round(editorContent.scrollTop / lineH) + 1);
    statusLn.textContent = `Ln ${ln}, Col 1`;
  });
}

/* ─── SIDEBAR TREE TOGGLE ───────────────────────────────── */
const treeRoot     = document.getElementById('treeRoot');
const treeChildren = document.getElementById('treeChildren');
if (treeRoot && treeChildren) {
  treeRoot.addEventListener('click', () => {
    const open = treeRoot.classList.toggle('open');
    treeChildren.style.display = open ? '' : 'none';
    treeRoot.querySelector('.tree-arrow').textContent = open ? '▾' : '▸';
  });
}

/* ─── SMOOTH SCROLL FROM SIDEBAR + LINKS ───────────────── */
document.querySelectorAll('.tree-file, a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── TAB CLICK NAVIGATION ──────────────────────────────── */
tabBar.addEventListener('click', (e) => {
  const closeBtn = e.target.closest('.tab-close');
  const tab      = e.target.closest('.tab');
  if (!tab) return;

  const file = tab.dataset.file;
  if (closeBtn) {
    e.stopPropagation();
    if (document.querySelectorAll('.tab').length === 1) return;
    tab.remove();
    openTabs.delete(file);
    const firstTab = document.querySelector('.tab');
    if (firstTab) {
      const activeFile = firstTab.dataset.file;
      const sectionId  = Object.keys(fileMap).find(k => fileMap[k].file === activeFile);
      if (sectionId) {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveFile(sectionId);
      }
    }
    return;
  }

  const sectionId = Object.keys(fileMap).find(k => fileMap[k].file === file);
  if (!sectionId) return;
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setActiveFile(sectionId);
});

/* ─── COMMAND PALETTE ───────────────────────────────────── */
const cmdOverlay = document.getElementById('cmdOverlay');
const cmdInput   = document.getElementById('cmdInput');
const cmdResults = document.querySelectorAll('.cmd-result');
const cmdHint    = document.getElementById('cmdHint');

function openPalette() {
  cmdOverlay.classList.add('open');
  setTimeout(() => cmdInput?.focus(), 50);
}
function closePalette() {
  cmdOverlay.classList.remove('open');
  if (cmdInput) cmdInput.value = '';
  cmdResults.forEach(r => r.classList.remove('active'));
  if (cmdResults[0]) cmdResults[0].classList.add('active');
}

cmdHint?.addEventListener('click', openPalette);
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'p') { e.preventDefault(); openPalette(); }
  if (e.key === 'Escape') closePalette();
});
cmdOverlay.addEventListener('click', e => { if (e.target === cmdOverlay) closePalette(); });

cmdResults.forEach(r => {
  r.addEventListener('click', () => {
    const href = r.dataset.href;
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    closePalette();
  });
});

// filter results on input
cmdInput?.addEventListener('input', () => {
  const q = cmdInput.value.toLowerCase();
  cmdResults.forEach(r => {
    const match = r.textContent.toLowerCase().includes(q);
    r.style.display = match ? '' : 'none';
  });
});
