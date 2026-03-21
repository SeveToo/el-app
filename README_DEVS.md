# 📚 EL APP: Design System & Dev Guidelines

This document provides standards for maintaining the **premium, high-quality aesthetic** and **educational effectiveness** of this application.

## 🎨 1. Aesthetics & UI (The "Sztos" Rule)
Every component must look professional, modern, and high-end. Avoid default browser styles.

- **Standard Components**: Use predefined utility classes from `styles/globals.css`:
  - `card-premium`: Large rounded corners (`2.5rem`), subtle border, and soft shadow.
  - `btn-premium`: Tall interactive buttons with a thick bottom border (`border-b-4`) for a tactile feel.
  - `glass-effect`: Glassmorphic backgrounds for overlays and floating panels.
- **Typography**: Header text should be `font-black` with tight tracking (`tracking-tighter`). Translation labels should be `text-default-400 font-bold uppercase tracking-widest text-[10px] italic`.
- **Animations**: Use `framer-motion` for transitions. Favor `layout` animations and `AnimatePresence` for appearing elements.

## 🏗️ 2. Component Structure
- **Bilingual Interface**: Interactive elements (sentences, explanations) must always be accompanied by their Polish translation (`q.pl`).
- **Feedback Loop**: Every action should have visual (colors) and auditory (success/error sounds) feedback.
- **Adaptive Mastery**: Use the `article_scores` pattern (localStorage) to track user progress:
  - Correct Answer: `+1` point.
  - Wrong Answer: `-3` points.
  - Score >= 5: Retire the question from the active pool.

## 🔊 3. Audio & TTS
- Use `audioService.speak(text, { lang: 'en-US' | 'pl-PL' })`.
- For explanations containing mixed languages, use the `speakMixed` pattern: split by single quotes and alternate the language code.

## 🚀 4. Performance & UX
- **No Placeholders**: Never use placeholder images. Use `generate_image` tool if needed.
- **Micro-interactions**: Use `hover:border-primary`, `active:scale-95`, and custom animations (like the `.shake` class for errors).
- **Mobile First**: Always ensure buttons are large enough for touch and that the layout doesn't overflow.

## 💾 5. Persistence
Save progress and preferences in `localStorage`. Use clear keys like `article_last_accuracy`, `article_scores`, etc.

---
*Created by Antigravity AI - Maintain the standard.*
