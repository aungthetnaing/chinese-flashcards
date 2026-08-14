# 中文 Chinese Flashcards

An iPhone (and Android) app to study Chinese vocabulary. Each flashcard shows the
**Simplified** and **Traditional** characters, **Pinyin**, **English** meaning, and
an **example sentence** with its translation.

Built with **Expo + React Native + TypeScript**, so you can develop it on Windows
and run it on your real iPhone using the free **Expo Go** app.

## Features

- Flip-card study mode (tap a card to reveal pinyin, English, and an example sentence)
- Next / Previous / Shuffle controls
- Simplified **and** Traditional characters on every card
- **Audio pronunciation** — tap 🔊 to hear the word or sentence spoken in Mandarin
  (uses the device's built-in text-to-speech via `expo-speech`)
- **Stroke-order practice** — a "Write" tab powered by [Hanzi Writer](https://hanziwriter.org):
  - **Animate** shows the correct stroke order for the character
  - **Quiz** lets you write each stroke with your finger and validates stroke
    order in real time, counting mistakes
  - Multi-character words show a chip for each character to practice individually
- **Preloaded deck: Integrated Chinese, Level 1 (Lessons 1–20, ~319 words)** —
  the complete Level 1 vocabulary (Part 1 + Part 2) with simplified, traditional,
  pinyin, English, and example sentences
- Add your own cards; browse and delete cards
- Cards are saved on-device (AsyncStorage) and reload on next launch

## Run and test on your iPhone

1. Install **Node.js** (LTS) on Windows if you don't have it.
2. In this folder, install dependencies (only needed once):
   ```powershell
   npm install
   ```
3. Start the dev server:
   ```powershell
   npm start
   ```
   A QR code appears in the terminal (press `w`/`a`/`i` for other targets).
4. On your iPhone, install **Expo Go** from the App Store.
5. Make sure your iPhone and PC are on the **same Wi-Fi network**.
6. Open the **Camera** app on the iPhone and point it at the QR code, then tap
   the "Open in Expo Go" banner. The app loads live on your phone.
7. Test each feature:
   - **Study** tab → tap a card to flip; tap 🔊 to hear pronunciation.
   - **Write** tab → tap **Animate** to see stroke order, or **Quiz** to write
     the character stroke-by-stroke and get validation. (Keep the phone online —
     stroke data streams from the Hanzi Writer CDN.)
   - **Deck** tab → browse/delete; **Add** tab → create your own card.
8. Edit any file and save — Expo hot-reloads the app on your phone instantly.

### Tips

- If the QR won't connect (e.g. corporate/campus Wi-Fi blocks it), run
  `npx expo start --tunnel` to route through Expo's servers.
- If you hear no audio, enable a Chinese voice under iOS **Settings →
  Accessibility → Spoken Content → Voices → Chinese**.

## Project structure

```
App.tsx                     App shell + bottom tab navigation
index.ts                    Expo entry point
src/
  types.ts                  Flashcard data model
  theme.ts                  Colors / spacing tokens
  storage.ts                AsyncStorage load/save
  speech.ts                 Mandarin text-to-speech helper
  useDeck.ts                Deck state hook (add/remove/persist)
  data/integratedChinese1.ts       Integrated Chinese L1 Part 1 (Lessons 1–10)
  data/integratedChinese1Part2.ts  Integrated Chinese L1 Part 2 (Lessons 11–20)
  data/starterDeck.ts       Small fallback sample deck
  data/strokeData.json      Bundled offline stroke data (generated)
  data/hanziWriterLib.json  Inlined Hanzi Writer library (generated)
  components/Flashcard.tsx  Animated flip card
  components/StrokeWriter.tsx  Hanzi Writer WebView (animate + quiz)
  screens/StudyScreen.tsx   Study mode
  screens/WriteScreen.tsx   Stroke-order animation + quiz validation
  screens/BrowseScreen.tsx  Deck list + delete
  screens/AddCardScreen.tsx Add-card form
scripts/genStrokeData.mjs   Regenerates the two bundled data files above
```

## Notes

- Audio pronunciation relies on the device's Mandarin text-to-speech voice. On a
  real iPhone this works out of the box; if you hear nothing, ensure a Chinese
  voice is available under iOS Settings → Accessibility → Spoken Content → Voices.
- Stroke-order animation and quiz validation use **Hanzi Writer**. Both the
  library and the stroke data for every character in the deck are **bundled into
  the app** (see `src/data/strokeData.json` and `hanziWriterLib.json`), so the
  Write tab works fully offline. Regenerate them with `npm run gen:strokes`
  after adding new characters to the deck (uses the `hanzi-writer` and
  `hanzi-writer-data` dev dependencies). Characters not in the bundle fall back
  to the CDN when online.
- The default deck covers **Integrated Chinese, Level 1 (Lessons 1–20)** — the
  full Part 1 + Part 2 vocabulary (~319 cards). To restore it after edits, the
  deck hook exposes `resetToStarter()`.

## Running standalone / offline (EAS Build)

Expo Go loads the JS bundle live from the Metro server on your PC, so in dev the
app **stops working when the server is down**. To get a standalone app that runs
on your phone with no PC and works offline, build it with EAS:

1. Create a free account at https://expo.dev, then log in:
   ```powershell
   npx eas login
   ```
2. Link the project (creates an EAS project id in `app.json`):
   ```powershell
   npx eas init
   ```
3. Build an installable app (`eas.json` defines the profiles):
   ```powershell
   # iOS – needs an Apple Developer account; installs via TestFlight or ad-hoc
   npx eas build --profile preview --platform ios

   # Android – produces a standalone APK, no account needed
   npx eas build --profile preview --platform android
   ```
4. Install the resulting build on your device. It launches on its own and, once
   opened, runs **fully offline** — Study, audio (device TTS), the deck, and the
   Write tab (stroke data is bundled).

For App Store distribution, use the `production` profile plus `eas submit`.

