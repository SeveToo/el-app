# Koncepcje Mini-gier (Learning Gamification)

Ten folder zawiera opisy i specyfikacje gier, które odblokowują się
wraz z postępem w nauce słownictwa i gramatyki.

## 1. Snajper / Killer (Listening & Speed)

- **Wymagania:** Opanowane zawody (professions) + czasowniki akcji
  (action verbs).
- **Mechanika:** Gracz patrzy przez celownik snajperski na tłum ludzi.
  Słyszy/czyta polecenie: "Eliminate the pilot who is walking with a
  nurse".
- **Cel:** Szybkie rozpoznanie właściwych tagów wizualnych na ekranie.
- **Edukacja:** Ćwiczy rozumienie całych fraz i szybkie skojarzenia.

## 2. Zgadnij Kto To? (Guess Who)

- **Wymagania:** Kolory (colors), części garderoby (clothes), cechy
  twarzy (facial features) - poziom Master.
- **Mechanika:** Klasyczna gra w eliminację. Komputer wybiera postać,
  gracz musi zadawać pytania lub słuchać opisów, np. "Is he wearing a
  green hat?".
- **Cel:** Wykorzystanie słownictwa opisowego w praktyce.

## 3. Nawigacja Miejska (City Guide)

- **Wymagania:** Przyimki miejsca (prepositions), kierunki
  (directions), budynki użyteczności publicznej.
- **Mechanika:** Widok mapy miasta z góry (top-down). Widzimy strzałkę
  (nasz wzrok). Lektor mówi: "Go straight, turn left at the pharmacy,
  the shop is next to the park".
- **Cel:** Nauka orientacji w terenie i rozumienia instrukcji ruchu.

## 4. Misja: Zakupy (Shopping Quest)

- **Wymagania:** Jedzenie (food), liczebniki (numbers), zwroty
  grzecznościowe (polite phrases).
- **Mechanika:**
  1.  **Odprawa:** Mama daje listę zakupów po polsku (np. "2 pomidory,
      chleb").
  2.  **Sklep:** Interakcja z ekspedientem. Gracz musi użyć frazy:
      "Can I have [X], please?".
  3.  **Weryfikacja:** Jeśli gracz pomyli produkt lub liczbę, misja
      kończy się powrotem do domu z "zażenowaniem" (motywacja do nauki
      nazw warzyw).
- **Cel:** Symulacja realnych sytuacji życiowych.

## 5. Kreator Sceny (Scene Builder / Messy Friend)

- **Wymagania:** Przyimki miejsca (prepositions), meble (furniture),
  postacie (characters) - min. 10 słów.
- **Fabuła:** Twój kumpel próbuje opisać obrazek, ale robi to
  chaotycznie. Twoim zadaniem jest ułożenie elementów w odpowiednich
  miejscach zgodnie z jego opisem, zanim skończy się czas.
- **Mechanika:**
  1.  **Audio:** Lektor mówi np. "Put the ball close to the tree" lub
      "The cat is on the sofa".
  2.  **Drag & Drop:** Gracz przesuwa obiekty na tle (np. park,
      pokój).
  3.  **Czas:** Masz ograniczony czas na dopasowanie wszystkich
      elementów.
- **Cel:** Nauka przyimków (`under`, `between`, `next to`) oraz
  rozumienia ze słuchu w stresie czasowym.

## 6. Wyłap Kłamstwo (Spot the Lie / Truth Detector)

- **Wymagania:** Kolory, kształty, przyimki miejsca - poziom Master.
- **Mechanika:** Lektor opisuje obrazek, ale podaje jedną lub kilka
  błędnych informacji (np. myli kolor lub kształt obiektu w rogu).
  Gracz musi kliknąć błędny element.
- **Cel:** Trening uważności i precyzyjnego rozumienia opisów
  wizualnych.

---

## System Odblokowywania (Prerequisites)

Każda gra w pliku konfiguracyjnym będzie miała przypisane warunki:

```json
{
  "gameId": "shopping_quest",
  "unlockCriteria": [
    { "tag": "vegetables", "minMastered": 10 },
    { "tag": "numbers", "minMastered": 20 },
    { "tag": "store_phrases", "minMastered": 5 }
  ]
}
```
