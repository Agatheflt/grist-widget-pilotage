# CLAUDE.md — Règles de travail pour Pilotage de la stratégie SIGNAL

Ce fichier s'applique à **toutes** les sessions Claude Code sur ce dépôt. La responsable du projet est novice en développement : expliquer simplement, en français, ce qui est fait et pourquoi.

## 1. Avant toute action

1. Lire `docs/03-PLAN-DE-DEVELOPPEMENT.md` pour identifier la tâche demandée, ses prérequis et sa définition de terminé.
2. Lire les sections de `docs/01` (fonctionnel), `docs/02` (technique), `docs/04` (tests) et `docs/07` (DSFR) citées par la tâche.
3. Vérifier dans `docs/06-DECISIONS-ET-ARBITRAGES.md` que les décisions nécessaires sont **validées**. Si une décision requise est encore « À valider », s'arrêter et demander.
4. Vérifier que la version précédente a été validée humainement (`docs/03` §6).

## 2. Périmètre

- Ne réaliser **que** la tâche demandée. Pas de fonctionnalité hors périmètre, pas d'« amélioration » non demandée.
- Si un besoin non prévu apparaît : le noter dans `docs/06` partie C et demander, ne pas l'implémenter.
- Ne jamais transformer une proposition (`Proposé`, `À valider`) en décision validée sans accord explicite écrit de la responsable.

## 3. Architecture (non négociable sans décision validée)

- Couches : `ui/` → `store/` → `domain/` ; `grist/` est le **seul** code qui touche `window.grist` (`docs/02` §1.1).
- `domain/` reste en TypeScript pur, sans dépendance.
- Noms de tables et colonnes Grist uniquement dans `src/grist/schema.ts`.
- Un geste utilisateur = un seul `applyUserActions` (données + journal).
- Aucune écriture dans Grist sans action explicite de l'utilisateur ; jamais au chargement.
- Interdits : `innerHTML`, `dangerouslySetInnerHTML`, `eval`, `new Function`, scripts ou polices chargés depuis un CDN (sauf `grist-plugin-api.js`), requêtes réseau vers des tiers, `getAccessToken`.
- Toute nouvelle dépendance npm d'exécution : justification dans `docs/06` et accord préalable.
- Ne jamais supposer qu'une méthode de l'API Grist existe : se référer à `docs/00` ; en cas de doute, vérifier la documentation officielle et consigner le résultat dans `docs/00`.
- Les indicateurs sont des **colonnes formules Grist** (`src/grist/formules/*.py`) : le widget les lit, il ne les recalcule pas (sauf retard, alertes et temps écoulé, qui dépendent de la date du jour).
- La sécurité par rôle repose sur les **règles d'accès Grist** (`docs/regles-acces-grist.md`) ; le widget ne fait qu'adapter l'affichage au rôle.

## 3 bis. Critères du guide de contribution GristGouv

Le dépôt est public et doit rester « prêt à forker » (https://github.com/gristgouv/.github/blob/main/CONTRIBUTING-fr.md) :
- code **lisible et défendable sans assistant d'IA** : fonctions courtes, noms explicites en français, commentaires utiles, pas de verbosité inutile ;
- **aucun code mort**, aucune dépendance superflue ;
- tests unitaires des fonctionnalités principales **et** tests d'intégration dans un vrai Grist (`npm run test:grist`) ;
- aucune requête externe non documentée, aucune donnée hors Grist ;
- `README.md` à jour (rôle, configuration, dépendances) ;
- failles de sécurité : jamais en issue publique (voir `SECURITY.md`).

## 4. Interface

- Respect strict de `docs/07-DESIGN-SYSTEM-DSFR.md` : **uniquement les couleurs (tokens) et la police Marianne du DSFR** ; **aucun composant DSFR** (ni classes `fr-*` de composants, ni JavaScript DSFR) ; réutiliser les composants de `src/ui/composants/base/` ; aucune couleur hors palette ; pas de bloc marque ni de logo Marianne.
- Accessibilité RGAA : clavier, focus, textes alternatifs, couleur jamais seule porteuse d'information.
- Textes de l'interface en français, sans jargon technique.

## 5. Méthode

1. Créer une branche `tache/<ID>-<mot-clé>` (jamais de travail direct sur `main`).
2. Procéder par **petites étapes** ; écrire les tests **avant ou avec** le code (valeurs attendues des indicateurs écrites avant l'implémentation).
3. Exécuter `npm run verifier` en local. Les tests dans un navigateur (`test:e2e`) et dans un Grist local (`test:grist`) tournent **uniquement sur GitHub (CI)** : pour une tâche d'interface, la tâche n'est terminée que lorsque la CI est verte. Ne jamais déclarer une tâche terminée si une vérification échoue ou n'a pas pu être lancée — le dire explicitement.
4. Mettre à jour : `CHANGELOG.md`, le statut de la tâche dans `docs/03`, les spécifications concernées si un écart est constaté.
5. Résumer à la responsable : ce qui a été fait, résultats des vérifications, ce qui reste, décisions éventuelles à prendre.
6. Ne pas commiter, pousser, fusionner, créer de tag ou de PR sans que la responsable l'ait demandé ou accepté dans la session.

## 6. Données et sécurité

- **Uniquement des données fictives** dans le code, les tests, les fixtures, les captures, les exemples, les commits, les issues et les PR (noms du type « Dominique Test », « Alex Fictif »).
- Ne jamais lire, modifier ou supprimer des **données réelles** d'un document Grist sans autorisation explicite pour cette opération précise.
- Ne jamais publier de données sensibles : pas d'URL de document Grist réel, pas d'identifiant, jeton, mot de passe, adresse interne.
- Les journaux console ne contiennent aucun contenu métier.
- `npm run verifier:secrets` doit rester vert.
- **Dépôt public** : le dossier `donnees-privees/` (fichier Excel de pilotage, etc.) n'est jamais ajouté à Git ; avant tout commit, vérifier `git status`. Les fichiers réels servent uniquement à comprendre la structure ; aucune valeur réelle n'est recopiée dans le code, les tests ou la documentation.
- Toute compétence (« skill ») ou extension tierce n'est installée qu'avec l'accord explicite de la responsable (ex. `testdino-hq/playwright-skill`, DEC-022).

## 6 bis. Sobriété du poste de la responsable

La responsable ne veut pas que son ordinateur soit sollicité ou encombré par les outils du projet.

- **Ne rien installer hors du dossier du projet sans accord préalable explicite**, en indiquant ce qui sera installé, où et la taille approximative. Cela vaut pour les navigateurs Playwright (`npx playwright install`), Docker, les paquets npm globaux (`-g`), les extensions, les compétences et tout autre logiciel.
- Les seules installations autorisées sans demander sont les dépendances du projet dans `node_modules/` (`npm install` / `npm ci`), nécessaires à `npm run verifier`.
- Les traitements lourds (tests dans un navigateur, Grist local, audits) sont exécutés par la CI GitHub, pas sur le poste.
- Ne pas lancer de serveur ou de processus qui reste actif après la tâche ; arrêter tout serveur démarré pour une vérification.
- Après une tâche, signaler tout fichier volumineux créé hors du dossier du projet.

## 7. Déploiement

- **Aucun déploiement** (GitHub Pages ou interne) sans validation explicite de la responsable dans la session.
- Aucun tag de version sans PV de recette validé (`docs/recette/`).
- Toujours rappeler la sauvegarde du document Grist avant une mise à jour de structure.

## 8. Fin de version

À la fin de chaque version (V1…V4), s'arrêter et présenter le bilan prévu dans `docs/03` §6. Ne pas commencer la version suivante sans validation écrite.

## 9. Commandes utiles (après T1.01)

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur local (`http://localhost:5173/`) |
| `npm run verifier` | Lint + types + tests + secrets + build |
| `npm test` | Tests unitaires, intégration, composants |
| `npm run test:e2e` | Tests de bout en bout et accessibilité — **exécutés par la CI GitHub uniquement** (navigateurs non installés sur le poste) |
| `npm run build` | Construction de `dist/` |
