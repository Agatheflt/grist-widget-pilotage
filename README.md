# Pilotage de la stratégie SIGNAL

Widget personnalisé **Grist** pour piloter la stratégie de transformation numérique SIGNAL : saisons annuelles, chantiers, objectifs et sous-objectifs, sprints mensuels, backlog d'actions, revue mensuelle, gouvernance (risques, blocages, arbitrages, décisions) et jalons.

- **Grist reste la source de vérité** : le widget lit et écrit directement dans les tables du document où il est installé. Les indicateurs d'avancement sont des colonnes formules Grist, visibles aussi sans le widget.
- **Aucun serveur** : le widget est un ensemble de fichiers statiques (GitHub Pages) affichés dans une section Grist.
- **Identité visuelle** : couleurs et police Marianne du Système de Design de l'État (DSFR) ; accessibilité RGAA.
- **Instance cible** : Grist de l'État (`grist.numerique.gouv.fr`), données non sensibles.
- **Démarche** : conforme aux critères du [guide de contribution GristGouv](https://github.com/gristgouv/.github/blob/main/CONTRIBUTING-fr.md).

> **État du projet : spécifications (version 0.2, 12/11/2026).** Aucun code applicatif n'a encore été écrit.
> Les décisions sont suivies dans `docs/06-DECISIONS-ET-ARBITRAGES.md` ; TypeScript et licence MIT validés ; deux points restent ouverts pour la V2 : actions multi-chantiers et mise en œuvre des indicateurs en formules.

## Documentation

| Document | Contenu |
|---|---|
| [docs/00-RECHERCHE-TECHNIQUE.md](docs/00-RECHERCHE-TECHNIQUE.md) | Sources consultées, faits vérifiés sur l'API Grist, le DSFR et la démarche GristGouv, audit du projet de référence, points à valider |
| [docs/01-CAHIER-DES-CHARGES-FONCTIONNEL.md](docs/01-CAHIER-DES-CHARGES-FONCTIONNEL.md) | Besoins, rôles, règles métier, vues, parcours, indicateurs, critères d'acceptation (`FONC-xxx`, `CA-xxx`) |
| [docs/02-CAHIER-DES-CHARGES-TECHNIQUE.md](docs/02-CAHIER-DES-CHARGES-TECHNIQUE.md) | Architecture, modèle de données Grist, formules, règles d'accès, sécurité, déploiement (`TECH-xxx`) |
| [docs/03-PLAN-DE-DEVELOPPEMENT.md](docs/03-PLAN-DE-DEVELOPPEMENT.md) | Versions V1 à V4, tâches `Tx.yy`, matrice de traçabilité |
| [docs/04-STRATEGIE-DE-TESTS.md](docs/04-STRATEGIE-DE-TESTS.md) | Tests automatisés (dont tests dans un Grist local) et manuels (`TEST-xxx`), jeux de données fictives |
| [docs/05-GUIDE-DE-DEMARRAGE.md](docs/05-GUIDE-DE-DEMARRAGE.md) | Guide pas à pas pour une personne non développeuse |
| [docs/06-DECISIONS-ET-ARBITRAGES.md](docs/06-DECISIONS-ET-ARBITRAGES.md) | Réponses reçues, questions ouvertes, registre des décisions |
| [docs/07-DESIGN-SYSTEM-DSFR.md](docs/07-DESIGN-SYSTEM-DSFR.md) | Couleurs et police DSFR, composants du projet, accessibilité |
| [CLAUDE.md](CLAUDE.md) | Règles de travail des sessions Claude Code |

## Architecture recommandée (résumé)

```
ui/ (Preact, couleurs et police DSFR) → store/ (état, commandes) → domain/ (règles) → grist/ (seul accès à l'API Grist)
```

TypeScript + Vite + Preact (DEC-003, validée) ; tests Vitest, Playwright et Grist local (Docker) en intégration continue ; déploiement manuel d'une version validée sur GitHub Pages.

## Arborescence prévue

```
README.md, CLAUDE.md, CHANGELOG.md, LICENSE, SECURITY.md, package.json, configs (tsconfig, vite, vitest, playwright, eslint)
.github/workflows/      intégration continue et déploiement
index.html
src/grist/              adaptateur Grist (lecture, écriture, schéma, formules, synchronisation, identification)
src/domain/             modèles et règles métier (TypeScript pur)
src/store/              état de l'application et commandes
src/ui/                 composants de base, composants métier, vues
src/styles/             variables (tokens DSFR) et styles du projet
tests/                  unit/, composants/, e2e/, grist/, harnais/, support/, fixtures/
outils/                 sonde de validation Grist, vitrine des composants
docs/                   spécifications, recette, règles d'accès, contrat de données
donnees-privees/        (exclu de Git) fichiers réels de travail — jamais publiés
```

## Démarrage

Voir [docs/05-GUIDE-DE-DEMARRAGE.md](docs/05-GUIDE-DE-DEMARRAGE.md).

## Données

Ce dépôt est **public** et ne contient **que des données fictives**. Aucune donnée opérationnelle, aucun identifiant, jeton ou secret ne doit y figurer.
