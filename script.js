/* ─── LINE NUMBERS ──────────────────────────────────────── */
// Count .code-line elements and populate the gutter
function renderLineNumbers() {
  const lines = document.querySelectorAll('.code-line');
  const gutter = document.getElementById('lineNums');
  if (!gutter) return;
  gutter.innerHTML = Array.from({ length: lines.length }, (_, i) =>
    `<div>${i + 1}</div>`
  ).join('');
}
renderLineNumbers();


/* ─── SCROLL REVEAL ─────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ─── STAGGER WORK + PROJECT BLOCKS ────────────────────── */
document.querySelectorAll('.work-entry, .proj-block').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.06}s`;
});


/* ─── ACTIVE TAB + SIDEBAR FILE — on scroll ─────────────── */
const fileMap = {
  'about':    { file: 'about.md',    lang: 'Markdown' },
  'work':     { file: 'work.json',   lang: 'JSON' },
  'projects': { file: 'projects.ts', lang: 'TypeScript' },
  'life':     { file: 'hobbies.jsx', lang: 'JavaScript JSX' },
  'contact':  { file: 'contact.sh',  lang: 'Shell Script' },
};

const sections = document.querySelectorAll('.code-section[id]');
const treeFiles = document.querySelectorAll('.tree-file');
const tabBar    = document.getElementById('tabBar');
const bcFile    = document.getElementById('breadcrumbFile');
const statusFile = document.getElementById('statusFile');
const openEditorEl = document.querySelector('.open-editor');

let currentFile = 'about.md';
const openTabs = new Set(['about.md']);

function setActiveFile(id) {
  const meta = fileMap[id];
  if (!meta) return;
  const { file, lang } = meta;

  // sidebar highlight
  treeFiles.forEach(f => {
    f.classList.toggle('active', f.dataset.file === file);
  });

  // breadcrumb + status
  if (bcFile) bcFile.textContent = file;
  if (statusFile) statusFile.textContent = lang;

  // open tab if not already there
  if (!openTabs.has(file)) {
    openTabs.add(file);
    const ext = file.split('.').pop();
    const tab = document.createElement('div');
    tab.className = 'tab';
    tab.dataset.file = file;
    tab.innerHTML = `<span class="file-icon ${ext}"></span>${file}<span class="tab-close">✕</span>`;
    tabBar.appendChild(tab);
  }

  // set active tab
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('active', t.dataset.file === file);
  });

  // update open editors panel
  if (openEditorEl) {
    const ext = file.split('.').pop();
    openEditorEl.innerHTML = `<span class="file-icon ${ext}"></span>${file}<span class="editor-close">✕</span>`;
  }

  currentFile = file;
}

document.querySelectorAll(`
  .tab,
  .tree-file,
  .work-entry,
  .proj-block,
  .hobby-item,
  .open-editor,
  .activity-icon
`).forEach(el => {
  el.classList.add('interactive');
});
/* ─── CURSOR GLOW FOLLOW ─────────────────────── */
const glow = document.createElement('div');
glow.className = 'cursor-glow';
document.body.appendChild(glow);

document.addEventListener('mousemove', (e) => {
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
});

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setActiveFile(entry.target.id);
  });
}, {
  root: document.querySelector('.editor-content'),
  threshold: 0.25
});

sections.forEach(s => sectionObserver.observe(s));


/* ─── STATUS BAR — line/col tracking ────────────────────── */
const editorContent = document.querySelector('.editor-content');
const statusLn = document.getElementById('statusLn');
const lines = document.querySelectorAll('.code-line');

if (editorContent && statusLn && lines.length) {
  editorContent.addEventListener('scroll', () => {
    const scrollTop = editorContent.scrollTop;
    // Approximate line height
    const lineH = editorContent.scrollHeight / lines.length;
    const ln = Math.max(1, Math.round(scrollTop / lineH) + 1);
    statusLn.textContent = `Ln ${ln}, Col 1`;
  });
}


/* ─── SIDEBAR TREE TOGGLE ───────────────────────────────── */
const treeRoot = document.getElementById('treeRoot');
const treeChildren = document.getElementById('treeChildren');
if (treeRoot && treeChildren) {
  treeRoot.addEventListener('click', () => {
    const open = treeRoot.classList.toggle('open');
    treeChildren.style.display = open ? '' : 'none';
    treeRoot.querySelector('.tree-arrow').textContent = open ? '▾' : '▸';
  });
}


/* ─── SIDEBAR FILE LINKS — smooth scroll ────────────────── */
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
