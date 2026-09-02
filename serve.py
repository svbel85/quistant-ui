"""Локальный dev-сервер для UI/.

Запуск:
    python serve.py            # порт 8080 по умолчанию
    python serve.py 5500       # свой порт

Откроет браузер на http://localhost:PORT/UI/index.html
Остановить: Ctrl+C
"""

import http.server
import os
import socket
import socketserver
import sys
import threading
import webbrowser
from functools import partial
from pathlib import Path


ROOT = Path(__file__).resolve().parent
UI_DIR = ROOT / "UI"
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, fmt, *args):
        sys.stderr.write(f"[serve] {self.address_string()} - {fmt % args}\n")

    def end_headers(self):
        # снимаем ограничение CORS для fetch() из локальных partials/data
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


def find_free_port(preferred: int) -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(("", preferred))
            return preferred
        except OSError:
            pass
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("", 0))
        return s.getsockname()[1]


def open_browser_when_ready(url: str, httpd):
    """Ждёт, пока сервер реально слушает порт, и только тогда открывает браузер."""
    deadline = None
    while True:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.connect(("127.0.0.1", httpd.server_address[1]))
                break
            except OSError:
                pass
        if deadline is None:
            import time
            deadline = time.time() + 5
        import time
        if time.time() > deadline:
            print(f"[serve] браузер не открыл — не дождался {url}", file=sys.stderr)
            return
        time.sleep(0.05)
    print(f"[serve] открываю {url}")
    webbrowser.open(url)


def main():
    port = find_free_port(PORT)
    if port != PORT:
        print(f"[serve] порт {PORT} занят, использую {port}")

    target = UI_DIR / "index.html"
    if not target.exists():
        print(f"[serve] не найден {target}", file=sys.stderr)
        sys.exit(1)

    url = f"http://localhost:{port}/UI/index.html"

    socketserver.ThreadingTCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("127.0.0.1", port), Handler) as httpd:
        print(f"[serve] Quistant UI готов: {url}")
        print(f"[serve] корень: {ROOT}")
        print(f"[serve] Ctrl+C — стоп")
        threading.Thread(target=open_browser_when_ready, args=(url, httpd), daemon=True).start()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[serve] стоп")


if __name__ == "__main__":
    main()
