// floating-settings.js — логика конфигуратора плавающих окон.
// Подключается из floating_windows_settings.html.
// Данные по умолчанию зеркалят data/windows.json (windows list), но живут
// в localStorage как `quistant.floatingWindows.v6` для совместимости с
// моделями плагинов/палитры.

const PALETTE = [
  '#94D07A', // live (green)
  '#B497D7', // solo (violet)
  '#84BFD6', // kb (cyan)
  '#D6BC84', // warn (amber)
  '#D28079', // danger (coral)
  '#8484D6', // accent (indigo)
  '#9C9CE0', // accent-2
  '#DBDBE0', // text
];

const KB_LIBRARY = [
  'System-Design-Primer',
  'HighScalability',
  'Behavioral Bank',
  '3Blue1Brown transcripts',
  'Salary Notes',
  'MIT 6.006',
  'LeetCode patterns',
  'PM interview prep',
  'Refactoring (Fowler)',
  'DDIA',
];

const DEFAULTS = [
  {
    id: 'coding', name: 'Coding Helper',
    color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    size: 'M', pos: 'tr', model: 'heavy', n: 10, r: 10,
    w: 120, kbs: ['System-Design-Primer', 'HighScalability'],
    prompt: 'You are a senior staff engineer helping in a live coding interview. Reply with concise hints: 3–5 bullets, prioritised. Include trade-offs only if material.',
    hotkey: 'Ctrl+Shift+1', ask: true, pin: false, enabled: true,
    web: true,
  },
  {
    id: 'behavioral', name: 'Behavioral Coach', color: '#B497D7',
    size: 'S', pos: 'bl', model: 'fast', n: 5, r: 10,
    w: 120, kbs: ['Behavioral Bank'],
    prompt: 'Coach the user through behavioral answers. Use STAR structure. Keep responses under 2 min spoken time. Emphasise "I" over "we".',
    hotkey: 'Ctrl+Shift+2', ask: true, pin: false, enabled: true,
    web: true,
  },
  {
    id: 'salary', name: 'Salary Negotiator', color: '#D6BC84',
    size: 'S', pos: 'br', model: 'fast', n: 8, r: 10,
    w: 120, kbs: ['Salary Notes'],
    prompt: 'Help with salary / offer negotiation. Provide counter-scripts, total-comp breakdowns, market data. Be concrete with numbers.',
    hotkey: 'Ctrl+Shift+3', ask: true, pin: false, enabled: true,
    web: true,
  },
  {
    id: 'lecture', name: 'Lecture Notes', color: '#84BFD6',
    size: 'M', pos: 'ctr', model: 'fast', n: 20, r: 10,
    w: 120, kbs: ['MIT 6.006', '3Blue1Brown transcripts'],
    prompt: 'Capture and explain lecture concepts in real time. Use the notation from the source. Add short worked examples when helpful.',
    hotkey: 'Ctrl+Shift+4', ask: false, pin: true, enabled: false,
    web: true,
  },
];

const STORAGE_KEY = 'quistant.floatingWindows.v6';
let windows = [];
let activeId = null;

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      windows = JSON.parse(raw);
      if (!Array.isArray(windows) || !windows.length) throw 0;
    } else throw 0;
  } catch {
    windows = JSON.parse(JSON.stringify(DEFAULTS));
    save();
  }
}
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(windows)); } catch {}
}
function uid() {
  return 'w_' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-3);
}

function renderList() {
  const list = document.getElementById('list');
  const empty = document.getElementById('empty');
  const form  = document.getElementById('form');

  document.getElementById('winCount').textContent = windows.length;

  if (!windows.length) {
    list.innerHTML = '';
    empty.style.display = 'flex';
    form.classList.remove('is-visible');
    activeId = null;
    return;
  }

  list.innerHTML = windows.map(w => `
    <div class="fws-item ${w.id === activeId ? 'is-on' : ''}" data-id="${w.id}">
      <span class="fws-item__dot" style="background:${w.color};color:${w.color}"></span>
      <span class="fws-item__name">${escapeHtml(w.name)}</span>
      <span class="fws-item__meta">${w.model === 'heavy' ? 'H' : 'F'}·N${w.n}</span>
      <button class="fws-item__toggle ${w.enabled ? 'is-on' : ''}" data-toggle="${w.id}" title="${w.enabled ? 'Disable' : 'Enable'}">
        ${w.enabled ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>' : ''}
      </button>
    </div>
  `).join('');

  list.querySelectorAll('.fws-item').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target.closest('.fws-item__toggle')) return;
      selectWindow(el.dataset.id);
    });
  });
  list.querySelectorAll('[data-toggle]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const w = windows.find(x => x.id === btn.dataset.toggle);
      if (!w) return;
      w.enabled = !w.enabled;
      save(); renderList(); renderForm();
      toast(w.enabled ? 'Window enabled' : 'Window disabled');
    });
  });
}

function selectWindow(id) {
  activeId = id;
  document.getElementById('empty').style.display = 'none';
  document.getElementById('form').classList.add('is-visible');
  renderList();
  renderForm();
}

function renderForm() {
  const w = windows.find(x => x.id === activeId);
  if (!w) return;

  document.getElementById('formTitle').textContent = w.name || 'Untitled';
  document.getElementById('formType').textContent = w.model === 'heavy' ? 'heavy · deep reasoning' : 'fast · quick hints';
  document.getElementById('formId').textContent = w.id;
  document.getElementById('preview').textContent = (w.name || '?').trim().charAt(0).toUpperCase();
  const preview = document.getElementById('preview');
  preview.style.background = w.color;
  preview.style.color = '#0B0B0E';
  document.getElementById('formDot').style.color = w.color;

  document.getElementById('fName').value = w.name;
  document.getElementById('fPrompt').value = w.prompt;
  document.getElementById('fHotkey').value = w.hotkey || '';
  document.getElementById('fN').value = w.n;
  document.getElementById('fNVal').textContent = 'C=' + w.n;
  document.getElementById('fR').value = w.r || 10;
  document.getElementById('fRVal').textContent = 'R=' + (w.r || 10);
  document.getElementById('fW').value = w.w || 120;
  document.getElementById('fWVal').textContent = 'W=' + (w.w || 120);
  document.getElementById('fAsk').checked = !!w.ask;
  document.getElementById('fWeb').checked = !!w.web;
  document.getElementById('fPin').checked = !!w.pin;

  const colors = document.getElementById('colors');
  colors.innerHTML = PALETTE.map(c => `
    <div class="fws-color ${c.toLowerCase() === (w.color||'').toLowerCase() ? 'is-on' : ''}" style="background:${c};color:${c}" data-color="${c}"></div>
  `).join('');
  colors.querySelectorAll('.fws-color').forEach(el => {
    el.addEventListener('click', () => {
      w.color = el.dataset.color;
      save(); renderForm(); renderList();
    });
  });

  paintSeg('segSize', w.size, v => { w.size = v; save(); renderForm(); });
  paintSeg('segPos',  w.pos,  v => { w.pos  = v; save(); renderForm(); });
  paintSeg('segModel', w.model, v => { w.model = v; save(); renderForm(); });

  const tagsEl = document.getElementById('kbTags');
  tagsEl.innerHTML = '';
  KB_LIBRARY.forEach(kb => {
    const on = w.kbs.includes(kb);
    const el = document.createElement('button');
    el.className = 'fws-kb-tag' + (on ? ' is-on' : '');
    el.innerHTML = kb + (on ? '<span class="x"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></span>' : '');
    el.onclick = () => {
      if (on) w.kbs = w.kbs.filter(k => k !== kb);
      else w.kbs.push(kb);
      save(); renderForm();
    };
    tagsEl.appendChild(el);
  });
  const add = document.createElement('button');
  add.className = 'fws-kb-tag-add';
  add.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg> add';
  add.onclick = () => {
    const name = prompt('Knowledge base name:');
    if (name && name.trim() && !KB_LIBRARY.includes(name.trim())) {
      KB_LIBRARY.push(name.trim());
      w.kbs.push(name.trim());
      save(); renderForm();
    }
  };
  tagsEl.appendChild(add);
}

function paintSeg(id, val, cb) {
  const el = document.getElementById(id);
  el.querySelectorAll('.fws-seg__btn').forEach(b => {
    b.classList.toggle('is-on', b.dataset.val === val);
    b.onclick = () => cb(b.dataset.val);
  });
}

function bindFields() {
  document.getElementById('fName').addEventListener('input', e => {
    const w = getActive(); if (!w) return;
    w.name = e.target.value;
    document.getElementById('formTitle').textContent = w.name || 'Untitled';
    document.getElementById('preview').textContent = (w.name || '?').trim().charAt(0).toUpperCase();
    save(); renderList();
  });

  document.getElementById('fPrompt').addEventListener('input', e => {
    const w = getActive(); if (!w) return;
    w.prompt = e.target.value; save();
  });

  document.getElementById('fN').addEventListener('input', e => {
    const w = getActive(); if (!w) return;
    w.n = parseInt(e.target.value, 10);
    document.getElementById('fNVal').textContent = 'C=' + w.n;
    save(); renderList();
  });

  document.getElementById('fR').addEventListener('input', e => {
    const w = getActive(); if (!w) return;
    w.r = parseInt(e.target.value, 10);
    document.getElementById('fRVal').textContent = 'R=' + w.r;
    save();
  });

  document.getElementById('fW').addEventListener('input', e => {
    const w = getActive(); if (!w) return;
    w.w = parseInt(e.target.value, 10);
    document.getElementById('fWVal').textContent = 'W=' + w.w;
    save();
  });

  ['fAsk', 'fPin', 'fWeb'].forEach(id => {
    document.getElementById(id).addEventListener('change', e => {
      const w = getActive(); if (!w) return;
      w[id === 'fAsk' ? 'ask' : id === 'fPin' ? 'pin' : 'web'] = e.target.checked;
      save();
    });
  });

  document.getElementById('fHotkey').addEventListener('keydown', e => {
    e.preventDefault();
    const parts = [];
    if (e.ctrlKey) parts.push('Ctrl');
    if (e.shiftKey) parts.push('Shift');
    if (e.altKey) parts.push('Alt');
    let k = e.key;
    if (k.length === 1) k = k.toUpperCase();
    if (['Control', 'Shift', 'Alt', 'Meta'].includes(k)) return;
    parts.push(k);
    const w = getActive(); if (!w) return;
    w.hotkey = parts.join('+');
    e.target.value = w.hotkey;
    save();
  });

  document.getElementById('fHotkey').addEventListener('keydown', e => {
    if (e.key === 'Escape' || e.key === 'Backspace') {
      e.target.value = '';
      const w = getActive(); if (w) { w.hotkey = ''; save(); }
    }
  });
}

function getActive() { return windows.find(x => x.id === activeId); }

function newWindow() {
  const w = {
    id: uid(),
    name: 'New window',
    color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    size: 'M', pos: 'tr', model: 'fast', n: 5, r: 10,
    w: 120, kbs: [], prompt: '', hotkey: '', ask: true, pin: false,
    enabled: true,
    web: true,
  };
  windows.push(w);
  save();
  selectWindow(w.id);
  document.getElementById('fName').focus();
  document.getElementById('fName').select();
  toast('Window created');
}

function duplicateWindow() {
  const w = getActive(); if (!w) return;
  const copy = JSON.parse(JSON.stringify(w));
  copy.id = uid();
  copy.name = w.name + ' copy';
  copy.enabled = false;
  windows.push(copy);
  save();
  selectWindow(copy.id);
  toast('Duplicated');
}

function deleteWindow() {
  const w = getActive(); if (!w) return;
  if (!confirm('Delete "' + w.name + '"?')) return;
  windows = windows.filter(x => x.id !== w.id);
  save();
  activeId = windows[0]?.id || null;
  renderList();
  if (activeId) selectWindow(activeId);
  else document.getElementById('empty').style.display = 'flex';
  toast('Deleted');
}

function resetDefaults() {
  if (!confirm('Reset all floating windows to defaults? Your customizations will be lost.')) return;
  windows = JSON.parse(JSON.stringify(DEFAULTS));
  save();
  activeId = null;
  renderList();
  toast('Reset to defaults');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

let toastT;
function toast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('is-visible');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('is-visible'), 1800);
}

function bindTabs() {
  const tabs = document.querySelectorAll('#tabs .fws-tab');
  const panes = document.querySelectorAll('.fws-tab-pane');
  tabs.forEach(t => {
    t.addEventListener('click', () => {
      const id = t.dataset.tab;
      tabs.forEach(x => x.classList.toggle('is-on', x === t));
      panes.forEach(p => p.classList.toggle('is-on', p.dataset.pane === id));
      hideTooltip();
    });
  });
}

const TOOLTIPS = {
  identity: {
    title: 'Identity',
    sub: 'who this window is',
    body: 'Identity defines how the window presents itself. Tweak this first when adding a new floating window — it is what you see in the chat header and the small color dot beside the title.',
    items: [
      ['Display name', 'shown in the window header'],
      ['Accent color', 'tints the border and status dot'],
    ],
  },
  behavior: {
    title: 'Behavior',
    sub: 'how it responds',
    body: 'Behavior shapes what the assistant says and how it thinks. Pick the engine (fast or heavy), then set its personality via the system prompt. Internet search expands its knowledge and output length keeps responses focused and easy to scan.',
    items: [
      ['Model', 'fast for quick hints, heavy for deeper reasoning'],
      ['System prompt', 'role and tone for this window'],
      ['Internet search', 'look up current facts on the web'],
      ['Output length (W)', 'max words per hint'],
    ],
  },
  sources: {
    title: 'Sources',
    sub: 'what it reads',
    body: 'Sources determine what context the window has access to. Replies from the main chat give immediate context, knowledge bases provide reference material, and chunks limit how much is pulled per query.',
    items: [
      ['Replies (R)', 'recent lines from main chat for context'],
      ['Knowledge bases', 'retrieval sources to pull from'],
      ['Chunks (C)', 'rows per base — cap on retrieval size'],
    ],
  },
  window: {
    title: 'Window',
    sub: 'placement & chrome',
    body: 'Window controls the physical footprint of the floating panel. Pick a size that fits the content and a default corner so the window never covers the main chat.',
    items: [
      ['Window size', 'S / M / L / XL preset dimensions'],
      ['Default position', 'corner where the window spawns'],
    ],
  },
  shortcuts: {
    title: 'Shortcuts',
    sub: 'how to trigger',
    body: 'Shortcuts let you summon and shape the window without leaving the chat. The hotkey toggles or refreshes it, the prompt input sends a direct question, and pin keeps it visible above everything else.',
    items: [
      ['Hotkey', 'toggle or refresh the window'],
      ['Prompt input', 'ask the window a direct question'],
      ['Pin', 'keep window above everything (always-on-top)'],
    ],
  },
};

function showTooltip(head) {
  const tt = document.getElementById('tooltip');
  const key = head.dataset.tooltip;
  const data = TOOLTIPS[key];
  if (!data) return;

  const ttIcon = document.getElementById('ttIcon');
  const srcIcon = document.querySelector(`.fws-tab[data-tab="${key}"] svg`);
  ttIcon.innerHTML = '';
  if (srcIcon) ttIcon.appendChild(srcIcon.cloneNode(true));

  document.getElementById('ttTitle').textContent = data.title;
  document.getElementById('ttSub').textContent = data.sub;
  document.getElementById('ttBody').textContent = data.body;
  document.getElementById('ttList').innerHTML = data.items
    .map(([n, d]) => `<li><b>${escapeHtml(n)}</b> ${escapeHtml(d)}</li>`)
    .join('');

  positionTooltip(head, tt);
  tt.classList.add('is-visible');
}

function hideTooltip() {
  const tt = document.getElementById('tooltip');
  if (tt) tt.classList.remove('is-visible');
}

function positionTooltip(head, tt) {
  const r = head.getBoundingClientRect();
  const tw = tt.offsetWidth;
  const th = tt.offsetHeight;
  const m = 12;
  const rightX = r.right + m;
  if (rightX + tw < window.innerWidth - 20) {
    tt.dataset.side = 'right';
    tt.style.left = rightX + 'px';
    tt.style.top = (r.top + 14) + 'px';
  } else {
    tt.dataset.side = 'bottom';
    tt.style.left = Math.max(20, Math.min(r.left, window.innerWidth - tw - 20)) + 'px';
    tt.style.top = (r.bottom + m) + 'px';
  }
}

function setupTooltips() {
  document.querySelectorAll('.fws-section__head[data-tooltip]').forEach(head => {
    head.addEventListener('mouseenter', () => showTooltip(head));
    head.addEventListener('mouseleave', hideTooltip);
  });
  window.addEventListener('scroll', hideTooltip, true);
  window.addEventListener('resize', hideTooltip);
}

export function initFloatingWindowsSettings() {
  load();
  renderList();
  bindFields();
  bindTabs();
  setupTooltips();

  if (windows.length) {
    const first = windows.find(w => w.enabled) || windows[0];
    selectWindow(first.id);
  }
}

// глобальные хендлеры для inline onclick в HTML
window.resetDefaults = resetDefaults;
window.newWindow = newWindow;
window.duplicateWindow = duplicateWindow;
window.deleteWindow = deleteWindow;
