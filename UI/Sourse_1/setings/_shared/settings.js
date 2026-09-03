
const CATEGORIES = [
  { id: 'general',   name: 'General',     icon: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>' },
  { id: 'account',   name: 'Account',     icon: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
  { id: 'ai',        name: 'AI & Models', icon: '<path d="M12 2a4 4 0 0 0-4 4v2a4 4 0 0 0-4 4v2a4 4 0 0 0 4 4v0a4 4 0 0 0 4 4 4 4 0 0 0 4-4v0a4 4 0 0 0 4-4v-2a4 4 0 0 0-4-4V6a4 4 0 0 0-4-4z"/>', requiresFlag: s => s.fMode === 'subscription' },
  { id: 'byok',      name: 'BYOK',        icon: '<circle cx="8" cy="15" r="4"/><line x1="10.85" y1="12.15" x2="19" y2="4"/><line x1="18" y1="5" x2="20" y2="7"/><line x1="15" y1="8" x2="17" y2="10"/>', requiresFlag: s => s.fMode === 'byok' },
  { id: 'embeddings',name: 'Memory', icon: '<circle cx="4" cy="4" r="1.5"/><circle cx="12" cy="4" r="1.5"/><circle cx="20" cy="4" r="1.5"/><circle cx="4" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="20" cy="12" r="1.5"/><circle cx="4" cy="20" r="1.5"/><circle cx="12" cy="20" r="1.5"/><circle cx="20" cy="20" r="1.5"/>' },
  { id: 'audio',     name: 'Audio',       icon: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' },
  { id: 'capture',   name: 'Capture',     icon: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>' },
  { id: 'shortcuts', name: 'Shortcuts',   icon: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>' },
    { id: 'privacy',   name: 'Data & Privacy', icon: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>' },
  { id: 'update',    name: 'Updates',     icon: '<path d="M21 12a9 9 0 1 1-3-6.7"/><polyline points="21 4 21 10 15 10"/>' },
  { id: 'advanced',  name: 'Advanced',    icon: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>' },
];

// -- STT model catalog (local Whisper / Parakeet files) --
const STT_MODELS = {
  'whisper-multi-base':   { name: 'Multi (base)',     size: '~150 MB', bundled: true,  defaultInstalled: true,  desc: '99 languages  -  CPU-friendly, included in installer' },
  'whisper-multi-turbo':  { name: 'Multi (turbo)',    size: '~800 MB', bundled: false, defaultInstalled: false, desc: 'large-v3-turbo quality  -  ~2× faster than large' },
  'whisper-large-v3':     { name: 'Multi (large) V3', size: '~1.5 GB', bundled: false, defaultInstalled: false, desc: 'Best accuracy across all languages, slowest' },
  'parakeet-v3':          { name: 'Parakeet V3',      size: '~1.1 GB', bundled: false, defaultInstalled: false, desc: 'English only  -  real-time on CPU, NVIDIA-optimized' },
};
const STT_FOLDER = '%LocalAppData%\\Quistan\\models\\stt';

// -- LLM provider presets (for Add Provider modal) --
const PROVIDER_PRESETS = {
  openai:     { kind: 'cloud', name: 'OpenAI',     url: 'https://api.openai.com/v1',                                                                                    needsKey: true,  models: 'gpt-4o, gpt-4o-mini, gpt-4-turbo, o1, o1-mini' },
  anthropic:  { kind: 'cloud', name: 'Anthropic',  url: 'https://api.anthropic.com',                                                                                     needsKey: true,  models: 'claude-sonnet-4.5, claude-opus, claude-haiku-4' },
  openrouter: { kind: 'cloud', name: 'OpenRouter', url: 'https://openrouter.ai/api/v1',                                                                                  needsKey: true,  models: 'auto-discover via /models' },
  ollama:     { kind: 'local', name: 'Ollama',     url: 'http://localhost:11434/v1',                                                                                    needsKey: false, models: 'auto-discover from running Ollama' },
  lmstudio:   { kind: 'local', name: 'LM Studio',  url: 'http://localhost:1234/v1',                                                                                     needsKey: false, models: 'auto-discover from loaded models' },
  vllm:       { kind: 'local', name: 'vLLM',       url: 'http://localhost:8000/v1',                                                                                     needsKey: false, models: 'auto-discover from /v1/models' },
  custom:     { kind: 'local', name: '',           url: '',                                                                                                             needsKey: false, models: '' },
};

// -- STT provider presets (for Add STT Provider modal) --
const STT_PROVIDER_PRESETS = {
  openai: { name: 'OpenAI Whisper',   url: 'https://api.openai.com/v1',             needsKey: true,  model: 'whisper-1',          kind: 'cloud' },
  groq:   { name: 'Groq Whisper',     url: 'https://api.groq.com/openai/v1',       needsKey: true,  model: 'whisper-large-v3-turbo', kind: 'cloud' },
  ollama: { name: 'Ollama / Custom',  url: 'http://localhost:11434/v1',            needsKey: false, model: 'whisper',             kind: 'local' },
};

// -- HELP TEXT (hover tooltip for every setting) --
const HELP = {
  // ===== General =====
  fLang: 'The language every label, button, menu and error message in this window shows up in. Change it and the whole UI instantly retranslates. <b>Practical use:</b> pick the language you actually read - everything stays the same, just translated.',

  theme: 'Pick a theme to change the overall mood of the app. <b>What you see change:</b> the body background color; the tint of the soft glow gradients in the corners; the color of the small dots before each section title; the color of "lit" elements like the live-status pills (Connected / Online). <b>Try this:</b> click Midnight - the whole backdrop goes blueish and the corner glows shift to cyan. <b>Vibe guide:</b> Obsidian = cool purple (default), Midnight = blue, Forest = green, Ember = orange/warm, Paper = light beige for daytime, Carbon = neutral grey-black.',

  themeGrid: 'Six theme tiles. Each tile has 3 small color squares that preview the theme\'s palette: the dark square is the background, the middle square is the accent/glow tint, the light square is the text color. Click any tile to switch the whole app to that theme. The currently active theme has a white border around its tile. Each theme can also load a custom background PNG if you put <code>bg-{theme}.png</code> next to this HTML file.',

  bg: 'How the background renders. <b>Show texture</b> = layered PNG image + theme color + soft corner glows. <b>Solid only</b> = just the theme color + glow gradients, no image. <b>When to flip to Solid:</b> if you find the image too busy, or for screen recording.',

  fScale: 'Zoom of the entire window. <b>Drag left</b> to make everything smaller and fit more on screen (good for 13" laptops). <b>Drag right</b> to make everything bigger (good if text feels too small). Changes take effect live as you drag.',

  fOpacity: 'Window opacity 50-100%. <b>Drag left</b> to make the settings window see-through so you can keep working in the app behind it. <b>Drag right</b> to full opacity. Changes apply live as you drag. Minimum 50% so text stays legible.',

  fAutoStart: 'ON = Quistan launches every time you sign in to Windows. <b>When to enable:</b> on a dedicated work machine where you want Quistan always ready. <b>When to disable:</b> on shared/gaming PCs where every second of boot matters.',

  fStartMinimized: 'ON = Quistan starts hidden in the system tray instead of opening the main window. Combine with <b>Auto-launch</b> to have it always-on but invisible. <b>Requires Auto-launch</b> &mdash; if Auto-launch is OFF this switch is disabled and ignored. <b>Priority:</b> when ON, it overrides the <b>Default startup mode</b> below &mdash; Quistan goes straight to tray regardless of Pre-flight / Resume.',

  fTrayIcon: 'ON = a small Quistan icon stays in the Windows notification area. <b>Required</b> if you use Start minimized or Stay in tray - it\'s how you reach the menu when the main window is closed.',

  fStartMode: 'What happens when Quistan launches. <b>Pre-flight</b> = show the start dialog (pick what to do). <b>Resume</b> = open the last dialog you were in. <b>Stay in tray</b> = stay hidden until summoned. <b>Pick Resume</b> for daily use; <b>Pre-flight</b> if each session is a new context. <b>Note:</b> if <b>Start minimized</b> is ON above, it wins &mdash; Quistan always goes to tray regardless of this choice.',

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

  fChunk: 'Maximum tokens per piece when Quistan splits a document for indexing. <b>Drag right</b> to keep longer passages intact (better for research papers); <b>drag left</b> for fine-grained Q&A pieces. Default 384 keeps every chunk safely inside the 512-token context window of bge-small — going higher silently truncates the tail of long chunks.',

  fOverlap: 'Tokens shared between neighboring chunks - prevents sentences from being cut at chunk boundaries. <b>Drag right</b> for technical/legal text where mid-sentence cuts hurt; <b>drag left</b> for huge corpora where speed beats edge recall.',

  fWorkers: 'How many chunks Quistan embeds in parallel during reindex. <b>Drag right</b> if you have many CPU cores and want faster reindex; <b>drag left</b> if reindex makes the UI sluggish.',

  // ===== Embeddings & Vector Store =====
  fEmbModel: 'Which local embedding model turns your text into vectors. <b>bge-small / base / large</b> are bundled and English-only. <b>paraphrase-multilingual-MiniLM-L12-v2</b> (384d, ~50 MB, downloadable) covers 50+ languages including Russian - good default for non-English KBs. <b>bge-m3</b> (1024d, ~2.2 GB, downloadable) is the top multilingual model. <b>nomic</b> and <b>mxbai</b> are downloadable English top-tier. <b>Custom</b> = any ONNX / HuggingFace model. <b>Important:</b> switching the model changes vector dimensions and forces a full reindex.',

  embModel: 'Read-only info card showing the currently active embedding model: its name, file path, dimensions and load status. Use the picker above to switch.',

  applyEmbModel: 'Reload the embedding model after changing the picker. Quistan unloads the old model, loads the new one, and (because dimensions changed) starts a full reindex in the background.',

  fEmbDevice: 'Where the embedding model runs. <b>CPU</b> = always works, slowest. <b>CUDA</b> = NVIDIA GPU, fastest, needs CUDA 12.x driver + the small CUDA redistributable that ships with Quistan. <b>DirectML</b> = any DirectX 12 GPU (AMD / Intel / NVIDIA), almost as fast as CUDA on NVIDIA, slower on AMD but still 5-10× over CPU. <b>If unsure</b>, leave on CPU; the bundled model is small enough.',

  fEmbGpu: 'Enable GPU execution provider for embeddings. <b>Why:</b> 5-20× faster embedding on supported hardware. <b>When to enable:</b> you selected CUDA or DirectML as device and have a working GPU/driver setup. <b>When to disable:</b> if you see ONNX Runtime GPU crashes on startup.',

  fEmbFp16: 'Use FP16 (half-precision) weights for the embedding model. <b>Why:</b> halves VRAM usage with negligible accuracy loss. <b>When to enable:</b> on GPU, recommended. <b>When to disable:</b> on CPU (slower without GPU tensor cores) or if you need exact float32 precision.',

  embGpuInfo: 'Live info card about the GPU Quistan detected on this machine. Useful to verify that CUDA / DirectML is actually wired up before flipping the device picker.',

  testEmbDevice: 'Re-scan the GPU and run a tiny embedding benchmark so you see real ms/chunk numbers before committing to a device in production.',

  embVectorDb: 'Stats about the on-disk vector store: engine, folder, number of collections, total vectors and disk size. Updated whenever a reindex finishes.',

  // ===== Audio =====
  fGain: 'Boosts the microphone signal before STT. <b>Drag right</b> if you speak quietly and the meter barely moves; <b>drag left</b> if the meter pegs into red (clipped). 100% is unity.',

  fSysGain: 'Boosts the loopback signal (what your speakers play) before STT. Use it when the interlocutor is quiet or far from the mic &mdash; <b>drag right</b> to amplify, <b>drag left</b> if the system meter clips into red. 100% is unity. Toggle the <b>AGC</b> (auto gain control) below to let Quistan normalize the level automatically instead of setting a fixed value.',

  fStt: 'STT is handled differently per mode. <b>Subscription:</b> Quistan picks the engine - no setup. <b>BYOK:</b> you choose between Cloud API (Deepgram / OpenAI Whisper), Local model (bundled Whisper, offline, free, slower on CPU), or Ollama / custom endpoint (any OpenAI-compatible STT server you run). Switch your mode in <b>Account</b> first.',

  fSttMode: 'Which STT backend to use in BYOK mode. <b>Local model</b> = bundled Whisper, offline, free, slower on CPU. <b>Cloud API</b> = Deepgram or OpenAI Whisper over the network, fast, paid. <b>Ollama / custom</b> = your own OpenAI-compatible STT server (Ollama, vLLM whisper, self-hosted).',

  fSttApiKey: 'API key for the cloud STT provider. <b>Deepgram:</b> project key from <code>console.deepgram.com</code>. <b>OpenAI Whisper API:</b> your <code>sk-...</code> key. Stored encrypted in Windows Credential Manager.',

  fSttOllamaUrl: 'URL of your local Ollama (or other OpenAI-compatible) STT server. <b>Default:</b> <code>http://localhost:11434</code>. Must expose <code>/v1/audio/transcriptions</code>. Use <code>ollama pull whisper</code> to get a model.',

  // ===== Capture =====
  fCompress: 'ON = PNG screenshots get converted to JPEG before being sent to the AI. <b>Why:</b> PNG can be 2-5 MB; JPEG at 70% is 50-200 KB - 20x smaller, faster, cheaper. <b>Turn OFF</b> only for lossless text/OCR-critical screenshots.',

  fJpeg: 'JPEG quality when compression is ON. <b>Drag right</b> for crystal-clear text; <b>drag left</b> for tiny blurry files. 70% is the sweet spot for AI consumption.',

  fSavePng: 'ON = every raw PNG screenshot is written to <code>%AppData%\\Quistan\\screenshots</code> before any JPEG conversion. <b>Why keep raw PNGs:</b> re-run analysis later at higher quality, diagnose OCR bugs, attach to support tickets. <b>Disk impact:</b> 2-5 MB per shot  -  a busy day = hundreds of MB, a busy month = many GB. <b>Tune</b> the Keep-last + Auto-purge limits below. <b>Turn OFF</b> if you want a zero-disk solution and don\'t need diagnostics.',

  fPngKeep: 'Maximum number of raw PNGs to keep on disk. Oldest files are deleted first when the cap is exceeded. <b>50</b> ≈ 100-200 MB  -  minimal footprint. <b>200</b> ≈ 500 MB-1 GB  -  good default for daily use. <b>1 000</b> ≈ 2-5 GB  -  keep a few weeks of history. <b>5 000</b> ≈ 10-20 GB  -  brutal diagnostics archive, only if you file lots of OCR tickets.',

  fPngAge: 'Auto-delete PNGs whose file mtime is older than this many days, on every app launch. <b>Never</b> = rely only on the count cap above. <b>7 days</b> = minimal footprint for low-noise workflows. <b>30 days</b> = good for support workflows where tickets get resolved in a sprint. <b>90 days</b> = generous for compliance / legal hold scenarios.',

  fWda: 'Windows Display API - hides Quistan\'s floating windows from screen capture. <b>Why:</b> when you share screen on Zoom/Meet, the interlocutor should not see your private AI window. Keep ON during calls.',

  fHideFrame: 'Hides the dashed region-pick rectangle from screen-share output. Keep ON during calls - otherwise the interlocutor sees you screenshotting.',

  fHideSelf: 'Hides your self-view webcam preview from screen-share. Keep ON for max privacy.',


  // ===== Privacy / DB =====
  fTelemetry: 'Send anonymous crash reports and feature-usage counts to Quistan. <b>What is NOT sent:</b> dialog text, screenshots, voice audio, KB content - ever. Keep ON to support dev; turn OFF for zero outbound traffic.',

  fBeta: 'Enable experimental/beta features. Expect occasional bugs. <b>Enable</b> if you want to live on the edge; <b>disable</b> for production.',

  fActiveDb: 'Which database Quistan uses as the main workspace. You can keep separate DBs for "work", "research", "archive" - each with its own KB and history. Switch at the start of a project for clean context isolation.',

  fDbConnected: 'ON = Quistan writes dialog turns, KB vectors and settings. OFF = read-only mode (no new entries). <b>Turn OFF</b> during screen-share, while debugging, or when reviewing someone else\'s DB.',

  fDbFolder: 'Read-only path to the folder where all Quistan .db files live. Use the buttons below to backup, open, or copy the path.',

  fEncryptDb: 'Encrypt database files with SQLCipher (AES-256). <b>Recommended ON</b> for privacy. <b>Requires app restart</b> after toggling.',

  fRetention: 'Auto-delete dialog turns older than N days on startup. <b>30 days</b> default; <b>7 days</b> for sensitive work; <b>Forever</b> for archives.',

  fClearOnExit: 'Wipe all dialog history when the app shuts down. <b>Settings</b> and <b>KB vectors</b> are kept - only dialog turns clear. Enable for confidential material.',

  fAutoBackup: 'How often Quistan takes automatic snapshots of the active database. <b>Never</b> = only the manual <b>Backup now</b> button. <b>Weekly</b> (default) = one snapshot per week on first launch. <b>Daily</b> = snapshot every launch. <b>Rotation:</b> Quistan keeps the last <b>5</b> copies in <code>%AppData%\\Quistan\\backups</code> and deletes older ones automatically &mdash; no manual cleanup.',

  fBackupInterval: 'How often Quistan takes automatic snapshots of the active database. <b>Never</b> = only the manual <b>Backup now</b> button. <b>Weekly</b> (default) = one snapshot per week on first launch. <b>Daily</b> = snapshot every launch. <b>Rotation:</b> Quistan keeps the last <b>5</b> copies in <code>%AppData%\\Quistan\\backups</code> and deletes older ones automatically &mdash; no manual cleanup.',

  fBackupKeep: 'How many recent automatic backups Quistan keeps on disk before deleting the oldest. <b>3</b> = small footprint, <b>5</b> (default) = good safety vs size, <b>10</b> = longer history. Old backups are pruned automatically after every snapshot.',

  fWipeHistory: 'When factory-resetting, also wipe all dialog history. <b>Unchecked</b> = only reset settings/shortcuts/KB sources. <b>Checked</b> = nuke everything. Choose before clicking Factory reset.',

  // ===== Updates =====
  fAutoUpdate: 'Download new Quistan versions in the background. <b>Keep ON</b> unless you are on metered internet.',

  fAutoInstall: 'Apply downloaded updates on next app quit (no restart prompt). <b>Enable</b> if you always quit Quistan at end of session.',

  fPrerelease: 'Get notified about pre-release builds. <b>Enable</b> for bleeding edge; <b>disable</b> for production (prereleases may be unstable).',

  // ===== Advanced =====
  fLogLevel: 'Verbosity of logs. <b>Error</b> = only crashes. <b>Warn</b> = errors + warnings (default). <b>Info</b> = adds lifecycle events. <b>Debug</b> = everything. <b>Switch to Debug only</b> when collecting a debug bundle for support.',

  fLogToFile: 'Write logs to a rotating file in %AppData%\\Quistan\\logs (max 50 MB). <b>Keep ON</b> for support cases - in-app logs vanish on restart.',

  fExpGpu: 'GPU acceleration for local Whisper (CUDA). <b>Enable</b> if you have NVIDIA GPU + CUDA; <b>disable</b> otherwise (causes Whisper crashes on launch).',

  fExpMem: 'Persistent memory across sessions - Quistan remembers facts from past dialogs. <b>Enable</b> for long-term assistant feel; <b>disable</b> if "how did it know that" surprises bother you.',

  fExpMulti: 'Have 3 models answer in parallel and pick the consensus. <b>Costs ~3x tokens</b> and ~3x latency per request. <b>Leave OFF</b> by default; enable temporarily for prompt research or hard comparisons.',

  // ===== Segmented groups =====
  'segBg': 'Background composition. <b>Show texture</b> = PNG + color + glows. <b>Solid only</b> = color + glows only (no PNG).',

  'segStartMode': 'What shows at launch. <b>Pre-flight</b> = start dialog. <b>Resume</b> = last dialog. <b>Stay in tray</b> = hidden.',

  'segVad': 'Voice-Activity Detection sensitivity. Low = catch everything (breaths). Medium = balanced. High = strict (skip noise).',

  'segSttMode': 'Pick the STT backend in BYOK mode. Local model = bundled Whisper, offline, free. Cloud API = Deepgram or OpenAI Whisper. Ollama = your own OpenAI-compatible STT server. Not visible in Subscription mode (Quistan handles it).',

  'segRetention': 'Auto-delete dialog turns older than N days. 1/7/30 days or Forever.',

  'segWorkers': 'Parallel reindex workers. 2 default. Raise to 4-8 on multi-core machines with lots of RAM.',

  'segLog': 'Log verbosity. Error = quietest. Warn = default. Info/Debug = noisier (for support).',

  // ===== Buttons / actions =====
  manageSub: 'Open the Quistan billing portal in your browser - change plan, view invoices, cancel. Changes sync on next launch.',

  devicesThis: 'The PC where Quistan is currently running. Always shown so you can confirm the installation is on a device you trust. The full device list lives in the <b>web cabinet</b>.',

  devicesAccount: 'Read-only summary of how many devices are bound to your account and how many of them are active right now. <b>Renaming or signing out from individual devices is only available in the web cabinet</b> - keeping that surface focused on account-management UI instead of crowding it into this app.',

  devicesDanger: 'Emergency: signs out from every other device in one click. Use if you lost a laptop or suspect unauthorized access. Your other devices will need to sign in again.',

  testKeys: 'Send a tiny ping through every enabled API key and show latency + quota. <b>Use after</b> pasting a new key.',

  reindexAll: 'Rebuild the entire vector index from scratch. <b>Use</b> after switching embedding model, after KB restructure, when retrieval is broken. Slow on big KBs.',

  recreateIndex: 'Hard wipe of the on-disk vector store (<code>./data/vectors</code>) followed by a clean reindex. <b>Use when:</b> a Reindex crashes on a corrupted SQLite file, the active embedding model has dimensions that don\'t match the existing index, or ChromaDB refuses to open after a crash / power loss. <b>Requires typing WIPE</b> to confirm - this erases every stored vector and starts over.',

  fRagTopK: 'How many of the best-matching chunks from the Memory index to pull for each user message. <b>4</b> = fast, focused, works for simple lookups. <b>8</b> = good default for chat. <b>16</b> = richer context, useful when answers need to cross-reference several docs. <b>32</b> = research mode: pulls a lot of text, slower and more expensive. Higher values increase prompt size so you may have to raise the <b>Max context size</b> below too.',

  fRagSim: 'Minimum cosine similarity (0-100%) for a chunk to be included. <b>0%</b> = return everything matched by Top-K. <b>65%</b> = good default, drops obvious noise. <b>85%</b> = only highly relevant chunks, expect short answers. <b>Drag right</b> to fight hallucinations, <b>drag left</b> to recover rare facts. Always applied <i>after</i> Top-K.',

  fRagCtx: 'Hard cap on how many tokens of retrieved context are stuffed into the model prompt. <b>2 000</b> = light context, fast. <b>4 000</b> = balanced. <b>8 000</b> = rich context, needs a model with a large window. <b>16 000</b> = research / long-doc mode. If the model truncates from the front, lower this value.',

  fRagCite: 'ON = every answer that used retrieved context ends with a list of source documents and the relevant passages. <b>Why ON:</b> verifiable answers, no hallucinations about what was in your KB. <b>Why OFF:</b> cleaner chat-style answers, slightly shorter replies. Costs one extra generation step.',

  dbMaintenance: 'SQLite housekeeping. <b>Vacuum</b> reclaims space; <b>Integrity check</b> runs PRAGMA; <b>Migrations</b> applies schema changes; <b>Rebuild indexes</b> refreshes FTS.',

  dbBackup: 'Snapshot DB to file, restore from snapshot, copy folder path, open in Explorer. <b>Backups are NOT encrypted</b> - store safely.',

  dbCleanup: 'Destructive action for the active DB. <b>Clear database</b> wipes all dialogs and history; settings, shortcuts and window layouts are kept. KB vectors are managed separately in the Knowledge section.',

  checkUpdate: 'Poll the update server right now. Shows version, size, changelog if an update is available.',

  logsTools: 'Open logs folder, or copy redacted diagnostics bundle (logs + system info, no dialogs) to clipboard. <b>Use</b> when filing a support ticket.',

  configIO: 'Export settings to portable JSON, import on another machine. <b>API keys are NOT exported</b> - re-enter after import.',

  factoryReset: 'Irreversibly reset everything (settings, floating windows, KB, shortcuts, caches). <b>Cannot be undone.</b> Check <b>Wipe history</b> above first if you also want dialogs gone.',

  micDev: 'Microphone input device. <b>Default</b> follows OS. Change if you have multiple mics (USB headset, webcam) and want a specific one. Verify with the Test button.',

  sysDev: 'System-audio capture (WASAPI loopback) - records what your speakers play, i.e. interlocutor\'s voice during a call. <b>Without this, STT cannot hear the other side.</b>',

  // ===== Hotkeys =====
  hotkey_open: 'Global hotkey to summon or refresh the main window from any app. <b>Default</b> Ctrl+Shift+Q. Click the field and press your combo to rebind. <kbd>Esc</kbd> clears.',

  hotkey_pause: 'Global hotkey to pause/resume the assistant. <b>Default</b> Ctrl+Shift+Space. Use when you step away or want to type without AI listening.',

  hotkey_region: 'Global hotkey for region picker. <b>Default</b> Ctrl+Shift+A. Drag a rectangle on any monitor.',

  hotkey_snap: 'Global hotkey - take screenshot now from active region. <b>Default</b> Ctrl+Shift+S.',

  hotkey_refresh: 'Global hotkey - force-refresh all floating windows (re-read context, re-fetch suggestions). <b>Default</b> Ctrl+R.',

  hotkey_solo: 'Global hotkey - toggle solo mode (mic only, no system audio). <b>Default</b> Ctrl+Shift+M. Good for practicing alone.',

  hotkey_send: 'Global hotkey - send current pending dialog to chat. <b>Default</b> Ctrl+Enter.',

  // ===== Read-only displays =====
  usageApi: 'Hours pool: <b>total available</b> = current period allowance + unused hours rolled over from previous periods. Unused hours <b>never burn</b> on Standard / Hustler / BYOK — they roll over forever. On <b>Offer</b> hours expire after 7 days (no rollover). On <b>BYOK</b> the pool is unlimited — no meter. Bar turns yellow >75%, red >90%.',

  usageStt: 'STT minutes are <b>included in the same hours pool</b>. Audio transcription costs are debited from the same rollover balance as model calls  -  no separate quota.',

  usageHours: 'Plan-level quota pool shared between AI requests and audio minutes. Hours instead of separate counters - what you spend on chat and STT draws from the same bucket. Resets on the date shown.',

  subPlan: 'Your current plan card. Shows emoji, name, regional price, hours pool, limits and rollover policy. <b>5 plans</b>: Test-Craster (free, 30 min/week), Offer (8 h for 7 days, no rollover), Standard (25 h/month, rollover), Hustler PRO (100 h/month, rollover), Your Key / BYOK (unlimited, you pay providers). Currency auto-detects from system locale (RU > ?, else > $).',

  subPeriod: 'Read-only subscription timeline: <b>ends</b> = next renewal/cancel date, <b>current period</b> = billing window, <b>resets in</b> = days left, <b>limits</b> = how many floating windows & knowledge folders your plan allows, <b>rollover policy</b> = whether unused hours carry to next period.',

  hwid: 'Internal opaque device fingerprint. You don\'t need this anymore - sign in with your account on the new PC and it shows up in this list. Used only as a stable identifier for the server.',

  embModel: 'Read-only info: bge-small-en-v1.5 bundled embedding model. 384 dimensions. ChromaDB vector store. Runs offline, no API key needed.',

  dbStats: 'Live DB health snapshot. Schema version, last integrity check, last vacuum, last backup timestamps.',
};

// -- DEV NOTES (Russian, for developer only — temporary panel) --
const DEV = {
  fLang: '<b>Краткое:</b> Локаль UI.<br><br><b>Зачем:</b> Перевод всех надписей и системных сообщений Куистана. Контент окон (Knowledge и т.п.) переводится отдельно.<br><b>Связано:</b> i18n-каталог, locale-флаг в OS, формат дат/чисел.<br><b>Размещение:</b> Самая первая настройка — задаёт язык всего приложения.',

  theme: '<b>Краткое:</b> Пресет визуальной темы.<br><br><b>Зачем:</b> Переключает палитру + фоновую текстуру. Один клик — новая атмосфера.<br><b>Связано:</b> CSS-переменные body.theme-*, файл bg-{theme}.png рядом с HTML.<br><b>Размещение:</b> Appearance — стартовая секция визуальных настроек.',

  themeGrid: '<b>Краткое:</b> Сетка пресетов тем.<br><br><b>Зачем:</b> Дать быстрый визуальный выбор вместо дроплиста.<br><b>Связано:</b> THEMES[], applyTheme(), bg-{theme}.png.<br><b>Размещение:</b> Сразу под Theme — выбор пресета.',

  bg: '<b>Краткое:</b> Режим фона: Show texture / Solid only.<br><br><b>Зачем:</b> Контроль видимости PNG-текстуры. По умолчанию texture, чтобы твои тематические PNG подхватывались сразу при выборе темы.<br><b>Связано:</b> segBg, body.theme-*, CSS-переменная --bg-mode-layer (выставляется JS applyBg), --bg-texture.<br><b>Размещение:</b> Appearance — финальный штрих внешнего вида. PNG-файлы: themes/1-Obsidian/1-obsidian.png, themes/2-Midnight/2-midnight.png и т.д.',

  fScale: '<b>Краткое:</b> Зум UI 80-140%.<br><br><b>Зачем:</b> Компактный режим для маленьких экранов и крупный для плохого зрения.<br><b>Связано:</b> CSS zoom на root, range-row.<br><b>Размещение:</b> Appearance — зум это визуал.',

  fOpacity: '<b>Краткое:</b> Прозрачность окна 50-100%.<br><br><b>Зачем:</b> Видеть приложение за окном настроек, не закрывая его.<br><b>Связано:</b> body.style.opacity, applyOpacity().<br><b>Размещение:</b> Appearance — сразу за UI scale.',

  fAutoStart: '<b>Краткое:</b> Автозапуск с Windows.<br><br><b>Зачем:</b> Запускать Куистан в фоне при логине (always-on сценарий).<br><b>Связано:</b> Реестр HKCU\\...\\Run, installer.<br><b>Размещение:</b> Startup & System — это и есть автозапуск.',

  fStartMinimized: '<b>Краткое:</b> Стартовать в трей.<br><br><b>Зачем:</b> Не открывать окно каждый раз, оставаться инкогнито до вызова.<br><b>Связано:</b> fTrayIcon, fStartMode.<br><b>Размещение:</b> Startup & System.',

  fTrayIcon: '<b>Краткое:</b> Иконка в трее.<br><br><b>Зачем:</b> Доступ к меню без открытого главного окна. Обязательно при fStartMinimized.<br><b>Связано:</b> Tray balloon (уведомления), системное меню.<br><b>Размещение:</b> Startup & System.',

  fStartMode: '<b>Краткое:</b> Что показывать при запуске (Pre-flight/Resume/Tray).<br><br><b>Зачем:</b> Разные UX: настройка новой сессии vs продолжение прошлой vs скрытый режим.<br><b>Связано:</b> segStartMode, fStartMinimized.<br><b>Размещение:</b> Startup & System.',

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

  fEmbDevice: '<b>Краткое:</b> CPU / CUDA (NVIDIA) / DirectML (любой GPU).<br><br><b>Зачем:</b> Ускорить embedding inference в 5-20×.<br><b>Связано:</b> ONNX Runtime EP, драйверы GPU, fEmbGpu.<br><b>Размещение:</b> Embeddings & Vector Store — Compute Device.',

  fEmbGpu: '<b>Краткое:</b> Включить GPU для эмбеддингов.<br><br><b>Зачем:</b> 5-20× ускорение.<br><b>Связано:</b> ONNX Runtime, драйверы, fEmbDevice.<br><b>Размещение:</b> Embeddings — рядом с fEmbDevice.',

  fEmbFp16: '<b>Краткое:</b> FP16-веса для эмбеддингов.<br><br><b>Зачем:</b> Вдвое меньше VRAM, точность почти не падает.<br><b>Связано:</b> GPU-режим, fEmbGpu.<br><b>Размещение:</b> Embeddings — рядом с fEmbGpu.',

  embGpuInfo: '<b>Краткое:</b> Live-инфо о GPU.<br><br><b>Зачем:</b> Подтвердить что CUDA/DirectML реально подхватились.<br><b>Связано:</b> detectGpu(), DXGI / NVAPI / CUDA enumerate.<br><b>Размещение:</b> Embeddings & Vector Store — Compute Device.',

  testEmbDevice: '<b>Краткое:</b> detectGpu() + benchmark.<br><br><b>Зачем:</b> Дать пользователю реальные ms/chunk до прода.<br><b>Связано:</b> fEmbDevice, ONNX Runtime timing.<br><b>Размещение:</b> Embeddings & Vector Store.',

  embVectorDb: '<b>Краткое:</b> Stats по ChromaDB: engine, path, collections, total vectors, размер на диске.<br><br><b>Зачем:</b> Дать обзор состояния индекса.<br><b>Связано:</b> data/vectors, reindexAll.<br><b>Размещение:</b> Embeddings & Vector Store — Vector Database.',

  micDev: '<b>Краткое:</b> Устройство микрофона.<br><br><b>Зачем:</b> WASAPI input device.<br><b>Связано:</b> STT pipeline, VU-метр.<br><b>Размещение:</b> Audio — Devices.',

  sysDev: '<b>Краткое:</b> Системное аудио (loopback).<br><br><b>Зачем:</b> Захват того, что играет в колонках — голос собеседника в звонке.<br><b>Связано:</b> WASAPI loopback, STT.<br><b>Размещение:</b> Audio — Devices.',

  fGain: '<b>Краткое:</b> Mic gain 0-200%.<br><br><b>Зачем:</b> Усилить тихий голос или убрать клиппинг.<br><b>Связано:</b> Mic input level, clipping.<br><b>Размещение:</b> Audio — Levels.',

  fSysGain: '<b>Краткое:</b> System audio gain 0-200%.<br><br><b>Зачем:</b> Усилить тихий голос собеседника (loopback) или убрать клиппинг, когда он говорит громко.<br><b>Связано:</b> WASAPI loopback, meter Sys, fAgc.<br><b>Размещение:</b> Audio — Levels, под Mic gain.',

  // fNoiseSup: '<b>Краткое:</b> RNNoise шумоподавление.<br><br><b>Зачем:</b> Убрать фоновые шумы (вентилятор, набор текста).<br><b>Связано:</b> STT quality.<br><b>Размещение:</b> Audio — Enhancement.',

  // fAec: '<b>Краткое:</b> Acoustic Echo Cancellation.<br><br><b>Зачем:</b> Не слышать собственный голос через открытые колонки.<br><b>Связано:</b> Open speakers, sys audio.<br><b>Размещение:</b> Audio — Enhancement.',

  // fAgc: '<b>Краткое:</b> Auto Gain Control.<br><br><b>Зачем:</b> Выровнять громкость при переменном расстоянии до мика.<br><b>Связано:</b> Mic input, clipping.<br><b>Размещение:</b> Audio — Enhancement.',

  // fVad: '<b>Краткое:</b> Чувствительность Voice Activity Detection.<br><br><b>Зачем:</b> Больше ловить речь (включая вздохи) или строже (пропускать шум).<br><b>Связано:</b> STT segmentation.<br><b>Размещение:</b> Audio — Enhancement.',

  fStt: '<b>Краткое:</b> STT управляется по-разному в зависимости от режима.<br><br><b>Зачем:</b> Subscription = Quistan сам выбирает движок, без настроек. BYOK = пользователь выбирает Cloud API / Local / Ollama.<br><b>Связано:</b> fMode, segSttMode, sttManaged/sttByok секции.<br><b>Размещение:</b> Audio — Enhancement.',

  fSttMode: '<b>Краткое:</b> Какой STT-бэкенд использовать в BYOK.<br><br><b>Зачем:</b> Локальный Whisper = бесплатно, офлайн, медленно на CPU. Cloud API = быстро, платно. Ollama = свой OpenAI-compatible сервер.<br><b>Связано:</b> fSttApiKey, fSttOllamaUrl.<br><b>Размещение:</b> Audio — Enhancement.',

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

  hotkey_refresh: '<b>Краткое:</b> Рефреш всех floating окон.<br><br><b>Зачем:</b> Перечитать контекст, переоценить ситуацию.<br><b>Связано:</b> Floating windows.<br><b>Размещение:</b> Shortcuts.',

  hotkey_solo: '<b>Краткое:</b> Solo mode.<br><br><b>Зачем:</b> AI слушает только вас (без системного аудио).<br><b>Связано:</b> sysDev toggling, fMode.<br><b>Размещение:</b> Shortcuts.',

  hotkey_send: '<b>Краткое:</b> Отправить текущий dialog.<br><br><b>Зачем:</b> Manual capture из floating window input.<br><b>Связано:</b> Floating window send.<br><b>Размещение:</b> Shortcuts.',

  fNotifKb: '<b>Краткое:</b> Уведомить о завершении индексации KB.<br><br><b>Зачем:</b> Сигнал: можно снова искать по KB.<br><b>Связано:</b> KB indexing pipeline.<br><b>Размещение:</b> Notifications — Alerts.',


  fTelemetry: '<b>Краткое:</b> Анонимная телеметрия.<br><br><b>Зачем:</b> Улучшать продукт без личных данных.<br><b>Связано:</b> Crash reporter, analytics.<br><b>Размещение:</b> Privacy & Data — Telemetry.',

  fBeta: '<b>Краткое:</b> Бета-функции.<br><br><b>Зачем:</b> Ранний доступ к экспериментам.<br><b>Связано:</b> fExpGpu/fExpMem/fExpMulti.<br><b>Размещение:</b> Privacy & Data — Telemetry.',

  fActiveDb: '<b>Краткое:</b> Активная БД.<br><br><b>Зачем:</b> Несколько проектов = несколько БД (work/research/archive).<br><b>Связано:</b> SQLite files, dbConnPill.<br><b>Размещение:</b> Privacy & Data — Database.',

  fDbConnected: '<b>Краткое:</b> Подключение к БД.<br><br><b>Зачем:</b> Read-only режим для безопасности/дебага.<br><b>Связано:</b> dbConnPill, write operations.<br><b>Размещение:</b> Privacy & Data — Database.',

  fDbFolder: '<b>Краткое:</b> Папка БД.<br><br><b>Зачем:</b> Read-only показ где лежат файлы.<br><b>Связано:</b> AppData/Local/Quistan/db, dbCopyPath, openDataFolder.<br><b>Размещение:</b> Privacy & Data — Database.',

  dbMaintenance: '<b>Краткое:</b> Vacuum/Integrity/Migrations/Rebuild.<br><br><b>Зачем:</b> SQLite housekeeping.<br><b>Связано:</b> SQLite PRAGMA, dbStats.<br><b>Размещение:</b> Privacy & Data — Database.',

  dbBackup: '<b>Краткое:</b> Backup/Restore/Copy/Open.<br><br><b>Зачем:</b> Защита от потери данных, удобный доступ.<br><b>Связано:</b> fActiveDb, .db files.<br><b>Размещение:</b> Privacy & Data — Database.',

  dbCleanup: '<b>Краткое:</b> Очистить базу диалогов.<br><br><b>Зачем:</b> Стереть все диалоги и историю в активной БД.<br><b>Связано:</b> fActiveDb, dialog turns.<br><b>Размещение:</b> Privacy & Data — Database.',

  dbStats: '<b>Краткое:</b> Read-only: версия схемы, последние операции.<br><br><b>Зачем:</b> Дать пользователю обзор здоровья БД.<br><b>Связано:</b> dbMaintenance.<br><b>Размещение:</b> Privacy & Data — Database.',

  fEncryptDb: '<b>Краткое:</b> SQLCipher AES-256.<br><br><b>Зачем:</b> Шифрование файлов БД на диске.<br><b>Связано:</b> SQLite engine, restart required.<br><b>Размещение:</b> Privacy & Data — Database.',

  fRetention: '<b>Краткое:</b> Срок хранения диалогов.<br><br><b>Зачем:</b> Не дать БД распухнуть.<br><b>Связано:</b> Cleanup cron, dbSize.<br><b>Размещение:</b> Privacy & Data — Database.',

  fClearOnExit: '<b>Краткое:</b> Стирать диалоги при выходе.<br><br><b>Зачем:</b> Чувствительные разговоры — очищать при закрытии.<br><b>Связано:</b> shutdown hook, dialog table.<br><b>Размещение:</b> Privacy & Data — Database.',

  fAutoBackup: '<b>Краткое:</b> Автобэкап: Never / Weekly / Daily.<br><br><b>Зачем:</b> Ручной бэкап никто не нажимает — автобэкап страхует от потери данных и битых миграций.<br><b>Связано:</b> %AppData%\\Quistan\\backups, ротация N копий (3/5/10).<br><b>Размещение:</b> Privacy & Data — Database, после Backup now.',

  checkUpdate: '<b>Краткое:</b> Проверить обновления сейчас.<br><br><b>Зачем:</b> Ручной trigger вместо ожидания фонового check.<br><b>Связано:</b> Update server, fAutoUpdate.<br><b>Размещение:</b> Updates — первое действие.',

  fAutoUpdate: '<b>Краткое:</b> Скачивать обновления автоматически.<br><br><b>Зачем:</b> Не заставлять пользователя ждать.<br><b>Связано:</b> Update server, fAutoInstall.<br><b>Размещение:</b> Updates.',

  fAutoInstall: '<b>Краткое:</b> Установить при выходе.<br><br><b>Зачем:</b> Не показывать restart prompt.<br><b>Связано:</b> Update workflow.<br><b>Размещение:</b> Updates.',

  fPrerelease: '<b>Краткое:</b> Получать pre-releases.<br><br><b>Зачем:</b> Доступ к бета-билдам.<br><b>Связано:</b> Update channel.<br><b>Размещение:</b> Updates.',

  fLogLevel: '<b>Краткое:</b> Уровень логирования (error/warn/info/debug).<br><br><b>Зачем:</b> Поддержка vs чистота логов.<br><b>Связано:</b> fLogToFile, copyDiagnostics.<br><b>Размещение:</b> Advanced — Logs & Debug.',

  fLogToFile: '<b>Краткое:</b> Писать логи в файл.<br><br><b>Зачем:</b> Диагностика для саппорта.<br><b>Связано:</b> Log rotation, openLogs.<br><b>Размещение:</b> Advanced — Logs & Debug.',

  logsTools: '<b>Краткое:</b> Open logs / Copy diagnostics.<br><br><b>Зачем:</b> Быстрый доступ к логам и диагностическому пакету.<br><b>Связано:</b> fLogToFile, support workflow.<br><b>Размещение:</b> Advanced — Logs & Debug.',

  fExpGpu: '<b>Краткое:</b> GPU для Whisper local.<br><br><b>Зачем:</b> Ускорить STT на совместимом GPU.<br><b>Связано:</b> fStt=whisper-local, CUDA.<br><b>Размещение:</b> Advanced — Experimental.',

  fExpMem: '<b>Краткое:</b> Persistent memory (RAG по диалогам).<br><br><b>Зачем:</b> AI помнит факты между сессиями.<br><b>Связано:</b> Vector DB, dialog history.<br><b>Размещение:</b> Advanced — Experimental.',

  fExpMulti: '<b>Краткое:</b> 3 модели параллельно + consensus.<br><br><b>Зачем:</b> Качество vs cost. Дебаг/исследование.<br><b>Связано:</b> AI providers, latency x3, ~3x токенов.<br><b>Размещение:</b> Advanced — Experimental.',

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
function applyOpacity() {
  const v = Math.min(100, Math.max(50, state.fOpacity || 100));
  document.body.style.opacity = v / 100;
}

const STORAGE_KEY = 'quistan.settings.v2';
let state = {};
let dirty = false;
let activeCat = (document.body && document.body.dataset && document.body.dataset.page) || 'general';


const DEFAULTS = {
  fLang: 'en',
  theme: 'obsidian', bg: 'texture',
  fScale: 100, fOpacity: 100,
  fAutoStart: false, fStartMinimized: true, fTrayIcon: true, fStartMode: 'preflight',
  fMode: 'subscription', fPlan: 'standard', fPlanUsed: 12, fPlanRollover: 18, fPlanEnds: 'Sep 16, 2026', fPlanRange: 'Sep 1 - Sep 16, 2026', fPlanResetsIn: '14 days', fByokDaysLeft: 18, fByokEndsOn: 'Sep 20, 2026', fRegion: '', fHwid: 'a7f3-9c2b-4e81-...',
  fSignedIn: true,
  fTemp: 'balanced', fMaxTok: 3, fStream: true,
  fModelFast: 'gpt-4o-mini', fModelHeavy: 'gpt-4o',
  fSttModel: 'whisper-multi-base', fSttLang: 'auto',
  fSttDevice: 'cpu', fSttGpuDetect: 'NVIDIA RTX 4070 \u00b7 12 GB',
  fSttInstalled: { 'whisper-multi-base': true },
  fSttProviders: [
    { id: 'stt_openai_demo', preset: 'openai', name: 'OpenAI Whisper API',  url: 'https://api.openai.com/v1',           key: 'sk-' + '*'.repeat(40),                   model: 'whisper-1',                enabled: true },
    { id: 'stt_ollama_demo', preset: 'ollama', name: 'Ollama STT',          url: 'http://localhost:11434/v1',          key: '',                                        model: 'whisper',                  enabled: true },
  ],
  fSttTab: 'api',
  fApiKeys: [
    { id: 'openai_demo', preset: 'openai',  name: 'OpenAI',                 key: 'sk-proj-' + '*'.repeat(35), baseUrl: 'https://api.openai.com/v1',     models: 'gpt-4o, gpt-4o-mini',            enabled: true  },
    { id: 'ollama_demo', preset: 'ollama',  name: 'Ollama (localhost:11434)', key: '',                           baseUrl: 'http://localhost:11434/v1',     models: 'llama-3.3-70b, qwen2.5-7b',       enabled: true  },
  ],
  fReindexWatch: true, fReindexVerify: false,
  fChunk: 384, fOverlap: 40, fWorkers: '2',
  fRagTopK: '8', fRagSim: 65, fRagCtx: '4000', fRagCite: true,
  fEmbModel: 'bge-small-en-v1.5', fEmbCustomPath: '', fEmbDevice: 'cpu', fEmbGpu: false, fEmbFp16: true,
  // -- hidden audio defaults (auto-tuned by Quistan, no UI) --
  fGain: 100, fSysGain: 100, fNoiseSup: true, fAec: true, fAgc: false, fVad: 'mid',
  fSttMode: 'local', fSttApiKey: '', fSttOllamaUrl: 'http://localhost:11434',
  fWda: true, fHideFrame: true, fHideSelf: true,
  fCompress: true, fJpeg: 70,
  fSavePng: false, fPngAge: '30',
  hotkey_open: 'Ctrl+Shift+Q', hotkey_pause: 'Ctrl+Shift+Space', hotkey_region: 'Ctrl+Shift+A',
  hotkey_snap: 'Ctrl+Shift+S', hotkey_refresh: 'Ctrl+R', hotkey_solo: 'Ctrl+Shift+M', hotkey_send: 'Ctrl+Enter',

  fTelemetry: false, fBeta: false, fRetention: '30', fEncryptDb: true, fClearOnExit: false, fBackupInterval: 'weekly', fBackupKeep: 5,
  fActiveDb: 'default', fDbConnected: true,
  fAutoUpdate: true, fAutoInstall: false, fPrerelease: false,
  fLogLevel: 'warn', fLogToFile: true,
  fExpGpu: false, fExpMem: false, fExpMulti: false,
  fWipeHistory: false,
};

// -- sidebar ------------------------------------------
function renderSidebar() {
  const list = document.getElementById('catList');
  if (!list) return;
  const visible = CATEGORIES.filter(c => {
    if (!c.requiresFlag) return true;
    if (typeof c.requiresFlag === 'function') return !!c.requiresFlag(state);
    return !!state[c.requiresFlag];
  });
  list.innerHTML = visible.map(c => `
    <div class="cat ${c.id === activeCat ? 'is-on' : ''}" data-cat="${c.id}">
      <span class="cat__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${c.icon}</svg></span>
      <span class="cat__name">${c.name}</span>
    </div>
  `).join('');
  list.querySelectorAll('.cat').forEach(el => {
    el.addEventListener('click', () => switchCat(el.dataset.cat));
  });
  if (activeCat && !visible.some(c => c.id === activeCat)) {
    const gated = CATEGORIES.find(c => c.id === activeCat);
    if (gated && gated.requiresFlag) {
      if (gated.id === 'byok' && state.fMode !== 'byok') {
        state.fMode = 'byok';
        markDirty();
        if (typeof applyModeVisibility === 'function') applyModeVisibility();
        renderSidebar();
        return;
      }
      if (gated.id === 'ai' && state.fMode !== 'subscription') {
        state.fMode = 'subscription';
        markDirty();
        if (typeof applyModeVisibility === 'function') applyModeVisibility();
        renderSidebar();
        return;
      }
    }
    const fallback = visible[0] ? visible[0].id : 'general';
    activeCat = fallback;
    if (document.body && document.body.dataset.page && document.body.dataset.page !== fallback) {
      window.location.href = fallback + '.html';
    }
  }
}
function pageForCat(id) { return (id + '.html'); }

function switchCat(id) {
  activeCat = id;
  const panes = document.querySelectorAll('.tab-content');
  const hasPane = Array.from(panes).some(p => p.dataset.tab === id);
  if (hasPane) {
    panes.forEach(p => p.classList.toggle('is-on', p.dataset.tab === id));
    document.querySelectorAll('.cat').forEach(c => c.classList.toggle('is-on', c.dataset.cat === id));
    const main = document.querySelector('.main'); if (main) main.scrollTop = 0;
  } else {
    window.location.href = pageForCat(id);
  }
}

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
  const d = document.getElementById('dirty'); if (d) d.classList.add('is-on');
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
  const signed = !!state.fSignedIn;
  toggle('aiManagedSection', !isByok);
  toggle('planPill', !isByok);
  toggle('sttManaged', !isByok);
  toggle('sttByok', isByok);
  const hint = document.getElementById('planHint');
  if (hint) hint.textContent = isByok ? 'direct keys' : 'managed by Quistan';
  renderPlan();
  paintSignedIn();
  renderSidebar();
}
function paintSignedIn() {
  const signed = !!state.fSignedIn;
  const mode = state.fMode || 'subscription';
  const stub = document.getElementById('signedOutStub');
  const extras = document.getElementById('modeSubExtras');
  const devices = document.getElementById('devicesSection');
  const showExtras = signed && mode !== 'byok';
  const showStub = !signed && mode !== 'byok';
  const showDevices = signed;
  if (stub)    stub.style.display    = showStub     ? '' : 'none';
  if (extras)  extras.style.display  = showExtras   ? '' : 'none';
  if (devices) devices.style.display = showDevices  ? '' : 'none';
}

function paintCompressState() {
  const enabled = !!state.fCompress;
  const inp = document.getElementById('fJpeg');
  const row = document.getElementById('fJpegRow');
  const hint = document.getElementById('fJpegHint');
  if (inp) { inp.disabled = !enabled; inp.style.opacity = enabled ? '' : '.4'; }
  if (row) row.classList.toggle('is-disabled', !enabled);
  if (hint) hint.textContent = enabled ? 'lower = smaller file sent to AI' : 'enable compression above to use';
}

function paintPngRetention() {
  const on = !!state.fSavePng;
  toggle('pngOffNote', !on);
  toggle('pngRetentionGroup', on);
  toggle('pngAdvanced', on);
}

function getPngCachePath() {
  const ua = (navigator.userAgent || '').toLowerCase();
  const platform = (navigator.platform || '').toLowerCase();
  if (ua.includes('win') || platform.includes('win')) {
    return 'C:\\Users\\You\\AppData\\Roaming\\Quistan\\screenshots';
  }
  if (platform.includes('mac')) {
    return '/Users/You/Library/Application Support/Quistan/screenshots';
  }
  return '/home/you/.config/Quistan/screenshots';
}
function paintPngPath() {
  const el = document.getElementById('pngCachePath');
  if (el) el.textContent = getPngCachePath();
}
function copyPngPath() {
  const path = getPngCachePath();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(path).then(
      () => toast('Path copied to clipboard'),
      () => toast('Copy failed  -  clipboard blocked', 'warn')
    );
  } else {
    toast('Clipboard not available', 'warn');
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return Math.round(bytes) + ' B';
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return Math.round(bytes / 1024 / 1024) + ' MB';
  return (bytes / 1024 / 1024 / 1024).toFixed(1) + ' GB';
}

function runPngPurge(reason) {
  const countEl = document.getElementById('pngCacheCount');
  const sizeEl = document.getElementById('pngCacheSize');
  const lastEl = document.getElementById('pngCacheLastPurge');
  if (!countEl || !sizeEl) return;
  const ageMap = { '7': 500, '30': 2000, '90': 5000, '365': 20000 };
  const keep = ageMap[state.fPngAge] || 2000;
  const current = parseInt((countEl.textContent || '0').replace(/\D/g, ''), 10) || 0;
  const purged = Math.max(0, current - keep);
  const after = current - purged;
  countEl.textContent = after;
  sizeEl.textContent = formatBytes(after * 3.2 * 1024 * 1024);
  if (purged > 0) {
    if (lastEl) lastEl.textContent = 'just now';
    if (reason) toast('Purged ' + purged + ' old PNG' + (purged === 1 ? '' : 's') + ' to match ' + reason, 'warn');
  } else if (reason) {
    toast('Cache already within limit (' + after + ' / ' + keep + ')');
  }
}

function paintRagPreview() {
  const topK = parseInt(state.fRagTopK, 10) || 8;
  const sim  = parseInt(state.fRagSim, 10)  || 0;
  const ctx  = parseInt(state.fRagCtx, 10)  || 4000;
  const cite = !!state.fRagCite;
  const chunksEl = document.getElementById('ragPreviewChunks');
  const tokensEl = document.getElementById('ragPreviewTokens');
  const citeEl   = document.getElementById('ragPreviewCite');
  if (chunksEl) chunksEl.textContent = topK + ' chunks (sim \u2265 ' + sim + '%)';
  if (tokensEl) tokensEl.textContent = '~' + ctx.toLocaleString('en-US') + ' tokens';
  if (citeEl)   citeEl.textContent   = cite ? 'on' : 'off';
}

function applyStartupInterdeps() {
  const autoEl  = document.getElementById('fAutoStart');
  const minEl   = document.getElementById('fStartMinimized');
  const minWrap = minEl && minEl.closest('.switch');
  if (!autoEl || !minEl || !minWrap) return;
  const autoOn = !!autoEl.checked;
  if (!autoOn) {
    minWrap.classList.add('is-disabled');
    minEl.checked = false;
    state.fStartMinimized = false;
  } else {
    minWrap.classList.remove('is-disabled');
  }
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
  ['fLang','fModelFast','fModelHeavy','fActiveDb','fEmbModel'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = state[id];
    el.addEventListener('change', () => { state[id] = el.value; markDirty(); if (id === 'fEmbModel') { paintEmbModelInfo(); applyEmbModel(); } });
  });

  // switches
  const swMap = {
    fAutoStart:'fAutoStart', fStartMinimized:'fStartMinimized', fTrayIcon:'fTrayIcon',
    fReindexWatch:'fReindexWatch', fReindexVerify:'fReindexVerify',
    fWda:'fWda', fHideFrame:'fHideFrame', fHideSelf:'fHideSelf',
    fCompress:'fCompress', fSavePng:'fSavePng',
    fTelemetry:'fTelemetry', fBeta:'fBeta',
    fEncryptDb:'fEncryptDb', fClearOnExit:'fClearOnExit',
    fDbConnected:'fDbConnected',
    fAutoUpdate:'fAutoUpdate', fAutoInstall:'fAutoInstall', fPrerelease:'fPrerelease',
    fLogToFile:'fLogToFile', fExpGpu:'fExpGpu', fExpMem:'fExpMem', fExpMulti:'fExpMulti',
    fWipeHistory:'fWipeHistory',
    fEmbGpu:'fEmbGpu', fEmbFp16:'fEmbFp16',
    fRagCite:'fRagCite',
  };
  Object.entries(swMap).forEach(([id,key]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.checked = !!state[key];
    el.addEventListener('change', () => { state[key] = el.checked; markDirty(); if (key === 'fDbConnected') updateDbConnPill(); if (key === 'fAutoStart') applyStartupInterdeps(); if (key === 'fCompress') paintCompressState(); if (key === 'fSavePng') paintPngRetention(); if (key === 'fWipeHistory') updateWipeDbVisibility(); if (key === 'fLogToFile') syncLogsButtons(); if (key === 'fRagCite') paintRagPreview(); if (key === 'fEmbGpu') paintEmbDevice(); });
  });

  applyStartupInterdeps();
  paintCompressState();
  paintPngRetention();
  paintPngPath();
  runPngPurge();

  // ranges
  const rangeMap = {
    fScale:    { fmt: v => v + '%',            key: 'fScale' },
    fOpacity:  { fmt: v => v + '%',            key: 'fOpacity' },
    fGain:     { fmt: v => v + '%',            key: 'fGain' },
    fSysGain:  { fmt: v => v + '%',            key: 'fSysGain' },
    fJpeg:     { fmt: v => v + '%',            key: 'fJpeg' },
    fChunk:    { fmt: v => v + ' tok',         key: 'fChunk' },
    fOverlap:  { fmt: v => v + ' tok',         key: 'fOverlap' },
    fRagSim:   { fmt: v => v + '%',            key: 'fRagSim',  after: paintRagPreview },
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
      if (cfg.key === 'fOpacity') applyOpacity();
      if (cfg.after) cfg.after();
    });
  });

  // times
  // (no time inputs in current UI)

  // STT BYOK: api key + ollama url
  ['fSttApiKey','fSttOllamaUrl'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = state[id] || '';
    el.addEventListener('input', () => { state[id] = el.value; markDirty(); });
  });

  // api key inputs
  ['fEmbCustomPath'].forEach(id => {
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
  paintSegSingle('segRetention','fRetention', () => {
    const prev = (state._prevRetention || state.fRetention);
    if (prev !== state.fRetention) {
      state._prevRetention = state.fRetention;
      if (state.fRetention !== 'forever') {
        toast('Dialog cleanup scheduled  -  VACUUM will run in background');
        setTimeout(() => dbVacuum(), 600);
      }
    }
  });
  paintSegSingle('segBackup','fBackupInterval');
paintSegSingle('segWorkers','fWorkers');
  paintSegSingle('segLog','fLogLevel');
  const pngAgeSel = document.getElementById('fPngAge');
  if (pngAgeSel) {
    pngAgeSel.value = String(state.fPngAge || '30');
    pngAgeSel.onchange = () => { state.fPngAge = pngAgeSel.value; markDirty(); runPngPurge('Auto-purge = ' + pngAgeSel.value + 'd'); };
  }
  paintSegSingle('segRagTopK','fRagTopK', paintRagPreview);
  paintSegSingle('segRagCtx', 'fRagCtx',  paintRagPreview);
  paintSegSingle('segEmbDevice','fEmbDevice', paintEmbDevice);
  paintSegSingle('segTemp','fTemp');
  paintMaxTok();
  applyModeVisibility();
  applySttModeVisibility();
  paintSignedIn();
  paintEmbModelInfo();
  paintRagPreview();
  paintEmbDevice();
  renderApiKeys();
  paintSttModels();
  paintSttProviders();
  paintSttTab();
  paintSegSingle('segSttLang','fSttLang');
  paintSegSingle('segSttDevice','fSttDevice');
  paintSttDevice();
  bindProviderKind();
  bindSttTab();
  renderPlan();
  paintDeviceLimit();
  bindHotkeys();
  applyHelp();
  bindDevHover();
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
let meterInBars = null;
let meterSysBars = null;
let micOn = false, sysOn = false;
function setMicTest(on) { micOn = !!on; const b = document.getElementById('btnTestMic'); if (b) b.classList.toggle('is-on', micOn); toast(micOn ? 'Mic test started' : 'Mic test stopped'); }
function setSysTest(on) { sysOn = !!on; const b = document.getElementById('btnTestSys'); if (b) b.classList.toggle('is-on', sysOn); toast(sysOn ? 'System audio test started' : 'System audio test stopped'); }
function testMic() { setMicTest(!micOn); }
function testSys() { setSysTest(!sysOn); }
function startMeters() {
  const inWrap = document.getElementById('meterInBars');
  const sysWrap = document.getElementById('meterSysBars');
  if (!inWrap && !sysWrap) return;
  meterInBars = inWrap ? buildMeter('meterInBars', 24) : null;
  meterSysBars = sysWrap ? buildMeter('meterSysBars', 24) : null;
  if (meterTick) clearInterval(meterTick);
  let micT = 0, sysT = 0;
  meterTick = setInterval(() => {
    micT = Math.max(0, Math.min(23, micT + (Math.random() * 5 - 2.4)));
    sysT = Math.max(0, Math.min(23, sysT + (Math.random() * 4 - 1.6)));
    const ml = micOn ? (4 + Math.floor(Math.random() * 18)) : Math.max(1, Math.round(micT * 0.25));
    const sl = 3 + Math.floor(Math.random() * 14);
    [meterInBars, meterSysBars].forEach((bars, idx) => {
      if (!bars) return;
      const lvl = idx === 0 ? ml : sl;
      bars.forEach((b, i) => {
        const on = i < lvl;
        b.classList.toggle('is-on', on);
        b.classList.toggle('is-warn',   on && i > 14 && i <= 18);
        b.classList.toggle('is-danger', on && i > 18);
      });
    });
    const inVal = document.getElementById('meterInVal');  if (inVal)  inVal.textContent  = dbStr(dbFromLevel(ml, 24));
    const sysVal = document.getElementById('meterSysVal'); if (sysVal) sysVal.textContent = dbStr(dbFromLevel(sl, 24));
  }, 120);
}
function dbFromLevel(l, max) { if (l <= 0) return -Infinity; return Math.round(20 * Math.log10(l/max)); }
function dbStr(db) { if (db === -Infinity) return '\u2014 dB'; return db + ' dB'; }

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
  const inp = document.getElementById('search');
  if (!inp) return;
  const q = inp.value.trim().toLowerCase();
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
function validateSettings(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return null;
  const out = {};
  for (const key of Object.keys(DEFAULTS)) {
    if (!(key in obj)) continue;
    const exp = DEFAULTS[key];
    const got = obj[key];
    if (Array.isArray(exp)) {
      if (!Array.isArray(got)) return null;
      out[key] = got;
    } else if (exp && typeof exp === 'object') {
      if (!got || typeof got !== 'object' || Array.isArray(got)) return null;
      out[key] = got;
    } else if (typeof got === typeof exp) {
      out[key] = got;
    } else {
      return null;
    }
  }
  return out;
}
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const cleaned = validateSettings(parsed);
      if (cleaned) return Object.assign({}, DEFAULTS, cleaned);
    }
  } catch (_) {}
  return JSON.parse(JSON.stringify(DEFAULTS));
}
function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {} }

function saveAll() {
  save();
  dirty = false;
  const d = document.getElementById('dirty'); if (d) d.classList.remove('is-on');
  toast('Settings saved');
}
function resetAll() {
  if (!confirm('Reset all settings to defaults? Your customizations will be lost.')) return;

  try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
  location.reload();
}

function factoryReset() {
  const wipe = !!(document.getElementById('fWipeHistory') && document.getElementById('fWipeHistory').checked);
  const wipeDb = !!(document.getElementById('fWipeDb') && document.getElementById('fWipeDb').checked);
  try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
  try { if (wipe) localStorage.removeItem('quistan.dialogs.v1'); } catch (_) {}
  try {
    if (wipeDb) {
      const dbName = (state && state.fActiveDb) ? state.fActiveDb : 'default';
      localStorage.setItem('quistan.factoryReset.wipeDb', dbName);
    }
  } catch (_) {}
  if (wipeDb) toast('Factory reset scheduled  -  DB will be deleted on next launch', 'warn');
  else if (wipe) toast('Factory reset scheduled  -  dialog history will be cleared', 'warn');
  else toast('Factory reset scheduled  -  settings will be restored to defaults');
  setTimeout(() => location.reload(), 700);
}

// -- modal helpers -----------------------------------
function confirmModal(opts) {
  return new Promise(resolve => {
    const root = document.createElement('div');
    root.className = 'modal';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.innerHTML = `
      <div class="modal__backdrop" data-close="1"></div>
      <div class="modal__panel${opts.danger ? ' is-danger' : ''}">
        <div class="modal__head">
          ${opts.icon || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'}
          <div class="modal__title">${opts.title || 'Confirm'}</div>
          <button class="modal__close" type="button" data-close="1" aria-label="Close">&times;</button>
        </div>
        <div class="modal__body">${opts.body || ''}</div>
        ${opts.token ? `
          <div class="modal__token">
            <label class="modal__token-label">Type <b>${opts.token}</b> to confirm:</label>
            <input class="modal__token-input" type="text" autocomplete="off" spellcheck="false" />
          </div>` : ''}
        <div class="modal__foot">
          ${opts.countdown ? `<span class="modal__countdown" data-countdown></span>` : '<span></span>'}
          <button class="modal__btn" type="button" data-close="1">${opts.cancelLabel || 'Cancel'}</button>
          <button class="modal__btn${opts.danger ? ' modal__btn--danger' : ''}" type="button" data-confirm ${opts.token || opts.countdown ? 'disabled' : ''}>${opts.confirmLabel || 'Confirm'}</button>
        </div>
      </div>
    `;
    document.body.appendChild(root);
    requestAnimationFrame(() => root.classList.add('is-on'));

    const tokenInput = root.querySelector('.modal__token-input');
    const confirmBtn = root.querySelector('[data-confirm]');
    const countdownEl = root.querySelector('[data-countdown]');
    let countdownTimer = null;
    let countdownLeft = opts.countdown || 0;

    if (tokenInput) {
      tokenInput.addEventListener('input', () => {
        const match = tokenInput.value.trim() === opts.token;
        tokenInput.classList.toggle('is-match', match);
        confirmBtn.disabled = !match;
      });
      setTimeout(() => tokenInput.focus(), 50);
    }
    if (countdownEl) {
      const tick = () => {
        if (countdownLeft <= 0) {
          countdownEl.textContent = '';
          confirmBtn.disabled = false;
          return;
        }
        countdownEl.textContent = 'Wait ' + countdownLeft + 's...';
        countdownLeft -= 1;
        countdownTimer = setTimeout(tick, 1000);
      };
      tick();
    }

    const close = (result) => {
      if (countdownTimer) clearTimeout(countdownTimer);
      root.classList.remove('is-on');
      setTimeout(() => { root.remove(); resolve(result); }, 140);
    };

    root.addEventListener('click', e => {
      const t = e.target;
      if (t && t.dataset && t.dataset.close === '1') close(false);
    });
    confirmBtn.addEventListener('click', () => close(true));
    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape') { document.removeEventListener('keydown', onKey); close(false); }
      if (e.key === 'Enter' && !confirmBtn.disabled) { document.removeEventListener('keydown', onKey); close(true); }
    });
  });
}

function openFactoryResetModal() {
  const wipe = !!(document.getElementById('fWipeHistory') && document.getElementById('fWipeHistory').checked);
  const wipeDb = !!(document.getElementById('fWipeDb') && document.getElementById('fWipeDb').checked);
  const dbName = (state && state.fActiveDb) ? state.fActiveDb : 'default';

  const scope = [];
  scope.push('all settings, floating windows, KB source configs, shortcuts and caches');
  if (wipe) scope.push('dialog history');
  if (wipeDb) scope.push('<b>the SQLite database file <code>' + dbName + '.db</code> (irrecoverable)</b>');

  const bodyHtml =
    '<p>You are about to wipe the following from Quistan:</p>' +
    '<p style="margin:6px 0 10px;padding-left:14px;border-left:2px solid var(--danger);color:var(--text)">' + scope.join('<br>+ ') + '</p>' +
    '<p>This cannot be undone. Backups of the database are recommended before continuing.</p>';

  confirmModal({
    title: 'Factory reset',
    body: bodyHtml,
    danger: true,
    token: 'RESET',
    confirmLabel: 'Reset everything'
  }).then(ok => { if (ok) factoryReset(); });
}

// -- logs + diagnostics -----------------------------
function syncLogsButtons() {
  const on = !!(state && state.fLogToFile);
  document.querySelectorAll('[data-log-action]').forEach(btn => {
    if (on) { btn.removeAttribute('disabled'); btn.title = btn.dataset.logTitle || ''; }
    else    { btn.setAttribute('disabled', ''); btn.title = 'Enable "Write logs to file" first'; }
  });
}

function updateWipeDbVisibility() {
  const wrap = document.getElementById('fWipeDbWrap');
  if (!wrap) return;
  const wipe = !!(state && state.fWipeHistory);
  wrap.style.display = wipe ? '' : 'none';
  if (!wipe) {
    const cb = document.getElementById('fWipeDb');
    if (cb) cb.checked = false;
  }
}

// -- GPU probe -------------------------------------
function probeGpu() {
  return new Promise(resolve => {
    let supported = false;
    let label = 'unknown';
    if (navigator.gpu && typeof navigator.gpu.requestAdapter === 'function') {
      navigator.gpu.requestAdapter().then(adapter => {
        if (adapter) {
          try {
            const info = adapter.info || {};
            const vendor = (info.vendor || '').toLowerCase();
            const arch = (info.architecture || '').toLowerCase();
            label = (info.vendor || 'GPU') + ' ' + (info.description || arch || '');
            if (vendor.includes('nvidia') || vendor.includes('amd') || vendor.includes('apple') || vendor.includes('intel') && arch.includes('xe')) {
              supported = true;
            } else if (arch.includes('vulkan') || arch.includes('metal') || arch.includes('direct')) {
              supported = true;
            }
          } catch (_) {}
        }
        if (!supported) probeViaWebGL().then(r => resolve(r));
        else resolve({ supported, label });
      }).catch(() => probeViaWebGL().then(r => resolve(r)));
      return;
    }
    probeViaWebGL().then(r => resolve(r));
  });
}
function probeViaWebGL() {
  return new Promise(resolve => {
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2') || c.getContext('webgl');
      if (!gl) return resolve({ supported: false, label: 'no WebGL' });
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : (gl.getParameter(gl.RENDERER) || '');
      const r = String(renderer).toLowerCase();
      const vendor = ext ? String(gl.getParameter(ext.UNMASKED_VENDOR_WEBGL)).toLowerCase() : '';
      const looksDiscrete = /nvidia|geforce|rtx|gtx|quadro|tesla|radeon|arc|apple m\d/.test(r);
      const isIntelIGPU = /intel.*(hd graphics|uhd graphics|iris|xe)/.test(r) && !/arc|discrete/.test(r);
      resolve({ supported: looksDiscrete && !isIntelIGPU, label: renderer || 'WebGL adapter', vendor });
    } catch (_) {
      resolve({ supported: false, label: 'probe failed' });
    }
  });
}
function applyGpuProbe() {
  const el = document.getElementById('fExpGpu');
  if (!el) return;
  probeGpu().then(r => {
    if (r.supported) return;
    el.checked = false;
    state.fExpGpu = false;
    el.disabled = true;
    const label = el.closest('.switch');
    if (label) label.classList.add('is-disabled');
    el.title = 'No compatible GPU detected (' + (r.label || 'unknown') + '). Need NVIDIA (CUDA) or AMD/Apple/Intel-Arc with Vulkan/Metal/DirectML.';
    const note = document.createElement('div');
    note.className = 'info info--warn';
    note.style.marginTop = '6px';
    note.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><div>GPU acceleration disabled: <b>' + (r.label || 'no compatible adapter') + '</b>. Whisper will run on CPU.</div>';
    const parent = el.closest('.field');
    if (parent && !parent.querySelector('.info--warn[data-gpu-note]')) {
      note.setAttribute('data-gpu-note', '1');
      parent.appendChild(note);
    }
  });
}

// -- toast -------------------------------------------
function toast(msg, kind) {
  const t = document.getElementById('toast');
  const m = document.getElementById('toastMsg');
  if (!t || !m) return;
  m.textContent = msg;
  t.classList.toggle('toast--warn', kind === 'warn');
  t.classList.add('is-visible');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('is-visible'), 1800);
}

// -- action stubs ------------------------------------
function signIn()         {
  if (state.fSignedIn) { toast('Already signed in'); return; }
  state.fSignedIn = true;
  markDirty();
  paintSignedIn();
  toast('Signed in  -  subscription unlocked (demo)');
}
function manageSub()      { toast('Opening subscription manager  -  ' + PLANS[state.fPlan].name + ' (' + getRegion().toUpperCase() + ')'); }
function manageAccount()  { window.open('https://quistan.com/account', '_blank', 'noopener'); }
function switchPlan()     { toast('Opening plan picker  -  5 plans available'); }
function addHours()       { toast('Opening hour packages  -  10 h / 50 h available'); }
function manageLicense()  { window.open('https://quistan.com/account/license', '_blank', 'noopener'); }
function manageSubscription() { window.open('https://quistan.com/account/billing', '_blank', 'noopener'); }
function switchKeys()     { window.open('https://quistan.com/account/keys', '_blank', 'noopener'); }
function signOutDevice(id)    { if (confirm('Sign out from this device? It will stop working on the next launch.')) toast('Device signed out  -  sign in again to restore', 'warn'); }
function signOutAll()         { if (confirm('Sign out from ALL other devices? Only this PC will stay signed in.')) toast('All other devices signed out', 'warn'); }
function openDevicesCabinet() { window.open('https://quistan.com/account/devices', '_blank', 'noopener'); }
function testKeys()       {
  const keys = (state.fApiKeys || []).filter(k => k.enabled && k.key);
  if (!keys.length) { toast('No enabled keys to test', 'warn'); return; }
  toast('Testing ' + keys.length + ' key' + (keys.length > 1 ? 's' : '') + '  -  pinging endpoints');
}
function reindexAll()     {
  const vectors = document.getElementById('vecTotalCount');
  const n = vectors ? (vectors.textContent || '').replace(/[^\d]/g, '') : '';
  const msg = 'Reindex ALL knowledge sources from scratch?\n\n'
    + (n ? '~' + n + ' vectors will be rebuilt.\n' : '')
    + 'This will run at full CPU load and can take 10-60 minutes\n'
    + 'depending on the size of your knowledge base.\n\n'
    + 'Quistan will be slow while reindexing.\n'
    + 'Continue?';
  if (!confirm(msg)) return;
  toast('Reindex started  -  ' + (n || 'all') + ' vectors queued');
}
function pickDevice(k)    { toast('Native picker  -  backend integration Phase 6'); }
function selectRegion()   { toast('Drag-select region on any screen'); }
function clearRegion()    { toast('Region cleared'); }
function convertScreenshots(fmt) {
  void fmt;
  toast('Format conversion is now automatic  -  toggle in General \u2192 Capture');
}
function takeScreenshot() { toast('Screenshot captured from current region'); }
function openPngFolder()  {
  toast('Opening ' + getPngCachePath());
}
function purgePngNow()     {
  const n = parseInt((document.getElementById('pngCacheCount')?.textContent || '0').replace(/\D/g, ''), 10) || 0;
  if (n === 0) { toast('Cache is already empty'); return; }
  if (!confirm('Delete ALL ' + n + ' raw PNG screenshots in the cache folder? AI processing is not affected.')) return;
  toast('Purged ' + n + ' PNG' + (n === 1 ? '' : 's') + ' from cache', 'warn');
  const c = document.getElementById('pngCacheCount'); if (c) c.textContent = '0';
  const s = document.getElementById('pngCacheSize');  if (s) s.textContent = '0 B';
  const p = document.getElementById('pngCacheLastPurge'); if (p) p.textContent = 'just now';
}
function openDataFolder() { toast('Opening data folder - '); }
function checkUpdate()    { toast('You are on the latest version'); }
function openLogs()       {
  if (!state.fLogToFile) { toast('Enable "Write logs to file" first', 'warn'); return; }
  toast('Opening logs folder - ');
}
function copyDiagnostics(){
  if (!state.fLogToFile) { toast('Enable "Write logs to file" to include log tail in diagnostics', 'warn'); return; }
  toast('Diagnostics copied to clipboard (system info + log tail)');
}
function exportConfig()   {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'quistan-settings.json';
  a.click();
  toast('Config exported');
}
function importConfig()   {
  const inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = 'application/json,.json';
  inp.addEventListener('change', () => {
    const f = inp.files && inp.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      toast('Config file too large (max 5 MB)', 'warn');
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => toast('Could not read file'), reader.onload = () => {
      let parsed;
      try { parsed = JSON.parse(reader.result); }
      catch (e) { toast('Invalid JSON: ' + (e.message || 'parse error'), 'warn'); return; }
      const cleaned = validateSettings(parsed);
      if (!cleaned) {
        toast('Config rejected: structure does not match current schema', 'warn');
        return;
      }
      const merged = Object.assign({}, state, cleaned);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        toast('Config imported  -  reloading');
        setTimeout(() => location.reload(), 500);
      } catch (_) {
        toast('Could not save imported config', 'warn');
      }
    };
    reader.readAsText(f);
  });
  inp.click();
}
function openWindows()    {
  if (window.parent && window.parent !== window) window.parent.postMessage({ type:'open-windows-settings' }, '*');
  else window.open('../floating_windows_settings.html', '_blank');
}
function openKb()         {
  if (window.parent && window.parent !== window) window.parent.postMessage({ type:'open-kb-picker' }, '*');
  else window.open('../kb_picker.html', '_blank');
}
function openKnowledge()  { openKb(); }
function addRagSource()   { openKb(); }
function connectRagSource(id) {
  const el = document.querySelector('[data-source="' + id + '"]');
  if (!el) { toast('Unknown source: ' + id, 'warn'); return; }
  el.classList.add('is-on');
  const status = el.querySelector('.provider__status');
  if (status) { status.className = 'provider__status is-on'; status.textContent = 'connecting'; }
  const btn = el.querySelector('.topbar__btn');
  if (btn) btn.remove();
  toast('Connecting ' + id + '  -  opening setup');
  setTimeout(() => { openKb(); }, 250);
}
function setBtnLoading(btn, on, label) {
  if (!btn) return;
  btn.classList.toggle('is-loading', !!on);
  if (on && label) btn.dataset.label = btn.textContent, btn.textContent = label;
  else if (!on && btn.dataset.label) { btn.textContent = btn.dataset.label; delete btn.dataset.label; }
}
function dbVacuum() {
  const btn = document.getElementById('btnDbVacuum');
  if (!btn || btn.classList.contains('is-loading')) return;
  setBtnLoading(btn, true, 'Optimizing...');
  toast('VACUUM started  -  reclaiming free pages');
  setTimeout(() => {
    const freed = (Math.random() * 4 + 0.3).toFixed(2);
    const el = document.getElementById('vacuumLast');
    if (el) el.textContent = 'just now  -  freed ' + freed + ' MB';
    setBtnLoading(btn, false);
    toast('VACUUM done  -  freed ' + freed + ' MB');
  }, 1400);
}
function dbIntegrity()    { toast('Integrity check: ok (no corruption)'); }
function dbMigrate()      { toast('No pending migrations  -  schema v14 is current'); }
function dbRebuild()      { toast('Rebuilding FTS and B-tree indexes - '); }
function dbBackup() {
  const btn = document.getElementById('btnDbBackup');
  if (!btn || btn.classList.contains('is-loading')) return;
  setBtnLoading(btn, true, 'Backing up...');
  setTimeout(() => {
    setBtnLoading(btn, false);
    toast('Backup saved  -  snapshots/' + (state.fActiveDb || 'default') + '-' + Date.now() + '.db');
  }, 900);
}
function dbRestore()      { const file = prompt('Path to backup .db file:'); if (file) toast('Restoring from ' + file); }
function dbCopyPath()     { navigator.clipboard?.writeText(document.getElementById('fDbFolder')?.value || ''); toast('Path copied'); }
function dbClearVectors() { if (!confirm('Wipe vector index for the active database? Sources will need to be reindexed.')) return; toast('Vector index cleared  -  reindex required', 'warn'); }
function dbClearHistory() { if (!confirm('Wipe dialog history for the active database? Settings and vectors preserved.')) return; toast('Dialog history cleared', 'warn'); }
function dbWipe() {
  confirmModal({
    title: 'Clear database',
    body: '<p>This will <b>erase all dialogs and history</b> from <code>default.db</code>.</p><p>Settings, shortcuts and window layouts are <b>kept</b>. KB vectors are not affected (managed separately in the Knowledge section). A backup snapshot is recommended before continuing.</p>',
    danger: true,
    token: 'CLEAR',
    confirmLabel: 'Clear database'
  }).then(ok => { if (ok) { toast('Database cleared  -  dialogs and history erased', 'warn'); setTimeout(() => location.reload(), 700); } });
}

// -- plans (subscription tiers) -----------------------------
const PLANS = {
  test: {
    name: 'Test-Craster', initial: 'T',
    hours: 0.5, period: 'week', periodLabel: '30 min / week', rollover: false, resetDay: 'Every Monday',
    windows: 1, folders: 1,
    ru: { price: 0,    currency: 'RUB', per: '' },
    us: { price: 0,    currency: '$',   per: '' },
    blurb: 'Just check out the app on your PC.',
  },
  offer: {
    name: 'Offer', initial: 'O',
    hours: 8, period: 'week', periodLabel: '8 h for 7 days', rollover: false,
    windows: 3, folders: 3,
    ru: { price: 690,  currency: 'RUB', per: ' / week' },
    us: { price: 9.99, currency: '$',   per: ' / week' },
    blurb: 'Job hunters - pass 1-2 interviews this week.',
  },
  standard: {
    name: 'Standard', initial: 'S',
    hours: 25, period: 'month', periodLabel: '25 h / month', rollover: true,
    windows: 3, folders: 5,
    ru: { price: 1190, currency: 'RUB', per: ' / month' },
    us: { price: 19.99, currency: '$',   per: ' / mo' },
    blurb: 'Daily meetings, reports and calls with the boss.',
  },
  hustler: {
    name: 'Hustler PRO', initial: 'H',
    hours: 100, period: 'month', periodLabel: '100 h / month', rollover: true,
    windows: 5, folders: 20,
    ru: { price: 2490, currency: 'RUB', per: ' / month' },
    us: { price: 39.99, currency: '$',   per: ' / mo' },
    blurb: 'Pro salespeople and multi-platform freelancers.',
  },
  byok: {
    name: 'Your Key', initial: 'Y',
    hours: -1, period: 'unlimited', periodLabel: 'UNLIMITED', rollover: true,
    windows: -1, folders: -1,
    ru: { price: 500,  currency: 'RUB', per: ' / month' },
    us: { price: 6.99, currency: '$',   per: ' / mo' },
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
  if (p.price === 0) return 'Free';
  return p.price.toLocaleString(region === 'ru' ? 'ru-RU' : 'en-US', { minimumFractionDigits: p.price % 1 ? 2 : 0, maximumFractionDigits: 2 }) + ' ' + p.currency + p.per;
}
function fmtLimit(n) { return n < 0 ? 'UNLIMITED' : n; }

function renderPlan() {
  const plan = PLANS[state.fPlan] || PLANS.standard;
  const monthlyAllowance = plan.hours;
  const used = state.fPlanUsed || 0;
  const rollover = state.fPlanRollover || 0;
  const total = monthlyAllowance + rollover;
  const isByokMode = state.fMode === 'byok';
  const isManaged = !isByokMode;
  const byokDaysLeft = state.fByokDaysLeft != null ? state.fByokDaysLeft : 18;
  const byokEndsOn = state.fByokEndsOn || 'Sep 20, 2026';

  // Plan card - always ACTIVE
  const card = document.getElementById('planCard');
  if (card) {
    if (isByokMode) {
      card.innerHTML = `
        <div class="plan-card__head">
          <div class="plan-card__avatar">Y</div>
          <div class="plan-card__body">
            <div class="plan-card__name">BYOK Subscription</div>
            <div class="plan-card__price">BRING YOUR OWN API KEYS</div>
            <div class="plan-card__blurb">Unlimited meeting time and floating windows with custom API keys.</div>
          </div>
          <span class="pill pill--live"><span class="d"></span>Active</span>
        </div>`;
    } else {
      card.innerHTML = `
        <div class="plan-card__head">
          <div class="plan-card__avatar">${plan.initial || plan.name[0]}</div>
          <div class="plan-card__body">
            <div class="plan-card__name">Cloud AI Balance</div>
            <div class="plan-card__price">${plan.name} package</div>
            <div class="plan-card__blurb">Direct voice streaming via Quistan cloud infrastructure.</div>
          </div>
          <span class="pill pill--live"><span class="d"></span>Active</span>
        </div>`;
    }
  }

  const accPlanPill = document.getElementById('accPlanPill');
  if (accPlanPill) {
    accPlanPill.innerHTML = '<span class="d"></span>ACTIVE  -  ' + (isByokMode ? 'BYOK LICENSE' : 'CLOUD HOURS');
  }

  const hoursBlock = document.getElementById('planHours');
  const trialBlock = document.getElementById('byokTrialStatus');
  const licenseBlock = document.getElementById('byokStatus');

  if (isManaged) {
    if (hoursBlock) {
      hoursBlock.style.display = '';
      const pct = total > 0 ? Math.min(100, Math.round(used / total * 100)) : 0;
      const remaining = Math.max(0, total - used);
      hoursBlock.innerHTML = `
        <div class="field__label">
          <span>Hours balance</span>
          <span class="field__hint">remaining</span>
        </div>
        <div class="usage">
          <div class="usage__head"><b>${remaining} h remaining</b><span>used ${used} of ${total} h</span></div>
          <div class="usage__bar"><div class="usage__bar-fill" style="width:${pct}%"></div></div>
        </div>
        <div class="btn-row" style="margin-top:14px">
          <button class="topbar__btn topbar__btn--primary" onclick="addHours()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add hours
          </button>
          <button class="topbar__btn" onclick="manageAccount()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.66V19a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1.66"/></svg>
            Manage account
          </button>
        </div>`;
    }
    if (trialBlock) trialBlock.style.display = 'none';
    if (licenseBlock) licenseBlock.style.display = 'none';
  } else {
    // BYOK mode - subscription period block instead of hours
    if (hoursBlock) hoursBlock.style.display = 'none';
    if (trialBlock) trialBlock.style.display = 'none';
    if (licenseBlock) {
      licenseBlock.style.display = '';
      licenseBlock.innerHTML = `
        <div class="field__label">
          <span>Subscription period</span>
          <span class="field__hint">remaining</span>
        </div>
        <div class="usage" style="padding:14px 16px">
          <div class="usage__head"><b>${byokDaysLeft} days remaining</b><span>renews on ${byokEndsOn}</span></div>
        </div>
        <div class="btn-row" style="margin-top:14px">
          <button class="topbar__btn topbar__btn--primary" onclick="manageSubscription()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            Manage subscription
          </button>
          <button class="topbar__btn" onclick="switchKeys()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
            Switch keys
          </button>
        </div>`;
    }
  }
}

// -- embeddings: model picker, device picker, gpu detect -
const EMB_MODELS = {
  'bge-small-en-v1.5':                 { name: 'bge-small-en-v1.5',                 dim: 384,  size: '~33 MB',    bundled: true,  langs: 'English',        path: 'C:\\Program Files\\Quistan\\models\\bge-small-en-v1.5' },
  'bge-base-en-v1.5':                  { name: 'bge-base-en-v1.5',                  dim: 768,  size: '~110 MB',   bundled: true,  langs: 'English',        path: 'C:\\Program Files\\Quistan\\models\\bge-base-en-v1.5' },
  'bge-large-en-v1.5':                 { name: 'bge-large-en-v1.5',                 dim: 1024, size: '~335 MB',   bundled: true,  langs: 'English',        path: 'C:\\Program Files\\Quistan\\models\\bge-large-en-v1.5' },
  'paraphrase-multilingual-MiniLM-L12-v2': { name: 'paraphrase-multilingual-MiniLM-L12-v2', dim: 384,  size: '~50 MB',    bundled: false, langs: '50+ languages',  path: '%USERPROFILE%\\.cache\\quistan\\paraphrase-multilingual-MiniLM-L12-v2' },
  'bge-m3':                            { name: 'bge-m3',                            dim: 1024, size: '~2.2 GB',   bundled: false, langs: '100+ languages', path: '%USERPROFILE%\\.cache\\quistan\\bge-m3' },
  'nomic-embed-text-v1.5':             { name: 'nomic-embed-text-v1.5',             dim: 768,  size: '~270 MB',   bundled: false, langs: 'English',        path: '%USERPROFILE%\\.cache\\quistan\\nomic-embed-text-v1.5' },
  'mxbai-embed-large-v1':              { name: 'mxbai-embed-large-v1',              dim: 1024, size: '~670 MB',   bundled: false, langs: 'English',        path: '%USERPROFILE%\\.cache\\quistan\\mxbai-embed-large-v1' },
  'custom':                            { name: 'Custom model',                      dim: 0,    size: 'unknown',   bundled: false, langs: 'depends on model', path: '' },
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
  const pathRowEl = document.getElementById('embModelPath');
  if (nameEl) nameEl.textContent = info.name + (info.bundled ? '  -  bundled' : (isCustom ? '' : '  -  downloadable'));
  if (pathEl) pathEl.textContent = path;
  if (pathRowEl) pathRowEl.textContent = path || '(no path)';
  if (dimEl)  dimEl.textContent  = info.dim || 'depends on model';
  if (sizeEl) sizeEl.textContent = info.size;
  const pill = document.getElementById('embStatusPill');
  const status = document.getElementById('embKvStatus');
  const dlRow = document.getElementById('embDownloadRow');
  if (info.bundled) {
    if (pill) { pill.className = 'pill pill--live'; pill.innerHTML = '<span class="d"></span>Loaded'; }
    if (status) status.textContent = 'Loaded';
    if (dlRow) dlRow.style.display = 'none';
  } else if (isCustom) {
    if (pill) { pill.className = 'pill pill--warn'; pill.innerHTML = '<span class="d"></span>Custom'; }
    if (status) status.textContent = 'Custom path';
    if (dlRow) dlRow.style.display = 'none';
  } else {
    if (pill) { pill.className = 'pill pill--off'; pill.innerHTML = '<span class="d"></span>Not installed'; }
    if (status) status.textContent = 'Not installed';
    if (dlRow) dlRow.style.display = '';
  }
}

function paintEmbDevice() {
  const dev = state.fEmbDevice || 'cpu';
  const gpuEnabled = !!state.fEmbGpu;
  const gpuFound = !!state.__gpuFound;
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
  const fp16Field = document.getElementById('embFp16Field');
  if (fp16Field) {
    const fp16Label = fp16Field.querySelector('.switch__label');
    const needsGpu = dev !== 'cpu' && gpuEnabled;
    fp16Field.classList.toggle('is-disabled', !needsGpu);
    if (fp16Label) {
      fp16Label.textContent = needsGpu
        ? 'Save GPU memory (FP16, a little less accurate)'
        : 'Save GPU memory (FP16)  -  requires GPU acceleration';
    }
    if (!needsGpu) {
      const inp = document.getElementById('fEmbFp16');
      if (inp) inp.checked = false;
      state.fEmbFp16 = false;
    }
  }
  const gpuSwitch = document.getElementById('fEmbGpu');
  const gpuHint   = document.getElementById('gpuDetectHint');
  const missingHint = document.getElementById('gpuMissingHint');
  if (!gpuFound) {
    if (gpuSwitch) gpuSwitch.disabled = true;
    if (gpuSwitch) gpuSwitch.checked = false;
    state.fEmbGpu = false;
    if (gpuHint) gpuHint.textContent = '\u00b7 not available \u2014 no GPU detected';
    if (missingHint) missingHint.style.display = '';
  } else {
    if (gpuSwitch) gpuSwitch.disabled = false;
    if (gpuHint) gpuHint.textContent = '\u00b7 auto-picks CUDA or DirectML when on';
    if (missingHint) missingHint.style.display = 'none';
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
  if (!state.fApiKeys.length) {
    list.innerHTML = `
      <div class="providers__empty">
        No providers added yet. Click <b>+ Add Provider</b> to connect OpenAI, Anthropic, OpenRouter or a local Ollama.
      </div>`;
    paintModelDropdowns();
    return;
  }
  list.innerHTML = state.fApiKeys.map(k => {
    const on = !!k.enabled;
    const has = !!k.key;
    const preset = PROVIDER_PRESETS[k.id];
    const isLocal = preset ? preset.kind === 'local' : (/localhost|127\.0\.0\.1/.test(k.baseUrl || ''));
    const models = (k.models || '').split(',').map(s => s.trim()).filter(Boolean);
    const statusText = !on ? 'Disabled' : (has || isLocal) ? 'Connected' : 'No key';
    const statusCls  = !on ? 'is-warn' : (has || isLocal) ? 'is-on' : 'is-off';
    const logoSvg = isLocal
      ? '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'
      : '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>';
    return `
      <div class="provider ${on ? 'is-on' : ''}" data-prov="${k.id}">
        <div class="provider__logo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${logoSvg}</svg></div>
        <div class="provider__body">
          <div class="provider__name">${(k.name || k.id).replace(/</g,'&lt;')}</div>
          <div class="provider__hint">${(k.baseUrl || '').replace(/</g,'&lt;')}${' \u00b7 ' + models.length + ' models'}</div>
        </div>
        <span class="provider__status ${statusCls}">${statusText}</span>
        <button class="topbar__btn" style="height:24px;padding:0 10px;font-size:11px" data-act="edit" title="Edit provider">Edit</button>
        <button class="topbar__btn topbar__btn--danger" style="height:24px;padding:0 10px;font-size:11px" data-act="del" title="Remove provider">\u2715</button>
      </div>`;
  }).join('');
  list.querySelectorAll('.provider').forEach(row => {
    const id = row.dataset.prov;
    const item = state.fApiKeys.find(x => x.id === id);
    if (!item) return;
    row.querySelector('[data-act="edit"]').addEventListener('click', () => editProvider(id));
    row.querySelector('[data-act="del"]').addEventListener('click', () => removeApiKey(id));
  });
  paintModelDropdowns();
}
function removeApiKey(id) {
  if (!Array.isArray(state.fApiKeys)) return;
  const item = state.fApiKeys.find(x => x.id === id);
  if (!item) return;
  if (!confirm('Remove provider "' + (item.name || id) + '"?\nIts models will disappear from the Fast / Heavy dropdowns.')) return;
  state.fApiKeys = state.fApiKeys.filter(x => x.id !== id);
  markDirty();
  renderApiKeys();
  toast('Provider removed');
}

function paintModelDropdowns() {
  const fastSel = document.getElementById('fModelFast');
  const heavySel = document.getElementById('fModelHeavy');
  if (!fastSel || !heavySel) return;
  const providers = (state.fApiKeys || []).filter(k => k.enabled);
  const groups = providers.map(p => {
    const models = (p.models || '').split(',').map(s => s.trim()).filter(Boolean);
    const opts = models.map(m => `<option value="${m}">${m}  -  ${(p.name || p.id).replace(/</g,'&lt;')}</option>`).join('');
    return `<optgroup label="${(p.name || p.id).replace(/</g,'&lt;')}">${opts}</optgroup>`;
  }).join('');
  const builtin = `
    <optgroup label="Built-in fallback">
      <option value="gpt-4o-mini">gpt-4o-mini</option>
      <option value="gpt-4o">gpt-4o</option>
      <option value="claude-sonnet">claude-sonnet-4.5</option>
      <option value="gemini-2.0-flash">gemini-2.0-flash</option>
      <option value="llama-3.3-70b">llama-3.3-70b</option>
    </optgroup>`;
  const emptyHint = providers.length
    ? ''
    : '<option value="" disabled>Add a provider below to see models</option>';
  fastSel.innerHTML = emptyHint + (groups || builtin);
  heavySel.innerHTML = emptyHint + (groups || builtin);
  if ([...fastSel.options].some(o => o.value === state.fModelFast)) fastSel.value = state.fModelFast;
  if ([...heavySel.options].some(o => o.value === state.fModelHeavy)) heavySel.value = state.fModelHeavy;
  fastSel.onchange = () => { state.fModelFast = fastSel.value; markDirty(); };
  heavySel.onchange = () => { state.fModelHeavy = heavySel.value; markDirty(); };
}

function paintSttModels() {
  const list = document.getElementById('sttModelsList');
  if (!list) return;
  if (!state.fSttInstalled || typeof state.fSttInstalled !== 'object') {
    state.fSttInstalled = {};
    Object.entries(STT_MODELS).forEach(([id, m]) => { if (m.defaultInstalled) state.fSttInstalled[id] = true; });
  }
  if (!Array.isArray(state.fSttProviders)) state.fSttProviders = [];
  const cur = state.fSttModel || 'whisper-multi-base';
  const sel = document.getElementById('fSttModel');
  if (sel) {
    const tab = state.fSttTab || 'local';
    const localOpts = Object.entries(STT_MODELS)
      .filter(([id, m]) => state.fSttInstalled[id])
      .map(([id, m]) => `<option value="${id}">${m.name}  \u00b7  Ready</option>`).join('');
    const remoteOpts = state.fSttProviders
      .filter(p => p.enabled)
      .map(p => `<option value="${p.id}">${p.name || p.preset}  -  ${p.model || ''}</option>`).join('');
    let html = '';
    if (tab === 'local' && localOpts) html += `<optgroup label="Local (Offline)">${localOpts}</optgroup>`;
    if (tab === 'api'  && remoteOpts) html += `<optgroup label="Remote / API">${remoteOpts}</optgroup>`;
    if (!html) {
      html = tab === 'api'
        ? '<option value="" disabled>No API providers connected  -  add one below</option>'
        : '<option value="" disabled>No local models installed  -  download below</option>';
    }
    sel.innerHTML = html;
    if ([...sel.options].some(o => o.value === cur)) sel.value = cur;
    sel.onchange = () => { state.fSttModel = sel.value; markDirty(); };
  }
  const pathEl = document.getElementById('sttFolderPath');
  if (pathEl) pathEl.textContent = STT_FOLDER;
list.innerHTML = Object.entries(STT_MODELS).map(([id, m]) => {
    const installed = !!state.fSttInstalled[id];
    const isCur = id === cur;
    const logoSvg = installed
      ? '<polyline points="20 6 9 17 4 12"/>'
      : '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>';
    const nameExtras = m.bundled && installed ? '  \u00b7  <span class="pill pill--info" style="font-size:9.5px;padding:1px 6px;vertical-align:1px"><span class="d"></span>Bundled</span>' : '';
    const deletable = installed && !m.bundled;
    const action = installed
      ? (isCur && deletable
          ? '<span class="pill pill--live" style="margin-right:6px"><span class="d"></span>Downloaded</span><button class="topbar__btn topbar__btn--danger" style="height:24px;padding:0 10px;font-size:11px;display:inline-flex;align-items:center;gap:4px" data-act="del" title="Delete model file"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V1-6h6v6"/></svg></button>'
          : isCur
            ? '<span class="pill pill--live"><span class="d"></span>Downloaded</span>'
            : '<button class="topbar__btn" style="height:24px;padding:0 10px;font-size:11px;margin-right:4px" data-act="use">Use</button>' + (deletable ? '<button class="topbar__btn topbar__btn--danger" style="height:24px;padding:0 10px;font-size:11px;display:inline-flex;align-items:center;gap:4px" data-act="del" title="Delete model file"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V1-6h6v6"/></svg></button>' : ''))
      : '<button class="topbar__btn topbar__btn--primary" style="height:24px;padding:0 10px;font-size:11px" data-act="dl">Download \u00b7 ' + m.size + '</button>';
    return `
      <div class="provider ${installed ? 'is-on' : ''}" data-stt="${id}">
        <div class="provider__logo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${logoSvg}</svg></div>
        <div class="provider__body">
          <div class="provider__name">${m.name}${nameExtras}</div>
          <div class="provider__hint">${m.desc}  \u00b7  ${m.size}</div>
        </div>
        ${action}
      </div>`;
  }).join('');
  list.querySelectorAll('.provider').forEach(row => {
    const id = row.dataset.stt;
    row.querySelectorAll('[data-act]').forEach(act => {
      const which = act.dataset.act;
      if (which === 'dl') act.addEventListener('click', () => downloadSttModel(id));
      else if (which === 'del') act.addEventListener('click', () => deleteSttModel(id));
      else if (which === 'use') act.addEventListener('click', () => useSttModel(id));
    });
  });
}

function paintSttProviders() {
  const list = document.getElementById('sttProvidersList');
  if (!list) return;
  if (!Array.isArray(state.fSttProviders)) state.fSttProviders = [];
  const empty = document.getElementById('sttProvidersEmpty');
  if (!state.fSttProviders.length) {
    if (empty) empty.style.display = '';
    list.querySelectorAll('.provider[data-stt-prov]').forEach(n => n.remove());
    return;
  }
  if (empty) empty.style.display = 'none';
  list.querySelectorAll('.provider[data-stt-prov]').forEach(n => n.remove());
  state.fSttProviders.forEach(p => {
    const on = !!p.enabled;
    const has = !!p.key;
    const isLocal = p.preset === 'ollama' || /localhost|127\.0\.0\.1/.test(p.url || '');
    const statusText = !on ? 'Disabled' : (has || isLocal) ? 'Connected' : 'No key';
    const statusCls  = !on ? 'is-warn' : (has || isLocal) ? 'is-on' : 'is-off';
    const logoSvg = isLocal
      ? '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'
      : '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>';
    const node = document.createElement('div');
    node.className = 'provider ' + (on ? 'is-on' : '');
    node.dataset.sttProv = p.id;
    node.innerHTML = `
      <div class="provider__logo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${logoSvg}</svg></div>
      <div class="provider__body">
        <div class="provider__name">${(p.name || p.id).replace(/</g,'&lt;')}</div>
        <div class="provider__hint">${(p.url || '').replace(/</g,'&lt;')}${' \u00b7  ' + (p.model || '')}</div>
      </div>
      <span class="provider__status ${statusCls}">${statusText}</span>
      <button class="topbar__btn" style="height:24px;padding:0 10px;font-size:11px" data-act="edit">Edit</button>
      <button class="topbar__btn topbar__btn--danger" style="height:24px;padding:0 10px;font-size:11px" data-act="del">\u2715</button>`;
    list.appendChild(node);
    node.querySelector('[data-act="edit"]').addEventListener('click', () => editSttProvider(p.id));
    node.querySelector('[data-act="del"]').addEventListener('click', () => removeSttProvider(p.id));
  });
}

function paintSttTab() {
  const tab = state.fSttTab || 'local';
  document.querySelectorAll('[data-stt-tab]').forEach(el => {
    el.style.display = (el.dataset.sttTab === tab) ? '' : 'none';
  });
  document.querySelectorAll('#segSttTab .seg__btn').forEach(b => {
    b.classList.toggle('is-on', b.dataset.val === tab);
  });
}
function paintSttDevice() {
  const dev = state.fSttDevice || 'cpu';
  const segEl = document.getElementById('segSttDevice');
  if (segEl) {
    segEl.querySelectorAll('.seg__btn').forEach(b => b.classList.toggle('is-on', b.dataset.val === dev));
  }
  const txt = document.getElementById('sttGpuDetectText');
  const pill = document.getElementById('sttGpuDetectPill');
  const detected = state.fSttGpuDetect || '';
  if (pill && txt) {
    if (detected) {
      pill.className = 'pill pill--live';
      txt.textContent = detected;
    } else {
      pill.className = 'pill pill--off';
      txt.textContent = 'No GPU detected';
    }
  }
}
function downloadSttModel(id) {
  const m = STT_MODELS[id]; if (!m) return;
  toast('Downloading ' + m.name + '  -  ' + m.size + ' into ' + STT_FOLDER);
  let pct = 0;
  const tick = setInterval(() => {
    pct += 5 + Math.random() * 12;
    if (pct >= 100) {
      clearInterval(tick);
      state.fSttInstalled[id] = true;
      markDirty();
      paintSttModels();
      toast(m.name + ' ready to use');
      return;
    }
    toast('Downloading ' + m.name + '  -  ' + Math.round(pct) + '%', 'progress');
  }, 320);
}
function deleteSttModel(id) {
  const m = STT_MODELS[id]; if (!m) return;
  if (!confirm('Delete ' + m.name + ' (' + m.size + ') from disk?\nYou can re-download anytime.')) return;
  delete state.fSttInstalled[id];
  if (state.fSttModel === id) state.fSttModel = Object.keys(state.fSttInstalled)[0] || 'whisper-multi-base';
  markDirty();
  paintSttModels();
  toast(m.name + ' removed');
}
function useSttModel(id) {
  state.fSttModel = id;
  markDirty();
  paintSttModels();
  toast(STT_MODELS[id].name + ' is now active');
}
function openSttFolder() {
  toast('Opening ' + STT_FOLDER + '  -  backend integration Phase 6');
}

function useSttProvider(id) {
  state.fSttModel = id;
  markDirty();
  paintSttModels();
  const p = (state.fSttProviders || []).find(x => x.id === id);
  toast((p ? p.name : id) + ' is now active for STT');
}
function removeSttProvider(id) {
  if (!Array.isArray(state.fSttProviders)) return;
  const p = state.fSttProviders.find(x => x.id === id);
  if (!p) return;
  if (!confirm('Remove STT provider "' + (p.name || id) + '"?\nIts model will disappear from the dropdown.')) return;
  state.fSttProviders = state.fSttProviders.filter(x => x.id !== id);
  if (state.fSttModel === id) state.fSttModel = 'whisper-multi-base';
  markDirty();
  paintSttProviders();
  paintSttModels();
  toast('STT provider removed');
}
function editSttProvider(id) {
  const p = (state.fSttProviders || []).find(x => x.id === id);
  if (!p) return;
  openAddSttProviderModal(p);
}

// -- Add STT Provider modal ------------------------------------
function openAddSttProviderModal(existing) {
  const m = document.getElementById('addSttProviderModal');
  if (m) m.classList.add('is-on');
  document.getElementById('newSttPreset').value = (existing && existing.preset) || 'openai';
  document.getElementById('newSttUrl').value    = (existing && existing.url)    || '';
  document.getElementById('newSttKey').value    = (existing && existing.key)    || '';
  document.getElementById('newSttModel').value  = (existing && existing.model)  || '';
  document.getElementById('newSttName').value   = (existing && existing.name)   || '';
  const r = document.getElementById('newSttTestResult');
  if (r) { r.style.display = 'none'; r.innerHTML = ''; }
  if (existing) document.getElementById('addSttProviderModal').dataset.editing = existing.id;
  else delete document.getElementById('addSttProviderModal').dataset.editing;
  applySttProviderPreset();
}
function closeAddSttProviderModal() {
  const m = document.getElementById('addSttProviderModal');
  if (m) m.classList.remove('is-on');
  delete m.dataset.editing;
}
function applySttProviderPreset() {
  const sel = document.getElementById('newSttPreset');
  if (!sel) return;
  const p = STT_PROVIDER_PRESETS[sel.value];
  if (!p) return;
  const url    = document.getElementById('newSttUrl');
  const key    = document.getElementById('newSttKey');
  const model  = document.getElementById('newSttModel');
  const name   = document.getElementById('newSttName');
  const keyField = document.getElementById('newSttKeyField');
  if (url && !url.value) url.value = p.url;
  if (model && !model.value) model.value = p.model;
  if (name && !name.value) name.value = p.name;
  if (keyField) keyField.style.display = p.needsKey ? '' : 'none';
  if (!p.needsKey && key) key.value = '';
}
function testNewSttProvider() {
  const url   = document.getElementById('newSttUrl').value.trim();
  const key   = document.getElementById('newSttKey').value.trim();
  const model = document.getElementById('newSttModel').value.trim();
  const r = document.getElementById('newSttTestResult');
  if (!url || !model) { r.style.display = ''; r.className = 'info info--warn'; r.innerHTML = 'Endpoint URL and Model name are required'; return; }
  r.style.display = '';
  r.className = 'info';
  r.innerHTML = 'Pinging <code>' + url.replace(/</g,'&lt;') + '/audio/transcriptions</code> with <code>' + model + '</code> \u2026';
  setTimeout(() => {
    const ok = !!key || /localhost|127\.0\.0\.1/.test(url);
    if (ok) {
      r.className = 'info';
      r.innerHTML = '\u2713 Connected. STT endpoint reachable. Model <code>' + model + '</code> will be available.';
    } else {
      r.className = 'info info--warn';
      r.innerHTML = '\u2717 Auth failed. Check the API key.';
    }
  }, 700);
}
function saveNewSttProvider() {
  const url   = document.getElementById('newSttUrl').value.trim();
  const key   = document.getElementById('newSttKey').value.trim();
  const model = document.getElementById('newSttModel').value.trim();
  const name  = document.getElementById('newSttName').value.trim() || (model || 'STT provider');
  const preset = document.getElementById('newSttPreset').value;
  if (!url || !model) { toast('Endpoint URL and Model name are required', 'warn'); return; }
  if (!Array.isArray(state.fSttProviders)) state.fSttProviders = [];
  const modal = document.getElementById('addSttProviderModal');
  const editing = modal && modal.dataset.editing;
  if (editing) {
    const item = state.fSttProviders.find(x => x.id === editing);
    if (item) { item.preset = preset; item.name = name; item.url = url; item.key = key; item.model = model; item.enabled = true; }
  } else {
    const id = 'stt_' + preset + '_' + Date.now().toString(36);
    state.fSttProviders.push({ id, preset, name, url, key, model, enabled: true });
    state.fSttModel = id;
  }
  markDirty();
  paintSttProviders();
  paintSttModels();
  closeAddSttProviderModal();
  toast((editing ? 'Updated' : 'Added') + ' STT provider "' + name + '"  -  available in Speech-to-Text dropdown');
}

// -- Add provider modal ------------------------------------
function openAddProviderModal() {
  const m = document.getElementById('addProviderModal');
  if (m) m.classList.add('is-on');
  document.getElementById('newProvName').value = '';
  document.getElementById('newProvKey').value = '';
  document.getElementById('newProvModels').value = '';
  const r = document.getElementById('newProvTestResult');
  if (r) { r.style.display = 'none'; r.innerHTML = ''; }
  applyProviderPreset();
}
function bindProviderKind() {
  const el = document.getElementById('segProviderKind');
  if (!el) return;
  el.querySelectorAll('.seg__btn').forEach(b => {
    b.onclick = () => {
      el.querySelectorAll('.seg__btn').forEach(x => x.classList.toggle('is-on', x === b));
      applyProviderKind();
    };
  });
}
function bindSttTab() {
  const el = document.getElementById('segSttTab');
  if (!el) return;
  el.querySelectorAll('.seg__btn').forEach(b => {
    b.onclick = () => {
      state.fSttTab = b.dataset.val;
      markDirty();
      paintSttTab();
      paintSttModels();
    };
  });
}
function closeAddProviderModal() {
  const m = document.getElementById('addProviderModal');
  if (m) m.classList.remove('is-on');
}
function applyProviderKind() {
  const kind = (document.querySelector('#segProviderKind .is-on') || {}).dataset?.val || 'cloud';
  document.querySelectorAll('#newProvPreset optgroup').forEach(g => {
    const show = (kind === 'cloud' && g.id === 'provCloudGroup') || (kind === 'local' && g.id === 'provLocalGroup');
    g.disabled = !show;
  });
  const sel = document.getElementById('newProvPreset');
  if (sel.selectedOptions[0] && sel.selectedOptions[0].parentElement.disabled) sel.value = kind === 'cloud' ? 'openai' : 'ollama';
  applyProviderPreset();
}
function applyProviderPreset() {
  const sel = document.getElementById('newProvPreset');
  if (!sel) return;
  const id = sel.value;
  const p = PROVIDER_PRESETS[id];
  if (!p) return;
  const name = document.getElementById('newProvName');
  const url  = document.getElementById('newProvUrl');
  const key  = document.getElementById('newProvKey');
  const mod  = document.getElementById('newProvModels');
  const keyField = document.getElementById('newProvKeyField');
  if (name && !name.value) name.value = p.name;
  if (url)  url.value = p.url;
  if (mod && !mod.value) mod.value = p.models;
  if (keyField) keyField.style.display = p.needsKey ? '' : 'none';
  if (!p.needsKey && key) key.value = '';
}
function testNewProvider() {
  const url = document.getElementById('newProvUrl').value.trim();
  const key = document.getElementById('newProvKey').value.trim();
  const r = document.getElementById('newProvTestResult');
  if (!url) { r.style.display = ''; r.className = 'info info--warn'; r.innerHTML = 'Base URL is required'; return; }
  r.style.display = '';
  r.className = 'info';
  r.innerHTML = 'Pinging <code>' + url.replace(/</g,'&lt;') + '/models</code> ...';
  setTimeout(() => {
    const ok = !!key || /localhost|127\.0\.0\.1/.test(url);
    if (ok) {
      const discovered = ['llama-3.1-8b', 'mistral-7b', 'qwen2.5-7b'];
      r.className = 'info';
      r.innerHTML = '\u2713 Connected. Discovered ' + discovered.length + ' models: <code>' + discovered.join(', ') + '</code>';
      const m = document.getElementById('newProvModels');
      if (m && !m.value) m.value = discovered.join(', ');
    } else {
      r.className = 'info info--warn';
      r.innerHTML = '\u2717 Auth failed. Check API key.';
    }
  }, 700);
}
function saveNewProvider() {
  const name = document.getElementById('newProvName').value.trim() || 'Provider';
  const url  = document.getElementById('newProvUrl').value.trim();
  const key  = document.getElementById('newProvKey').value.trim();
  const mods = document.getElementById('newProvModels').value.trim();
  if (!url) { toast('Base URL is required', 'warn'); return; }
  const id = (document.getElementById('newProvPreset').value || 'custom') + '_' + Date.now().toString(36);
  if (!Array.isArray(state.fApiKeys)) state.fApiKeys = [];
  state.fApiKeys.push({ id, preset: document.getElementById('newProvPreset').value, name, key, baseUrl: url, models: mods, enabled: true });
  markDirty();
  renderApiKeys();
  closeAddProviderModal();
  toast('Provider "' + name + '" saved  -  models added to Fast / Heavy');
}
function editProvider(id) {
  const item = (state.fApiKeys || []).find(x => x.id === id);
  if (!item) return;
  openAddProviderModal();
  document.getElementById('newProvName').value = item.name || '';
  document.getElementById('newProvKey').value = item.key || '';
  document.getElementById('newProvUrl').value = item.baseUrl || '';
  document.getElementById('newProvModels').value = item.models || '';
  if (item.preset) document.getElementById('newProvPreset').value = item.preset;
  applyProviderPreset();
}

function downloadEmbModel() {
  const id = state.fEmbModel || '';
  if (id === 'custom') { toast('Custom models are not downloadable', 'warn'); return; }
  if (EMB_MODELS[id] && EMB_MODELS[id].bundled) { toast('Already bundled  -  nothing to download'); return; }
  toast('Downloading ' + id + '  -  ~' + EMB_MODELS[id].size);
}

function pickEmbModel() { toast('Native folder picker  -  backend integration Phase 6'); }
function copyEmbModelPath() {
  const el = document.getElementById('embModelPath');
  const path = el ? el.textContent : '';
  if (!path) return;
  navigator.clipboard?.writeText(path);
  toast('Model path copied');
}
function openEmbModelFolder() {
  const id = state.fEmbModel || 'bge-small-en-v1.5';
  if (id === 'custom' && !state.fEmbCustomPath) { toast('Pick a custom model folder first', 'warn'); return; }
  toast('Opening model folder');
}

function detectGpu() {
  const name = document.getElementById('gpuKvName');
  const drv  = document.getElementById('gpuKvDriver');
  const vram = document.getElementById('gpuKvVram');
  const cuda = document.getElementById('gpuKvCuda');
  const pill = document.getElementById('gpuDetectPill');
  const txt  = document.getElementById('gpuDetectText');
  const sumPill = document.getElementById('gpuSummaryPill');
  const sumTxt  = document.getElementById('gpuSummaryText');
  const missing = document.getElementById('gpuMissingHint');
  const benBtn  = document.getElementById('benchmarkEmbBtn');
  const benLbl  = document.getElementById('benchmarkEmbLabel');
  if (name) name.textContent = 'Scanning';
  if (pill) { pill.className = 'pill pill--info'; pill.innerHTML = '<span class="d"></span>Scanning'; }
  if (txt)  txt.textContent  = 'Scanning';
  setTimeout(() => {
    const found = !!state.__gpuFound;
    if (found) {
      if (name) name.textContent = 'NVIDIA GeForce RTX 4070';
      if (drv)  drv.textContent  = 'Game Ready 552.22';
      if (vram) vram.textContent = '12 GB';
      if (cuda) cuda.textContent = '5888 cores';
      if (pill) { pill.className = 'pill pill--live'; pill.innerHTML = '<span class="d"></span>CUDA ready'; }
      if (txt)  txt.textContent  = 'CUDA ready';
      if (sumPill) { sumPill.className = 'pill pill--live'; sumPill.innerHTML = '<span class="d"></span>CUDA ready'; }
      if (sumTxt)  sumTxt.textContent  = 'CUDA ready';
      if (missing) missing.style.display = 'none';
      if (benBtn)  benBtn.disabled = false;
      if (benLbl)  benLbl.textContent = 'Benchmark GPU';
      state.fEmbDevice = 'cuda';
    } else {
      if (name) name.textContent = 'None detected';
      if (drv)  drv.textContent  = '-';
      if (vram) vram.textContent = '-';
      if (cuda) cuda.textContent = '-';
      if (pill) { pill.className = 'pill pill--off'; pill.innerHTML = '<span class="d"></span>None'; }
      if (txt)  txt.textContent  = 'None';
      if (sumPill) { sumPill.className = 'pill pill--off'; sumPill.innerHTML = '<span class="d"></span>None'; }
      if (sumTxt)  sumTxt.textContent  = 'None';
      if (missing) missing.style.display = '';
      if (benBtn)  benBtn.disabled = true;
      if (benLbl)  benLbl.textContent = 'Benchmark CPU';
      state.fEmbDevice = 'cpu';
      state.fEmbGpu = false;
      const gpuSwitch = document.getElementById('fEmbGpu');
      if (gpuSwitch) { gpuSwitch.checked = false; gpuSwitch.disabled = true; }
    }
    markDirty();
    paintEmbDevice();
    toast('Detecting GPU');
  }, 1200);
}

function benchmarkEmb() {
  const dev = (state.fEmbGpu && state.fEmbDevice !== 'cpu') ? 'GPU' : 'CPU';
  toast('Benchmark ' + dev + '  -  100 chunks  -  measuring ms/chunk');
}
function optimizeVectors() { toast('Optimizing vector index  -  IVF-PQ recompute'); }
function openVectorsFolder() { toast('Opening vector store folder'); }

function recreateVectorDb() {
  const vectors = document.getElementById('vecTotalCount');
  const n = vectors ? (vectors.textContent || '').replace(/[^\d]/g, '') : '';
  const body =
    '<p>This will <b>permanently delete</b> the entire vector store on disk (<code>./data/vectors</code>) and rebuild it from scratch.</p>' +
    '<p style="margin:6px 0 10px;padding-left:14px;border-left:2px solid var(--danger);color:var(--text)">' +
      (n ? 'Vectors to be erased: <b>' + n + '</b><br>' : '') +
      'Collections: default, work, archive<br>' +
      'Settings, KB sources and dialog history: <b>kept</b>' +
    '</p>' +
    '<p>Use this when <b>Reindex</b> itself crashes on a corrupted SQLite file or when the active embedding model has incompatible dimensions and the existing index refuses to load.</p>';
  confirmModal({
    title: 'Recreate vector database',
    body: body,
    danger: true,
    token: 'WIPE',
    confirmLabel: 'Wipe and rebuild'
  }).then(ok => {
    if (!ok) return;
    if (vectors) vectors.textContent = '0';
    const disk = document.getElementById('vecDiskSize');
    if (disk) disk.textContent = '0 B';
    toast('Vector store wiped  -  rebuilding from sources', 'warn');
    setTimeout(() => reindexAll(), 600);
  });
}

// -- init --------------------------------------------
state = load();
applyTheme();
applyBg();
applyScale();
applyOpacity();
renderSidebar();
renderThemes();
renderAccents();
bindFields();
updateWipeDbVisibility();
syncLogsButtons();
applyGpuProbe();
bindSearch();
updateDbConnPill();
startMeters();
