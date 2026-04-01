# Plan Optymalizacji Nauki i Zarządzania Kategoriami

Ten dokument zawiera propozycje rozwoju algorytmu nauki oraz struktury
danych dla aplikacji EL App.

## 1. Inteligentny Algorytm Nauki (Adaptive Flow)

Zamiast sztywnego podziału na lekcje lub brania wszystkiego naraz,
wprowadzamy system dynamicznej kolejki.

### Mechanizm "Błędy -> Masterowanie"

- **Aktywna Pula (Current Group):** Zaczynamy od 5-7 słówek.
- **Licznik Błędów:** Każde słówko ma swój wewnętrzny licznik
  poprawnych odpowiedzi w danej sesji.
- **Blokada Nowych:** Jeśli w sesji wystąpią więcej niż 3 błędy
  (łącznie lub na jednym słowie), algorytm **nie dodaje** nowych
  słówek z "poczekalni".
- **Warunek Progresu:** Nowe słówko z bazy wchodzi do aktywnej puli
  tylko wtedy, gdy inne słówko z puli zostanie "zaliczone" (np. 3
  poprawne odpowiedzi z rzędu w różnych trybach).

### Wykorzystanie Wielu Zdjęć

Jeśli dla jednego czasownika (np. "climb") mamy kilka zdjęć:

1.  **Faza Poznawcza:** Pokazujemy zawsze to samo zdjęcie (najbardziej
    reprezentatywne).
2.  **Faza Utrwalania (Master):** Po pierwszej poprawnej odpowiedzi w
    teście pisemnym, zmieniamy zdjęcie na inne. Użytkownik musi
    rozpoznać czynność, a nie zapamiętać konkretny obrazek.

---

## 2. Architektura Multilang & Rozszerzalność Gramatyczna

Zamiast sztywnych par "en-pl", przechodzimy na strukturę opartą na
`translation_key`.

### Dynamiczny JSON (Baza Wiedzy)

```json
{
  "id": "action_walk",
  "translations": {
    "en": { "word": "Walk", "example": "He walks to school." },
    "pl": { "word": "Chodzić", "example": "On chodzi do szkoły." },
    "es": { "word": "Caminar", "example": "Él camina a la escuela." },
    "da": { "word": "Gå", "example": "Han går i skole." }
  },
  "grammar": {
    "en": {
      "past_simple": "walked",
      "negative": "doesn't walk",
      "continuous": "walking"
    }
  },
  "images": [
    "/action_verbs/walk_1.webp",
    "/action_verbs/walk_2.webp"
  ],
  "tags": ["action", "movement", "daily"]
}
```

### System Odblokowywania (Gamification)

To jest klucz do Twojego pomysłu z "Killerem" i "Guess Who":

- **Wymagania (Prerequisites):** Każda gra/zadanie gramatyczne ma
  listę `required_tags` lub `required_words_count`.
  - _Przykład:_ Gra "Guess Who" wymaga: `colors` (min 5), `clothes`
    (min 10), `facial_features` (min 5).
- **Przycisk "Graj":** Szary (zablokowany), dopóki
  `MasteredCount(tags)` nie spełni warunku.

---

## 3. Mini-gry i Zadania Specjalne

### A. Tryb "Snajper" (Listening/Visual Match)

- **Cel:** Szybkie kojarzenie par (zawód + akcja).
- **Logika:** System losuje zdanie: "The pilot walks with a nurse".
- **Grafika:** Na ekranie masz 4 obrazki. Musisz kliknąć ten, gdzie
  tagi `pilot` i `nurse` są na jednym zdjęciu (lub obok siebie).

### B. Tryb "Grammar Shift"

Gdy słowo jest "Mastered" (Poziom 3), zamiast zwykłego `WrittenTest`,
dostajesz zadanie:

- "Change to Past Simple: _I walk to work_" -> użytkownik musi wpisać
  _walked_.
- To sprawia, że stare słówka nie są nudne, bo dostają nowe wyzwania.

---

## 3. Zarządzanie Zasobami (Zdjęcia)

### Optymalizacja

- **Format WebP:** Wszystkie zdjęcia powinny być w formacie .webp (już
  widać skrypt `optimize-images.js`).
- **Lazy Loading:** Przy dużej ilości zdjęć w jednej lekcji, ładowanie
  tylko tych z "Aktywnej Puli".

---

## 4. Kolejne Kroki (Roadmap)

1.  [ ] **Modyfikacja `StudyLoop.tsx`:** Implementacja `activePool` i
        logiki blokowania nowych słówek przy błędach.
2.  [ ] **Refactor JSONów:** Dodanie tablicy `images` zamiast
        pojedynczego pola, jeśli chcemy rotacji zdjęć.
3.  [ ] **System Powtórek:** Dodanie przycisku "Powtórz
        najtrudniejsze" na ekranie głównym (na podstawie
        `globalErrorIds`).
