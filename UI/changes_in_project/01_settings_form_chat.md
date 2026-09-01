# Срез чата: форма Settings (01.09.2026)

> **Охватывает:** сессию от момента, когда попросили «сделать форму настроек», до финального коммита `cb7a534` + последующих мелких правок.
> **Артефакт:** `UI/settings.html` (~127 KB, 10 вкладок, ~88 секций, ~90 полей).
> **Связанные коммиты (по порядку):**
> - `02c5a2e` feat(settings): add main Settings form with sidebar categories
> - `5b75894` fix(settings): simplify Capture trigger to manual only
> - `cb7a534` feat(settings): polish — drop header/timezone, ASCII-clean, per-theme textures, full help tooltips

---

## 1. Что сделано

### 1.1. Файл `UI/settings.html` написан с нуля

Самостоятельный HTML+CSS+JS-файл, без зависимостей от других UI. Изначально планировался рядом с `floating_windows_settings.html` и `kb_picker.html` (которые вынесены в отдельные экраны по требованию).

**Лейаут:** flex-only (`body` → topbar + `.body` (flex row) → `.sidebar` (244px фикс) + `.main` (flex:1, min-width:0)). CSS Grid не использовался — первая попытка с ним дала пересечения из-за `min-width:auto` у grid-ячеек и `.kv`-таблица раздувала колонку. Полностью переписано с flex, после чего все заработало стабильно.

**Состав:** 10 категорий в сайдбаре (см. п.1.2).

### 1.2. Все 10 вкладок реализованы

| # | Вкладка | Что внутри |
|---|---------|-----------|
| 1 | **General** | язык, тема, accent, background, UI scale, Reduce Motion, автозапуск, tray, startup mode |
| 2 | **Account** | профиль, режим **Subscription/BYOK** (toggle), plan-pill, usage-бары, HWID, deactivate |
| 3 | **AI & Models** | Subscription: «managed by Quistan» карточка. BYOK: **Fast model** + **Heavy model** два отдельных `<select>`, providers, API keys. Общая секция Generation (temp / max-tokens / stream / fallback). Плюс **Indexing & Embeddings** (см. п.1.3) |
| 4 | **Audio** | микрофон + system loopback (третий device — TTS — убран по запросу), живые VU-метры, RNNoise/AEC/AGC, VAD, STT engine |
| 5 | **Capture** | region (select/clear), trigger = **только manual** (кнопка + Ctrl+Shift+S), compress to JPEG, JPEG quality, Stealth (WDA, hide frame, hide self) |
| 6 | **Shortcuts** | 7 глобальных хоткеев с inline-записью (Ctrl/Shift/Alt/Meta + key, Esc = clear). Плюс ссылка на per-window в Floating Windows |
| 7 | **Notifications** | 5 событий (update / license / KB / errors / weekly), channels (multi-select tray/sound/toast/telegram), sound preset, quiet hours, DnD, Telegram bot token + chat ID + test |
| 8 | **Privacy & Data** | telemetry/beta тумблеры + **полная Database-секция** (см. п.1.4) |
| 9 | **Updates** | текущая версия, auto-download / install-on-quit / pre-releases тумблеры, code signature info |
| 10 | **Advanced** | log level (errors/warn/info/debug), log-to-file, open logs / copy diagnostics, 3 эксперимента, import/export JSON, **Danger Zone** с factory reset |

### 1.3. Indexing & Embeddings (внутри AI-таба)

Встроенная модель эмбеддингов (`bge-small-en-v1.5`) — ставится инсталлятором, лежит в `C:\Program Files\Quistan\models\...`, запускается локально, ключей не требует. В UI отображается read-only KV-таблицей (model / path / vector DB / dimensions / status) + настраиваемые параметры:

- Reindex changed files automatically (file watcher) — включен по умолчанию
- Verify index integrity on startup
- **Chunk size** (100–1500 токенов, default 500)
- **Chunk overlap** (0–300 токенов, default 50)
- **Indexing workers** (1 / 2 / 4 / 8)
- Кнопка **Reindex all sources**

### 1.4. Database-секция (внутри Privacy)

Полноценное управление БД — в ответ на запрос «должны быть настройки работы с базой данных, очистка/vacuum/обслуживание, backup, переключение между базами».

- **Active database** — `<select>` с 4 пресетами (`default.db`, `work.db`, `research.db`, `archive.db`)
- **Connection** — connect/disconnect тумблер (off = read-only режим), pill в углу показывает «Connected» / «Read-only»
- **Folder** — путь к `C:\Users\...\AppData\Local\Quistan\db`, read-only
- **Schema version** — KV-таблица с версией схемы, временем последних vacuum / integrity check / backup
- **Maintenance** — 4 кнопки: Vacuum / Integrity check / Run migrations / Rebuild indexes
- **Backup & restore** — 4 кнопки: Backup to file / Restore from file / Copy path / Open folder
- **Cleanup** — 3 кнопки: Clear vectors / Clear dialog history / Wipe DB (с двойным confirm)
- **Settings** — SQLCipher encryption тумблер, retention (1/7/30/forever), clear-on-exit

### 1.5. Per-theme текстуры (финальная правка)

Для каждой темы — отдельная body-текстура и палитра:

```css
body.theme-obsidian { --bg-texture: url('1-obsidian.png?v=4'); --bg: #0A0A10; ... }
body.theme-midnight { --bg-texture: url('bg-midnight.png'); --bg: #08080F; --bg-glow-*: ...; }
body.theme-forest   { --bg-texture: url('bg-forest.png');   --bg: #0A130D; ... }
body.theme-ember    { --bg-texture: url('bg-ember.png');    --bg: #150B0B; ... }
body.theme-paper    { --bg-texture: url('bg-paper.png');    --bg: #F5F2EA; ... переопределяет text/border для светлой }
body.theme-carbon   { --bg-texture: url('bg-carbon.png');   --bg: #0F0F11; ... }
```

При выборе темы JS переключает `body.classList` и фон подменяется на лету. PNG-файлы `bg-{theme}.png` пользователь добавляет сам рядом с HTML.

### 1.6. HELP-тултипы для каждой настройки

По запросу «сделай для каждой настройки описание, почему она есть и что она делает»:

- CSS-класс `.field__help` — popup с треугольничком, появляется снизу на `:hover` или `:focus-within`
- Словарь `HELP` в JS — 70+ записей с описаниями в одно-два предложения: **что это, зачем, что ставить**
- Функция `applyHelp()` пробегает по `.field`, ищет input/select/segmented/etc внутри, вставляет tooltip
- Покрытие: General, Account, AI, Indexing, Audio, Capture, Notifications, Privacy, Updates, Advanced + все segmented-группы

Пример:
> `fModelFast` = "Lightweight model used for quick hints (naming entities, recognizing dialog turns, short rephrasing). Should be cheap and fast — usually a mini-class model."

---

## 2. Ключевые продуктовые решения, принятые в чате

| Тема | Решение | Источник |
|------|---------|----------|
| **Режим AI** | При Subscription пользователь **не выбирает модель** — Куистан сам подбирает. Только в BYOK появляются Fast и Heavy pickers | прямое указание в чате |
| **Fast / Heavy модели** | Два отдельных селектора в BYOK (а не один Primary). Каждое плавающее окно выбирает между ними в своих настройках | уточнение в чате |
| **Voice Activation** | Целая категория удалена — «у нас нет такой темы активации голоса» | прямое указание |
| **Capture trigger** | Никаких интервалов и авто-триггеров — только ручной режим (кнопка или Ctrl+Shift+S) | прямое указание |
| **TTS / playback device** | Убран — Куистан не озвучивает ответы голосом | инициатива по логике продукта |
| **Update channels (Stable/Beta/Nightly)** | Удалён — слишком много выбора | инициатива по запросу |
| **Timezone** | Удалён — берётся из Windows | прямое указание |
| **Sidebar header** | «Categories 10 шт.» убран — лишнее | прямое указание |
| **Encoding (em-dash, bullets)** | Заменены на ASCII, чтобы не было � на любых системах | сообщение об ошибке отображения |
| **Per-theme текстуры** | Каждой теме — свой PNG (`bg-{theme}.png`); пользователь добавит файлы сам | ответ на вопрос про прозрачность |

---

## 3. Архитектурные решения

### 3.1. Лейаут — только flex, никакого CSS Grid

Первая версия использовала `display: grid` для `.layout` (sidebar 244px + 1fr main). Это дало проблему: `.kv` с `grid-template-columns: minmax(120px, max-content) 1fr` раздувал main-ячейку (по умолчанию `min-width: auto` у grid-айтемов), и длинные пути вроде `C:\Program Files\Quistan\models\...` наезжали на sidebar и обрезались справа.

**Финальный лейаут:**
```
body (flex column)
├─ .topbar (flex-shrink: 0)
└─ .body (flex row)
 ├─ .sidebar (width: 244px; flex-shrink: 0)
   └─ .main (flex: 1; min-width: 0; overflow-x: hidden)
     └─ .tab-content (max-width: 760px; margin: 0 auto)
```

### 3.2. kv-таблица — flex, не grid

```html
<dl class="kv">
  <div class="kv-row">
    <dt>Model</dt>
    <dd>bge-small-en-v1.5 · bundled</dd>
  </div>
  ...
</dl>
```

```css
.kv { display: flex; flex-direction: column; gap: 8px; ... }
.kv-row { display: flex; gap: 12px; min-width: 0; }
.kv dt { flex-shrink: 0; min-width: 100px; ... }
.kv dd { flex: 1; min-width: 0; overflow-wrap: anywhere; }
```

`min-width: 0` + `overflow-wrap: anywhere` гарантируют, что длинные значения переносятся, а не раздувают строку.

### 3.3. Persisted state

`localStorage` ключ `quistan.settings.v2`. Каждое изменение выставляет «unsaved» (topbar pill). Кнопка Save пишет в storage. Reset → возврат к DEFAULTS. Factory Reset → чистит storage + dialog history (опционально через тумблер).

### 3.4. JS-архитектура

- `CATEGORIES` — массив категорий для рендера сайдбара и табов
- `DEFAULTS` — дефолтные значения для всех полей (одна большая плоская map)
- `THEMES` — палитры тем (для swatch-превью)
- `HELP` — словарь описаний для тултипов
- `paintSegSingle(id, key)` / `paintSegMulti(id, key)` — рендер и обработка segmented controls
- `paintSegMode()` — переключатель Subscription ↔ BYOK + перерисовка связанных секций
- `applyModeVisibility()` — показать/скрыть `aiManagedSection` / `aiByokSection` / usage-блоки
- `applyTheme()` — переключение `body.theme-*` класса
- `applyHelp()` — инжекция тултипов в каждое `.field`
- `bindHotkeys()` — inline-запись хоткеев (Ctrl/Shift/Alt/Meta + key, Esc = clear)
- `startMeters()` — анимированные VU-метры (демо, без реального WASAPI)
- `load()` / `save()` / `saveAll()` / `resetAll()` / `factoryReset()` — persistence

---

## 4. Что НЕ сделано (вне scope этого чата)

- **Per-theme PNG-файлы** — ждут от пользователя. Пока работает только `1-obsidian.png` для темы Obsidian; остальные темы получат тот же Obsidian-фон пока файлы не добавлены.
- **Реальная WASAPI-интеграция** — VU-метры и device picker это заглушки (`pickDevice()` → toast «backend integration Phase 6»).
- **Реальный SQL** — все кнопки DB (`dbVacuum`, `dbBackup` и т.д.) → toast. Реальные SQL-операции в Phase 6.
- **Real hotkey capture** — `bindHotkeys()` ловит клавиши и пишет в state, но не регистрирует глобальный хоткей в ОС.
- **Подписи файлов тем** — есть только `bg-{theme}.png` URL; пользователь сам положит PNG с подходящей текстурой.

---

## 5. Файлы и точки расширения

| Что | Где | Зачем менять |
|-----|-----|--------------|
| Список категорий | `CATEGORIES` массив в JS (~строка 2119) | Добавить новую вкладку: добавить объект сюда + добавить `<section class="tab-content" data-tab="...">` в HTML |
| Дефолтные значения | `DEFAULTS` объект в JS | Начальные значения полей |
| Темы | `THEMES` массив + `body.theme-*` CSS | Новые темы: добавить объект и body-класс с CSS-переменными |
| Текстуры | `bg-{theme}.png` рядом с HTML | Пользователь кладёт PNG/WebP сам |
| Описания настроек | `HELP` словарь в JS (~строка 2222) | Добавить/изменить текст тултипа |
| Backend-стабы | функции внизу JS (`signIn`, `dbVacuum`, и т.д.) | Заменить `toast(...)` на реальные вызовы в Phase 6 |

---

## 6. Известные баги / шероховатости

- **Нет `Куистан» в UI** — брендинг «Куистант» присутствует только в `00_README.md` и AGENTS.md, в самом Settings нет упоминания бренда (кроме `QUISTAN · v0.1.4-beta` в topbar sub-label).
- **Theme picker не имеет per-theme PNG preview** — swatches показывают 3 hex-цвета, а не саму текстуру. Можно улучшить, если будет запрос.
- **`fTrigger: 'replies'` в DEFAULTS** — был, но после упрощения Capture поле удалено из UI; значение осталось «висящим» в state. Не влияет на работу, но можно удалить при следующем рефакторе.
- **Тест-метры в Audio** — `meter-row` рендерит 24 бара с рандомной анимацией (для демо). В реальности нужно подключиться к WASAPI peak levels.
- **Inline-editing hotkeys** — работают в окне настроек (фокус → нажатие → запись), но в Windows глобально не регистрируются. Для production — отдельный backend-вызов типа `registerGlobalHotkey(combo, callback)`.
- **Дропдаун `fLang`** — содержит экзотические языки (中文, Japanese, Français, etc.). Не все имеют переводы UI; пока они просто переключают locale-флаг, но контент английский. Переводы контента — отдельная задача.

---

## 7. Контрольный список для следующего раза

- [ ] Положить PNG-файлы `bg-midnight.png`, `bg-forest.png`, `bg-ember.png`, `bg-paper.png`, `bg-carbon.png` в `UI/`
- [ ] Проверить в живом браузере, что ховеры на полях показывают тултипы корректно и не вылезают за края `.main`
- [ ] Если будет нужно — добавить HELP для fields, у которых его сейчас нет (например, новые segmented-группы)
- [ ] При включении backend (Phase 6) — заменить все toast-стабы на реальные вызовы
