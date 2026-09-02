/* settings.js — Settings screen controller.
   Loads tab partials from partials/settings/, renders the sidebar,
   handles tab switching and runs all the original settings logic
   (state, themes, fields, hotkeys, meters, save/load, toast). */

const CATEGORIES = [
  { id: 'general',   name: 'General',     file: 'partials/settings/tab-general.html',     icon: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>' },
  { id: 'account',   name: 'Account',     file: 'partials/settings/tab-account.html',     icon: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
  { id: 'ai',        name: 'AI & Models', file: 'partials/settings/tab-models.html',      icon: '<path d="M12 2a4 4 0 0 0-4 4v2a4 4 0 0 0-4 4v2a4 4 0 0 0 4 4v0a4 4 0 0 0 4 4 4 4 0 0 0 4-4v0a4 4 0 0 0 4-4v-2a4 4 0 0 0-4-4V6a4 4 0 0 0-4-4z"/>' },
  { id: 'embeddings',name: 'Memory',      file: 'partials/settings/tab-memory.html',      icon: '<circle cx="4" cy="4" r="1.5"/><circle cx="12" cy="4" r="1.5"/><circle cx="20" cy="4" r="1.5"/><circle cx="4" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="20" cy="12" r="1.5"/><circle cx="4" cy="20" r="1.5"/><circle cx="12" cy="20" r="1.5"/><circle cx="20" cy="20" r="1.5"/>' },
  { id: 'audio',     name: 'Audio',       file: 'partials/settings/tab-audio.html',       icon: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' },
  { id: 'capture',   name: 'Capture',     file: 'partials/settings/tab-capture.html',     icon: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>' },
  { id: 'shortcuts', name: 'Shortcuts',   file: 'partials/settings/tab-shortcuts.html',   icon: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>' },
  { id: 'notif',     name: 'Notifications', file: 'partials/settings/tab-notifications.html', icon: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>' },
  { id: 'privacy',   name: 'Privacy & Data', file: 'partials/settings/tab-privacy.html',   icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' },
  { id: 'update',    name: 'Updates',     file: 'partials/settings/tab-updates.html',     icon: '<path d="M21 12a9 9 0 1 1-3-6.7"/><polyline points="21 4 21 10 15 10"/>' },
  { id: 'advanced',  name: 'Advanced',    file: 'partials/settings/tab-advanced.html',    icon: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>' },
];

let activeCat = 'general';
let loadedTabs = {};

// -- sidebar ------------------------------------------
function renderSidebar() {
  const list = document.getElementById('catList');
  if (!list) return;
  list.innerHTML = CATEGORIES.map(c => `
    <div class="cat ${c.id === activeCat ? 'is-on' : ''}" data-cat="${c.id}">
      <span class="cat__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${c.icon}</svg></span>
      <span class="cat__name">${c.name}</span>
    </div>
  `).join('');
  list.querySelectorAll('.cat').forEach(el => {
    el.addEventListener('click', () => switchCat(el.dataset.cat));
  });
}

function switchCat(id) {
  activeCat = id;
  const main = document.getElementById('tab-content');
  if (main) main.scrollTop = 0;
  showTab(id);
}

function showTab(id) {
  document.querySelectorAll('.tab-content').forEach(p => p.classList.toggle('is-on', p.dataset.tab === id));
  document.querySelectorAll('.cat').forEach(c => c.classList.toggle('is-on', c.dataset.cat === id));
}

function loadAllTabs() {
  const main = document.getElementById('tab-content');
  if (!main) return;
  const wrap = document.createElement('div');
  wrap.id = 'tab-sections';
  main.appendChild(wrap);
  CATEGORIES.forEach(c => {
    const slot = document.createElement('div');
    slot.className = 'tab-content';
    slot.dataset.tab = c.id;
    if (c.id === activeCat) slot.classList.add('is-on');
    wrap.appendChild(slot);
    loadedTabs[c.id] = slot;
  });
  const dp = document.createElement('div');
  dp.id = 'dev-panel-container';
  dp.dataset.tab = '_dev';
  main.appendChild(dp);

  const tabFetches = CATEGORIES.map(c =>
    fetch(c.file)
      .then(r => r.text())
      .then(html => { if (loadedTabs[c.id]) loadedTabs[c.id].innerHTML = html; })
      .catch(err => { if (loadedTabs[c.id]) loadedTabs[c.id].innerHTML = '<div class="info info--danger">Failed to load ' + c.name + ': ' + err.message + '</div>'; })
  );
  const devFetch = fetch('partials/settings/dev-panel.html')
    .then(r => r.text())
    .then(html => { dp.innerHTML = html; })
    .catch(err => { dp.innerHTML = '<div class="info info--danger">Failed to load dev panel: ' + err.message + '</div>'; });

  Promise.all([...tabFetches, devFetch]).then(() => {
    showTab(activeCat);
    renderThemes();
    renderAccents();
    bindFields();
    bindSearch();
    updateDbConnPill();
    startMeters();
  });
}

// -- HELP TEXT (hover tooltip for every setting) --
const HELP = {
  // ===== General =====
  fLang: 'The language every label, button, menu and error message in this window shows up in. Change it and the whole UI instantly retranslates. <b>Practical use:</b> pick the language you actually read - everything stays the same, just translated.',

  theme: 'Pick a theme to change the overall mood of the app. <b>What you see change:</b> the body background color; the tint of the soft glow gradients in the corners; the color of the small dots before each section title; the color of "lit" elements like the live-status pills (Connected / Online). <b>Try this:</b> click Midnight - the whole backdrop goes blueish and the corner glows shift to cyan. <b>Vibe guide:</b> Obsidian = cool purple (default), Midnight = blue, Forest = green, Ember = orange/warm, Paper = light beige for daytime, Carbon = neutral grey-black.',

  themeGrid: 'Six theme tiles. Each tile has 3 small color squares that preview the theme\'s palette: the dark square is the background, the middle square is the accent/glow tint, the light square is the text color. Click any tile to switch the whole app to that theme. The currently active theme has a white border around its tile. Each theme can also load a custom background PNG if you put <code>bg-{theme}.png</code> next to this HTML file.',

  bg: 'How the background renders. <b>Show texture</b> = layered PNG image + theme color + soft corner glows. <b>Solid only</b> = just the theme color + glow gradients, no image. <b>When to flip to Solid:</b> if you find the image too busy, or for screen recording.',

  fScale: 'Zoom of the entire window. <b>Drag left</b> to make everything smaller and fit more on screen (good for 13" laptops). <b>Drag right</b> to make everything bigger (good if text feels too small). Changes take effect live as you drag.',

  fAutoStart: 'ON = Quistan launches every time you sign in to Windows. <b>When to enable:</b> on a dedicated work machine where you want Quistan always ready. <b>When to disable:</b> on shared/gaming PCs where every second of boot matters.',

  fStartMinimized: 'ON = Quistan starts hidden in the system tray instead of opening the main window. Combine with <b>Auto-launch</b> to have it always-on but invisible.',

  fTrayIcon: 'ON = a small Quistan icon stays in the Windows notification area. <b>Required</b> if you use Start minimized or Stay in tray - it\'s how you reach the menu when the main window is closed.',

  fStartMode: 'What happens when Quistan launches. <b>Pre-flight</b> = show the start dialog (pick what to do). <b>Resume</b> = open the last dialog you were in. <b>Stay in tray</b> = stay hidden until summoned. <b>Pick Resume</b> for daily use; <b>Pre-flight</b> if each session is a new context.',

  // ===== Account =====
  fMode: 'Who pays the AI providers. <b>Subscription</b> = Quistan gives you all models under one monthly bill; you do not pick which model runs per request - Quistan does. <b>BYOK</b> = you paste API keys from OpenAI/Anthropic/OpenRouter and pay providers directly; you also pick Fast and Heavy models yourself. <b>Default Subscription</b> for most users; switch to BYOK if you want full control or run local models.',

  // ===== AI & Models =====
  fModelFast: 'The small, cheap, fast model used for quick on-the-fly hints (entity names, dialog turn detection, short rephrasing). <b>How to choose:</b> any "mini" class - gpt-4o-mini, claude-haiku, gemini-flash. <b>What it affects:</b> response latency for everyday turns and your API bill.',

  fModelHeavy: 'The big, slow, smart model used for hard reasoning (long answers, multi-step analysis, complex instructions). <b>How to choose:</b> flagship class - gpt-4o, claude-sonnet/opus, gemini-pro. <b>What it affects:</b> quality of deep analysis turns.',

  fTemp: 'How Quistan answers. <b>Precise</b> = strict, repeats the question back, sticks to facts (good for technical/legal/medical). <b>Balanced</b> = natural conversation, default. <b>Creative</b> = varied wording, may invent or go on tangents (good for brainstorming).',

  fMaxTok: 'How much Quistan says before stopping. <b>1</b> = one line, <b>2</b> = a few lines, <b>3</b> = a paragraph (default, best for live calls), <b>4</b> = a few paragraphs, <b>5</b> = multiple paragraphs (essay-like, costs more and is slower). Each step roughly doubles the token budget.',

  fKeyOpenAI: 'One row per provider. <b>Name</b> is what shows in the model picker. <b>Key</b> is the API secret - stored in Windows Credential Manager. <b>Base URL</b> is the OpenAI-compatible endpoint (e.g. <code>https://api.openai.com/v1</code>, <code>http://localhost:11434/v1</code> for Ollama). <b>Models</b> whitelist is optional comma-separated list - leave empty to use all models the provider offers. Toggle <b>Enabled</b> off to keep a key saved but unused.',

  addProvider: 'Add any provider that speaks an OpenAI-compatible API: OpenAI, Anthropic, Google Gemini, Mistral, Groq, xAI, DeepSeek, Cohere, Together, Fireworks, Perplexity, Ollama, LM Studio, or your own self-hosted endpoint. Each card is independent  -  add as many as you need.',

  // ===== Indexing & Embeddings =====
  fReindexWatch: 'ON = Quistan watches your KB folders and re-embeds files automatically when they change. <b>When to enable:</b> for active KBs that get updated often (notes, docs). <b>When to disable:</b> for static archives that never change.',

  fReindexVerify: 'ON = at every launch Quistan runs an integrity check on the vector index (catches corruption, adds 1-3 sec to startup). <b>When to enable:</b> after power loss, crashes, or weird retrieval results. <b>When to disable:</b> on a stable SSD if you want faster boot.',

  fChunk: 'Maximum tokens per piece when Quistan splits a document for indexing. <b>Drag right</b> to keep longer passages intact (better for research papers); <b>drag left</b> for fine-grained Q&A pieces. 500 is the safe default.',

  fOverlap: 'Tokens shared between neighboring chunks - prevents sentences from being cut at chunk boundaries. <b>Drag right</b> for technical/legal text where mid-sentence cuts hurt; <b>drag left</b> for huge corpora where speed beats edge recall.',

  fWorkers: 'How many chunks Quistan embeds in parallel during reindex. <b>Drag right</b> if you have many CPU cores and want faster reindex; <b>drag left</b> if reindex makes the UI sluggish.',

  // ===== Embeddings & Vector Store =====
  fEmbModel: 'Which local embedding model turns your text into vectors. <b>bge-small</b> (384d) is bundled and tiny - default for most. <b>bge-base</b> (768d) is twice the size and noticeably better retrieval. <b>bge-large</b> (1024d) is the best retrieval quality but 335 MB. <b>nomic</b> and <b>mxbai</b> are downloadable top-tier models - need internet on first use. <b>Custom</b> = any ONNX/HuggingFace model you point at. <b>Important:</b> switching the model changes vector dimensions and requires a full reindex.',

  embModel: 'Read-only info card showing the currently active embedding model: its name, file path, dimensions and load status. Use the picker above to switch.',

  applyEmbModel: 'Reload the embedding model after changing the picker. Quistan unloads the old model, loads the new one, and (because dimensions changed) starts a full reindex in the background.',

  fEmbDevice: 'Where the embedding model runs. <b>CPU</b> = always works, slowest. <b>CUDA</b> = NVIDIA GPU, fastest, needs CUDA 12.x driver + the small CUDA redistributable that ships with Quistan. <b>DirectML</b> = any DirectX 12 GPU (AMD / Intel / NVIDIA), almost as fast as CUDA on NVIDIA, slower on AMD but still 5-10? over CPU. <b>If unsure</b>, leave on CPU; the bundled model is small enough.',

  fEmbGpu: 'Enable GPU execution provider for embeddings. <b>Why:</b> 5-20x faster embedding on supported hardware. <b>When to enable:</b> you selected CUDA or DirectML as device and have a working GPU/driver setup. <b>When to disable:</b> if you see ONNX Runtime GPU crashes on startup.',

  fEmbFp16: 'Use FP16 (half-precision) weights for the embedding model. <b>Why:</b> halves VRAM usage with negligible accuracy loss. <b>When to enable:</b> on GPU, recommended. <b>When to disable:</b> on CPU (slower without GPU tensor cores) or if you need exact float32 precision.',

  embGpuInfo: 'Live info card about the GPU Quistan detected on this machine. Useful to verify that CUDA / DirectML is actually wired up before flipping the device picker.',

  testEmbDevice: 'Re-scan the GPU and run a tiny embedding benchmark so you see real ms/chunk numbers before committing to a device in production.',

  embVectorDb: 'Stats about the on-disk vector store: engine, folder, number of collections, total vectors and disk size. Updated whenever a reindex finishes.',

  // ===== Audio =====
  fGain: 'Boosts the microphone signal before STT. <b>Drag right</b> if you speak quietly and the meter barely shows; <b>drag left</b> if the meter pegs into red (clipped). 100% is unity.',

  fStt: 'STT is handled differently per mode. <b>Subscription:</b> Quistan picks the engine - no setup. <b>BYOK:</b> you choose between Cloud API (Deepgram / OpenAI Whisper), Local model (bundled Whisper, offline, free, slower on CPU), or Ollama / custom endpoint (any OpenAI-compatible STT server you run). Switch your mode in <b>Account</b> first.',

  fSttMode: 'Which STT backend to use in BYOK mode. <b>Local model</b> = bundled Whisper, offline, free, slower on CPU. <b>Cloud API</b> = Deepgram or OpenAI Whisper over the network, fast, paid. <b>Ollama / custom</b> = your own OpenAI-compatible STT server (Ollama, vLLM whisper, self-hosted).',

  fSttApiKey: 'API key for the cloud STT provider. <b>Deepgram:</b> project key from <code>console.deepgram.com</code>. <b>OpenAI Whisper API:</b> your <code>sk-...</code> key. Stored encrypted in Windows Credential Manager.',

  fSttOllamaUrl: 'URL of your local Ollama (or other OpenAI-compatible) STT server. <b>Default:</b> <code>http://localhost:11434</code>. Must expose <code>/v1/audio/transcriptions</code>. Use <code>ollama pull whisper</code> to get a model.',

  // ===== Capture =====
  fCompress: 'ON = PNG screenshots get converted to JPEG before being sent to the AI. <b>Why:</b> PNG can be 2-5 MB; JPEG at 70% is 50-200 KB - 20x smaller, faster, cheaper. <b>Turn OFF</b> only for lossless text/OCR-critical screenshots.',

  fJpeg: 'JPEG quality when compression is ON. <b>Drag right</b> for crystal-clear text; <b>drag left</b> for tiny blurry files. 70% is the sweet spot for AI consumption.',

  fWda: 'Windows Display API - hides Quistan\'s floating windows from screen capture. <b>Why:</b> when you share screen on Zoom/Meet, the interlocutor should not see your private AI window. Keep ON during calls.',

  fHideFrame: 'Hides the dashed region-pick rectangle from screen-share output. Keep ON during calls - otherwise the interlocutor sees you screenshotting.',

  fHideSelf: 'Hides your self-view webcam preview from screen-share. Keep ON for max privacy.',

  // ===== Notifications =====
  fNotifUpdate: 'Get a notification when a new Quistan build is available. Keep ON unless updates annoy you.',

  fNotifLicense: 'Get a notification 7 days before your subscription expires. Gives you time to renew.',

  fNotifKb: 'Notify when KB reindex completes. Useful for big KBs that take hours to reindex - you know when it is ready.',

  fNotifError: 'Notify on API errors and quota warnings (rate-limit, 5xx). Recommended ON - silent errors look like "thinking" and waste your time.',

  fNotifWeekly: 'Weekly email summary of usage stats. Enable if you want transparency on how much you used.',

  fSound: 'Sound played for notifications. <b>Default</b> soft chime, <b>Ping</b> short, <b>Chime</b> musical, <b>Silent</b> no sound (visual alerts still appear).',

  fQuietFrom: 'Start time of your daily quiet hours - notification sounds suppressed between From and To.',

  fQuietTo: 'End time of your daily quiet hours - sound restored after this.',

  fDoNotDisturb: 'ON = suppress all Quistan notifications when any app is fullscreen (presentations, games, video calls). Prevents a toast popping over your slide.',

  fTgToken: 'Telegram bot token from @BotFather. Allows notifications to be forwarded to your Telegram. <b>How:</b> create a bot via @BotFather, paste the token here.',

  fTgChat: 'Your Telegram chat ID (get from @userinfobot). The bot needs to know where to send messages. Use <b>Send test message</b> to verify.',

  // ===== Privacy / DB =====
  fTelemetry: 'Send anonymous crash reports and feature-usage counts to Quistan. <b>What is NOT sent:</b> dialog text, screenshots, voice audio, KB content - ever. Keep ON to support dev; turn OFF for zero outbound traffic.',

  fBeta: 'Enable experimental/beta features. Expect occasional bugs. <b>Enable</b> if you want to live on the edge; <b>disable</b> for production.',

  fActiveDb: 'Which database Quistan uses as the main workspace. You can keep separate DBs for "work", "research", "archive" - each with its own KB and history. Switch at the start of a project for clean context isolation.',

  fDbConnected: 'ON = Quistan writes dialog turns, KB vectors and settings. OFF = read-only mode (no new entries). <b>Turn OFF</b> during screen-share, while debugging, or when reviewing someone else\'s DB.',

  fDbFolder: 'Read-only path to the folder where all Quistan .db files live. Use the buttons below to backup, open, or copy the path.',

  fEncryptDb: 'Encrypt database files with SQLCipher (AES-256). <b>Recommended ON</b> for privacy. <b>Requires app restart</b> after toggling.',

  fRetention: 'Auto-delete dialog turns older than N days on startup. <b>30 days</b> default; <b>7 days</b> for sensitive work; <b>Forever</b> for archives.',

  fClearOnExit: 'Wipe all dialog history when the app shuts down. <b>Settings</b> and <b>KB vectors</b> are kept - only dialog turns clear. Enable for confidential material.',

  fWipeHistory: 'When factory-resetting, also wipe all dialog history. <b>Unchecked</b> = only reset settings/shortcuts/KB sources. <b>Checked</b> = nuke everything. Choose before clicking Factory reset.',

  // ===== Updates =====
  fAutoUpdate: 'Download new Quistan versions in the background. <b>Keep ON</b> unless you are on metered internet.',

  fAutoInstall: 'Apply downloaded updates on next app quit (no restart prompt). <b>Enable</b> if you always quit Quistan at end of session.',

  fPrerelease: 'Get notified about pre-release builds. <b>Enable</b> for bleeding edge; <b>disable</b> for production (prereleases may be unstable).',

  // ===== Advanced =====
  fLogLevel: 'Verbosity of logs. <b>Error</b> = only crashes. <b>Warn</b> = errors + warnings (default). <b>Info</b> = adds lifecycle events. <b>Debug</b> = everything. <b>Switch to Debug only</b> when collecting a debug bundle for support.',

  fLogToFile: 'Write logs to a rotating file in %AppData%\\Quistan\\logs (max 50 MB). <b>Keep ON</b> for support cases — in-app logs vanish on restart.',

  fExpGpu: 'GPU acceleration for local Whisper (CUDA). <b>Enable</b> if you have NVIDIA GPU + CUDA; <b>disable</b> otherwise (causes Whisper crashes on launch).',

  fExpMem: 'Persistent memory across sessions - Quistan remembers facts from past dialogs. <b>Enable</b> for long-term assistant feel; <b>disable</b> if "how did it know that" surprises bother you.',

  fExpMulti: 'Have 3 models answer in parallel and pick the consensus. <b>Leave OFF</b> (3x cost, 3x latency); enable temporarily for prompt research.',

  // ===== Segmented groups =====
  'segBg': 'Background composition. <b>Show texture</b> = PNG + color + glows. <b>Solid only</b> = color + glows only (no PNG).',

  'segStartMode': 'What shows at launch. <b>Pre-flight</b> = start dialog. <b>Resume</b> = last dialog. <b>Stay in tray</b> = hidden.',

  'segMode': 'Subscription = Quistan handles all AI under one bill. BYOK = you pay providers directly.',

  'segVad': 'Voice-Activity Detection sensitivity. Low = catch everything (breaths). Medium = balanced. High = strict (skip noise).',

  'segSttMode': 'Pick the STT backend in BYOK mode. Local model = bundled Whisper, offline, free. Cloud API = Deepgram or OpenAI Whisper. Ollama = your own OpenAI-compatible STT server. Not visible in Subscription mode (Quistan handles it).',

  'segRetention': 'Auto-delete dialog turns older than N days. 1/7/30 days or Forever.',

  'segWorkers': 'Parallel reindex workers. 2 default. Raise to 4-8 on multi-core machines with lots of RAM.',
  'segLog': 'Log verbosity. Error = quietest. Warn = default. Info/Debug = noisier (for support).',

  'segChannels': 'How notifications are delivered. Pick any combination. <b>Tray + Sound</b> recommended.',

  // ===== Buttons / actions =====
  manageSub: 'Open the Quistan billing portal in your browser - change plan, view invoices, cancel. Changes sync on next launch.',

  devicesThis: 'The PC where Quistan is currently running. Always shown so you can confirm the installation is on a device you trust. The full device list lives in the <b>web cabinet</b>.',

  devicesAccount: 'Read-only summary of how many devices are bound to your account and how many of them are active right now. <b>Renaming or signing out from individual devices is only available in the web cabinet</b> — keeping that surface focused on account-management UI instead of crowding it into this app.',

  devicesDanger: 'Emergency: signs out from every other device in one click. Use if you lost a laptop or suspect unauthorized access. Your other devices will need to sign in again.',

  testKeys: 'Send a tiny ping through every enabled API key and show latency + quota. <b>Use after</b> pasting a new key.',

  reindexAll: 'Rebuild the entire vector index from scratch. <b>Use</b> after switching embedding model, after KB restructure, when retrieval is broken. Slow on big KBs.',

  testTg: 'Send a test message to your Telegram via the bot. <b>Use</b> after setting up the bot to verify token + chat ID.',

  dbMaintenance: 'SQLite housekeeping. <b>Vacuum</b> reclaims space; <b>Integrity check</b> runs PRAGMA; <b>Migrations</b> applies schema changes; <b>Rebuild indexes</b> refreshes FTS.',

  dbBackup: 'Snapshot DB to file, restore from snapshot, copy folder path, open in Explorer. <b>Backups are NOT encrypted</b> — store safely.',

  dbCleanup: 'Destructive actions for active DB. <b>Clear vectors</b> wipes KB index (must reindex). <b>Clear history</b> wipes dialogs (KB kept). <b>Wipe DB</b> deletes everything.',

  checkUpdate: 'Poll the update server right now. Shows version, size, changelog if an update is available.',

  logsTools: 'Open logs folder, or copy redacted diagnostics bundle (logs + system info, no dialogs) to clipboard. <b>Use</b> when filing a support ticket.',

  configIO: 'Export settings to portable JSON, import on another machine. <b>API keys are NOT exported</b> — re-enter after import.',

  factoryReset: 'Irreversibly reset everything (settings, floating windows, KB, shortcuts, caches). <b>Cannot be undone.</b> Check <b>Wipe history</b> above first if you also want dialogs gone.',

  micDev: 'Microphone input device. <b>Default</b> follows OS. Change if you have multiple mics (USB headset, webcam) and want a specific one. Verify with the Test button.',

  sysDev: 'System-audio capture (WASAPI loopback) — records what your speakers play, i.e. interlocutor\'s voice during a call. <b>Without this, STT cannot hear the other side.</b>',

  // ===== Hotkeys =====
  hotkey_open: 'Global hotkey to summon or refresh the main window from any app. <b>Default</b> Ctrl+Shift+Q. Click the field and press your combo to rebind. <b>Esc</b> clears.',

  hotkey_pause: 'Global hotkey to pause/resume the assistant. <b>Default</b> Ctrl+Shift+Space. Use when you step away or want to type without AI listening.',

  hotkey_region: 'Global hotkey for region picker. <b>Default</b> Ctrl+Shift+A. Drag a rectangle on any monitor.',

  hotkey_snap: 'Global hotkey — take screenshot now from active region. <b>Default</b> Ctrl+Shift+S.',

  hotkey_refresh: 'Global hotkey — force-refresh all floating windows (re-read context, re-fetch suggestions). <b>Default</b> Ctrl+R.',

  hotkey_solo: 'Global hotkey — toggle solo mode (mic only, no system audio). <b>Default</b> Ctrl+Shift+M. Good for practicing alone.',

  hotkey_send: 'Global hotkey — send current pending dialog to chat. <b>Default</b> Ctrl+Enter.',

  // ===== Read-only displays =====
  usageApi: 'Hours pool: <b>total available</b> = current period allowance + unused hours rolled over from previous periods. Unused hours <b>never burn</b> on Standard / Hustler / BYOK — they roll over forever. On <b>Offer</b> hours expire after 7 days (no rollover). On <b>BYOK</b> the pool is unlimited — no meter. Bar turns > 75%, red > 90%.',

  usageStt: 'STT minutes are <b>included in the same hours pool</b>. Audio transcription costs are debited from the same rollover balance as model calls — no separate quota.',

  usageHours: 'Plan-level quota pool shared between AI requests and audio minutes. Hours instead of separate counters — what you spend on chat and STT draws from the same bucket. Resets on the date shown.',

  subPlan: 'Your current plan card. Shows emoji, name, regional price, hours pool, limits and rollover policy. <b>5 plans</b>: Test-Craster (free, 30 min/week), Offer (8 h for 7 days, no rollover), Standard (25 h/month, rollover), Hustler PRO (100 h/month, rollover), Your Key / BYOK (unlimited, you pay providers). Currency auto-detects from system locale (RU > ?, else > $).',

  subPeriod: 'Read-only subscription timeline: <b>ends</b> = next renewal/cancel date, <b>current period</b> = billing window, <b>resets in</b> = days left, <b>limits</b> = how many floating windows & knowledge folders your plan allows, <b>rollover policy</b> = whether unused hours carry to next period.',

  hwid: 'Internal opaque device fingerprint. You don\'t need this anymore — sign in with your account on the new PC and it shows up in this list. Used only as a stable identifier for the server.',

  embModel: 'Read-only info: bge-small-en-v1.5 bundled embedding model. 384 dimensions. ChromaDB vector store. Runs offline, no API key needed.',

  dbStats: 'Live DB health snapshot. Schema version, last integrity check, last vacuum, last backup timestamps.',
};

// -- DEV NOTES (Russian, for developer only — temporary panel) --
const DEV = {
  fLang: '<b>Краткое:</b> Локаль UI.<br><br><b>Зачем:</b> Перевод всех надписей и системных сообщений Куистана. Контент окон (Knowledge и т.п.) переводится отдельно.<br><b>Связано:</b> i18n-каталог, locale-флаг в OS, формат дат/чисел.<br><b>Размещение:</b> Самая первая настройка — задаёт язык всего прилож.',

  theme: '<b>Краткое:</b> Пресет визуальной темы.<br><br><b>Зачем:</b> Переключает палитру + фоновую текстуру. Один клик — новая атмосфера.<br><b>Связано:</b> CSS-переменные body.theme-*, файл bg-{theme}.png рядом с HTML.<br><b>Размещение:</b> Appearance — стартовая секция визуальных настроек.',

  themeGrid: '<b>Краткое:</b> Сетка пресетов тем.<br><br><b>Зачем:</b> Дать быстрый визуальный выбор вместо дроплиста.<br><b>Связано:</b> THEMES[], applyTheme(), bg-{theme}.png.<br><b>Размещение:</b> Сразу под Theme — выбор пресета.',

  bg: '<b>Краткое:</b> Режим фона: Show texture / Solid only.<br><br><b>Зачем:</b> Контроль видимости PNG-текстуры. По умолчанию texture, чтобы твои тематические PNG подхватывались сразу при выборе темы.<br><b>Связано:</b> segBg, body.theme-*, CSS-переменная --bg-mode-layer (выставляется JS applyBg), --bg-texture.<br><b>Размещение:</b> Appearance — финальный штрих внешнего вида. PNG-файлы: themes/1-Obsidian/1-obsidian.png, themes/2-Midnight/2-midnight.png и т.д.',

  fScale: '<b>Краткое:</b> Зум UI 80-140%.<br><br><b>Зачем:</b> Компактный режим для маленьких экранов и крупный для плохого зрения.<br><b>Связано:</b> CSS zoom на root, range-row.<br><b>Размещение:</b> Appearance — зум это визуал.',

  fAutoStart: '<b>Краткое:</b> Автозапуск с Windows.<br><br><b>Зачем:</b> Запускать Куистан в фоне при логине (always-on сценарий).<br><b>Связано:</b> Реестр HKCU\\...\\Run, installer.<br><b>Размещение:</b> Startup & System — это и есть автозапуск.',

  fStartMinimized: '<b>Краткое:</b> Стартовать в трей.<br><br><b>Зачем:</b> Не открывать окно каждый раз, оставаться инкогнито до вызова.<br><b>Связано:</b> fTrayIcon, fStartMode.<br><b>Размещение:</b> Startup & System.',

  fTrayIcon: '<b>Краткое:</b> Иконка в трее.<br><br><b>Зачем:</b> Доступ к меню без открытого главного окна. Обязательно при с панели.<br><b>Связано:</b> Tray balloon (уведомления), системное меню.<br><b>Размещение:</b> Startup & System.',

  fStartMode: '<b>Краткое:</b> Что показывать при запуске (Pre-flight/Resume/Tray).<br><br><b>Зачем:</b> Разные UX: настройка новой сессии vs продолжение прошлой vs скрытый режим.<br><b>Связано:</b> segStartMode, fStartMinimized.<br><b>Размещение:</b> Startup & System.',

  fMode: '<b>Краткое:</b> Subscription или BYOK.<br><br><b>Зачем:</b> Главный роутер AI-запросов. Меняет UI в AI & Models.<br><b>Связано:</b> segMode, applyModeVisibility(), aiManagedSection/aiByokSection.<br><b>Размещение:</b> Account — это контракт пользователя.',

  manageSub: '<b>Краткое:</b> Открыть биллинг-портал.<br><br><b>Зачем:</b> Смена плана, инвойсы, пауза.<br><b>Связано:</b> Внешний billing URL, квота usage.<br><b>Размещение:</b> Account — рядом с usage-барами.',

  deactivate: '<b>Краткое:</b> Кнопка «Sign out from all other devices» — экстренный сброс всех остальных устройств.<br><br><b>Зачем:</b> Потерял ноут / подозрение на чужой доступ. Другие устройства вылетят, их надо будет снова логинить.<br><b>Связано:</b> devicesThis, devicesAccount, сервер лицензий.<br><b>Размещение:</b> Account — Devices.',

  devicesThis: '<b>Краткое:</b> Текущий ПК, на котором запущен Куистан.<br><br><b>Зачем:</b> Пользователь видит, что установка привязана к доверенному устройству.<br><b>Связано:</b> devicesAccount, web cabinet.<br><b>Размещение:</b> Account — Devices.',

  devicesAccount: '<b>Краткое:</b> Read-only сводка: сколько устройств привязано к аккаунту и сколько активно.<br><br><b>Зачем:</b> Дать понимание лимитов без полноценного UI управления устройствами.<br><b>Связано:</b> devicesThis, web cabinet (там переименование / sign-out per device).<br><b>Размещение:</b> Account — Devices.',

  usageApi: '<b>Краткое:</b> Часы пула: месячная квота + rollover.<br><br><b>Зачем:</b> Показать сколько часов доступно всего и сколько использовано в текущем периоде.<br><b>Связано:</b> Сервер биллинга, rollover balance, subPeriod.<br><b>Размещение:</b> Account — usage виден только в Subscription.',

  usageStt: '<b>Краткое:</b> STT минуты идут из того же пула часов.<br><br><b>Зачем:</b> Не разделять квоты — всё из одного баланса.<br><b>Связано:</b> usageHours, billing server.<br><b>Размещение:</b> Account.',

  subPeriod: '<b>Краткое:</b> Сроки подписки + лимиты окон/папок + rollover policy.<br><br><b>Зачем:</b> Показать дату конца периода, диапазон, лимиты плана и переносится ли остаток.<br><b>Связано:</b> Сервер биллинга, PLANS{}, fPlan.<br><b>Размещение:</b> Account — рядом с usage.',

  hwid: '<b>Краткое:</b> Не показывается пользователю — внутренний opaque device_id.<br><br><b>Зачем:</b> Сервер лицензий использует как стабильный идентификатор устройства.<br><b>Связано:</b> Сервер лицензий, devicesList.<br><b>Размещение:</b> Скрыт от пользователя.',

  fModelFast: '<b>Краткое:</b> Лёгкая модель для быстрых подсказок.<br><br><b>Зачем:</b> Naming entities, короткие репразы — должны быть дёшевы и быстры.<br><b>Связано:</b> fModelHeavy, BYOK-секция, per-window выбор роли.<br><b>Размещение:</b> AI & Models — BYOK, секция Models.',

  fModelHeavy: '<b>Краткое:</b> Тяжёлая модель для рассуждений.<br><br><b>Зачем:</b> Длинный контекст, multi-step reasoning, драфты.<br><b>Связано:</b> fModelFast, fallback.<br><b>Размещение:</b> AI & Models — BYOK.',

  fTemp: '<b>Краткое:</b> Стиль ответов (Precise / Balanced / Creative).<br><br><b>Зачем:</b> Баланс между точностью и живостью речи ассистента.<br><b>Связано:</b> segTemp, Fast и Heavy модели используют это.<br><b>Размещение:</b> AI & Models — Style of answers.',

  fMaxTok: '<b>Краткое:</b> Длина ответа — ползунок 1-5 с подписью (one line / few lines / paragraph / few paragraphs / multiple paragraphs).<br><br><b>Зачем:</b> Сколько Куистан говорит перед тем как замолчать.<br><b>Связано:</b> LENGTH_LABELS[], fMaxTok, cost, latency, TTS duration.<br><b>Размещение:</b> AI & Models — Style of answers.',

  fKeyOpenAI: '<b>Краткое:</b> Динамический список ключей любых провайдеров.<br><br><b>Зачем:</b> BYOK-доступ к моделям без жёсткой привязки к вендору.<br><b>Связано:</b> Credential Manager, OpenAI-compatible endpoints (Ollama, vLLM, LM Studio), fApiKeys[] в state.<br><b>Размещение:</b> AI & Models — BYOK, API Keys.',

  addProvider: '<b>Краткое:</b> Добавить нового провайдера (OpenAI-compatible).<br><br><b>Зачем:</b> Ollama, vLLM, LM Studio, self-hosted, любой вендор.<br><b>Связано:</b> renderApiKeys(), addApiKey(), fApiKeys[].<br><b>Размещение:</b> AI & Models — BYOK, Providers & Keys.',

  embModel: '<b>Краткое:</b> Read-only: модель эмбеддингов.<br><br><b>Зачем:</b> Показать пользователю что используется локально bge-small-en-v1.5.<br><b>Связано:</b> KB index, ChromaDB.<br><b>Размещение:</b> AI & Models — Indexing.',

  fReindexWatch: '<b>Краткое:</b> Следить за файлами KB.<br><br><b>Зачем:</b> Авто-обновление индекса при изменении источников.<br><b>Связано:</b> OS file watcher (ReadDirectoryChangesW).<br><b>Размещение:</b> AI & Models — Indexing.',

  fReindexVerify: '<b>Краткое:</b> Проверять целостность индекса при старте.<br><br><b>Зачем:</b> Ловить corruption рано, после крэшей.<br><b>Связано:</b> ChromaDB integrity, +время на старт.<br><b>Размещение:</b> AI & Models — Indexing.',

  fChunk: '<b>Краткое:</b> Размер чанка 100-1500 токенов.<br><br><b>Зачем:</b> Баланс retrieval-гранулярности и контекста.<br><b>Связано:</b> Embedding model max length, точность поиска.<br><b>Размещение:</b> AI & Models — Indexing.',

  fOverlap: '<b>Краткое:</b> Overlap чанков 0-300.<br><br><b>Зачем:</b> Не разрезать предложения на границах.<br><b>Связано:</b> fChunk, indexing time.<br><b>Размещение:</b> AI & Models — Indexing.',

  fWorkers: '<b>Краткое:</b> Параллельные воркеры 1-8.<br><br><b>Зачем:</b> Ускорить reindex за счёт CPU/RAM.<br><b>Связано:</b> fChunk, machine load.<br><b>Размещение:</b> AI & Models — Indexing.',

  reindexAll: '<b>Краткое:</b> Перестроить индекс с нуля.<br><br><b>Зачем:</b> Fix corruption, миграция embeddings.<br><b>Связано:</b> ChromaDB, CPU/RAM пик.<br><b>Размещение:</b> AI & Models — Indexing.',

  fEmbModel: '<b>Краткое:</b> Какая модель эмбеддингов активна.<br><br><b>Зачем:</b> Quality vs размер. Small=384d быстрый, Large=1024d самый точный. Custom — любой ONNX.<br><b>Связано:</b> ChromaDB dim, fReindexAll (при смене dim обязателен).<br><b>Размещение:</b> Embeddings & Vector Store — Active Model.',

  embModel: '<b>Краткое:</b> Read-only карточка активной модели.<br><br><b>Зачем:</b> Показать пользователю что лежит на диске.<br><b>Связано:</b> fEmbModel, applyEmbModel.<br><b>Размещение:</b> Embeddings & Vector Store.',

  applyEmbModel: '<b>Краткое:</b> Перезагрузить модель после смены.<br><br><b>Зачем:</b> Unload old > load new > если dim другой, авто-reindex.<br><b>Связано:</b> fEmbModel, fEmbDevice.<br><b>Размещение:</b> Embeddings & Vector Store — Active Model.',

  fEmbDevice: '<b>Краткое:</b> CPU / CUDA (NVIDIA) / DirectML (любой GPU).<br><br><b>Зачем:</b> Ускорить embedding inference в 5-20?.<br><b>Связано:</b> ONNX Runtime EP, драйверы GPU, fEmbGpu.<br><b>Размещение:</b> Embeddings & Vector Store — Compute Device.',

  fEmbGpu: '<b>Краткое:</b> Включить GPU для эмбеддингов.<br><br><b>Зачем:</b> 5-20? ускорение.<br><b>Связано:</b> ONNX Runtime, драйверы, fEmbDevice.<br><b>Размещение:</b> Embeddings — рядом с fEmbDevice.',

  fEmbFp16: '<b>Краткое:</b> FP16-веса для эмбеддингов.<br><br><b>Зачем:</b> Вдвое меньше VRAM, точность почти не падает.<br><b>Связано:</b> GPU-режим, fEmbGpu.<br><b>Размещение:</b> Embeddings — рядом с fEmbGpu.',

  embGpuInfo: '<b>Краткое:</b> Live-инфо о GPU.<br><br><b>Зачем:</b> Подтвердить что CUDA/DirectML реально подхватились.<br><b>Связано:</b> detectGpu(), DXGI / NVAPI / CUDA enumerate.<br><b>Размещение:</b> Embeddings & Vector Store — Compute Device.',

  testEmbDevice: '<b>Краткое:</b> detectGpu() + benchmark.<br><br><b>Зачем:</b> Дать пользователю реальные ms/chк до прода.<br><b>Связано:</b> fEmbDevice, ONNX Runtime timing.<br><b>Размещение:</b> Embeddings & Vector Store.',

  embVectorDb: '<b>Краткое:</b> Stats по ChromaDB: engine, path, collections, total vectors, размер на диске.<br><br><b>Зачем:</b> Дать обзор состояния индекса.<br><b>Связано:</b> data/vectors, reindexAll.<br><b>Размещение:</b> Embeddings & Vector Store — Vector Database.',

  micDev: '<b>Краткое:</b> Устройство микрофона.<br><br><b>Зачем:</b> WASAPI input device.<br><b>Связано:</b> STT pipeline, VU-метр.<br><b>Размещение:</b> Audio — Devices.',

  sysDev: '<b>Краткое:</b> Системное аудио (loopback).<br><br><b>Зачем:</b> Захват того, что играет в колонках — голос собеседника в звонке.<br><b>Связано:</b> WASAPI loopback, STT.<br><b>Размещение:</b> Audio — Devices.',

  fGain: '<b>Краткое:</b> Mic gain 0-200%.<br><br><b>Зачем:</b> Усилить тихийый голос или убрать клиппинг.<br><b>Связано:</b> Mic input level, clipping.<br><b>Размещение:</b> Audio — Levels.',

  fStt: '<b>Краткое:</b> STT управляется по-разному в зависимости от режима.<br><br><b>Зачем:</b> Subscription = Quistan сам выбирает движок, без настроек. BYOK = пользователь выбирает Cloud API / Local / Ollama.<br><b>Связано:</b> fMode, segSttMode, sttManaged/sttByok секции.<br><b>Размещение:</b> Audio — Enhancement.',

  fSttMode: '<b>Краткое:</b> Какой STT-бэкенд использовать в BYOK.<br><br><b>Зачем:</b> Локальный Whisper = бесплатно, офлайн, медленно на CPU. Cloud API = быстро, платно. О Ollama = свой OpenAI-compatible сервер.<br><b>Связано:</b> fSttApiKey, fSttOllamaUrl.<br><b>Размещение:</b> Audio — Enhancement.',

  fSttApiKey: '<b>Краткое:</b> API-ключ облачного STT-провайдера.<br><br><b>Зачем:</b> Deepgram или OpenAI Whisper API.<br><b>Связано:</b> Credential Manager, Cloud API режим.<br><b>Размещение:</b> Audio — под segSttMode при выборе API.',

  fSttOllamaUrl: '<b>Краткое:</b> URL локального Ollama или другого OpenAI-compatible STT-сервера.<br><br><b>Зачем:</b> Подключить свой бэкенд STT.<br><b>Связано:</b> Должен expose /v1/audio/transcriptions, модель whisper через ollama pull.<br><b>Размещение:</b> Audio — под segSttMode при выборе Ollama.',

  fJpeg: '<b>Краткое:</b> Качество JPEG 40-100%.<br><br><b>Зачем:</b> Баланс размер/чёткость для AI. 70% — sweet spot.<br><b>Связано:</b> fCompress toggle (общий on/off).<br><b>Размещение:</b> Capture — Format.',

  fWda: '<b>Краткое:</b> Windows Display API — скрыть окна Куистана.<br><br><b>Зачем:</b> Не светить ассистента в Zoom/Meet screen-share.<br><b>Связано:</b> Stealth, anti-detection.<br><b>Размещение:</b> General — Stealth.',

  fHideFrame: '<b>Краткое:</b> Скрыть рамку региона при screen-share собеседника.<br><br><b>Зачем:</b> Визуальная скрытность.<br><b>Связано:</b> fWda.<br><b>Размещение:</b> General — Stealth.',

  fHideSelf: '<b>Краткое:</b> Скрыть self-preview из screen-share.<br><br><b>Зачем:</b> Не показывать вебку собеседнику.<br><b>Связано:</b> Webcam pipeline, stealth.<br><b>Размещение:</b> General — Stealth.',

  hotkey_open: '<b>Краткое:</b> Открыть Control Panel.<br><br><b>Зачем:</b> Глобальный вызов главного окна из любого приложения.<br><b>Связано:</b> Main window, restore from tray.<br><b>Размещение:</b> Shortcuts — первый в списке.',

  hotkey_pause: '<b>Краткое:</b> Пауза/возобновить прослушку.<br><br><b>Зачем:</b> Временно отключить AI (звонок закончился, отошёл).<br><b>Связано:</b> STT pipeline, indicator.<br><b>Размещение:</b> Shortcuts.',

  hotkey_region: '<b>Краткое:</b> Выбрать регион.<br><br><b>Зачем:</b> Быстро переопределить зону capture.<br><b>Связано:</b> Floating toolbar (runtime), hotkey_region.<br><b>Размещение:</b> Shortcuts.',

  hotkey_snap: '<b>Краткое:</b> Снимок сейчас.<br><br><b>Зачем:</b> Ручной триггер capture из любой точки.<br><b>Связано:</b> Floating toolbar (runtime).<br><b>Размещение:</b> Shortcuts.',

  hotkey_refresh: '<b>Краткое:</b> Рефреш всех floating окон.<br><br><b>Зачем:</b> Перечитать конт, переоценить ситуацию.<br><b>Связано:</b> Floating windows.<br><b>Размещение:</b> Shortcuts.',

  hotkey_solo: '<b>Краткое:</b> Solo mode.<br><br><b>Зачем:</b> AI слушает только вас (без системного аудио).<br><b>Связано:</b> sysDev toggling, fMode.<br><b>Размещение:</b> Shortcuts.',

  hotkey_send: '<b>Краткое:</b> Отправить текущий dialog.<br><br><b>Зачем:</b> Manual capture из floating window input.<br><b>Связано:</b> Floating window send.<br><b>Размещение:</b> Shortcuts.',

  fNotifUpdate: '<b>Краткое:</b> Уведомлять о новых версиях.<br><br><b>Зачем:</b> Донести, что есть апдейт.<br><b>Связано:</b> Update server, fAutoUpdate.<br><b>Размещение:</b> Notifications — Alerts.',

  fNotifLicense: '<b>Краткое:</b> Предупредить об истечении подписки.<br><br><b>Зачем:</b> Дать время продлить.<br><b>Связано:</b> Expiry date, billing.<br><b>Размещение:</b> Notifications — Alerts.',

  fNotifKb: '<b>Краткое:</b> Уведомить о завершении реиндексации KB.<br><br><b>Зачем:</b> Сигнал: можно снова пользоваться AI.<br><b>Связано:</b> reindexAll, KB state.<br><b>Размещение:</b> Notifications — Alerts.',

  fNotifError: '<b>Краткое:</b> Уведомления об ошибках API.<br><br><b>Зачем:</b> Быстро увидеть проблемы quota/rate-limit.<br><b>Связано:</b> Provider errors.<br><b>Размещение:</b> Notifications — Alerts.',

  fNotifWeekly: '<b>Краткое:</b> Еженедельный дайджест.<br><br><b>Зачем:</b> Саммари использования.<br><b>Связано:</b> Analytics aggregation.<br><b>Размещение:</b> Notifications — Alerts.',

  fSound: '<b>Краткое:</b> Пресет звука уведомления.<br><br><b>Зачем:</b> Контроль звукового сопровождения.<br><b>Связано:</b> fChannels, fQuietFrom/To.<br><b>Размещение:</b> Notifications — Delivery.',

  fQuietFrom: '<b>Краткое:</b> Начало quiet hours.<br><br><b>Зачем:</b> Ночной режим без звуков.<br><b>Связано:</b> fQuietTo, fDoNotDisturb.<br><b>Размещение:</b> Notifications — Delivery.',

  fQuietTo: '<b>Краткое:</b> Конец quiet hours.<br><br><b>Зачем:</b> Восстановить звук утром.<br><b>Связано:</b> fQuietFrom.<br><b>Размещение:</b> Notifications — Delivery.',

  fDoNotDisturb: '<b>Краткое:</b> DnD во время fullscreen apps.<br><br><b>Зачем:</b> Не мешать презентациям/играм/видеозвонкам.<br><b>Связано:</b> Fullscreen detection.<br><b>Размещение:</b> Notifications — Delivery.',

  fTgToken: '<b>Краткое:</b> Telegram bot token.<br><br><b>Зачем:</b> Форвард уведомлений в Telegram.<br><b>Связано:</b> @BotFather, Telegram API.<br><b>Размещение:</b> Notifications — Telegram Bot.',

  fTgChat: '<b>Краткое:</b> Telegram chat ID.<br><br><b>Зачем:</b> Куда слать уведомления.<br><b>Связано:</b> @userinfobot, fToken.<br><b>Размещение:</b> Notifications — Telegram Bot.',

  testTg: '<b>Краткое:</b> Тестовое сообщение в Telegram.<br><br><b>Зачем:</b> Проверить token + chat ID.<br><b>Связано:</b> fTgToken, fTgChat.<br><b>Размещение:</b> Notifications — Telegram Bot.',

  fTelemetry: '<b>Краткое:</b> Анонимная телеметрия.<br><br><b>Зачем:</b> Улучшать продукт без личных данных.<br><b>Связано:</b> Crash reporter, analytics.<br><b>Размещение:</b> Privacy & Data — Telemetry.',

  fBeta: '<b>Краткое:</b> Бета-функции.<br><br><b>Зачем:</b> Ранний доступ к экспериментам.<br><b>Связано:</b> fExpGpu/fExpMem/fExpMulti.<br><b>Размещение:</b> Privacy & Data — Telemetry.',

  fActiveDb: '<b>Краткое:</b> Активная БД.<br><br><b>Зачем:</b> Несколько проектов = несколько БД (work/research/archive).<br><b>Связано:</b> SQLite files, dbConnPill.<br><b>Размещение:</b> Privacy & Data — Database.',

  fDbConnected: '<b>Краткое:</b> Подключение к БД.<br><br><b>Зачем:</b> Read-only режим для безопасности/дебага.<br><b>Связано:</b> dbConnPill, write operations.<br><b>Размещение:</b> Privacy & Data — Database.',

  fDbFolder: '<b>Краткое:</b> Папка БД.<br><br><b>Зачем:</b> Read-only показ где лежат файлы.<br><b>Связано:</b> AppData/Local/Quistan/db, dbCopyPath, openDataFolder.<br><b>Размещение:</b> Privacy & Data — Database.',

  dbMaintenance: '<b>Краткое:</b> Vacuum/Integrity/Migrations/Rebuild.<br><br><b>Зачем:</b> SQLite housekeeping.<br><b>Связано:</b> SQLite PRAGMA, dbStats.<br><b>Размещение:</b> Privacy & Data — Database.',

  dbBackup: '<b>Краткое:</b> Backup/Restore/Copy/Open.<br><br><b>Зачем:</b> Защита от потери данных, удобный доступ.<br><b>Связано:</b> fActiveDb, .db files.<br><b>Размещение:</b> Privacy & Data — Database.',

  dbCleanup: '<b>Краткое:</b> Clear Vectors/History/Wipe.<br><br><b>Зачем:</b> Радикальная очистка только активной БД.<br><b>Связано:</b> fActiveDb, KB index, dialog turns.<br><b>Размещение:</b> Privacy & Data — Database.',

  dbStats: '<b>Краткое:</b> Read-only: версия схемы, последние операции.<br><br><b>Зачем:</b> Дать пользователю обзор здоровья БД.<br><b>Связано:</b> dbMaintenance.<br><b>Размещение:</b> Privacy & Data — Database.',

  fEncryptDb: '<b>Краткое:</b> SQLCipher AES-256.<br><br><b>Зачем:</b> Шифрование файлов БД на диске.<br><b>Связано:</b> SQLite engine, restart required.<br><b>Размещение:</b> Privacy & Data — Database.',

  fRetention: '<b>Краткое:</b> Срок хранения диалогов.<br><br><b>Зачем:</b> Не дать БД распухнуть.<br><b>Связано:</b> Cleanup cron, dbSize.<br><b>Размещение:</b> Privacy & Data — Database.',

  fClearOnExit: '<b>Краткое:</b> Стирать диалоги при выходе.<br><br><b>Зачем:</b> Чувствительные разговоры — очищать при закрытии.<br><b>Связано:</b> shutdown hook, dialog table.<br><b>Размещение:</b> Privacy & Data — Database.',

  checkUpdate: '<b>Краткое:</b> Проверить обновления сейчас.<br><br><b>Зачем:</b> Ручной trigger вместо ожидания фонового check.<br><b>Связано:</b> Update server, fAutoUpdate.<br><b>Размещение:</b> Updates — первое действие.',

  fAutoUpdate: '<b>Краткое:</b> Скачивать обновления автоматически.<br><br><b>Зачем:</b> Не заставлять пользователя ждать.<br><b>Связано:</b> Update server, fAutoInstall.<br><b>Размещение:</b> Updates.',

  fAutoInstall: '<b>Краткое:</b> Установить при выходе.<br><br><b>Зачем:</b> Не показывать restart prompt.<br><b>Связано:</b> Update workflow.<br><b>Размещение:</b> Updates.',

  fPrerelease: '<b>Краткое:</b> Получать pre-releases.<br><br><b>Зачем:</b> Доступ к бета-билдам.<br><b>Связано:</b> Update channel.<br><b>Размещение:</b> Updates.',

  fLogLevel: '<b>Краткое:</b> Уровень логирования (error/warn/info/debug).<br><br><b>Зачем:</b> Поддержка vs чистота логов.<br><b>Связано:</b> fLogToFile, copyDiagnostics.<br><b>Размещение:</b> Advanced — Logs & Debug.',

  fLogToFile: '<b>Краткое:</b> Писать логи в файл.<br><br><b>Зачем:</b> Диагностика для саппорта.<br><b>Связано:</b> Log rotation, openLogs.<br><b>Размещение:</b> Advanced — Logs & Debug.',

  logsTools: '<b>Краткое:</b> Open logs / Copy diagnostics.<br><br><b>Зачем:</b> Быстрый доступ к логам и диагностическому пакету.<br><b>Связано:</b> fLogToFile, support workflow.<br><b>Размещение:</b> Advanced — Logs & Debug.',

  fExpGpu: '<b>Краткое:</b> GPU для Whisper local.<br><br><b>Зачем:</b> Ускорить STT на совместимом GPU.<br><b>Связано:</b> fStt=whisper-local, CUDA.<br><b>Размещение:</b> Advanced — Experimental.',

  fExpMem: '<b>Краткое:</b> Persistent memory (RAG по диалогам).<br><br><b>Зачем:</b> AI помнит факты между сессиями.<br><b>Связано:</b> Vector DB, dialog history.<br><b>Размещение:</b> Advanced — Experimental.',

  fExpMulti: '<b>Краткое:</b> 3 модели параллельно + consensus.<br><br><b>Зачем:</b> Качество vs cost. Дебаг/исследование.<br><b>Связано:</b> AI providers, latency x3.<br><b>Размещение:</b> Advanced — Experimental.',

  configIO: '<b>Краткое:</b> Export/Import JSON настроек.<br><br><b>Зачем:</b> Перенос настроек между машинами. API keys не экспортируются (безопасность).<br><b>Связано:</b> DEFAULTS, saveAll.<br><b>Размещение:</b> Advanced — Import/Export.',

  factoryReset: '<b>Краткое:</b> Полный сброс.<br><br><b>Зачем:</b> Вернуть к DEFAULTS, вычистить всё.<br><b>Связано:</b> fWipeHistory, localStorage.<br><b>Размещение:</b> Advanced — Danger zone.',

  fWipeHistory: '<b>Краткое:</b> Дополнительно стереть диалоги при reset.<br><br><b>Зачем:</b> Опция: только настройки или полная очистка.<br><b>Связано:</b> factoryReset, dialog table.<br><b>Размещение:</b> Advanced — Danger zone.',
};

function applyHelp() {
  document.querySelectorAll('.field').forEach(field => {
    if (field.querySelector(':scope > .field__help')) return;
    let text = null;
    if (field.dataset.help && HELP[field.dataset.help]) {
      text = HELP[field.dataset.help];
    } else {
      const ctrl = field.querySelector('input, select, textarea, .seg, .theme-grid, .accent-row, .providers, .device-row, .meter-row, .kv, .update, .btn-row');
      if (ctrl && ctrl.id && HELP[ctrl.id]) text = HELP[ctrl.id];
    }
    if (!text) return;
    const tip = document.createElement('div');
    tip.className = 'field__help';
    tip.innerHTML = text;
    field.appendChild(tip);
    field.classList.add('has-help');
  });
  document.querySelectorAll('.shortcut').forEach(row => {
    if (row.querySelector(':scope > .field__help')) return;
    const key = row.dataset.help;
    if (!key || !HELP[key]) return;
    const tip = document.createElement('div');
    tip.className = 'field__help field__help--shortcut';
    tip.innerHTML = HELP[key];
    row.appendChild(tip);
    row.classList.add('has-help');
  });
}

// Dev notes hover panel (temporary)
function bindDevHover() {
  const note = document.getElementById('devNote');
  if (!note) return;
  const placeholder = note.innerHTML;

  const findKey = (el) => {
    if (!el) return null;
    if (el.dataset && el.dataset.help && DEV[el.dataset.help]) return el.dataset.help;
    const ctrl = el.querySelector && el.querySelector('input, select, textarea, .seg, .theme-grid, .accent-row, .providers, .device-row, .meter-row, .kv, .update, .btn-row');
    if (ctrl && ctrl.id && DEV[ctrl.id]) return ctrl.id;
    return null;
  };

  let lastEl = null;
  document.querySelectorAll('.field, .shortcut').forEach(el => {
    el.addEventListener('mouseenter', () => {
      const key = findKey(el);
      lastEl = el;
      if (key) note.innerHTML = `<span class="dev-note__key">${key}</span>` + DEV[key];
      else note.innerHTML = placeholder;
    });
    el.addEventListener('mouseleave', () => {
      if (lastEl === el) note.innerHTML = placeholder;
    });
  });
}

const THEMES = [
  { id: 'obsidian', name: 'Obsidian', sw: ['#0A0A10','#54548F','#A8A8B5'] },
  { id: 'midnight', name: 'Midnight', sw: ['#08080F','#3D6FB5','#9DB5D1'] },
  { id: 'forest',   name: 'Forest',   sw: ['#0A130D','#3A7C4F','#9CB89F'] },
  { id: 'ember',    name: 'Ember',    sw: ['#150B0B','#B25E48','#D8B19E'] },
  { id: 'paper',    name: 'Paper',    sw: ['#F5F2EA','#6E6248','#3A3328'] },
  { id: 'carbon',   name: 'Carbon',   sw: ['#0F0F11','#5E5E68','#B8B8C0'] },
];

function applyTheme() {
  const t = state.theme || 'obsidian';
  document.documentElement.setAttribute('data-theme', t);
  document.body.classList.remove('theme-obsidian', 'theme-midnight', 'theme-forest', 'theme-ember', 'theme-paper', 'theme-carbon');
  document.body.classList.add('theme-' + t);
}
function applyBg() {
  const mode = state.bg || 'texture';
  const layer = mode === 'solid' ? 'none' : 'var(--bg-texture, none)';
  document.body.style.setProperty('--bg-mode-layer', layer);
}
function applyScale() {
  const s = (state.fScale || 100) / 100;
  document.documentElement.style.zoom = s;
}

const STORAGE_KEY = 'quistan.settings.v2';
let state = {};
let dirty = false;

const DEFAULTS = {
  fLang: 'en',
  theme: 'obsidian', bg: 'texture',
  fScale: 100,
  fAutoStart: false, fStartMinimized: true, fTrayIcon: true, fStartMode: 'preflight',
  fMode: 'subscription', fPlan: 'standard', fPlanUsed: 12, fPlanRollover: 18, fPlanEnds: 'Sep 16, 2026', fPlanRange: 'Sep 1 - Sep 30, 2026', fPlanResetsIn: '14 days', fRegion: '', fHwid: 'a7f3-9c2b-4e81-...',
  fTemp: 'balanced', fMaxTok: 3, fStream: true,
  fModelFast: 'gpt-4o-mini', fModelHeavy: 'gpt-4o',
  fKeyOpenAI: 'sk-proj-' + '*'.repeat(35),
  fKeyAnthropic: '', fKeyOpenRouter: '',
  fApiKeys: [
    { id: 'openai',     name: 'OpenAI',        key: 'sk-proj-' + '*'.repeat(35), baseUrl: 'https://api.openai.com/v1',           enabled: true  },
    { id: 'anthropic',  name: 'Anthropic',     key: '',                            baseUrl: 'https://api.anthropic.com',           enabled: true  },
    { id: 'openrouter', name: 'OpenRouter',    key: '',                            baseUrl: 'https://openrouter.ai/api/v1',        enabled: true  },
    { id: 'gemini',     name: 'Google Gemini', key: '',                            baseUrl: 'https://generativelanguage.googleapis.com/v1beta', enabled: false },
    { id: 'mistral',    name: 'Mistral',       key: '',                            baseUrl: 'https://api.mistral.ai/v1',            enabled: false },
    { id: 'groq',       name: 'Groq',          key: '',                            baseUrl: 'https://api.groq.com/openai/v1',       enabled: false },
    { id: 'xai',        name: 'xAI (Grok)',    key: '',                            baseUrl: 'https://api.x.ai/v1',                  enabled: false },
    { id: 'deepseek',   name: 'DeepSeek',      key: '',                            baseUrl: 'https://api.deepseek.com/v1',          enabled: false },
    { id: 'cohere',     name: 'Cohere',        key: '',                            baseUrl: 'https://api.cohere.ai/v1',             enabled: false },
    { id: 'together',   name: 'Together AI',   key: '',                            baseUrl: 'https://api.together.xyz/v1',          enabled: false },
    { id: 'fireworks',  name: 'Fireworks AI',  key: '',                            baseUrl: 'https://api.fireworks.ai/inference/v1',enabled: false },
    { id: 'perplexity', name: 'Perplexity',    key: '',                            baseUrl: 'https://api.perplexity.ai',            enabled: false },
    { id: 'ollama',     name: 'Ollama (local)',key: '',                            baseUrl: 'http://localhost:11434/v1',            enabled: false },
    { id: 'lmstudio',   name: 'LM Studio',     key: '',                            baseUrl: 'http://localhost:1234/v1',             enabled: false },
    { id: 'custom',     name: 'Custom endpoint',key:'',                            baseUrl: '',                                     enabled: false },
  ],
  fReindexWatch: true, fReindexVerify: false,
  fChunk: 500, fOverlap: 50, fWorkers: '2',
  fEmbModel: 'bge-small-en-v1.5', fEmbCustomPath: '', fEmbDevice: 'cpu', fEmbGpu: false, fEmbFp16: true,
  // -- hidden audio defaults (auto-tuned by Quistan, no UI) --
  fGain: 100, fNoiseSup: true, fAec: true, fAgc: false, fVad: 'mid',
  fSttMode: 'local', fSttApiKey: '', fSttOllamaUrl: 'http://localhost:11434',
  fWda: true, fHideFrame: true, fHideSelf: true,
  fCompress: true, fJpeg: 70,
  hotkey_open: 'Ctrl+Shift+Q', hotkey_pause: 'Ctrl+Shift+Space', hotkey_region: 'Ctrl+Shift+A',
  hotkey_snap: 'Ctrl+Shift+S', hotkey_refresh: 'Ctrl+R', hotkey_solo: 'Ctrl+Shift+M', hotkey_send: 'Ctrl+Enter',
  fNotifUpdate: true, fNotifLicense: true, fNotifKb: true, fNotifError: true, fNotifWeekly: false,
  fChannels: ['tray','sound','toast'], fSound: 'default', fQuietFrom: '22:00', fQuietTo: '08:00',
  fDoNotDisturb: false, fTgToken: '', fTgChat: '',
  fTelemetry: false, fBeta: false, fRetention: '30', fEncryptDb: true, fClearOnExit: false,
  fActiveDb: 'default', fDbConnected: true,
  fAutoUpdate: true, fAutoInstall: false, fPrerelease: false,
  fLogLevel: 'warn', fLogToFile: true,
  fExpGpu: false, fExpMem: false, fExpMulti: false,
  fWipeHistory: false,
};

// -- palettes -----------------------------------------
function renderThemes() {
  const g = document.getElementById('themeGrid');
  if (!g) return;
  g.innerHTML = THEMES.map(t => `
    <div class="theme ${t.id === state.theme ? 'is-on' : ''}" data-theme="${t.id}">
      <div class="theme__swatches">${t.sw.map(c => `<span class="theme__sw" style="background:${c}"></span>`).join('')}</div>
      <div class="theme__name">${t.name}</div>
    </div>
  `).join('');
  g.querySelectorAll('.theme').forEach(el => {
    el.addEventListener('click', () => { state.theme = el.dataset.theme; markDirty(); renderThemes(); applyTheme(); });
  });
}
function renderAccents() {
  const r = document.getElementById('accentRow');
  if (!r) return;
  const palette = ['#54548F', '#6868A2', '#6E9C5E', '#7E73AA', '#669AB2', '#B89A6A', '#A86E68', '#A8A8B5'];
  r.innerHTML = palette.map(c => `<div class="accent ${c === state.accent ? 'is-on' : ''}" style="background:${c};color:${c}" data-color="${c}"></div>`).join('');
  r.querySelectorAll('.accent').forEach(el => {
    el.addEventListener('click', () => { state.accent = el.dataset.color; markDirty(); renderAccents(); });
  });
}

// -- segmented / dirty --------------------------------
function paintSegSingle(id, key, onChange) {
  const el = document.getElementById(id);
  if (!el) return;
  el.querySelectorAll('.seg__btn').forEach(b => {
    b.classList.toggle('is-on', b.dataset.val === state[key]);
    b.onclick = () => { state[key] = b.dataset.val; markDirty(); paintSegSingle(id, key, onChange); if (onChange) onChange(); };
  });
}
function paintSegMulti(id, key) {
  const el = document.getElementById(id);
  if (!el) return;
  el.querySelectorAll('.seg__btn').forEach(b => {
    const on = state[key].includes(b.dataset.val);
    b.classList.toggle('is-on', on);
    b.onclick = () => {
      const v = b.dataset.val;
      if (state[key].includes(v)) state[key] = state[key].filter(x => x !== v);
      else state[key] = state[key].concat([v]);
      markDirty();
      paintSegMulti(id, key);
    };
  });
}

// -- length slider (5 gradations) -----------------------
const LENGTH_LABELS = ['one line', 'a few lines', 'a paragraph', 'a few paragraphs', 'multiple paragraphs'];
function paintMaxTok() {
  const inp = document.getElementById('fMaxTok');
  if (!inp) return;
  let v = parseInt(inp.value, 10);
  if (!v || v < 1) v = 1;
  if (v > 5) v = 5;
  inp.value = v;
  state.fMaxTok = v;
  const hint = document.getElementById('fMaxTokHint');
  if (hint) hint.textContent = LENGTH_LABELS[v - 1];
  const ticks = inp.parentElement && inp.parentElement.querySelectorAll('.length-slider__ticks span');
  if (ticks) ticks.forEach((t, i) => t.classList.toggle('is-on', i < v));
  inp.oninput = () => { paintMaxTok(); markDirty(); };
}
function markDirty() {
  if (dirty) return;
  dirty = true;
  document.getElementById('dirty').classList.add('is-on');
}

// -- mode toggle (subscription - byok) ---------------
function paintSegMode() {
  const el = document.getElementById('segMode');
  if (!el) return;
  el.querySelectorAll('.seg__btn').forEach(b => {
    b.classList.toggle('is-on', b.dataset.val === state.fMode);
    b.onclick = () => { state.fMode = b.dataset.val; markDirty(); paintSegMode(); applyModeVisibility(); };
  });
}
function applyModeVisibility() {
  const isByok = state.fMode === 'byok';
  toggle('aiManagedSection', !isByok);
  toggle('aiByokSection', isByok);
  toggle('modeSubInfo', !isByok);
  toggle('modeByokInfo', isByok);
  toggle('modeSubExtras', !isByok);
  toggle('planPill', !isByok);
  toggle('sttManaged', !isByok);
  toggle('sttByok', isByok);
}

function applySttModeVisibility() {
  const m = state.fSttMode || 'local';
  toggle('sttByokLocal', m === 'local');
  toggle('sttByokApi', m === 'api');
  toggle('sttByokOllama', m === 'ollama');
}
function toggle(id, on) {
  const el = document.getElementById(id);
  if (el) el.style.display = on ? '' : 'none';
}

// -- DB connection pill ------------------------------
function updateDbConnPill() {
  const pill = document.getElementById('dbConnPill');
  if (!pill) return;
  if (state.fDbConnected) {
    pill.className = 'pill pill--live';
    pill.innerHTML = '<span class="d"></span>Connected';
  } else {
    pill.className = 'pill pill--off';
    pill.innerHTML = '<span class="d"></span>Read-only';
  }
}

// -- field bindings ----------------------------------
function bindFields() {
  // selects
  ['fLang','fModelFast','fModelHeavy','fSound','fActiveDb','fEmbModel'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = state[id];
    el.addEventListener('change', () => { state[id] = el.value; markDirty(); if (id === 'fEmbModel') paintEmbModelInfo(); });
  });

  // switches
  const swMap = {
    fAutoStart:'fAutoStart', fStartMinimized:'fStartMinimized', fTrayIcon:'fTrayIcon',
    fReindexWatch:'fReindexWatch', fReindexVerify:'fReindexVerify',
    fWda:'fWda', fHideFrame:'fHideFrame', fHideSelf:'fHideSelf',
    fCompress:'fCompress',
    fNotifUpdate:'fNotifUpdate', fNotifLicense:'fNotifLicense', fNotifKb:'fNotifKb', fNotifError:'fNotifError', fNotifWeekly:'fNotifWeekly',
    fDoNotDisturb:'fDoNotDisturb', fTelemetry:'fTelemetry', fBeta:'fBeta',
    fEncryptDb:'fEncryptDb', fClearOnExit:'fClearOnExit',
    fDbConnected:'fDbConnected',
    fAutoUpdate:'fAutoUpdate', fAutoInstall:'fAutoInstall', fPrerelease:'fPrerelease',
    fLogToFile:'fLogToFile', fExpGpu:'fExpGpu', fExpMem:'fExpMem', fExpMulti:'fExpMulti',
    fWipeHistory:'fWipeHistory',
    fEmbGpu:'fEmbGpu', fEmbFp16:'fEmbFp16',
  };
  Object.entries(swMap).forEach(([id,key]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.checked = !!state[key];
    el.addEventListener('change', () => { state[key] = el.checked; markDirty(); if (key === 'fDbConnected') updateDbConnPill(); });
  });

  // ranges
  const rangeMap = {
    fScale:    { fmt: v => v + '%',            key: 'fScale' },
    fGain:     { fmt: v => v + '%',            key: 'fGain' },
    fJpeg:     { fmt: v => v + '%',            key: 'fJpeg' },
    fChunk:    { fmt: v => v + ' tok',         key: 'fChunk' },
    fOverlap:  { fmt: v => v + ' tok',         key: 'fOverlap' },
  };
  Object.entries(rangeMap).forEach(([id,cfg]) => {
    const inp = document.getElementById(id);
    const out = document.getElementById(id + 'Val');
    if (!inp) return;
    inp.value = state[cfg.key];
    if (out) out.textContent = cfg.fmt(state[cfg.key]);
    inp.addEventListener('input', () => {
      state[cfg.key] = parseInt(inp.value, 10);
      if (out) out.textContent = cfg.fmt(state[cfg.key]);
      markDirty();
      if (cfg.key === 'fScale') applyScale();
    });
  });

  // times
  ['fQuietFrom','fQuietTo'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = state[id];
    el.addEventListener('change', () => { state[id] = el.value; markDirty(); });
  });

  // STT BYOK: api key + ollama url
  ['fSttApiKey','fSttOllamaUrl'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = state[id] || '';
    el.addEventListener('input', () => { state[id] = el.value; markDirty(); });
  });

  // api key inputs
  ['fTgToken','fTgChat','fEmbCustomPath'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = state[id] || '';
    el.addEventListener('input', () => { state[id] = el.value; markDirty(); });
  });

  // segmented
  paintSegSingle('segBg','bg', applyBg);
  paintSegSingle('segStartMode','fStartMode');
  paintSegMode();
  // paintSegSingle('segVad','fVad')  -- hidden UI, see DEFAULTS comment
  paintSegSingle('segSttMode','fSttMode', applySttModeVisibility);
  paintSegSingle('segRetention','fRetention');
  paintSegSingle('segWorkers','fWorkers');
  paintSegSingle('segLog','fLogLevel');
  paintSegSingle('segEmbDevice','fEmbDevice', paintEmbDevice);
  paintSegSingle('segTemp','fTemp');
  paintMaxTok();
  paintSegMulti('segChannels','fChannels');

  applyModeVisibility();
  applySttModeVisibility();
  paintEmbModelInfo();
  paintEmbDevice();
  renderApiKeys();
  renderPlan();
  paintDeviceLimit();
  bindHotkeys();
}

// -- hotkeys ------------------------------------------
function bindHotkeys() {
  document.querySelectorAll('.hotkey-input').forEach(el => {
    el.addEventListener('focus', () => el.classList.add('is-recording'));
    el.addEventListener('blur',  () => el.classList.remove('is-recording'));
    el.addEventListener('keydown', e => {
      e.preventDefault();
      if (e.key === 'Escape' || e.key === 'Backspace') {
        state['hotkey_' + el.dataset.hotkey] = '';
        el.textContent = '';
        markDirty();
        return;
      }
      const parts = [];
      if (e.ctrlKey)  parts.push('Ctrl');
      if (e.shiftKey) parts.push('Shift');
      if (e.altKey)   parts.push('Alt');
      if (e.metaKey)  parts.push('Meta');
      let k = e.key;
      if (k.length === 1) k = k.toUpperCase();
      if (['Control','Shift','Alt','Meta'].includes(k)) return;
      parts.push(k);
      const key = 'hotkey_' + el.dataset.hotkey;
      state[key] = parts.join('+');
      el.textContent = state[key];
      markDirty();
    });
  });
}

// -- audio meters (demo) -----------------------------
function buildMeter(id, n) {
  const wrap = document.getElementById(id);
  if (!wrap) return null;
  wrap.innerHTML = '';
  const bars = [];
  for (let i = 0; i < n; i++) {
    const b = document.createElement('span');
    b.className = 'meter-bar';
    wrap.appendChild(b);
    bars.push(b);
  }
  return bars;
}
let meterTick = null;
function startMeters() {
  const inBars  = buildMeter('meterInBars', 24);
  const sysBars = buildMeter('meterSysBars', 24);
  if (!inBars || !sysBars) return;
  let micOn = false, sysOn = false;
  const micBtn = document.getElementById('btnTestMic');
  const sysBtn = document.getElementById('btnTestSys');
  if (micBtn) micBtn.onclick = () => { micOn = !micOn; micBtn.classList.toggle('is-on', micOn); toast(micOn ? 'Mic test started' : 'Mic test stopped'); };
  if (sysBtn) sysBtn.onclick = () => { sysOn = !sysOn; sysBtn.classList.toggle('is-on', sysOn); toast(sysOn ? 'System audio test started' : 'System audio test stopped'); };
  if (meterTick) clearInterval(meterTick);
  meterTick = setInterval(() => {
    const ml = micOn ? Math.floor(Math.random() * 18) : 0;
    const sl = sysOn ? Math.floor(Math.random() * 20) : Math.floor(Math.random() * 3);
    [inBars, sysBars].forEach((bars, idx) => {
      const lvl = idx === 0 ? ml : sl;
      bars.forEach((b, i) => {
        const on = i < lvl;
        b.classList.toggle('is-on', on);
        b.classList.toggle('is-warn',   on && i > 14 && i <= 18);
        b.classList.toggle('is-danger', on && i > 18);
      });
    });
    const mVal = document.getElementById('meterInVal');
    const sVal = document.getElementById('meterSysVal');
    if (mVal) mVal.textContent  = dbStr(dbFromLevel(ml, 24));
    if (sVal) sVal.textContent = dbStr(dbFromLevel(sl, 24));
  }, 120);
}
function dbFromLevel(l, max) { if (l <= 0) return -Infinity; return Math.round(20 * Math.log10(l/max)); }
function dbStr(db) { return db <= -60 ? '-∞ dB' : db + ' dB'; }

// -- search ------------------------------------------
function bindSearch() {
  const inp = document.getElementById('search');
  if (!inp) return;
  inp.addEventListener('input', applySearch);
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault(); inp.focus(); inp.select();
    }
  });
}
function applySearch() {
  const q = document.getElementById('search').value.trim().toLowerCase();
  document.querySelectorAll('.cat').forEach(c => {
    const cat = CATEGORIES.find(x => x.id === c.dataset.cat);
    c.classList.toggle('is-search-hide', q && !cat.name.toLowerCase().includes(q));
  });
  document.querySelectorAll('.tab-content').forEach(pane => {
    let paneHasMatch = false;
    pane.querySelectorAll('.field, .update, .acc-card, .shortcut, .dz, .kv').forEach(el => {
      const hit = !q || (el.textContent || '').toLowerCase().includes(q);
      el.classList.toggle('is-search-hide', q && !hit);
      if (hit && q) paneHasMatch = true;
    });
    pane.querySelectorAll('.section').forEach(sec => {
      if (!q) { sec.classList.remove('is-search-empty'); return; }
      const has = Array.from(sec.querySelectorAll('.field,.update,.acc-card,.shortcut,.dz,.kv'))
        .some(f => !f.classList.contains('is-search-hide'));
      sec.classList.toggle('is-search-empty', !has);
      if (has) paneHasMatch = true;
    });
    if (q) {
      pane.classList.toggle('is-on', paneHasMatch);
      const cat = pane.dataset.tab;
      const catEl = document.querySelector(`.cat[data-cat="${cat}"]`);
      if (catEl) catEl.classList.toggle('is-search-hide', !paneHasMatch);
    } else {
      pane.classList.toggle('is-on', pane.dataset.tab === activeCat);
    }
  });
}

// -- save / load / reset -----------------------------
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data && typeof data === 'object') return Object.assign({}, DEFAULTS, data);
    }
  } catch (_) {}
  return JSON.parse(JSON.stringify(DEFAULTS));
}
function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {} }

function saveAll() {
  save();
  dirty = false;
  document.getElementById('dirty').classList.remove('is-on');
  toast('Settings saved');
}
function resetAll() {
  if (!confirm('Reset all settings to defaults? Your customizations will be lost.')) return;
  state = JSON.parse(JSON.stringify(DEFAULTS));
  save();
  dirty = false;
  document.getElementById('dirty').classList.remove('is-on');
  bindFields(); renderThemes(); renderAccents(); updateDbConnPill(); applyTheme(); applyBg(); applyScale(); applyModeVisibility(); applySttModeVisibility();
  toast('Reset to defaults', 'warn');
}

function factoryReset() {
  const wipe = document.getElementById('fWipeHistory').checked;
  const msg = wipe
    ? 'Factory reset will erase ALL settings, dialog history and caches. This cannot be undone. Continue?'
    : 'Factory reset will erase all settings and caches (history preserved). Continue?';
  if (!confirm(msg)) return;
  try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
  try { if (wipe) localStorage.removeItem('quistan.dialogs.v1'); } catch (_) {}
  state = JSON.parse(JSON.stringify(DEFAULTS));
  save();
  bindFields(); renderThemes(); renderAccents(); updateDbConnPill(); applyTheme(); applyBg(); applyScale(); applyModeVisibility(); applySttModeVisibility();
  toast('Factory reset complete', 'warn');
}

// -- toast -------------------------------------------
function toast(msg, kind) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.classList.toggle('toast--warn', kind === 'warn');
  t.classList.add('is-visible');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('is-visible'), 1800);
}

// -- action stubs ------------------------------------
function signIn()         { toast('Sign-in flow  -  Phase 5'); }
function manageSub()      { toast('Opening subscription manager  -  ' + PLANS[state.fPlan].name + ' (' + getRegion().toUpperCase() + ')'); }
function switchPlan()     { toast('Opening plan picker  -  5 plans available'); }
function signOutDevice(id)    { if (confirm('Sign out from this device? It will stop working on the next launch.')) toast('Device signed out  -  sign in again to restore', 'warn'); }
function signOutAll()         { if (confirm('Sign out from ALL other devices? Only this PC will stay signed in.')) toast('All other devices signed out', 'warn'); }
function openDevicesCabinet() { window.open('https://quistan.com/account/devices', '_blank', 'noopener'); }
function testKeys()       {
  const keys = (state.fApiKeys || []).filter(k => k.enabled && k.key);
  if (!keys.length) { toast('No enabled keys to test', 'warn'); return; }
  toast('Testing ' + keys.length + ' key' + (keys.length > 1 ? 's' : '') + '  -  pinging endpoints');
}
function reindexAll()     { if (!confirm('Reindex all knowledge sources? Existing vectors will be rebuilt.')) return; toast('Reindexing started'); }
function pickDevice(k)    { toast('Native picker  -  backend integration Phase 6'); }
function testMic()        { const b = document.getElementById('btnTestMic'); if (b) b.onclick(); }
function testSys()        { const b = document.getElementById('btnTestSys'); if (b) b.onclick(); }
function selectRegion()   { toast('Drag-select region on any screen'); }
function clearRegion()    { toast('Region cleared'); }
function convertScreenshots(fmt) {
  void fmt;
  toast('Format conversion is now automatic  -  toggle in General \u2192 Capture');
}
function takeScreenshot() { toast('Screenshot captured from current region'); }
function testTg()         { toast('Test message sent to Telegram'); }
function openDataFolder() { toast('Opening data folder - '); }
function checkUpdate()    { toast('You are on the latest version'); }
function openLogs()       { toast('Opening logs folder - '); }
function copyDiagnostics(){ toast('Diagnostics copied to clipboard'); }
function exportConfig()   {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'quistan-settings.json';
  a.click();
  toast('Config exported');
}
function importConfig()   { toast('Native file picker  -  backend integration Phase 6'); }
function openWindows()    {
  if (window.parent && window.parent !== window) window.parent.postMessage({ type:'open-windows-settings' }, '*');
  else window.open('floating_windows_settings.html', '_blank');
}
function openKb()         {
  if (window.parent && window.parent !== window) window.parent.postMessage({ type:'open-kb-picker' }, '*');
  else window.open('kb_picker.html', '_blank');
}
function dbVacuum()       { toast('Vacuum: rebuilding DB file to reclaim space - '); }
function dbIntegrity()    { toast('Integrity check: ok (no corruption)'); }
function dbMigrate()      { toast('No pending migrations  -  schema v14 is current'); }
function dbRebuild()      { toast('Rebuilding FTS and B-tree indexes - '); }
function dbBackup()       { toast('Backup saved'); }
function dbRestore()      { const file = prompt('Path to backup .db file:'); if (file) toast('Restoring from ' + file); }
function dbCopyPath()     { navigator.clipboard?.writeText(document.getElementById('fDbFolder')?.value || ''); toast('Path copied'); }
function dbClearVectors() { if (!confirm('Wipe vector index for the active database? Sources will need to be reindexed.')) return; toast('Vector index cleared  -  reindex required', 'warn'); }
function dbClearHistory() { if (!confirm('Wipe dialog history for the active database? Settings and vectors preserved.')) return; toast('Dialog history cleared', 'warn'); }
function dbWipe()         { if (!confirm('Wipe the ACTIVE database completely? This cannot be undone.')) return; if (!confirm('Are you absolutely sure?')) return; toast('Database wiped', 'warn'); }

// -- plans (subscription tiers) -----------------------------
const PLANS = {
  test: {
    name: 'Test-Craster', initial: 'T',
    hours: 0.5, period: 'week', periodLabel: '30 min / week', rollover: false, resetDay: 'Every Monday',
    windows: 1, folders: 1,
    ru: { 'price': 0,    currency: 'RUB', 'per': '' },
    us: { 'price': 0,    currency: '$',   'per': '' },
    blurb: 'Just check out the app on your PC.',
  },
  offer: {
    name: 'Offer', initial: 'O',
    hours: 8, period: 'week', periodLabel: '8 h for 7 days', rollover: false,
    windows: 3, folders: 3,
    ru: { 'price': 690,  currency: 'RUB', 'per': ' / week' },
    us: { 'price': 9.99, currency: '$',   'per': ' / week' },
    blurb: 'Job hunters - pass 1-2 interviews this week.',
  },
  standard: {
    name: 'Standard', initial: 'S',
    hours: 25, period: 'month', periodLabel: '25 h / month', rollover: true,
    windows: 3, folders: 5,
    ru: { 'price': 1190, currency: 'RUB', 'per': ' / month' },
    us: { 'price': 19.99, currency: '$',   'per': ' / mo' },
    blurb: 'Daily meetings, reports and calls with the boss.',
  },
  hustler: {
    name: 'Hustler PRO', initial: 'H',
    hours: 100, period: 'month', periodLabel: '100 h / month', rollover: true,
    windows: 5, folders: 20,
    ru: { 'price': 2490, currency: 'RUB', 'per': ' / month' },
    us: { 'price': 39.99, currency: '$',   'per': ' / mo' },
    blurb: 'Pro salespeople and multi-platform freelancers.',
  },
  byok: {
    name: 'Your Key', initial: 'Y',
    hours: -1, period: 'unlimited', periodLabel: 'UNLIMITED', rollover: true,
    windows: -1, folders: -1,
    ru: { 'price': 500,  currency: 'RUB', 'per': ' / month' },
    us: { 'price': 6.99, currency: '$',   'per': ' / mo' },
    blurb: 'BYOK - for programmers and geeks, 0% AI costs.',
  },
};

function getRegion() {
  if (state && state.fRegion) return state.fRegion;
  const lang = (navigator.language || (navigator.languages && navigator.languages[0]) || 'en').toLowerCase();
  if (lang.startsWith('ru') || lang === 'uk' || lang === 'kk' || lang === 'be' || lang === 'uz') return 'ru';
  return 'us';
}
function fmtMoney(plan, region) {
  const p = plan[region];
  if (p['price'] === 0) return 'Free';
  return p['price'].toLocaleString(region === 'ru' ? 'ru-RU' : 'en-US', { minimumFractionDigits: p['price'] % 1 ? 2 : 0, maximumFractionDigits: 2 }) + ' ' + p.currency + p['per'];
}
function fmtLimit(n) { return n < 0 ? 'UNLIMITED' : n; }

function renderPlan() {
  const plan = PLANS[state.fPlan] || PLANS.standard;
  const region = getRegion();
  const price = fmtMoney(plan, region);
  const isFree = plan[region]['price'] === 0;
  const isUnlimited = plan.hours < 0;
  const monthlyAllowance = plan.hours;
  const used = state.fPlanUsed || 0;
  const rollover = state.fPlanRollover || 0;
  const total = isUnlimited ? -1 : (monthlyAllowance + rollover);

  // Plan card
  const card = document.getElementById('planCard');
  if (card) {
    card.innerHTML = `
      <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--solo));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:24px;flex-shrink:0;box-shadow:0 4px 12px rgba(84,84,143,.35)">${plan.initial || plan.name[0]}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:20px;font-weight:700;color:var(--text);letter-spacing:-.01em">${plan.name}</div>
        <div style="font-size:12px;color:var(--muted);font-family:'Geist Mono',monospace;margin-top:4px;text-transform:uppercase;letter-spacing:.04em">${price} · ${plan.periodLabel}${plan.rollover ? ' · rollover' : ''}</div>
        <div style="font-size:11.5px;color:var(--muted-2);margin-top:6px;font-style:italic">${plan.blurb}</div>
      </div>
      <span class="pill pill--live"><span class="d"></span>${isFree ? 'Free' : 'Active'}</span>
    `;
  }

  // Period kv
  const periodEnds = document.getElementById('planPeriodEnds');
  const periodRange = document.getElementById('planPeriodRange');
  const periodResets = document.getElementById('planPeriodResets');
  const rolloverEl = document.getElementById('planRollover');
  if (periodEnds)  periodEnds.textContent  = isUnlimited ? 'Active until cancelled' : (state.fPlanEnds || 'Sep 16, 2026');
  if (periodRange) periodRange.textContent = isUnlimited ? 'Auto-renew monthly'     : (state.fPlanRange || 'Sep 1 - Sep 30, 2026');
  if (periodResets)periodResets.textContent= isUnlimited ? 'Never'                  : (state.fPlanResetsIn || '14 days');
  if (rolloverEl) {
    if (isUnlimited) {
      rolloverEl.outerHTML = '<span class="pill pill--info"><span class="d"></span>Always unlimited</span>';
    } else if (plan.rollover) {
      rolloverEl.outerHTML = '<span class="pill pill--info"><span class="d"></span>Unused hours carry over</span>';
    } else {
      rolloverEl.outerHTML = '<span class="pill pill--warn"><span class="d"></span>No rollover  -  hours expire</span>';
    }
  }

  // Limits
  const limWin = document.getElementById('planLimitWindows');
  const limFol = document.getElementById('planLimitFolders');
  if (limWin) limWin.textContent = fmtLimit(plan.windows);
  if (limFol) limFol.textContent = fmtLimit(plan.folders);

  // Hours usage
  const hoursBlock = document.getElementById('planHours');
  if (hoursBlock) {
    if (isUnlimited) {
      hoursBlock.outerHTML = `
        <div class="info" style="margin-top:14px" data-help="usageHours">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 12 15 22 6"/></svg>
          <div><b>UNLIMITED hours</b>. You bring your own API keys — Quistan does not meter or bill your usage.</div>
        </div>`;
    } else {
      const pct = total > 0 ? Math.min(100, Math.round(used / total * 100)) : 0;
      hoursBlock.outerHTML = `
        <div class="field" data-help="usageHours">
          <div class="field__label">
            <span>Hours pool</span>
            <span class="field__hint">${plan.periodLabel}${plan.rollover ? ' + rollover' : ''}</span>
          </div>
          <div class="usage">
            <div class="usage__head"><b>${total} h available</b><span>used ${used} of ${total}</span></div>
            <div class="usage__bar"><div class="usage__bar-fill" style="width:${pct}%"></div></div>
            <div class="usage__sub">${monthlyAllowance} h ${plan.period === 'week' ? 'this week' : 'this month'}${plan.rollover ? '  +  ' + rollover + ' h rollover  -  ' + used + ' h used' : '  -  ' + used + ' h used'}</div>
          </div>
        </div>`;
    }
  }
}

// -- embeddings: model picker, device picker, gpu detect -
const EMB_MODELS = {
  'bge-small-en-v1.5':     { name: 'bge-small-en-v1.5',     dim: 384,  size: '~33 MB',   bundled: true,  path: 'C:\\Program Files\\Quistan\\models\\bge-small-en-v1.5' },
  'bge-base-en-v1.5':      { name: 'bge-base-en-v1.5',      dim: 768,  size: '~110 MB',  bundled: true,  path: 'C:\\Program Files\\Quistan\\models\\bge-base-en-v1.5' },
  'bge-large-en-v1.5':     { name: 'bge-large-en-v1.5',     dim: 1024, size: '~335 MB',  bundled: true,  path: 'C:\\Program Files\\Quistan\\models\\bge-large-en-v1.5' },
  'nomic-embed-text-v1.5': { name: 'nomic-embed-text-v1.5', dim: 768,  size: '~270 MB',  bundled: false, path: '%USERPROFILE%\\.cache\\quistan\\nomic-embed-text-v1.5' },
  'mxbai-embed-large-v1':  { name: 'mxbai-embed-large-v1',  dim: 1024, size: '~670 MB',  bundled: false, path: '%USERPROFILE%\\.cache\\quistan\\mxbai-embed-large-v1' },
  'custom':                { name: 'Custom model',          dim: 0,    size: 'unknown',  bundled: false, path: '' },
};

function paintEmbModelInfo() {
  const id = state.fEmbModel || 'bge-small-en-v1.5';
  const info = EMB_MODELS[id] || EMB_MODELS['bge-small-en-v1.5'];
  const isCustom = id === 'custom';
  const row = document.getElementById('embCustomRow');
  if (row) row.style.display = isCustom ? '' : 'none';
  const path = isCustom ? (state.fEmbCustomPath || '(pick a folder)') : info.path;
  const nameEl = document.getElementById('embKvName');
  const pathEl = document.getElementById('embKvPath');
  const dimEl  = document.getElementById('embKvDim');
  const sizeEl = document.getElementById('embKvSize');
  if (nameEl) nameEl.textContent = info.name + (info.bundled ? '  -  bundled' : (isCustom ? '' : '  -  downloadable'));
  if (pathEl) pathEl.textContent = path;
  if (dimEl)  dimEl.textContent  = info.dim || 'depends on model';
  if (sizeEl) sizeEl.textContent = info.size;
  const pill = document.getElementById('embStatusPill');
  const status = document.getElementById('embKvStatus');
  if (info.bundled) {
    if (pill) { pill.className = 'pill pill--live'; pill.innerHTML = '<span class="d"></span>Loaded'; }
    if (status) status.textContent = 'Loaded';
  } else if (isCustom) {
    if (pill) { pill.className = 'pill pill--warn'; pill.innerHTML = '<span class="d"></span>Custom'; }
    if (status) status.textContent = 'Custom path';
  } else {
    if (pill) { pill.className = 'pill pill--off'; pill.innerHTML = '<span class="d"></span>Not installed'; }
    if (status) status.textContent = 'Not installed';
  }
}

function paintEmbDevice() {
  const dev = state.fEmbDevice || 'cpu';
  const gpuEnabled = !!state.fEmbGpu;
  const segEl = document.getElementById('segEmbDevice');
  if (segEl) {
    segEl.querySelectorAll('.seg__btn').forEach(b => b.classList.toggle('is-on', b.dataset.val === dev));
  }
  const runtime = document.getElementById('gpuKvRuntime');
  if (runtime) {
    let txt = 'ONNX Runtime 1.18  -  ';
    if (dev === 'cpu') txt += 'CPU';
    else if (dev === 'cuda') txt += gpuEnabled ? 'CUDA 12.x (NVIDIA)' : 'CUDA (disabled)';
    else if (dev === 'dml')  txt += gpuEnabled ? 'DirectML' : 'DirectML (disabled)';
    runtime.textContent = txt;
  }
}

function applyEmbModel() {
  const id = state.fEmbModel || 'bge-small-en-v1.5';
  if (id === 'custom' && !state.fEmbCustomPath) { toast('Pick a model folder first', 'warn'); return; }
  toast('Loading ' + id + '  -  rebuilding vector index');
}

function unloadEmbModel() {
  toast('Embedding model unloaded');
}

// -- api keys: dynamic provider list --------------------
function _apiKeyMask(v) {
  if (!v) return '';
  if (v.length <= 8) return '*'.repeat(v.length);
  return v.slice(0, 4) + '*'.repeat(Math.max(8, v.length - 8)) + v.slice(-4);
}
function paintDeviceLimit() {
  const limitEl = document.getElementById('devLimit');
  const totalEl = document.getElementById('devTotal');
  const activeEl = document.getElementById('devActive');
  const otherEl = document.getElementById('devOther');
  if (!limitEl) return;
  const isTrial = state.fPlan === 'trial';
  const limit = isTrial ? 1 : 3;
  const active = 1;
  const total = limit;
  const other = Math.max(0, total - active);
  limitEl.textContent = limit;
  if (totalEl) totalEl.textContent = total;
  if (activeEl) activeEl.textContent = active;
  if (otherEl) otherEl.textContent = other;
}
function renderApiKeys() {
  const list = document.getElementById('apiKeysList');
  if (!list) return;
  if (!Array.isArray(state.fApiKeys)) state.fApiKeys = [];
  list.innerHTML = state.fApiKeys.map(k => {
    const masked = _apiKeyMask(k.key || '');
    const has = !!k.key;
    const on = !!k.enabled;
    let statusText, statusCls;
    if (!on)         { statusText = 'Disabled'; statusCls = 'is-warn'; }
    else if (has)    { statusText = 'Active';   statusCls = 'is-on';   }
    else             { statusText = 'Empty';    statusCls = 'is-off';  }
    return `
      <div class="api-key-row ${on ? 'is-on' : 'is-off'}" data-id="${k.id}">
        <div class="api-key-row__head">
          <input class="api-key-row__name" type="text" data-field="name" value="${(k.name || '').replace(/"/g,'&quot;')}" placeholder="Provider name">
          <span class="api-key-row__preset">${k.id}</span>
          <span class="api-key-row__status ${statusCls}">${statusText}</span>
          <button class="api-key-row__del" title="Remove this key" data-act="del">&#10005;</button>
        </div>
        <div class="input--suffix">
          <input class="input" type="password" data-field="key" value="${(k.key || '').replace(/"/g,'&quot;')}" placeholder="paste API key here" autocomplete="off">
          <span class="suf" style="cursor:pointer" data-act="peek" title="Show / hide">${has ? masked : ''}</span>
        </div>
        <div class="api-key-row__inputs">
          <input class="input" type="text" data-field="baseUrl" value="${(k.baseUrl || '').replace(/"/g,'&quot;')}" placeholder="https://api.example.com/v1">
          <input class="input" type="text" data-field="models" value="${(k.models || '').replace(/"/g,'&quot;')}" placeholder="model whitelist (comma-separated, optional)">
        </div>
        <div style="display:flex;align-items:center;gap:8px;font-size:11px;color:var(--muted-2)">
          <label class="switch" style="font-size:11px">
            <input type="checkbox" data-field="enabled" ${on ? 'checked' : ''}>
            <span class="switch__track" style="width:26px;height:14px"><span class="switch__thumb" style="width:11px;height:11px"></span></span>
            <span class="switch__label">Enabled</span>
          </label>
        </div>
      </div>
    `;
  }).join('');
  list.querySelectorAll('.api-key-row').forEach(row => {
    const id = row.dataset.id;
    const item = state.fApiKeys.find(x => x.id === id);
    if (!item) return;
    row.querySelectorAll('[data-field]').forEach(inp => {
      inp.addEventListener('input', () => {
        const f = inp.dataset.field;
        let v = inp.type === 'checkbox' ? inp.checked : inp.value;
        if (f === 'enabled') v = !!v;
        item[f] = v;
        markDirty();
        if (f === 'enabled') renderApiKeys();
      });
    });
    row.querySelector('[data-act="del"]').addEventListener('click', () => removeApiKey(id));
    const peek = row.querySelector('[data-act="peek"]');
    const keyInp = row.querySelector('[data-field="key"]');
    if (peek && keyInp) {
      peek.addEventListener('click', () => {
        if (keyInp.type === 'password') { keyInp.type = 'text'; peek.textContent = item.key || ''; }
        else { keyInp.type = 'password'; peek.textContent = _apiKeyMask(item.key || ''); }
      });
    }
  });
}
function addApiKey() {
  if (!Array.isArray(state.fApiKeys)) state.fApiKeys = [];
  const id = 'custom_' + Date.now().toString(36);
  state.fApiKeys.push({ id, name: 'New provider', key: '', baseUrl: '', models: '', enabled: false });
  markDirty();
  renderApiKeys();
  const last = document.querySelector('.api-key-row:last-child .api-key-row__name');
  if (last) { last.focus(); last.select(); }
  toast('New provider key added  -  fill name, key, baseUrl');
}
function removeApiKey(id) {
  if (!Array.isArray(state.fApiKeys)) return;
  const item = state.fApiKeys.find(x => x.id === id);
  if (!item) return;
  if (!confirm('Remove ' + (item.name || id) + ' key?')) return;
  state.fApiKeys = state.fApiKeys.filter(x => x.id !== id);
  markDirty();
  renderApiKeys();
  toast('Provider key removed');
}

function downloadEmbModel() {
  const id = state.fEmbModel || '';
  if (id === 'custom') { toast('Custom models are not downloadable', 'warn'); return; }
  if (EMB_MODELS[id] && EMB_MODELS[id].bundled) { toast('Already bundled  -  nothing to download'); return; }
  toast('Downloading ' + id + '  -  ~' + EMB_MODELS[id].size);
}

function pickEmbModel() { toast('Native folder picker  -  backend integration Phase 6'); }

function detectGpu() {
  const name = document.getElementById('gpuKvName');
  const drv  = document.getElementById('gpuKvDriver');
  const vram = document.getElementById('gpuKvVram');
  const cuda = document.getElementById('gpuKvCuda');
  const pill = document.getElementById('gpuDetectPill');
  const txt  = document.getElementById('gpuDetectText');
  if (name) name.textContent = 'Scanning';
  setTimeout(() => {
    if (name) name.textContent = 'NVIDIA GeForce RTX 4070';
    if (drv)  drv.textContent  = '551.23  -  CUDA 12.4';
    if (vram) vram.textContent = '12 GB GDDR6X';
    if (cuda) cuda.textContent = '5888';
    if (pill) { pill.className = 'pill pill--live'; pill.innerHTML = '<span class="d"></span>Detected'; }
    if (txt)  txt.textContent = 'RTX 4070';
  }, 600);
  toast('Detecting GPU');
}

function benchmarkEmb() { toast('Benchmark running  -  100 chunks  -  measuring ms/chunk'); }
function optimizeVectors() { toast('Optimizing vector index  -  IVF-PQ recompute'); }
function openVectorsFolder() { toast('Opening vector store folder'); }

// -- start ---------------------------------------------
state = load();
applyTheme();
applyBg();
applyScale();
renderSidebar();
loadAllTabs();