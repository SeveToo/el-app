<div align="left">
  <img src="public/logo.webp" alt="EL APP Logo" width="120" />
  <h1>Twój Interaktywny Nauczyciel Angielskiego</h1>
  <p><b>Nowoczesna nauka języka angielskiego oparta na etapach i wizualnych skojarzeniach.</b></p>
</div>

---

**[🇺🇸 English Version](README_EN.md)** | **🔗 [🔴 Zobacz Demo na żywo / Live Demo (Kliknij tutaj)](https://sevetoo.github.io/el-app) 🔗**

## 📖 Spis Treści
- [✨ Pierwsze Wrażenie](#-pierwsze-wrażenie)
- [🛠️ Stack Technologiczny](#️-stack-technologiczny)
- [✨ Etapy Nauki (Learning Flow)](#-etapy-nauki-learning-flow)
- [🧠 Inteligentna Pętla Nauki (Study Loop)](#-inteligentna-pętla-nauki-study-loop)
- [📈 Wydajność i Optymalizacja (98%+)](#-wydajność-i-optymalizacja-98)
- [🌓 Dark Mode & UI Showcase](#-dark-mode--ui-showcase)
- [🛠️ Wyzwania Techniczne](#-wyzwania-techniczne-deep-dive)
- [🎨 Prototypowanie UI](#-prototypowanie-ui-design-exploration)
- [🚀 Jak uruchomić to samemu](#-jak-uruchomić-to-samemu)
- [🗺️ Plany Rozwoju (Roadmap)](#-plany-rozwoju-roadmap)

---

## ✨ Pierwsze Wrażenie

Główny interfejs aplikacji został zaprojektowany z myślą o przejrzystości i intuicyjnej nawigacji. System kategorii pozwala na szybki dostęp do interesujących Cię tematów:

![EL APP Main Menu](public/app_screens/loading_screen.gif)

---

## 🛠️ Stack Technologiczny

Aplikacja została zbudowana w oparciu o najnowocześniejszy stack webowy, zapewniający szybkość, dostępność i responsywność:

<div align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,framer,html,css,git,vscode" alt="Tech Stack" />
</div>

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Components)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) & [HeroUI](https://heroui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Audio**: Web Speech API (Native Text-to-Speech)
- **Deployment**: GitHub Pages (Static Export)

---

## ✨ Etapy Nauki (Learning Flow)

Aplikacja prowadzi użytkownika przez 5 inteligentnych etapów nauki, od poznania słowa do jego swobodnego użycia w zdaniu:

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

## 🧠 Inteligentna Pętla Nauki (Study Loop)

Sercem aplikacji jest algorytm zarządzający postępem użytkownika:
- **Grupy po 10 słówek**: Nauka podzielona na strawne partie, aby uniknąć zmęczenia.
- **System Błędów**: Słówka sprawiające trudność automatycznie trafiają do powtórek w kolejnej rundzie.
- **Lokalny Zapis (Local Storage)**: Twój postęp jest bezpieczny nawet po odświeżeniu strony czy zamknięciu przeglądarki.

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

### 📱 Podgląd Mobilny (Stage Screenshots)
| Etap 1 | Etap 2 | Etap 3 | Etap 4 | Etap 5 |
| :---: | :---: | :---: | :---: | :---: |
| ![S1](public/app_screens/1.webp) | ![S2](public/app_screens/2.webp) | ![S3](public/app_screens/3.webp) | ![S4](public/app_screens/4.webp) | ![S5](public/app_screens/5.webp) |

---

## 🛠️ Wyzwania Techniczne (Deep Dive)

Projektowanie na darmowe hostingi statyczne (GitHub Pages) wymagało kreatywnych rozwiązań:

- **Hydracja & Statyczny Eksport**: Wdrożenie `trailingSlash: true` wyeliminowało błędy routingu oraz błędy **#418 (Hydration Failed)**.
- **Visual Viewport API**: Dynamiczne obliczanie położenia nagłówka nad klawiaturą mobilną (`window.visualViewport.offsetTop`) zapewnia idealne UI podczas pisania.
- **PWA w Sub-katalogu**: System dynamicznych metadanych wstrzykuje poprawny `basePath` do manifestu, umożliwiając instalację jako PWA bezpośrednio z GitHub Pages.

---

## 🎨 Prototypowanie UI (Design Exploration)

Aplikacja stale ewoluuje. W ramach prac nad nowym menu głównym, stworzyliśmy stronę z prototypami dostępną pod `/design-preview`. 

---

## 🚀 Jak uruchomić to samemu

1. Zainstaluj biblioteki: `npm install`
2. Uruchom dewelopersko: `npm run dev`
3. Buduj statycznie: `npm run build` (wynik w folderze `/out`)

---

## 🎨 Obrazy (Assets)

Obrazki użyte w aplikacji zostały wygenerowane za pomocą modelu **Nano Banana 2** (Gemini 3 Flash Image). Każdy z nich został zoptymalizowany do formatu `.webp`, aby zapewnić błyskawiczne ładowanie.

---

## 🗺️ Plany Rozwoju (Roadmap)

- **🎮 Mini-gry (Gamification)**: Snajper, Zgadnij Kto To, Misja Zakupy, Kreator Sceny.
- **🎙️ Tryb Dyktowania**: Zapisywanie usłyszanych zdań.
- **🎧 Rozumienie ze Słuchu**: Zaawansowane ćwiczenia audio.
- **☁️ Cloud Sync**: Synchronizacja statystyk w chmurze.

---

_Stworzone z pasją do nauki języków. by
[SeveToo](https://github.com/SeveToo)_
