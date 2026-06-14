from __future__ import annotations

import json
import time
import urllib.parse
import urllib.request

MAX_CHARS = 4800


def _call_mymemory(text: str, source: str, target: str) -> str:
    params = urllib.parse.urlencode({"q": text, "langpair": f"{source}|{target}"})
    url = f"https://api.mymemory.translated.net/get?{params}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            translated = data.get("responseData", {}).get("translatedText", "")
            return translated if translated else text
    except Exception:
        return text


def translate_text(text: str, target: str, source: str = "ar") -> str:
    """Translate text using the free MyMemory API. Long text is split by paragraphs."""
    if not text or not text.strip():
        return text
    if len(text) <= MAX_CHARS:
        return _call_mymemory(text, source, target)
    # Split long text into paragraph-sized chunks
    parts = text.split("\n\n")
    translated: list[str] = []
    chunk = ""
    for part in parts:
        candidate = (chunk + "\n\n" + part) if chunk else part
        if len(candidate) > MAX_CHARS:
            if chunk:
                translated.append(_call_mymemory(chunk, source, target))
                time.sleep(0.3)
            chunk = part
        else:
            chunk = candidate
    if chunk:
        translated.append(_call_mymemory(chunk, source, target))
    return "\n\n".join(translated)
