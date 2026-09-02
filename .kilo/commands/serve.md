---
description: Start Quistant UI dev server
---

Launch the Quistant UI dev server in a background process.

Command: `python D:\Projekts\Quistant\Quistant_UI\serve.py`

The script:
- Serves the UI/ directory on http://localhost:8080/UI/index.html
- Auto-picks next free port if 8080 is taken
- Opens the browser automatically when ready
- Stops with Ctrl+C in its terminal

If a server is already running on the port, do not start a second one — just report the existing URL.
