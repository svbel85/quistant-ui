# 📝 ИЗМЕНЕНИЯ В ПРОЕКТЕ vs ROADMAP v2

> **Откуда взят анализ:**
> - `themes/1-Obsidian/obsidian_design_dark.html` (актуальная тема)
> - `UI/*.html` (6 файлов: `control_panel`, `chat_minimal`, `floating_window`, `floating_windows_settings`, `kb_picker`, `settings`)
> - 19 прошлых сессий Kilo в этом проекте (`kilo_local_recall`)
> - Стартовые документы: `00_README.md`, `03_branding.md`, `04_design_system.md`, `13_product_features.md`
>
> **Зачем:** переписать roadmap так, чтобы он соответствовал тому, что уже построено и утверждено в UI-прототипах.

---

## 1. ГЛАВНОЕ — что вообще произошло

Roadmap v2 (`00_README.md`) — это **стратегический план на ещё не существующий продукт**: Flet+Python desktop, SQLite, Figma, Cryptomus, 9 фаз.

В реальности сделано **иначе**: продукт строится **не с десктопа, а с UI-прототипов на HTML+CSS+JS** (6 экранов в `UI/`), и эти прототипы уже несколько раз переделывались. Дизайн-система `04_design_system.md` использовалась как **референс**, но финальные цвета/шрифты/компоненты уехали далеко от неё.

Поэтому roadmap для следующих шагов нужно переписывать вокруг фактического **UI-first процесса** и **Obsidian-темы**, а не вокруг старого «сначала Figma → потом Flet».

---

## 2. ЧТО УТВЕРЖДЕНО (оставить как есть)

### 2.1. Имя и позиционирование
- ✅ **«Quistan»** (англ. транслит, везде в коде и UI), не «Куистант». Слоган про «суфлёр для созвонов» жив в `chat_minimal.html`. → **В дорожной карте оставить двойной нейминг как был, но в коде и UI уже всё на `Quistan`.**

### 2.2. Режимы работы
- ✅ **Live** (микрофон + системный звук), **Solo** (только системный), **Keyboard** (только клавиатура) — три режима как в `13_product_features.md` п.13–14. В UI это переменные `--live`/`--solo`/`--kb` + индикаторы.
- ✅ **Маркер «Speaker»** для собеседника (см. `chat_minimal.html` строки 1876–1933): ты = `user` (аватар с цветом `--live`), собеседник = `Speaker` (аватар с цветом `--kb`). **Roadmap говорил `other`/`client` — фактический UI переименовал в `Speaker`** и привязал цвет аватара к цвету собеседника (а у пользователя цвет аватара = цвет в подвале).

### 2.3. Плавающие окна — 4 пресета, не 3
В `floating_windows_settings.html` `DEFAULTS` (строки 879–908) зашиты **4 пресета**:

| # | Имя              | Размер | Позиция | Модель | KB                                  |
|---|------------------|--------|---------|--------|-------------------------------------|
| 1 | Coding Helper    | M      | top-R   | heavy  | System-Design-Primer, HighScalability |
| 2 | Behavioral Coach | S      | bot-L   | fast   | Behavioral Bank                     |
| 3 | Salary Negotiator| S      | bot-R   | fast   | Salary Notes                        |
| 4 | Lecture Notes    | M      | center  | fast   | MIT 6.006, 3Blue1Brown transcripts  |

Lecture Notes — это **вторая ЦА из п.13/14 roadmap'а**, и она сразу попала в дефолты → **roadmap п.13 («ассистент без собеседника») подтверждён**.

### 2.4. Freeze → переименовано и расширено
В roadmap п.6 это «freeze» (не реагировать на клики). В `floating_windows_settings.html`:
- есть `fPin` — *«Pin window on top of others (always-on-top)»* (всегда поверх),
- есть `enabled`-toggle в сайдбаре (вкл/выкл целиком),
- «Freeze» из roadmap **отсутствует** как отдельная фича → либо переименована в `enabled`, либо будет возвращена позже.

### 2.5. Контекст окна — R (replies), N (chunks), W (words)
В UI окна настраиваются **три ползунка** (строки 731–767):
- **R** = replies — сколько последних реплик чата тянуть в анализ,
- **C** (бывший N) = chunks — сколько чанков из KB подмешивать,
- **W** = words — макс. длина подсказки.

Roadmap п.6 говорил только про `context_size` (= N реплик) и freeze. **UI развил это в три ползунка — это надо зафиксировать в roadmap как утверждённое.**

### 2.6. Markdown-RAG: kb_picker → **ПЕРЕДЕЛЫВАЕТСЯ (решение 01.09)**
`UI/kb_picker.html` — popup-окно выбора «баз знаний» как **объединений** (тэги, «Enable all», мульти-выбор, postMessage родителю). Подтверждал roadmap п.12 как он есть.

**Решение 01.09 (вне roadmap):** вместо модели «база знаний = объединение из нескольких источников» — база знаний = **ровно один из трёх типов источника**:
1. **Файл** (один `.md`, `.txt`, `.pdf`)
2. **Папка** (директория с файлами, рекурсивно)
3. **Ссылка** (URL — подкаст-транскрипт, веб-статья, YouTube-расшифровка)

→ в `kb_picker.html` и `floating_windows_settings.html` тэговая мульти-выборная модель будет убрана. Окно будет хранить массив **отдельных KB-юнитов**, каждый со своим `type ∈ {file, folder, link}`. См. п.9 в «Рекомендациях».

### 2.7. Hotkeys на каждое окно
Каждое плавающее окно имеет свой `fHotkey` (Ctrl+Shift+1..4 по дефолту). В UI это `<input readonly>` с перехватом `keydown`. Roadmap это не выделял — **новая утверждённая фича**.

### 2.8. Settings — 11 вкладок, sidebar-навигация
`UI/settings.html` (~113 KB, 11 вкладок, 160+ полей):
**General · Account · AI & Models · Audio · Capture · Voice Activation · Shortcuts · Notifications · Privacy · Updates · Advanced**

Roadmap п.2 «Плавающие окна (конструктор виджетов)» вынесено в **отдельное окно** `floating_windows_settings.html`, а не в `Settings`. Это утверждённое разделение.

---

## 3. ОТ ЧЕГО ОТКАЗАЛИСЬ (по сравнению с roadmap)

### 3.1. Цветовая палитра — **полностью переписана**

Roadmap `04_design_system.md` п.2:
```
background_primary:   "#0A0E1A"   (тёмно-синий)
accent_primary:       "#00D9FF"   (cyan)
accent_secondary:     "#39FF14"   (electric green)
mode_live:            "#FF6B6B"   (красноватый)
mode_solo:            "#9D4EDD"   (фиолетовый)
mode_keyboard:        "#06D6A0"   (бирюзовый)
```

Фактическая тема `themes/1-Obsidian/obsidian_design_dark.html`:
```
--bg:          #0A0A10   (глубокий обсидиан)
--bg-1:        #111119
--bg-2:        #1B1B25
--bg-3:        #25252F
--text:        #A8A8B5   (cool gray, не белый)
--accent:      #54548F   (HSL 245,32%,45% — DEEP violet, не candy)
--accent-2:    #6868A2
--live:        #6E9C5E   (приглушённый зелёный)
--solo:        #7E73AA   (фиолет)
--kb:          #669AB2   (cyan)
--warn:        #B89A6A   (амбер)
--danger:      #A86E68   (коралл)
```
+ **glass-поверхности** (`--surface: rgba(255,255,255,.025)` и т.д.) — «вулканическое стекло» сливается с фоном, проявляется на hover.

**Решение:** вся палитра дорожной карты **отменена**, кроме принципа dark-mode. Базовая нота HSL=248°, акцент — deep violet. Live/solo/keyboard цвета переименованы и сдвинуты в сторону приглушённых, не неон.

### 3.2. Шрифты — отказ от JetBrains Mono
Roadmap: `ui_main: Inter`, `ui_code: JetBrains Mono`.
Фактически: **`Inter` + `Geist Mono`** (см. `<link>` во всех HTML).
JetBrains Mono убран, **Geist Mono** (vercel-шрифт) — для ID, метаданных, hotkey-полей, верхнего регистра заголовков.

### 3.3. Стек — HTML+CSS+JS прототипы вместо Flet
Roadmap п.5 «Разработка desktop» предполагал **Flet (Python)** как UI-фреймворк.
Фактически все экраны — это **самодостаточные HTML-файлы с inline CSS и vanilla JS**. Логика пресетов плавающих окон уже работает через `localStorage` (`quistant.floatingWindows.v6`).

**Что это значит:** либо HTML-прототипы останутся как «demo/build target» (рендер через Electron/Tauri/WebView2), либо их потом перепишут под Flet. **Roadmap должен явно зафиксировать выбор стека**, иначе фаза 2 развалится.

### 3.4. «Пре-собранные» слайсы — отменены ещё в roadmap v3
Roadmap v3 (п.6) уже убрал слайсы в пользу **перемотки реплик**. UI это подтверждает:
- в `chat_minimal.html` лента реплик линейная (без группировки по слайсам),
- в `floating_windows_settings.html` есть ползунок `R` (replies), но **нет UI-элемента «новый слайс»**.

✅ Roadmap тут совпадает с UI. Просто отметить как согласованное.

### 3.5. Убраны каналы обновлений (Stable/Beta/Nightly)
В сессии `Setinggs` (от 19:45) ты явно сказал: **«убираю выбор канала обновлений»**. В `settings.html` вкладка Updates осталась, но только auto-download / install-on-quit / pre-releases тумблеры. → **Roadmap про каналы обновлений — отменить.**

### 3.6. Перепланирование модели доступа: Subscription ↔ BYOK
Roadmap `13_product_features.md` п.15 «BYOK» позиционировался как **отдельный тариф** «Your Key» (500 ₽/мес за оболочку + свой ключ).

Фактически в `settings.html` (см. сессию Setinggs) реализована **схема переключателя `segMode`**: `subscription` / `byok` внутри вкладки Account — это **один и тот же аккаунт с двумя режимами**, а не два разных тарифа. В режиме BYOK выбор модели **недоступен** (всё идёт через свой ключ).

→ **Roadmap должен переписать п.15**: не «тариф Your Key», а «режим BYOK в любом тарифе».

### 3.7. Нет тарифной сетки в UI
Roadmap п.10 «Тарифы» — 5 тарифов от Test-Craster до Hustler PRO + Your Key. В `settings.html` они НЕ показаны — есть только usage-бары и кнопка «Manage subscription». → **Тарифную сетку оставить только в `09_legal_finance.md` / личном кабинете, в desktop UI её не будет.**

---

## 4. ЧТО НЕ НАЧАТО (из must-have roadmap'а)

| # | Фича roadmap | Статус | Где живёт |
|---|---------------|--------|-----------|
| 1 | Pre-flight (запуск созвона за 30 сек) | ❌ нет | — |
| 3 | Захват аудио (микрофон + системный) | ❌ нет | — |
| 4 | Транскрипция Whisper | ❌ нет | — |
| 5 | Определение спикеров | ⚠️ частично | `chat_minimal.html` визуально различает user/Speaker, но бэкенда нет |
| 7 | Скриншоты по рамке (Ctrl+Shift+S) | ❌ нет | — |
| 8 | WDA-скрытность | ❌ нет | — |
| 9 | Device Flow авторизация | ❌ нет | — |
| 10 | Cryptomus оплата | ❌ нет | — |
| 17 | Голосовая активация «Эй, Quistan» | ⚠️ UI вкладка есть | `settings.html` → Voice Activation |

То есть **сделан только UI-каркас и дизайн-система**. Бэкенд, аудио, скриншоты, оплата — всё ещё в roadmap'е.

---

## 5. ДОБАВЛЕНО СВЕРХ ROADMAP (новые фичи, которых не было)

1. **`kb_picker.html`** — popup-окно выбора KB с тэгами, массовым enable, postMessage-связью с родителем. Не выделено в roadmap как отдельный экран.
2. **Per-window hotkey** — каждое плавающее окно имеет свой шорткат (Ctrl+Shift+1..N). В roadmap про горячие клавиши только «Ctrl+Shift+S для скриншота».
3. **`Ask`-режим** — переключатель «Show prompt input at the bottom of window» (строка 821–825). Не было в roadmap.
4. **Window size presets (S/M/L/XL)** + Default position (5 точек) — в roadmap был только общий «frameless», без пресетов размеров.
5. **`Web-search` per-window тумблер** (строка 724–728) — каждое окно может включать/выключать поиск независимо.
6. **Sidebar в окне настроек плавающих окон** (список окон слева) — не было в roadmap.
7. **Geist Mono шрифт** (вместо JetBrains Mono).
8. **Glass-surface паттерн** (`rgba(255,255,255,.025)`) — принципиально отличается от плоских `background_secondary` в roadmap'е.

---

## 6. РЕКОМЕНДАЦИИ ДЛЯ ПЕРЕПИСАННОГО ROADMAP

1. **Переименовать стек:** Фаза 2 теперь — «UI-прототипы на HTML+CSS+JS» (уже сделано), затем «выбор runtime: Electron / Tauri / WebView2 / Flet» — решение до Фазы 6.
2. **Заменить палитру** в `04_design_system.md` на Obsidian-палитру из `themes/1-Obsidian/obsidian_design_dark.html`.
3. **Шрифты:** Inter + **Geist Mono** (не JetBrains Mono).
4. **BYOK** — отдельным разделом, не отдельным тарифом. Переключатель Subscription ↔ BYOK в настройках Account, модель заблокирована в BYOK.
5. **Каналы обновлений** — убрать из roadmap.
6. **Плавающее окно:** 4 пресета (включая Lecture Notes), три ползунка R/N/W, freeze переименовать в `enabled`, добавить hotkey/window-size/position/web-search/prompt-input.
7. **Спикеры:** user + Speaker (не user + other/client), цвет аватара user = цвет в подвале.
8. **Режимы:** live/solo/keyboard — цвета приглушённые (зелёный/фиолет/cyan), не неон.
9. **kb_picker** — отдельный экран в дизайн-системе. **Переделать под модель «1 юнит = 1 файл / 1 папка / 1 ссылка»** (без объединений, без мульти-выбора).
10. **Settings** — sidebar с 11 категориями, **English UI** (согласовано в финальной версии `settings.html`).
11. **Тарифы:** в desktop UI не показывать, только в личном кабинете.
12. **Крипта-оплата, аудио, скриншоты, WDA, Device Flow** — остаются must-have roadmap, но теперь чётко «ещё не начато».

---

## 7. КАРТА СОЗДАННЫХ ФАЙЛОВ

| Файл | Назначение | Размер |
|------|------------|--------|
| `themes/1-Obsidian/obsidian_design_dark.html` | Канон дизайн-системы (HSL 248°) | 1364 строк |
| `themes/1-Obsidian/1-obsidian.png` | Фон-текстура обсидиана | фон |
| `UI/control_panel.html` | Демо control panel | 1108 строк |
| `UI/chat_minimal.html` | Главное окно чата (лента реплик, user+Speaker) | самый большой |
| `UI/floating_window.html` | Само плавающее окно (frameless) | 36 KB |
| `UI/floating_windows_settings.html` | Конструктор окон: sidebar + форма, 4 пресета, localStorage v6 | 1216 строк |
| `UI/kb_picker.html` | Popup-выбор баз знаний | 51 KB |
| `UI/settings.html` | Полные настройки, 11 вкладок, sidebar | 118 KB |
| `UI/1-obsidian.png` | Копия фона для UI-страниц | фон |

Все UI-файлы используют **одну и ту же CSS-секцию** (палитра Obsidian + glass-поверхности) — фактически уже single-source-of-truth, нужно только вынести в общий `obsidian.css`.

---

## 8. ХРОНОЛОГИЯ КЛЮЧЕВЫХ РЕШЕНИЙ

| Дата       | Решение | Откуда |
|------------|---------|--------|
| 27.08      | Выбран HSL-anchor 240°/248° (Obsidian dark) | сессия «Главное окно 1» |
| 27.08      | Утверждены 4 пресета плавающих окон (включая Lecture Notes) | `floating_windows_settings.html` DEFAULTS |
| 27.08      | Собеседник = **Speaker** (не other/client), аватар привязан к цвету | сессия «New session - 2026-08-27T20:17» |
| 28.08      | Glass-поверхности вместо плоских карточек | `obsidian_design_dark.html` |
| 01.09      | Settings полностью на английском, 11 вкладок, sidebar | сессия «Setinggs» |
| 01.09      | Убраны каналы обновлений | сессия «Setinggs» |
| 01.09      | Subscription ↔ BYOK как переключатель | сессия «Setinggs» |
| 01.09      | Floating Windows: 3 секции → **5 вкладок** (Identity, Behavior, Sources, Window, Shortcuts) | сессия «New session - 2026-09-01T15:15» |

---

**Итог:** roadmap v2 **стратегически правильный** (те же фичи, те же ЦА), но **тактически полностью расходится** с тем, что уже построено в UI-прототипах. Переписывать нужно цвета, шрифты, стек, модель BYOK, набор плавающих окон, и список экранов дизайн-системы (добавить `kb_picker`, явно выделить `floating_windows_settings`).
