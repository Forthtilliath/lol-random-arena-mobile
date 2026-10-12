# ⚔️ LoL Random Arena (mobile)

![Expo](https://img.shields.io/badge/Expo_57-000020?style=for-the-badge&logo=expo&logoColor=white) ![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/-TypeScript-blue?logo=typescript&logoColor=white&style=for-the-badge) ![License](https://img.shields.io/github/license/forthtilliath/lol-random-arena-mobile?style=for-the-badge)

> Version mobile de [LoL Random Arena](https://github.com/Forthtilliath/lol-random-arena) : renseigne les joueurs du lobby, l'app forme les équipes du mode Arena de League of Legends et attribue un champion à chacun.

![Accueil, résultat d'un tirage en duos et groupes sauvegardés](docs/tirage.webp)

## Fonctionnalités

- 👥 **Duos ou Trios** : 8 équipes de 2 ou 6 équipes de 3
- 🎲 **Équipes aléatoires** ou par ordre d'inscription
- 🏆 **Un champion par joueur, sans doublon**, parmi les 173 champions du jeu, portraits embarqués (fonctionne hors ligne)
- 🚫 **Bannissement automatique** des champions les plus joués, les plus gagnants ou un mix des deux, d'après les statistiques Arena actuelles d'[op.gg](https://www.op.gg/lol/modes/arena) (connexion requise)
- 🔁 **Relancer** un tirage en un geste, **partager** le résultat en texte (Discord, chat du lobby…)
- 💾 **Pseudos retenus automatiquement** d'une ouverture à l'autre, et **groupes sauvegardés** pour changer de bande d'amis en un geste
- 🇫🇷 Interface en français

![Bannissement automatique, tirage en trios et accueil](docs/trios.webp)

## Thème « Hextech »

Même identité visuelle que le site : palette du client League of Legends (noir hextech `#010A13`, bleu nuit `#0A1428`, or `#C8AA6E`, bleu hextech `#0AC8B9`), panneaux à coins biseautés dessinés en SVG, titres en Cinzel. Les tokens sont dans [`src/constants/theme.ts`](src/constants/theme.ts), à garder synchronisés avec `src/app.css` du site.

## Stack technique

- [Expo SDK 57](https://docs.expo.dev/) + [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native 0.86](https://reactnative.dev/) + TypeScript
- [Zustand](https://zustand.docs.pmnd.rs/) + AsyncStorage : configuration, groupes et dernier tirage persistés sur l'appareil
- [Zod](https://zod.dev/) : revalidation des données relues depuis le stockage
- [react-native-svg](https://github.com/software-mansion/react-native-svg), [expo-linear-gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/), [expo-image](https://docs.expo.dev/versions/latest/sdk/image/)
- [Data Dragon](https://developer.riotgames.com/docs/lol#data-dragon) : liste des champions et portraits officiels
- [Biome](https://biomejs.dev/) (lint + format), [Jest](https://jestjs.io/) + jest-expo (tests)

## Installation

```bash
git clone https://github.com/Forthtilliath/lol-random-arena-mobile.git
cd lol-random-arena-mobile
npm install
npm start
```

Scanne ensuite le QR code avec l'app [Expo Go](https://expo.dev/go), ou lance `npm run android`.

### Scripts disponibles

| Commande                 | Description                                                                   |
| ------------------------ | ----------------------------------------------------------------------------- |
| `npm start`              | Serveur de développement Expo                                                 |
| `npm run android`        | Ouvre l'app sur Android                                                       |
| `npm test`               | Tests unitaires (Jest)                                                        |
| `npm run typecheck`      | Vérification des types (tsc)                                                  |
| `npm run lint`           | Lint et format (Biome)                                                        |
| `npm run format`         | Corrige le lint et le format                                                  |
| `npm run sync-champions` | Met à jour les champions et leurs portraits depuis Data Dragon                |

Après la sortie d'un nouveau champion, lance `npm run sync-champions` : le script régénère `src/lib/champions.ts` et `src/lib/championImages.ts`, et télécharge les portraits manquants dans `assets/champions/`.

### Construire un APK de release

L'APK de release est signé avec une clé propre à l'app, jamais avec le `debug.keystore` public de React Native (plugin [`plugins/withReleaseSigning.js`](./plugins/withReleaseSigning.js)). Sans cette clé, `gradlew assembleRelease` échoue (« Keystore file not set »).

1. Générer la clé une seule fois, **hors du dépôt**, et la sauvegarder (gestionnaire de mots de passe) : la perdre empêche toute mise à jour de l'app installée.

   ```powershell
   keytool -genkeypair -v -storetype PKCS12 -keyalg RSA -keysize 2048 -validity 10000 -alias lolrandomarena-upload -keystore "$env:USERPROFILE\keys\lolrandomarena-upload.keystore"
   ```

2. Déclarer son emplacement et son mot de passe dans `~/.gradle/gradle.properties` (jamais dans `android/`, régénéré par `expo prebuild`) :

   ```properties
   LOLRANDOMARENA_UPLOAD_STORE_FILE=C:/Users/<toi>/keys/lolrandomarena-upload.keystore
   LOLRANDOMARENA_UPLOAD_STORE_PASSWORD=...
   LOLRANDOMARENA_UPLOAD_KEY_ALIAS=lolrandomarena-upload
   LOLRANDOMARENA_UPLOAD_KEY_PASSWORD=...
   ```

3. Construire : `npx expo prebuild --platform android`, puis `cd android && ./gradlew assembleRelease`.

L'APK n'embarque que le code natif des téléphones ARM (plugin [`plugins/withAndroidAbis.js`](./plugins/withAndroidAbis.js)) ; `npm run android` cible de toute façon l'architecture de l'appareil branché, émulateur compris.

## Licence

Distribué sous licence [MIT](./LICENSE).

LoL Random Arena est un projet de fan non affilié à Riot Games. League of Legends et les portraits des champions sont la propriété de Riot Games, Inc.
