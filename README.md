# ⚔️ LoL Random Arena

![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white) ![Gratuit](https://img.shields.io/badge/Gratuit-C8AA6E?style=for-the-badge) ![License](https://img.shields.io/github/license/forthtilliath/lol-random-arena-mobile?style=for-the-badge)

> **Fini les débats avant la partie.** Entre les pseudos de ton lobby, l'app forme les équipes du mode **Arena** de League of Legends et donne un champion à chaque joueur, en un geste.

![Accueil, résultat d'un tirage en duos et groupes sauvegardés](docs/tirage.webp)

## Comment ça marche

1. **Choisis le format** : Duos (8 équipes de 2) ou Trios (6 équipes de 3).
2. **Entre les pseudos** de tes amis, ou recharge un groupe déjà enregistré.
3. **Lance le tirage** : les équipes sont formées et chacun reçoit son champion.

Le résultat ne te plaît pas ? Relance d'un geste. Il te plaît ? Partage-le sur Discord ou dans le chat du lobby.

## Ce que fait l'app

- 🎲 **Équipes aléatoires**, ou dans l'ordre d'inscription pour jouer avec ton duo habituel
- 🏆 **Un champion par joueur, jamais deux fois le même**, parmi tous les champions du jeu
- 🚫 **Bannissement automatique** des champions les plus forts du moment, d'après les statistiques Arena d'[op.gg](https://www.op.gg/lol/modes/arena) : les plus joués, ceux qui gagnent le plus, ou un mélange des deux
- 💾 **Tes pseudos sont retenus** d'une partie à l'autre, et tu peux **enregistrer plusieurs groupes** pour passer d'une bande d'amis à l'autre
- 📶 **Fonctionne hors ligne** : seul le bannissement automatique a besoin d'internet
- 🔒 **Aucun compte, aucune publicité** : tout reste sur ton téléphone
- 🇫🇷 Interface en français

![Bannissement automatique, tirage en trios et accueil](docs/trios.webp)

## Une ambiance de client LoL

L'app reprend l'univers du client League of Legends : noir et or « Hextech », panneaux aux coins biseautés, titres gravés et portraits officiels des champions. C'est la version mobile du site [LoL Random Arena](https://github.com/Forthtilliath/lol-random-arena), avec la même identité visuelle.

## Installer l'app

L'app est disponible sur **Android**. Télécharge le fichier `.apk` de la dernière version sur la page [Releases](https://github.com/Forthtilliath/lol-random-arena-mobile/releases), ouvre-le sur ton téléphone et autorise l'installation quand Android le demande.

## Pour les développeurs

<details>
<summary>Lancer le projet, scripts et construction de l'APK</summary>

### Lancer le projet

Projet [Expo](https://docs.expo.dev/) (React Native + TypeScript).

```bash
git clone https://github.com/Forthtilliath/lol-random-arena-mobile.git
cd lol-random-arena-mobile
npm install
npm start
```

Scanne ensuite le QR code avec l'app [Expo Go](https://expo.dev/go), ou lance `npm run android`.

### Scripts

| Commande                 | Description                                                    |
| ------------------------ | -------------------------------------------------------------- |
| `npm start`              | Serveur de développement Expo                                  |
| `npm run android`        | Ouvre l'app sur Android                                        |
| `npm test`               | Tests unitaires (Jest)                                         |
| `npm run typecheck`      | Vérification des types (tsc)                                   |
| `npm run lint`           | Lint et format (Biome)                                         |
| `npm run format`         | Corrige le lint et le format                                   |
| `npm run sync-champions` | Met à jour les champions et leurs portraits depuis Data Dragon |

Après la sortie d'un nouveau champion, lance `npm run sync-champions` : le script régénère la liste des champions et télécharge les portraits manquants.

### Construire un APK de release

L'APK de release est signé avec une clé propre à l'app, jamais avec le `debug.keystore` public de React Native (plugin `withReleaseSigning` de [`@forthtilliath/expo-config-plugins`](https://www.npmjs.com/package/@forthtilliath/expo-config-plugins)). Sans cette clé, `gradlew assembleRelease` échoue (« Keystore file not set »).

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

3. Construire : `npx expo prebuild --platform android --clean`, puis `cd android && ./gradlew assembleRelease`.

L'APK n'embarque que le code natif des téléphones ARM (plugin `withAndroidAbis`) ; `npm run android` cible de toute façon l'architecture de l'appareil branché, émulateur compris.

</details>

## Licence

Distribué sous licence [MIT](./LICENSE).

LoL Random Arena est un projet de fan non affilié à Riot Games. League of Legends et les portraits des champions sont la propriété de Riot Games, Inc.
