# Changelog

Toutes les évolutions notables de ce projet sont documentées ici.

Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), et le projet suit le [Semantic Versioning](https://semver.org/lang/fr/) (`MAJOR.MINOR.PATCH`).

## [Unreleased]

### Modifié

- Le compteur de bannissements accepte aussi une saisie au clavier entre les boutons − et +.
- L'écran d'erreur propose « Réessayer » ; sur les écrans Résultat et Mes groupes, la flèche retour reste disponible.
- Interrupteurs, onglets, compteur, écran d'erreur, retours haptiques et plugins de build proviennent désormais des paquets partagés `@forthtilliath/*` (ts-kit, react-native-kit, expo-config-plugins).

## [1.0.0] - 2026-09-26

Première version, portage mobile du site [LoL Random Arena](https://github.com/Forthtilliath/lol-random-arena).

### Ajouté

- Tirage des équipes du mode Arena : **Duos** (8 équipes de 2) ou **Trios** (6 équipes de 3), aléatoires ou par ordre d'inscription.
- Un champion par joueur, **sans doublon** dans le lobby, parmi 173 champions ; portraits embarqués, le tirage fonctionne hors ligne.
- **Bannissement automatique** d'après les statistiques Arena d'op.gg : par popularité, par taux de victoire ou mixte (les deux à parts égales).
- Écran de résultat avec **Relancer** et **Partager** (résumé texte du tirage).
- Pseudos et réglages retenus automatiquement d'une ouverture à l'autre ; **groupes sauvegardés** (charger, remplacer, supprimer) ; dernier tirage consultable depuis l'accueil.
- Thème « Hextech » identique au site : palette du client LoL, panneaux à coins biseautés, titres en Cinzel, icône et écran de démarrage dédiés.
- Script `npm run sync-champions` pour mettre à jour la liste et les portraits depuis Data Dragon.
- CI GitHub Actions (lint Biome, types, tests Jest).
