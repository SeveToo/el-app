<div align="left">
  <img src="public/logo.webp" alt="EL APP Logo" width="120" />
  <h1>Your Interactive English Teacher</h1>
  <p><b>Modern English learning based on stages and visual associations.</b></p>
</div>

---

**[🇵🇱 Wersja Polska (Polish Version)](README.md)** | **🔗 [🔴 Live Demo (Click here)](https://sevetoo.github.io/el-app) 🔗**

## 📖 Table of Contents
- [✨ First Impression](#-first-impression)
- [🛠️ Tech Stack](#️-tech-stack)
- [✨ Learning Flow](#-learning-flow)
- [🧠 Intelligent Study Loop](#-intelligent-study-loop)
- [📈 Performance & Optimization (98%+)](#-performance--optimization-98)
- [🌓 Dark Mode & UI Showcase](#-dark-mode--ui-showcase)
- [🛠️ Technical Challenges](#-technical-challenges-deep-dive)
- [🎨 UI Prototyping](#-ui-prototyping-design-exploration)
- [🚀 How to Run Locally](#-how-to-run-locally)
- [🗺️ Roadmap](#-roadmap)

---

## ✨ First Impression

The main application interface is designed for clarity and intuitive navigation. The category system allows for quick access to the topics you are interested in:

![EL APP Main Menu](public/app_screens/loading_screen.gif)

---

## 🛠️ Tech Stack

The application is built on the latest web stack, ensuring speed, accessibility, and responsiveness:

<div align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,framer,html,css,git,vscode" alt="Tech Stack" />
</div>

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Components)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) & [HeroUI](https://heroui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Audio**: Web Speech API (Native Text-to-Speech)
- **Deployment**: GitHub Pages (Static Export)

---

## ✨ Learning Flow

The application guides the user through 5 intelligent learning stages, from learning a word to its fluent use in a sentence:

1.  **🗂️ Stage 1: Flashcards**
    - Dynamic cards with images and native speaker pronunciation.
    - ![Flashcards Flow](public/app_screens/stage_1.gif)

2.  **⚖️ Stage 2: Fast Review**
    - Instant verification of word knowledge.
    - ![Review Flow](public/app_screens/stage_2.gif)

3.  **🎮 Stage 3: Matching Game**
    - Visual association training - match the word to the picture.
    - ![Matching Flow](public/app_screens/stage_3.gif)

4.  **✍️ Stage 4: Written Test**
    - Typing words from memory with a penalty mode for mistakes.
    - ![Writing Flow](public/app_screens/stage_4.gif)

5.  **📝 Stage 5: Sentence Fill**
    - Using the word in a real context with an intelligent hint system.
    - ![Sentences Flow](public/app_screens/stage_5.gif)

---

## 🧠 Intelligent Study Loop

At the heart of the application is an algorithm that manages user progress:
- **Groups of 10 words**: Learning divided into digestible portions to avoid fatigue.
- **Error System**: Words that cause difficulty automatically return for review in the next round.
- **Local Storage**: Your progress is safe even after refreshing the page or closing the browser.

---

## 📈 Performance & Optimization (98%+)

The project achieves top scores in Lighthouse audits thanks to WebP image optimization and modern resource loading:

| Lighthouse Score (Mobile) | Lighthouse Score (Desktop) |
| :---: | :---: |
| ![Lighthouse Mobile 98](public/app_screens/lighthouse_mobile.webp) | ![Lighthouse Desktop 99](public/app_screens/lighthouse_desktop.webp) |

---

## 🌓 Dark Mode & UI Showcase

Full support for light and dark themes with a responsive layout tailored for mobile devices:

| Variant | Desktop | Mobile |
| :--- | :---: | :---: |
| ☀️ **Light Mode** | ![Desktop Light](public/app_screens/showcase_light_1.webp) | ![Mobile Light](public/app_screens/mobile_main_menu.webp) |
| 🌙 **Dark Mode** | ![Desktop Dark](public/app_screens/showcase_dark_1.webp) | ![Mobile Dark](public/app_screens/mobile_main_menu_dark.webp) |

### 📱 Mobile Preview (Stage Screenshots)
| Stage 1 | Stage 2 | Stage 3 | Stage 4 | Stage 5 |
| :---: | :---: | :---: | :---: | :---: |
| ![S1](public/app_screens/1.webp) | ![S2](public/app_screens/2.webp) | ![S3](public/app_screens/3.webp) | ![S4](public/app_screens/4.webp) | ![S5](public/app_screens/5.webp) |

---

## 🛠️ Technical Challenges (Deep Dive)

Designing for free static hosting (GitHub Pages) required creative solutions:

- **Hydration & Static Export**: Implementing `trailingSlash: true` eliminated routing issues and **#418 (Hydration Failed)** errors.
- **Visual Viewport API**: Dynamically calculating the header position above the mobile keyboard (`window.visualViewport.offsetTop`) ensures a perfect UI during typing.
- **PWA in Sub-directory**: A dynamic metadata system injects the correct `basePath` into the manifest, enabling installation as a PWA directly from GitHub Pages.

---

## 🎨 UI Prototyping (Design Exploration)

The application is constantly evolving. As part of the work on the new main menu, we created a prototyping page available at `/design-preview`. 

---

## 🚀 How to Run Locally

1. Install dependencies: `npm install`
2. Run in development mode: `npm run dev`
3. Build for production: `npm run build` (output in `/out` folder)

---

## 🎨 Assets

The images used in the application were generated using the **Nano Banana 2** model (Gemini 3 Flash Image). Each of them has been optimized to `.webp` format to ensure instant loading.

---

## 🗺️ Roadmap

- **🎮 Gamification (Mini-games)**: Sniper, Guess Who, Shopping Mission, Scene Creator.
- **🎙️ Dictation Mode**: Writing down heard sentences.
- **🎧 Listening Comprehension**: Advanced audio exercises.
- **☁️ Cloud Sync**: Cloud-based progress synchronization.

---

_Created with passion for language learning by [SeveToo](https://github.com/SeveToo)_
