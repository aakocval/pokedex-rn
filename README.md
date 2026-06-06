# Pokédex

A React Native Pokédex app built with Expo that lets you browse, search, and explore Pokémon from the [PokéAPI](https://pokeapi.co/).

<p align="center">
  <img src="assets/images/demo.gif" alt="Pokédex demo" width="320" />
</p>

---

## Features

- **Browse** — paginated grid of all Pokémon, color-coded by primary type
- **Search** — real-time name search with partial-match support
- **Filter by type** — bottom-sheet type picker with an active-filter badge
- **Detail view** — full-screen card with Pokédex number, name, height, weight, Japanese name, and region label
- **Light / dark mode** — toggleable theme with animated icon transition
- **Smooth animations** — fade-in/out transitions and spring-based interactions via React Native Reanimated

## Screens

| Home | Detail |
|------|--------|
| Paginated Pokémon grid with search and type filter | Type-colored full-screen detail with stats and artwork |

## Tech Stack

| Layer | Library |
|-------|---------|
| Framework | [Expo](https://expo.dev) ~54 |
| Navigation | [Expo Router](https://expo.github.io/router) (file-based) |
| Animations | [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) ~4 |
| Images | [expo-image](https://docs.expo.dev/versions/latest/sdk/image/) |
| Icons | [@expo/vector-icons](https://icons.expo.fyi/) |
| Data | [PokéAPI](https://pokeapi.co/) |
| Testing | Jest + jest-expo |

## Getting Started

### Prerequisites

- Node.js 18+
- [Expo CLI](https://docs.expo.dev/more/expo-cli/)

### Install

```bash
npm install
```

### Run

```bash
npx expo start
```

Then open the app in an iOS simulator, Android emulator, or Expo Go.

| Command | Target |
|---------|--------|
| `npm run ios` | iOS simulator |
| `npm run android` | Android emulator |
| `npm run web` | Web browser |

### Tests

```bash
npm test
```

## Project Structure

```
app/
  index.tsx          # Home screen (list + search + filter)
  pokemon/[id].tsx   # Detail screen
components/          # Shared UI components
viewmodels/          # Business logic hooks
services/            # PokéAPI data layer
constants/           # Colors, type palette
context/             # Theme context
navigation/          # App coordinator
types/               # TypeScript types
```

## Data Source

All Pokémon data is fetched from the public [PokéAPI v2](https://pokeapi.co/). No API key required.
