from __future__ import annotations

import json
import os
import time
import urllib.parse
import urllib.request

# MyMemory free tier: 500 chars/request, ~100 words/day per IP without email,
# 10,000 words/day with a registered email (TRANSLATION_EMAIL env var).
MAX_CHARS = 490


def _call_mymemory(text: str, source: str, target: str) -> str:
    email = os.environ.get("TRANSLATION_EMAIL", "")
    params: dict = {"q": text, "langpair": f"{source}|{target}"}
    if email:
        params["de"] = email
    url = f"https://api.mymemory.translated.net/get?{urllib.parse.urlencode(params)}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            # Quota exhausted — don't store original as translation
            if data.get("quotaFinished"):
                return text
            # Non-200 status is an API error
            if data.get("responseStatus", 200) != 200:
                return text
            translated = data.get("responseData", {}).get("translatedText", "")
            if not translated or "QUERY LENGTH LIMIT" in translated:
                return text
            return translated
    except Exception:
        return text


def _split_to_chunks(text: str) -> list[str]:
    if len(text) <= MAX_CHARS:
        return [text]

    chunks: list[str] = []

    def _flush_sentences(sentences: list[str]) -> None:
        buf = ""
        for s in sentences:
            candidate = (buf + " " + s).strip() if buf else s
            if len(candidate) > MAX_CHARS:
                if buf:
                    chunks.append(buf)
                    time.sleep(0.1)
                while len(s) > MAX_CHARS:
                    chunks.append(s[:MAX_CHARS])
                    s = s[MAX_CHARS:]
                buf = s
            else:
                buf = candidate
        if buf:
            chunks.append(buf)

    paragraphs = text.split("\n\n")
    sentence_buf: list[str] = []

    for para in paragraphs:
        if not para.strip():
            continue
        candidate = ("\n\n".join(sentence_buf) + "\n\n" + para).strip() if sentence_buf else para
        if len(candidate) > MAX_CHARS:
            if sentence_buf:
                _flush_sentences(sentence_buf)
                sentence_buf = []
            import re
            sentences = re.split(r'(?<=[.!?؟])\s+', para)
            sentence_buf.extend(sentences)
        else:
            sentence_buf.append(para)

    if sentence_buf:
        _flush_sentences(sentence_buf)

    return chunks if chunks else [text[:MAX_CHARS]]


def translate_text(text: str, target: str, source: str = "ar") -> str:
    if not text or not text.strip():
        return text
    chunks = _split_to_chunks(text)
    if len(chunks) == 1:
        return _call_mymemory(chunks[0], source, target)
    translated: list[str] = []
    for i, chunk in enumerate(chunks):
        translated.append(_call_mymemory(chunk, source, target))
        if i < len(chunks) - 1:
            time.sleep(0.4)
    return " ".join(translated)
