# Kilo: команды, скиллы и кастомные агенты

> Шпаргалка для нового агента (или новой сессии) в этом проекте.
> Не нужно лезть в сорсы Kilo — здесь всё, что нужно, чтобы создать и зарегистрировать свои команды, скиллы и субагентов.

---

## 1. ГДЕ ЧТО ЛЕЖИТ В ПРОЕКТЕ

```
<project-root>/
├── .kilo/
│   ├── kilo.jsonc         ← общая конфигурация Kilo (commit_message, skills.paths и т.п.)
│   ├── AGENTS.md          ← проектные правила (auto-нейминг сессии и т.п.)
│   ├── commands/          ← slash-команды (в стиле /submit-pr)
│   │   └── session-slice.md
│   ├── agent/             ← кастомные субагенты (mode + system prompt)
│   │   └── *.md
│   └── skills/            ← проектные скиллы (папки со SKILL.md)
│       └── my-skill/SKILL.md
└── AGENTS.md              ← дополнительный проектный контекст (на уровне cwd)
```

Глобальные настройки пользователя — в `~/.config/kilo/` (Windows: `C:\Users\<user>\.config\kilo\`, *nix: `~/.config/kilo/`). Там же лежат глобальные `commands/`, `skills/`, `rules/`, `bin/`, `kilo.jsonc`.

---

## 2. КОМАНДЫ (slash-commands / workflows)

**Что это.** Команда — это файл `.md`, который вызывается через `/<имя-файла-без-.md>` в чате. Kilo подставляет содержимое файла в system-prompt и дальше работает как обычно.

**Где создавать.**
- Проектные (только в этом проекте): `.kilo/commands/<name>.md`
- Глобальные (везде): `~/.config/kilo/commands/<name>.md`
- Старый путь `.kilocode/workflows/` автоматически мигрируется в `commands/` при старте.

**Минимальный формат.**

```markdown
# commands/foo.md

Делай foo. Шаги: 1) ... 2) ... 3) ...
```

Этого достаточно — имя файла `foo.md` = команда `/foo`.

**С frontmatter (рекомендуется).**

```markdown
---
description: Краткое описание для command-picker
agent: code              # какой агент (mode) использовать
model: anthropic/claude-3-5-sonnet   # опционально
variant: high            # опционально, если модель поддерживает
subtask: false           # true → запустить как под-сессию
---

# Body

Инструкции агенту. Можно писать в свободной форме: шаги, чек-листы,
промпты, ссылки на документы. Внутри доступны все tools (`read`,
`glob`, `grep`, `edit`, `write`, `bash`, `webfetch`, MCP).
```

**Пример в этом проекте:** `.kilo/commands/session-slice.md` — 5 строк,
просит загрузить одноимённый скилл и выполнить его инструкции.

**Горячая перезагрузка:** новые/изменённые команды подхватываются на старте
новой сессии или по `/reload`.

**Снапшоты:** если у тебя команда лежит **вне** проекта (симлинк-папка),
нужно явно разрешить её в `~/.config/kilo/kilo.jsonc`:

```jsonc
{
  "permission": {
    "markdown_source": {
      "/path/to/shared/commands/*": "allow"
    }
  }
}
```

**Чего не умеет.** Внешние (не из trusted-локации) команды блокируют
`{env:...}` подстановки и ограничивают `{file:...}` пределами проекта.

---

## 3. СКИЛЛЫ (skills)

**Что это.** Скилл = папка с `SKILL.md` (YAML frontmatter + инструкции).
Скилл **пассивен**: он не вызывается явно. Агент сам решает подгрузить
его, когда описание задачи матчит `description` скилла. Дальше —
выполняет инструкции.

**Отличие от команды.** Команда = явное действие пользователя («/foo»).
Скилл = знание, которое агент применяет по контексту. Если хочешь
**«когда пользователь просит X, сделай Y»** — это скилл.

**Где создавать.**
- Проектные: `.kilo/skills/<skill-name>/SKILL.md`
- Глобальные: `~/.config/kilo/skills/<skill-name>/SKILL.md`
- Совместимость: `.agents/skills/...` и `.claude/skills/...` тоже
  подхватываются (см. priority ниже).

**Структура папки скилла.**

```
my-skill/
├── SKILL.md           # обязателен
├── scripts/           # опционально: исполняемый код (вызывай из bash)
├── references/        # опционально: документация, на которую ссылаешься
└── assets/            # опционально: шаблоны, картинки
```

**Формат `SKILL.md` (по [Agent Skills spec](https://agentskills.io/specification)).**

```markdown
---
name: my-skill-name
description: Что скилл делает и КОГДА его применять (≤1024 символа). Агент матчит именно по этой строке.
# опционально:
license: Apache-2.0
compatibility: "Works on Windows + PowerShell"
metadata:
  author: you
  version: 1.0.0
---

# Тело инструкций

Шаги, которые агент должен выполнить, когда скилл загружен.
Можно использовать tools (`bash`, `read`...), markdown-разметку,
ссылки на `references/*.md` (агент прочитает их по запросу).
```

**Правила именования.**
- `name` ≤ 64 символа, lowercase, цифры, дефисы.
- **В Kilo имя должно совпадать с именем папки** (`frontend-design/SKILL.md` → `name: frontend-design`).
- **Самое важное поле — `description`.** Именно по нему LLM решает,
  применять ли скилл. Перечисли в нём типичные формулировки
  пользователя: «срез сессии», «итоги», «session summary», и т.п.
  Vague descriptions → uncertain matching.

**Как агент находит и грузит скилл.**

1. На старте сессии Kilo сканирует все скилл-папки и читает **только метаданные** (name, description, path).
2. Эти метаданные кладутся в system-prompt как список доступных скиллов.
3. Когда задача пользователя матчит `description` — агент вызывает
   tool `skill` с именем скилла, **читает полный `SKILL.md`** и
   выполняет инструкции.
4. Чтобы заставить агента взять скилл гарантированно — упомяни имя
   явно в запросе: «используй скилл `session-slice`».

**Приоритет** (если имена пересекаются):

```
проектный .kilo/skills/   >   глобальный ~/.kilo/skills/
                            >   .claude/skills/, .agents/skills/
                            >   skills.paths и skills.urls из конфига
```

**Дополнительные пути и remote URL.** В `kilo.jsonc`:

```jsonc
{
  "skills": {
    "paths": ["/abs/path", "~/my-skills", "relative/skills"],
    "urls":  ["https://example.com/.well-known/skills/"]
  }
}
```

Для remote-источника сервер должен отдавать `index.json`:

```json
{
  "skills": [
    {"name": "skill-x", "version": "2", "files": ["SKILL.md", "references/x.md"]}
  ]
}
```

Файлы качаются из `{url}/{skill-name}/{file}`. При изменении содержимого
поднимай `version` — иначе Kilo закэширует.

**Shell-команды в `SKILL.md`.** Скилл может встраивать `!`command`` —
Kilo выполнит её **до того**, как тело скилла попадёт в модель, и
подставит stdout вместо плейсхолдера. Команды **выполняются только
из trusted-локаций** (глобальные `~/.kilo/skills/`, `~/.agents/skills/`,
`~/.claude/skills/`, builtin, абсолютные пути из глобального конфига).
Из проектных `.kilo/skills/` и remote-URL — команды **не выполняются**,
вместо плейсхолдера вставляется маркер «untrusted».

Перед запуском Kilo показывает один общий prompt со списком всех команд
в скилле. Approve → выполнятся все. Reject → скилл не загрузится.

Полностью отключить встраиваемые команды: env-переменная
`KILO_DISABLE_SKILL_SHELL=1`.

**Примеры в этом проекте:**
- `~/.config/kilo/skills/session-title/SKILL.md` — узкий скилл-обходной
  путь для Kilo-регрессии авто-нейминга сессий (3-6 слов на первой реплике).
- `~/.config/kilo/skills/session-slice/SKILL.md` — скилл, который по
  запросу «срез / итоги / TL;DR» читает текущую сессию из SQLite
  (`~/.local/share/kilo/kilo.db`) и выдаёт структурированный отчёт.

---

## 4. КАСТОМНЫЕ СУБАГЕНТЫ (custom agents / modes)

**Что это.** Агент = режим работы Kilo с собственным system-prompt,
набором tools и ограничениями. Используется, когда хочется выделить
отдельную «роль»: code-reviewer, doc-writer, test-runner.

**Где создавать.**
- Проектные: `.kilo/agent/<name>.md`
- Глобальные: `~/.config/kilo/agent/<name>.md`

**Минимальный формат.**

```markdown
---
name: code-reviewer
description: Режим для код-ревью PR. Только read + grep, ничего не редактирует.
mode: primary         # primary | subagent
model: anthropic/claude-3-5-sonnet
variant: high
permissions:
  edit:   ["never"]            # или ["file/*.md"] для ограничения
  bash:   ["git diff", "git log"]
  webfetch: ["always"]
tools:
  - read
  - grep
  - glob
  - bash
---

# System prompt этого режима

Ты — строгий ревьюер. Ищи баги, проблемы с производительностью,
нарушения конвенций проекта. Никогда не редактируй код — только
комментируй.
```

**Поля frontmatter (по докам):**
- `name` — уникальный ID режима.
- `description` — для command-picker / picker'а режимов.
- `mode` — `primary` (полноценный режим) или `subagent` (вызывается из других).
- `model` / `variant` — переопределение модели для режима.
- `permissions` — массивы для `edit`, `bash`, `webfetch`, `read`, и т.п.
- `tools` — список разрешённых tools (whitelist).

**Когда использовать.** Когда команда — это «один раз зашёл → сделал
Y», а скилл — «когда контекст подходит, примени X», то агент — это
«я хочу отдельный sandbox со своими правилами и tools».

---

## 5. ЧЕК-ЛИСТ «ХОЧУ ДОБАВИТЬ X»

**Хочу добавить slash-команду `/foo`.**
1. Создай `.kilo/commands/foo.md`.
2. Внутри — frontmatter с `description` + свободная инструкция.
3. Перезапусти сессию (или `/reload`).
4. В чате набери `/foo`.

**Хочу, чтобы агент сам применял мою экспертизу.**
1. Создай `.kilo/skills/<name>/SKILL.md`.
2. Заполни `name`, главное — `description` (формулировки пользователя).
3. Перезапусти сессию.
4. Попроси агента «используй скилл `<name>`» или просто сформулируй задачу так, чтобы она попала в `description`.

**Хочу отдельный режим для типа задач.**
1. Создай `.kilo/agent/<name>.md`.
2. Frontmatter с `name`, `description`, `mode`, `tools`, `permissions`.
3. Ниже — system-prompt этого режима.
4. Перезапусти — режим появится в пикере режимов (если `mode: primary`)
   или будет доступен для делегирования (если `mode: subagent`).

**Хочу, чтобы мои настройки шарились между проектами.**
- Кладешь в `~/.config/kilo/...` — будут видны везде.
- Проект-локальные правила — в `.kilo/` (коммитится в репо, шарятся
  между разработчиками).

---

## 6. ОТЛАДКА: «скилл/команда не подхватывается»

1. Файл лежит ровно в нужной папке? (`commands/foo.md`, а не `commands/foo` без расширения).
2. Frontmatter: есть `name` (для скилла) и/или `description`?
3. Для скилла — `name` совпадает с именем папки?
4. `/reload` или новая сессия — файлы сканируются на старте.
5. Спросить агента напрямую: «какие скиллы у тебя загружены?» / «доступен ли скилл X?».
6. В логах сессии искать tool-call `skill` — если он есть, скилл подгружался.

**Тайминги перезагрузки** в VS Code-экстеншене: при переподключении к
CLI-серверу; в CLI — при старте `kilo run`. Изменения в `kilo.jsonc`
требуют полного перезапуска.

---

## 7. ГДЕ ЧИТАТЬ ДОКУ ОФИЦИАЛЬНО

- Skills: <https://kilo.ai/docs/customize/skills>
- Workflows (команды): <https://kilo.ai/docs/customize/workflows>
- Custom Modes (агенты): <https://kilo.ai/docs/customize/custom-modes>
- Custom Rules: <https://kilo.ai/docs/customize/custom-rules>
- Agent Skills spec: <https://agentskills.io/specification>
- Marketplace: <https://github.com/Kilo-Org/kilo-marketplace>

Этот документ — локальная шпаргалка. Если доки обновятся, проверь
поля frontmatter и locations.