<div align="left">
  <img src="public/logo.webp" alt="EL APP Logo" width="120" />
  <h1>Twój Interaktywny Nauczyciel Angielskiego</h1>
  <p><b>Nowoczesna nauka języka angielskiego oparta na etapach i wizualnych skojarzeniach.</b></p>
</div>

---

**🔗 [🔴 Zobacz Demo na żywo / Live Demo (Kliknij tutaj)](https://sevetoo.github.io/el-app) 🔗**

## 📖 Spis Treści
- [✨ Pierwsze Wrażenie (Loader)](#-pierwsze-wrażenie-loader)
- [✨ Etapy Nauki (Learning Flow)](#-etapy-nauki-learning-flow)
- [📈 Wydajność i Optymalizacja (98%+)](#-wydajność-i-optymalizacja-98)
- [🌓 Dark Mode & UI Showcase](#-dark-mode--ui-showcase)
- [🛠️ Wyzwania Techniczne](#-wyzwania-techniczne-deep-dive)
- [🚀 Jak uruchomić to samemu](#-jak-uruchomić-to-samemu)
- [🗺️ Plany Rozwoju (Roadmap)](#-plany-rozwoju-roadmap)

---

## ✨ Pierwsze Wrażenie (Loader)

Zamiast pustej strony, użytkownik widzi autorsko zaprojektowany ekran ładowania, który przygotowuje silnik nauki:

![Loading Screen Flow](public/app_screens/loading_screen.gif)

*   **Animowane Logo**: Pulsujące i obracające się logo **EL APP**.
*   **Adaptacyjność**: Loader automatycznie wykrywa motyw przeglądarki.

---

## ✨ Etapy Nauki (Learning Flow)

Aplikacja prowadzi użytkownika przez 5 inteligentnych etapów nauki, od poznania słowa do jego użycia w zdaniu:

1.  **🗂️ Etap 1: Fiszki (Flashcards)**
    - Dynamiczne karty z obrazkami i wymową native speakera.
    - ![Fiszki Flow](public/app_screens/stage_1.gif)

2.  **⚖️ Etap 2: Szybka Ocena (Fast Review)**
    - Błyskawiczna weryfikacja znajomości słówek.
    - ![Oceń Flow](public/app_screens/stage_2.gif)

3.  **🎮 Etap 3: Gra w Dopasowywanie (Matching Game)**
    - Trening skojarzeń wizualnych - dopasuj słowo do obrazka.
    - ![Gra Flow](public/app_screens/stage_3.gif)

4.  **✍️ Etap 4: Test Pisemny (Written Test)**
    - Wpisywanie słówek z pamięci z trybem karnym za błędy.
    - ![Pisanie Flow](public/app_screens/stage_4.gif)

5.  **📝 Etap 5: Uzupełnianie Zdań (Sentences)**
    - Użycie słowa w prawdziwym kontekście z systemem podpowiedzi.
    - ![Zdania Flow](public/app_screens/stage_5.gif)

---

## 📈 Wydajność i Optymalizacja (98%+)

Projekt osiąga najwyższe noty w audytach Lighthouse dzięki optymalizacji obrazów WebP i nowoczesnemu ładowaniu zasobów:

| Wynik Lighthouse (Mobile) | Wynik Lighthouse (Desktop) |
| :---: | :---: |
| ![Lighthouse Mobile 98](public/app_screens/lighthouse_mobile.webp) | ![Lighthouse Desktop 99](public/app_screens/lighthouse_desktop.webp) |

---

## 🌓 Dark Mode & UI Showcase

Pełne wsparcie dla motywów jasnych i ciemnych z responsywnym układem dostosowanym do urządzeń mobilnych:

| Wariant | Desktop | Mobile |
| :--- | :---: | :---: |
| ☀️ **Tryb Jasny** | ![Desktop Light](public/app_screens/showcase_light_1.webp) | ![Mobile Light](public/app_screens/mobile_main_menu.webp) |
| 🌙 **Tryb Ciemny** | ![Desktop Dark](public/app_screens/showcase_dark_1.webp) | ![Mobile Dark](public/app_screens/mobile_main_menu_dark.webp) |

### 📱 Podgląd Mobilny (Stages)
| Etap 1 | Etap 2 | Etap 3 | Etap 4 | Etap 5 |
| :---: | :---: | :---: | :---: | :---: |
| ![S1](public/app_screens/1.webp) | ![S2](public/app_screens/2.webp) | ![S3](public/app_screens/3.webp) | ![S4](public/app_screens/4.webp) | ![S5](public/app_screens/5.webp) |

---

## 🛠️ Wyzwania Techniczne (Deep Dive)

Projektowanie aplikacji w nowoczesnym frameworku na darmowe hostingi statyczne (GitHub Pages) wiązało się z kilkoma nietrywialnymi problemami:

### 🧩 Rozwiązanie problemu Hydracji & 404
Domyślny system routingu Next.js (App Router) przy statycznym eksporcie miewał problemy z pobieraniem danych dla sub-katalogów (`/el-app`).
- **Rozwiązanie:** Wdrożyłem flagę `trailingSlash: true` w konfiguracji projektu, co wymusiło na silniku statycznym poprawne generowanie paczek danych w strukturze katalogowej, eliminując błędy o kodzie **#418 (Hydration Failed)** oraz błędy wczytywania zasobów `.txt`.

### 📱 Visual Viewport API (Klawiatura Mobile)
Standardowe pozycjonowanie `sticky` lub `fixed` często zawodzi na smartfonach, gdy klawiatura usuwa 50% widocznego obszaru.
- **Rozwiązanie:** Zastosowałem **Visual Viewport API** (`window.visualViewport.offsetTop`), które dynamicznie oblicza rzeczywiste położenie górnej krawędzi okna nad klawiaturą. Wszystkie nagłówki w Etapie 5 są dzięki temu zawsze idealnie przyklejone do góry widocznego obszaru! 🦾

### 📡 Naprawa PWA w Sub-katalogu
Aplikacje typu PWA często tracą dostęp do manifestu na GitHubie przez brak poprawnego przedrostka ścieżki.
- **Rozwiązanie:** Stworzyłem system dynamicznych metadanych w Głównym Layoucie, który wstrzykuje poprawny `basePath` do pliku `site.webmanifest` oraz ikon Apple, gwarantując bezbłędną instalację aplikacji na telefonach Apple i Android.

---

## 🚀 Jak uruchomić to samemu

1. Sklonuj repozytorium.
2. Zainstaluj biblioteki:
   ```bash
   npm install
   ```
3. Uruchom serwer deweloperski:
   ```bash
   npm run dev
   ```
4. Otwórz `http://localhost:3000` w swojej przeglądarce.

---

## 🧠 Inteligentna Pętla Nauki (Study Loop)

- **Grupy po 10 słówek:** Nauka podzielona na strawne partie.
- **System Błędów:** Słówka sprawiające trudność automatycznie trafiają do powtórek w kolejnej rundzie.
- **Lokalny Zapis (Local Storage):** Twój postęp jest bezpieczny nawet po odświeżeniu strony.

---

## 🎨 Obrazy (Assets)

Obrazki użyte w aplikacji zostały wygenerowane za pomocą **Gemini Nanobanana**. Każdy z nich został zoptymalizowany do formatu `.webp`, aby zapewnić błyskawiczne ładowanie.

---

## 🛠️ Stack Technologiczny

<div align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,framer,html,css,git,vscode" alt="Tech Stack" />
</div>

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, App Context)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **UI Components**: [HeroUI](https://heroui.com/) (Modern, Accessible components)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Audio**: Web Speech API (Native TTS)
- **Deployment**: GitHub Pages (via GitHub Actions)

## 🎨 Prototypowanie UI (Design Exploration)

Aplikacja EL APP stale ewoluuje wizualnie. W ramach prac nad nowym menu głównym, stworzyliśmy specjalną stronę z prototypami:

- **Dostęp:** `/design-preview`
- **Zawartość:** 3 unikalne koncepcje interfejsu (Galaxy Cards, Quest Path, Compact List).
- **Cel:** Testowanie animacji, przejrzystości i motywacji użytkownika przed wdrożeniem do głównego nurtu aplikacji.

---

## 🗺️ Plany Rozwoju (Roadmap)

- **🎮 Mini-gry (Gamification):** Wdrażanie interaktywnych gier odblokowywanych wraz z postępem nauki:
  - **Snajper**: Ćwiczenie rozumienia szybkich instrukcji i zawodów.
  - **Zgadnij Kto To?**: Wykorzystanie przymiotników i cech wyglądu.
  - **Misja Zakupy**: Symulacja realnych sytuacji w sklepie.
  - **Kreator Sceny**: Praktyczna nauka przyimków miejsca (Drag & Drop).
- **🎙️ Tryb Dyktowania:** Zapisywanie usłyszanych zdań.
- **🎧 Rozumienie ze Słuchu:** Zaawansowane ćwiczenia audio.
- **🏙️ Tryb "Miasto":** Interaktywna mapa do nauki przyimków.
- **☁️ Cloud Sync:** Synchronizacja statystyk w chmurze.

---

_Stworzone z pasją do nauki języków. by
[SeveToo](https://github.com/SeveToo)_
