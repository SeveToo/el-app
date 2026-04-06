# 🚀 EL APP - Twój Interaktywny Nauczyciel Angielskiego

**🔗 [🔴 Zobacz Demo na żywo / Live Demo (Kliknij tutaj)](https://sevetoo.github.io/el-app) 🔗**

![EL APP Main Menu](public/app_screens/menu.png)

**EL APP** to nowoczesna aplikacja webowa do nauki języka angielskiego, zaprojektowana z myślą o maksymalnej efektywności i przyjemności z nauki. System oparny na etapach (Stages) pozwala na płynne przejście od poznania słowa do jego swobodnego użycia w kontekście.

## 📈 Wydajność i Optymalizacja (Lighthouse 99%+)

Projekt został poddany rygorystycznym testom wydajnościowym pod kątem Core Web Vitals. Dzięki optymalizacji obrazów, nowoczesnemu ładowaniu czcionek i precyzyjnemu zarządzaniu zasobami, aplikacja osiąga najwyższe noty w audytach:

![Lighthouse Score Placeholder](https://via.placeholder.com/800x200?text=Lighthouse+Score+99-100%25+Showcase)

> [!TIP]
> **Dlaczego 99%, a nie 100%?** Wynik powyżej 90% jest uznawany za doskonały. Różnica 1% wynika często z narzutu renderowania JavaScriptu w frameworkach typu SPA (React/NextJS) oraz zmienności sieciowej przy wczytywaniu zewnętrznych zasobów multimedialnych.

---

## 🌓 Dark Mode & UI Showcase

Aplikacja wspiera pełne przełączanie motywów, dbając o komfort wzroku użytkownika o każdej porze dnia. Dzięki **HeroUI** i **TailwindCSS**, interfejs jest spójny i czytelny w obu wariantach:

| Tryb Jasny (Light Mode) | Tryb Ciemny (Dark Mode) |
| :---: | :---: |
| ![Light Mode](public/app_screens/menu.png) | ![Dark Mode](public/app_screens/menu.png) |
| _Katalog główny (Jasny)_ | _Katalog główny (Ciemny)_ |

---

## ✨ Etapy Nauki (Learning Flow)

Aplikacja prowadzi użytkownika przez 5 inteligentnych etapów nauki:

1.  **🗂️ Etap 1: Fiszki (Flashcards)**

    - Dynamiczne karty z obrazkami i przykładami.
    - Pełna wymowa audio (native speaker).
    - ![Fiszki](public/app_screens/etap1.png)

2.  **⚖️ Etap 1.5: Szybka Ocena (Fast Review)**

    - Błyskawiczna weryfikacja znajomości słówek.
    - ![Oceń](public/app_screens/etap1.5.png)

3.  **🎮 Etap 3: Gra w Dopasowywanie (Matching Game)**

    - Dopasuj angielskie słowo do odpowiedniego obrazka. Trening
      skojarzeń wizualnych.
    - ![Gra](public/app_screens/etap3.png)

4.  **✍️ Etap 4: Test Pisemny (Written Test)**

    - Wpisywanie słówek z pamięci z **Trybem Karnym** za błędy.
    - ![Pisanie](public/app_screens/etap4.png)
    - _Tryb karny przy błędzie:_
    - ![Błąd](public/app_screens/etap4_wrong_answer.png)

5.  **📝 Etap 5: Uzupełnianie Zdań (Sentences)**
    - Użycie słowa w prawdziwym kontekście z systemem inteligentnych
      podpowiedzi (💡).
    - ![Zdania](public/app_screens/etap5.png)

---

---

## ✨ Nowoczesny Loader (User Experience)

Pierwsze wrażenie jest najważniejsze. Dlatego zamiast pustej strony, użytkownik widzi autorsko zaprojektowany ekran ładowania:
*   **Animowane Logo**: Pulsujące i obracające się logo **EL APP** przygotowuje użytkownika na wysoką jakość doświadczenia.
*   **Łagodne Przejście**: Dzięki bibliotece **Framer Motion**, ładowanie silnika nauki jest płynne i profesjonalne.
*   **Adaptacyjność**: Loader automatycznie wykrywa motyw przeglądarki, zapewniając spójność od pierwszej milisekundy.

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
  <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,framer,html,css,git,vscode" alt="Tech Stack - Next.js, React, TypeScript, Tailwind, Framer, HTML, CSS, Git, VSCode" />
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

- **🎮 Mini-gry (Gamification):** Wdrażanie interaktywnych gier odblokowywanych wraz z postępem:
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
