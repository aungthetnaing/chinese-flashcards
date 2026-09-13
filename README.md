# SciOly Flashcards

An offline-first iPhone study app for Science Olympiad biology events,
built with Expo, React Native, and TypeScript.

## Included

- A SciOly event picker with a dedicated Disease Detectives subsection.
- A Designer Genes subsection with 145 genetics, inheritance, and biotechnology
  cards expanded from forum Question Marathons and study discussions.
- An Anatomy & Physiology subsection with 121 cards based on the official
  Science Olympiad event pages, OpenStax Anatomy and Physiology, and
  supplemental Scioly.org Question Marathon prompts.
- 300 Disease Detectives cards covering epidemiology foundations, outbreak
  investigation, study design, bias, statistics, surveillance, transmission,
  immunity, prevention, and causation.
- Disease Detectives study filters for every subcategory or a full-deck shuffle
  through **All topics**.
- Flip cards with a question-first study flow.
- Shuffle, previous/next, and “Review again” / “Got it” controls.
- Searchable card library with topic labels.
- Add custom question-and-answer cards.
- On-device persistence with AsyncStorage.
- Portrait iPhone layout with native React Native controls and dark, high-contrast
  styling.

The Disease Detectives cards are based on the Disease Detectives wiki material and the
past-year discussion and Question Marathon topics linked from the Scioly.org
event thread. They are study prompts, not a replacement for the current
Science Olympiad rules or official event resources.

## Run on an iPhone

1. Install Node.js LTS and run `npm install`.
2. Start Expo with `npm start`.
3. Install **Expo Go** on the iPhone.
4. Put the iPhone and development computer on the same Wi-Fi network.
5. Scan the terminal QR code with the iPhone Camera and open it in Expo Go.

### Fully offline iPhone install

Expo Go is useful for development, but it loads the JavaScript bundle from the
development server. For an app that works with Wi-Fi and cellular data turned
off:

1. Create or sign in to an account at https://expo.dev.
2. Install the EAS CLI with `npm install -g eas-cli`.
3. Run `eas login` in this project.
4. Run `eas build --profile preview --platform ios`.
5. Open the completed build link on the iPhone and install it, or distribute
   the build through TestFlight. An Apple Developer account is required for
   iOS device distribution.

The preview build bundles the card data and app code. Events, Study, Cards, Add,
subcategory filters, and on-device AsyncStorage persistence work without a
network connection.

## Project structure

```text
App.tsx                         App shell and tab navigation
src/data/events.ts              SciOly event registry and event subsections
src/data/starterDeck.ts         Disease Detectives starter cards
src/data/designerGenesDeck.ts   Designer Genes starter cards
src/screens/EventsScreen.tsx    Biology event picker
src/screens/StudyScreen.tsx    Flip-card study mode
src/screens/BrowseScreen.tsx   Search and manage cards
src/screens/AddCardScreen.tsx  Create custom cards
src/components/Flashcard.tsx   Animated question/answer card
src/useDeck.ts                  Deck state and persistence
```
