# 03 — Plan de développement

> Version : 0.1 — 12/11/2026 — Statut : **Proposé — à valider**
> Ce plan est **le fil conducteur des sessions Claude Code**. Il est mis à jour à la fin de chaque tâche (colonne Statut).

## 1. Mode d'emploi

- Le développement avance **version par version** (V1 → V4). Chaque version se termine par une **validation humaine** (§6) ; aucune tâche de la version suivante ne commence avant.
- Chaque tâche est réalisable en une session Claude Code, sur une branche dédiée `tache/<ID>-<mot-clé>`, et se termine par une PR.
- Statuts possibles : `À faire`, `En cours`, `Terminée`, `Bloquée (motif)`.
- **Définition de terminé commune (DoD)** à toutes les tâches, en plus de la DoD propre à chaque tâche :
  1. Code conforme à `02` (couches, conventions) et à `07` (DSFR) ;
  2. tests listés écrits et verts ; `npm run verifier` vert ;
  3. aucune donnée réelle ni secret ;
  4. `CHANGELOG.md` mis à jour ; statut de la tâche mis à jour ici ;
  5. documents de spécification modifiés si la tâche a révélé un écart (avec mention dans `06` si c'est une décision).

### Prérequis de démarrage (avant T1.01)

Décisions obtenues le 12/11/2026 : Q-002 (dépôt public), DEC-008 (couleurs et polices DSFR seulement). DEC-003 (TypeScript + Vite + Preact) et Q-013 (licence MIT) validées le 12/11/2026, sous condition de fonctionnement dans Grist (vérifiée en T1.02 puis T1.18). **Plus aucune décision ne bloque T1.01.** Prévoir aussi un compte GitHub (voir `05`) et l'acceptation des modalités DSFR par la responsable lors de T1.03.

## 2. V1 — Fondations

**Objectifs** : socle technique sûr et testé ; connexion à Grist validée ; schéma de données créé ; utilisateurs, rôles et règles d'accès ; saisons, chantiers, objectifs et sous-objectifs gérables dans une première interface aux couleurs et polices DSFR.

**Fonctionnalités** : FONC-001 à 004, 010 à 012, 020 à 025, 027 à 029, 070, 071, 080 à 083, 087 ; UX-001 à 013, 020 à 025 ; SECF-001 à 007 ; TECH-001 à 046, 055, 060 à 071, 080 à 093, 100 à 113 (sauf 112), 120 à 134, 157 à 161.

**Dépendances** : Node.js et Git installés ; compte GitHub ; compte sur `grist.numerique.gouv.fr` (ou instance de test) avec un document de test fictif  ; préciser le titulaire du copyright MIT.

| ID | Tâche | Prérequis | Exigences | Statut |
|---|---|---|---|---|
| T1.01 | Initialiser le projet | Décisions de démarrage | TECH-001, 010–013, 020–022, 030 | Terminée (12/11/2026, PR #1) |
| T1.02 | Valider l'API Grist (sonde) | T1.01 | VAL-01…19, TECH-060, 064, 065, 080 | En cours |
| T1.03 | Intégrer couleurs et polices DSFR, thème, CSP | T1.01 | UX-020, 023, TECH-113, 120 | À faire |
| T1.22 | Composants de base et vitrine | T1.03 | UX-004–009, 020–022 | À faire |
| T1.04 | Modèles du domaine | T1.01 | TECH-031, 071 | À faire |
| T1.05 | Encodage Grist | T1.02, T1.04 | TECH-070, 071, ERR-07–09 | À faire |
| T1.06 | Schéma, vérification, initialisation, migrations | T1.02, T1.04 | FONC-080, TECH-040–046, 055, 056 | À faire |
| T1.07 | Source de données réelle et faux Grist | T1.05, T1.06 | TECH-011, 061–067, RG-050 | À faire |
| T1.08 | Synchronisation | T1.07 | FONC-082, TECH-080–083 | À faire |
| T1.09 | Store, commandes, journal, préférences | T1.07 | TECH-090–093, FONC-027, TECH-003 | À faire |
| T1.10 | Coquille de l'interface | T1.22, T1.09 | UX-001–013, FONC-083, ERR-01, ERR-13 | À faire |
| T1.11 | Écran d'initialisation et démonstration | T1.06, T1.10 | FONC-080, FONC-081, SECF-003, SECF-006 | À faire |
| T1.12 | Saisons | T1.10 | FONC-001–004, RG-002–004, RG-051 | À faire |
| T1.13 | Référentiels (personnes avec rôles, équipes, chantiers) | T1.10 | FONC-010, FONC-070, FONC-071 | À faire |
| T1.21 | Identification, rôles et règles d'accès | T1.13, T1.02 (VAL-17) | FONC-087, TECH-160, 161, DEC-016, DEC-023 | À faire |
| T1.14 | Vue Chantiers | T1.12, T1.13 | FONC-011, FONC-012, RG-005, RG-006 | À faire |
| T1.15 | Règles des objectifs | T1.09 | FONC-020–025, 029, RG-010–012 | À faire |
| T1.16 | Vue Objectifs | T1.14, T1.15 | FONC-020–025, 027–029 | À faire |
| T1.17 | Tests E2E, accessibilité, harnais V1 | T1.11–T1.16, T1.21 | UX-021, 022, SECF-002, 004, 005 | À faire |
| T1.20 | Tests d'intégration dans un Grist local (Docker, CI) | T1.11, T1.17 | TECH-157–159, DEC-021 | À faire |
| T1.18 | Déploiement GitHub Pages | T1.20, DEC-007 | TECH-101, 9.x de `02` | À faire |
| T1.19 | Recette V1 dans Grist et livraison v1.0.0 | T1.18 | Toutes V1 | À faire |

Ordre d'exécution conseillé : T1.01, T1.02, T1.03, T1.22, T1.04 à T1.13, T1.21, T1.14 à T1.17, T1.20, T1.18, T1.19 (les identifiants ne sont jamais renumérotés).

### Fiches des tâches V1

**T1.01 — Initialiser le projet**
- Fichiers : `package.json`, `package-lock.json`, `.nvmrc`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `playwright.config.ts`, `eslint.config.js`, `.prettierrc`, `.gitignore`, `index.html`, `src/main.tsx`, `src/config.ts`, `CHANGELOG.md`, `.github/workflows/ci.yml`, `tests/unit/exemple.test.ts`.
- Instructions : créer le projet Vite (modèle Preact + TypeScript) ; TypeScript `strict` ; installer Vitest, Testing Library, Playwright, ESLint (avec règles TECH-013 et TECH-110), Prettier, stylelint ; créer les scripts npm de `04` §3 (`verifier:secrets` sous forme de script Node dans `scripts/verifier-secrets.mjs`) ; CI exécutant `npm ci` puis `npm run verifier` et `npm run test:e2e` ; `.gitignore` incluant `node_modules/`, `dist/`, `coverage/`, `test-results/`, `playwright-report/`, `.env*`, **`donnees-privees/`** (DEC-026), `*.xlsx` ; fichiers `LICENSE` (MIT, Q-013) et `SECURITY.md` (signalement via la VDP de l'État, jamais en issue publique) ; README conforme au guide GristGouv (rôle, configuration, dépendances).
- Tests : un test trivial par outil (Vitest, Playwright sur une page vide).
- DoD : `npm run verifier` passe en local ; `npm run verifier` et `npm run test:e2e` passent en CI ; `npm run dev` affiche « Pilotage de la stratégie SIGNAL — initialisation ».

**T1.02 — Valider l'API Grist (sonde)**
- Fichiers : `outils/sonde-grist/index.html`, `outils/sonde-grist/sonde.ts`, `docs/00-RECHERCHE-TECHNIQUE.md` (§8 « Résultats de validation »).
- Instructions : page minimale (servie par `npm run dev` à `/outils/sonde-grist/`) qui appelle `grist.ready({requiredAccess:'full'})`, journalise à l'écran (pas de données réelles) les retours de `onOptions`, `listTables`, `fetchTable` (y compris `_grist_Tables`, `_grist_Tables_column`), propose des boutons pour exécuter chaque essai VAL-01 à VAL-19 sur un **document de test fictif**, en priorité sur `grist.numerique.gouv.fr` (VAL-15 : URL personnalisée acceptée ?). La responsable exécute les essais dans Grist avec Claude Code (procédure écrite pas à pas dans la page).
- Tests : `TEST-G-01` à `TEST-G-19`.
- DoD : résultats consignés dans `00` §8 avec « confirmé / infirmé / partiel » ; si VAL-01 est infirmé, `DEC-006` est réexaminée et `02` §5.8 ajusté avant T1.08.

**T1.03 — Intégrer couleurs et polices DSFR, thème, CSP**
- Fichiers : `src/main.tsx`, `src/theme-initial.ts`, `index.html` (CSP), `src/styles/variables.css`, `src/styles/base.css`, éventuellement `scripts/extraire-tokens-dsfr.mjs`.
- Instructions : installer `@gouvfr/dsfr@1.15.4` (la responsable accepte elle-même les modalités) ; importer **seulement** `core` et `scheme` (`07` §1) ; vérifier l'absence d'effets indésirables de `core` (sinon repli : extraction des tokens) ; thème Système/Clair/Sombre ; CSP de TECH-113 ; aucun JavaScript DSFR.
- Tests : `TEST-SEC-07`, `TEST-VIS-02`, `TEST-E2E-THEME`.
- DoD : police Marianne et couleurs chargées localement (aucune requête externe), clair et sombre fonctionnels.

**T1.22 — Composants de base et vitrine**
- Fichiers : `src/ui/composants/base/*.tsx` (Bouton, Alerte, Bandeau, Modale, Badge, Etiquette, Onglets, ChampTexte, ZoneTexte, ChampDate, ListeDeroulante, CaseACocher, GroupeRadio, Interrupteur, ControleSegmente, Tableau, Pagination, Infobulle, Accordeon, IndicateurEtapes, Tuile, ChoixTheme), `src/ui/icones.tsx`, `outils/vitrine/`.
- Instructions : `07` §2 ; éléments HTML natifs en priorité ; motifs ARIA de référence ; classes `sg-*` ; un fichier par composant, court et commenté.
- Tests : `TEST-C-02`, `TEST-C-03`, `TEST-C-06`, `TEST-C-11`, `TEST-A11Y-01`, `TEST-A11Y-03`, `TEST-A11Y-04` sur la vitrine.
- DoD : vitrine validée visuellement par la responsable en clair et sombre ; zéro violation axe-core.

**T1.04 — Modèles du domaine**
- Fichiers : `src/domain/modeles.ts`, `listes-valeurs.ts`, `dates.ts`, tests `tests/unit/domain/dates.test.ts`.
- Instructions : types de chaque table de `02` §4.3 ; listes de valeurs uniques ; utilitaires de dates ISO (mois, bornes, aujourd'hui injectable).
- Tests : tests des utilitaires de dates (fin de mois, années bissextiles).
- DoD : aucune dépendance hors `domain/`.

**T1.05 — Encodage Grist**
- Fichiers : `src/grist/encodage.ts`, `src/grist/types-api.ts`, tests.
- Instructions : implémenter le tableau `02` §5.5 conformément aux résultats de T1.02.
- Tests : `TEST-U-ENC-01` à `04`.
- DoD : 100 % des branches de `encodage.ts` couvertes.

**T1.06 — Schéma, vérification, initialisation, migrations**
- Fichiers : `src/grist/schema.ts`, `verification-schema.ts`, `initialisation.ts`, `actions-utilisateur.ts`.
- Instructions : décrire les 16 tables de `02` §4.3 (dont `Profils`, `ReleveMensuel`) (types, choix, formules, formules de déclenchement selon VAL-11) ; comparer avec le schéma réel ; générer les actions d'initialisation ; mécanisme `migrations[N]`.
- Tests : `TEST-U-SCH-01` à `03`, `TEST-U-ACG-01`.
- DoD : l'initialisation appliquée au `FauxGrist` produit un schéma que la vérification déclare complet.

**T1.07 — Source de données réelle et faux Grist**
- Fichiers : `src/grist/source-donnees.ts`, `client-grist.ts`, `tests/support/faux-grist.ts`, `tests/support/fabriques.ts`, `tests/fixtures/jdd-vide.json`.
- Instructions : interface `SourceDonnees` (`02` §5.2) ; client réel ; faux Grist fidèle (atomicité, refus d'écriture simulable, identifiants séquentiels, colonnes inconnues refusées).
- Tests : `TEST-I-04`, `TEST-I-05`, tests propres du faux Grist.
- DoD : mêmes tests de contrat passés par `FauxGrist` (et par `ClientGrist` dans la sonde T1.02, manuellement).

**T1.08 — Synchronisation**
- Fichiers : `src/grist/synchro.ts`.
- Instructions : `02` §5.8 et §5.9 (anti-rebond 300 ms, comparaison de signature, secours, état affiché).
- Tests : `TEST-U-SYN-01`, `TEST-U-SYN-02`, `TEST-I-07`.
- DoD : en recette (T1.19), `TEST-G-22` passe.

**T1.09 — Store, commandes, journal, préférences**
- Fichiers : `src/store/etat.ts`, `selecteurs.ts`, `commandes.ts`, `preferences.ts`, `src/domain/journal.ts`, `src/grist/journal-technique.ts`.
- Instructions : `02` §6 ; squelette de commande générique (valider → construire → appliquer → recharger → message) ; journal métier dans le même lot ; journal technique sans données (SECF-005).
- Tests : `TEST-I-01`, `TEST-I-08`, `TEST-I-10`, `TEST-U-JOU-01`, `TEST-U-PRF-01`.
- DoD : aucune écriture au chargement (TEST-I-08).

**T1.10 — Coquille de l'interface**
- Fichiers : `src/ui/App.tsx`, `src/ui/BarreSuperieure.tsx`, `src/ui/vues/etats/*` (AccesInsuffisant, HorsGrist, Chargement, ErreurChargement), `src/ui/format.ts`.
- Instructions : barre supérieure (saison, utilisateur connecté et rôle — rempli par T1.21, actualiser, thème, version) ; onglets (vues V2/V3 masquées) ; bandeaux lecture seule ; région `aria-live` ; lien d'évitement.
- Tests : `TEST-C-04`, `TEST-C-05`, `TEST-C-09`, `TEST-E2E-ERR`, `TEST-E2E-THEME`.
- DoD : navigation clavier complète de la coquille.

**T1.11 — Écran d'initialisation et démonstration**
- Fichiers : `src/ui/vues/initialisation/*`, `src/domain/demo/jeu-demo.ts`, `tests/fixtures/jdd-demo.json`.
- Instructions : FONC-080 (liste des manques, bouton, confirmation, résultat), FONC-081 ; contrôle de cohérence (ERR-10) en lecture.
- Tests : `TEST-E2E-P1`, `TEST-U-DEM-01`, `TEST-I-08`.
- DoD : P1 complet sur le harnais.

**T1.12 — Saisons**
- Fichiers : `src/domain/regles/saisons.ts`, `src/ui/vues/saisons/*` (sélecteur, formulaire, changement de statut, préparation de la suivante, reconduction d'objectifs).
- Tests : `TEST-U-SAI-01` à `06`, `TEST-I-09`, `TEST-I-11`, `TEST-E2E-P2`, `TEST-E2E-P9`.
- DoD : P2 et P9 complets.

**T1.13 — Référentiels**
- Fichiers : `src/domain/regles/chantiers.ts`, `src/domain/regles/personnes.ts`, `src/ui/vues/referentiels/*`.
- Instructions : personnes avec `Role` et `Courriel` (unicité, format) ; la création/suppression d'une personne crée/supprime sa ligne `Profils` dans le même lot.
- Tests : `TEST-U-CHA-01`, `TEST-U-REF-01`, `TEST-U-REF-02`, `TEST-I-02` (partie référentiels).
- DoD : désactivation au lieu de suppression pour les éléments référencés.

**T1.21 — Identification, rôles et règles d'accès**
- Fichiers : `src/grist/identification.ts`, `src/store/etat.ts` (utilisateur courant), `src/domain/roles.ts` (actions permises par rôle), `docs/regles-acces-grist.md` (procédure pas à pas pour la propriétaire, avec captures sur données fictives).
- Instructions : lecture de `Profils` sans écriture (DEC-016, VAL-17) ; affichage « Connecté : Nom (Rôle) » ; masquage des actions non permises ; écrire les règles d'accès de TECH-160 et la procédure pour les appliquer dans Grist ; les tester avec deux comptes fictifs.
- Tests : `TEST-U-ROL-01`, `TEST-U-PRO-01`, `TEST-C-05`, `TEST-G-31`.
- DoD : CA-087 et CA-024 vérifiés dans un vrai document Grist.

**T1.14 — Vue Chantiers**
- Fichiers : `src/ui/vues/chantiers/*`.
- Tests : `TEST-U-CHA-02`, `TEST-E2E-NAV` (partie chantiers).
- DoD : liste + fiche conformes à `01` §11.2.

**T1.15 — Règles des objectifs**
- Fichiers : `src/domain/regles/objectifs.ts`, `src/domain/validation.ts`.
- Tests : `TEST-U-OBJ-01` à `07`.
- DoD : machine à états couverte à 100 %.

**T1.16 — Vue Objectifs**
- Fichiers : `src/ui/vues/objectifs/*`, `src/ui/composants/metier/ArbreObjectifs.tsx`.
- Tests : `TEST-C-01`, `TEST-C-10`, `TEST-E2E-P3`, `TEST-E2E-P4`.
- DoD : P3 et P4 complets, au clavier.

**T1.17 — Tests E2E, accessibilité, harnais V1**
- Fichiers : `tests/harnais/*`, `tests/e2e/*`.
- Instructions : au début de la tâche, **proposer** l'installation de la compétence `testdino-hq/playwright-skill` (packs `core` et `ci`) citée par le guide GristGouv, et ne l'installer qu'avec l'accord de la responsable (DEC-022) ; relire et exécuter chaque test produit avec son aide.
- Tests : `TEST-A11Y-01` à `04`, `TEST-A11Y-06`, `TEST-VIS-01`, `TEST-VIS-02`, `TEST-SEC-01` à `06`, `TEST-ARCH-01`, `TEST-E2E-RESP`.
- DoD : toute la suite V1 verte en CI.

**T1.20 — Tests d'intégration dans un Grist local**
- Fichiers : `tests/grist/*.spec.ts`, `tests/grist/demarrer-grist.mjs`, `.github/workflows/ci.yml` (service Docker `gristlabs/grist`, version figée), script `test:grist`.
- Instructions : `02` §9.7 bis ; clé d'API générée à la volée pour le conteneur, jamais enregistrée ; scénario minimal GristGouv (création d'un document, ajout du widget, initialisation, création d'une saison et d'un objectif, vérification des lignes dans Grist, synchronisation après modification d'une cellule).
- Tests : `TEST-GR-01`, `TEST-GR-03`, `TEST-GR-04`.
- DoD : suite verte en CI (aucune exécution sur le poste de la responsable).

**T1.18 — Déploiement GitHub Pages**
- Fichiers : `.github/workflows/deploiement-pages.yml`, `vite.config.ts` (`base`).
- Instructions : `02` §9.3 ; déploiement manuel d'un tag ; **à n'exécuter qu'après accord explicite** (CLAUDE.md) ; vérifier VAL-15 avec l'URL publiée sur `grist.numerique.gouv.fr`.
- Tests : `TEST-DEP-01` à `03`.
- DoD : URL publiée fonctionnelle dans le document de test fictif sur `grist.numerique.gouv.fr`.

**T1.19 — Recette V1 et livraison**
- Fichiers : `docs/recette/v1.0.0.md`, `CHANGELOG.md`, `README.md`.
- Tests : `TEST-G-20` à `25`, `TEST-DEP-04`, `TEST-DEP-05`.
- DoD : PV signé par la responsable ; tag `v1.0.0`.

**Critères d'acceptation V1** : CA-001 à CA-004, CA-010 à CA-012, CA-020 à CA-024, CA-026 à CA-028, CA-070, CA-080 à CA-083, CA-087, CA-100 à CA-105.

**Risques V1**

| Risque | Probabilité | Impact | Parade |
|---|---|---|---|
| VAL-01 infirmé (pas d'événement via `Synchro`) | Moyenne | Moyen | Secours TECH-082 ; envisager un rafraîchissement périodique léger (toutes les 30 s, désactivable) |
| Formules de déclenchement non créables via l'API (VAL-11) | Moyenne | Faible | Procédure manuelle guidée dans `05` |
| URL personnalisée refusée par `grist.numerique.gouv.fr` (VAL-15) | Faible à moyenne | Fort | Chemin B GristGouv (revue + audit) ; repli Widget Creator (`02` §9.6) |
| Identification par `Profils` infaisable (VAL-17) | Moyenne | Faible | Choix manuel de « Moi » ; sécurité inchangée (règles d'accès) |
| Accessibilité des composants maison (pas de composants DSFR audités) | Moyenne | Moyen | Éléments natifs, motifs ARIA, axe-core dès T1.22, test lecteur d'écran |
| Courbe d'apprentissage de l'outillage | Moyenne | Moyen | Guide `05`, commandes uniques (`npm run verifier`) |

**Livrables V1** : widget v1.0.0, document de test initialisé, `docs/regles-acces-grist.md`, PV de recette, `00` complété (§8).

**Conditions de passage à V2** : PV V1 validé ; `Q-012` (actions multi-chantiers) et `Q-014` (contenu de la revue mensuelle) tranchées.

## 3. V2 — Pilotage opérationnel (fin du MVP)

**Objectifs** : sprints, backlog et Kanban utilisables au quotidien ; avancement calculé dans Grist et visible par l'amiral ; revue mensuelle outillée.

**Fonctionnalités** : FONC-026, 030 à 036, 040 à 046, 048 à 054, 072, 085, 086 ; IND-001 à 006, 009, 010 ; TECH-044, 047.

**Dépendances** : V1 validée ; Q-012, Q-014 (Q-004 et Q-006 validées le 12/11/2026).

| ID | Tâche | Prérequis | Exigences | Statut |
|---|---|---|---|---|
| T2.01 | Règles des actions | V1 | FONC-040–046, 048–050, RG-030–032 | À faire |
| T2.02 | Indicateurs en formules Grist + calculs « du jour » du widget | T2.01, T1.20 | FONC-026, IND-001–006, 009, 010, TECH-044, 047 | À faire |
| T2.12 | Actions multi-chantiers | T2.01, Q-012 | FONC-054, FONC-044, RG-043 | À faire |
| T2.13 | Relevé mensuel | T2.02, Q-014 | FONC-085 | À faire |
| T2.14 | Page Grist « Synthèse SIGNAL » | T2.02, T2.13 | FONC-086 | À faire |
| T2.03 | Commandes des actions | T2.01 | FONC-040, 041, 049, 050, FONC-027 | À faire |
| T2.04 | Vue Backlog (liste, filtres, « Moi ») | T2.03 | FONC-052, 053, 072 | À faire |
| T2.05 | Formulaire d'action | T2.03 | FONC-040–046, 048, ERR-06 | À faire |
| T2.06 | Kanban | T2.04, T2.05 | FONC-051 | À faire |
| T2.07 | Règles des sprints | T2.01 | FONC-030–036, RG-020–025 | À faire |
| T2.08 | Vue Sprints : préparation, démarrage, suivi | T2.07, T2.04 | FONC-030–033 | À faire |
| T2.09 | Clôture, bilan, historique, annulation | T2.08 | FONC-034–036 | À faire |
| T2.10 | Avancement dans Chantiers et Objectifs | T2.02 | FONC-026, FONC-012 | À faire |
| T2.11 | E2E, accessibilité, recette V2, livraison v2.0.0 | T2.06, T2.09, T2.10, T2.12–T2.14 | Toutes V2 | À faire |

**Fiches V2**

- **T2.01** — `src/domain/regles/actions.ts`, `validation.ts`. Tests : `TEST-U-ACT-01` à `08`, `TEST-U-ACT-10`. DoD : toutes les règles §9 de `01` couvertes.
- **T2.02** — `src/grist/formules/*.py` (colonnes formules de `02` §4.3 : `Objectifs`, `ChantiersSaison`, `Saisons`, `Sprints`, `Actions.EnRetard`), migration de schéma ajoutant ces colonnes, `src/domain/indicateurs.ts` (seulement IND-006/008 « du jour »), `tests/fixtures/jdd-calc.json` (valeurs attendues écrites **avant** les formules). Tests : `TEST-GR-02`, `TEST-U-IND-04`, `TEST-U-IND-05`, `TEST-PERF-02`. DoD : valeurs des formules dans Grist local = valeurs attendues ; le widget affiche les colonnes formules sans les recalculer (RG-042).
- **T2.12** — `src/domain/regles/actions.ts` (porteur, associés), formulaire et backlog (mention « Contribue »). Tests : `TEST-U-ACT-11`, `TEST-GR-02` (cas multi-chantiers de `JDD-CALC`). DoD : CA-053.
- **T2.13** — `src/domain/releve.ts`, `src/ui/vues/releve/*` (bouton « Figer l'avancement du mois », tableau et courbe d'évolution). Tests : `TEST-U-REL-01`, `TEST-E2E-REL`. DoD : CA-085.
- **T2.14** — `docs/page-synthese-grist.md` (procédure pas à pas de création de la page native : sections, tri, graphique) ; création automatique par l'assistant si VAL-18 le permet. Tests : `TEST-G-32`. DoD : CA-086 vérifié avec un compte `Lecteur` fictif.
- **T2.03** — `src/store/commandes.ts` (actions). Tests : `TEST-I-02` (actions), `TEST-I-03`, `TEST-I-10`. DoD : chaque commande écrit son journal dans le même lot.
- **T2.04** — `src/ui/vues/backlog/Liste*.tsx`, `Filtres*.tsx`, `src/store/selecteurs.ts`. Tests : `TEST-U-FIL-01`, `TEST-U-FIL-02`, `TEST-E2E-FIL`. DoD : filtres en tags supprimables, pagination > 200 lignes.
- **T2.05** — `src/ui/vues/backlog/FormulaireAction.tsx`. Tests : `TEST-C-01`, `TEST-C-08`, `TEST-I-06`. DoD : cohérence des listes de choix (FONC-044) ; conflit ERR-06 géré.
- **T2.06** — `src/ui/composants/metier/Kanban*.tsx`, `CarteAction.tsx`. Tests : `TEST-E2E-P6`, `TEST-A11Y-02` (Kanban). DoD : glisser-déposer et alternative clavier ; retour de la carte en cas d'échec.
- **T2.07** — `src/domain/regles/sprints.ts` (plan de clôture pur). Tests : `TEST-U-SPR-01` à `08`. DoD : le plan de clôture est une fonction pure produisant la liste d'actions Grist.
- **T2.08** — `src/ui/vues/sprints/*`. Tests : `TEST-E2E-P5`. DoD : P5 complet.
- **T2.09** — `src/ui/vues/sprints/AssistantCloture*.tsx`, `Bilan*.tsx`. Tests : `TEST-E2E-P7`, `TEST-I-04`. DoD : atomicité vérifiée ; bilan figé (CA-035).
- **T2.10** — `src/ui/composants/metier/BarreProgression.tsx`, vues Chantiers/Objectifs. Tests : `TEST-C-07`. DoD : « Non mesurable » affiché correctement.
- **T2.11** — Tests : suite complète, `TEST-A11Y-05`, `TEST-G-26`, `TEST-G-30`. DoD : PV `docs/recette/v2.0.0.md`, tag `v2.0.0`.

**Critères d'acceptation V2** : CA-025, CA-030 à CA-036, CA-040 à CA-051, CA-053, CA-072, CA-085, CA-086, CA-106.

**Risques V2** : complexité de l'assistant de clôture (parade : plan de clôture pur et testé, UI simple) ; DnD peu fiable dans l'iframe (parade : alternative par menu toujours disponible) ; volumétrie du Kanban (parade : filtres par défaut sur le sprint en cours).

**Livrables V2** : MVP v2.0.0, PV de recette, guide utilisateur succinct (section dans `README.md`).

**Conditions de passage à V3** : PV V2 validé ; période d'usage d'au moins un cycle de sprint et une revue mensuelle (données fictives, ou réelles non sensibles sur `grist.numerique.gouv.fr` si la responsable le décide) ; retours consignés dans `06`.

## 4. V3 — Supervision

**Objectifs** : vision consolidée et préparation des réunions.

**Fonctionnalités** : FONC-047, 060 à 069 ; IND-007, 008, 011 ; UX-026 ; TECH-051, 112, 140 à 143.

| ID | Tâche | Prérequis | Exigences | Statut |
|---|---|---|---|---|
| T3.01 | Alertes et indicateurs temporels | V2 | IND-007, 008, 011, FONC-061 | À faire |
| T3.02 | Cockpit | T3.01 | FONC-060–062 | À faire |
| T3.03 | Gouvernance (risques, blocages, arbitrages, décisions) | V2 | FONC-063, 064, RG-040, 041 | À faire |
| T3.04 | Jalons | V2 | FONC-067 | À faire |
| T3.05 | Gantt | T3.04 | FONC-068 | À faire |
| T3.06 | Calendrier | T3.05 | FONC-068 | À faire |
| T3.07 | Revue de chantier | T3.02, T3.03 | FONC-065, UX-026 | À faire |
| T3.08 | Synthèse mensuelle | T3.07 | FONC-066 | À faire |
| T3.09 | Export CSV | V2 | FONC-069, TECH-051, 112 | À faire |
| T3.10 | Dépendances entre actions | V2 | FONC-047, RG-033 | À faire |
| T3.11 | Performances | T3.02, T3.05 | TECH-140–143 | À faire |
| T3.12 | ~~Règles d'accès par chantier~~ | — | — | **Retirée** (Q-008 : pas de restriction par chantier ; règles par rôle traitées en T1.21) |
| T3.13 | E2E, recette V3, livraison v3.0.0 | T3.01–T3.11 | Toutes V3 | À faire |

**Fiches V3**

- **T3.01** — `src/domain/alertes.ts`, `tests/fixtures/jdd-alertes.json`. Tests : `TEST-U-ALE-01`, `TEST-U-IND-05`.
- **T3.02** — `src/ui/vues/cockpit/*`, `TuileChantier.tsx`. Tests : `TEST-E2E-COCK`, `TEST-E2E-NAV`. DoD : clic alerte → vue filtrée.
- **T3.03** — `src/domain/regles/gouvernance.ts`, `src/ui/vues/gouvernance/*`. Tests : `TEST-U-GOU-01` à `03`, `TEST-E2E-GOUV`.
- **T3.04** — Jalons (règles + formulaire). Tests : `TEST-U-GOU-04`.
- **T3.05** — `src/ui/composants/metier/Gantt*.tsx`, calcul de positions dans `domain/`. Tests : `TEST-U-GOU-06`, `TEST-E2E-GANTT`, `TEST-A11Y-01`. DoD : équivalent tableau ; liste mobile.
- **T3.06** — `Calendrier.tsx`. Tests : `TEST-E2E-GANTT` (partie calendrier).
- **T3.07** — `src/ui/vues/revue/*`, styles d'impression. Tests : `TEST-U-GOU-05`, `TEST-E2E-P8`.
- **T3.08** — `src/ui/vues/synthese/*`. Tests : `TEST-U-GOU-05`, `TEST-E2E-SYN`.
- **T3.09** — `src/domain/export-csv.ts`. Tests : `TEST-U-EXP-01`, `TEST-E2E-SYN`.
- **T3.10** — Règles + affichage des dépendances. Tests : `TEST-U-ACT-09`.
- **T3.11** — `tests/fixtures/jdd-volume.json`. Tests : `TEST-PERF-01` à `03`. DoD : seuils atteints ou écart documenté dans `06`.
- **T3.12** — Retirée (Q-008).
- **T3.13** — Tests : `TEST-G-27`, `TEST-G-30`, suite complète. DoD : PV v3.0.0, tag.

**Critères d'acceptation V3** : CA-052, CA-060 à CA-069.

**Risques V3** : lisibilité du Gantt dans une section étroite (parade : liste chronologique) ; surcharge du cockpit (parade : test utilisateur avec la responsable sur maquette avant développement de T3.02) ; impression variable selon navigateur (parade : test Chrome/Edge/Firefox).

**Conditions de passage à V4** : PV V3 validé ; besoin éditorial exprimé (au moins une liste des données attendues par le futur widget).

## 5. V4 — Préparation des intégrations

**Objectifs** : modèle de données partagé, contrat pour le widget éditorial, optimisation, documentation finale.

**Fonctionnalités** : FONC-090, FONC-091, TECH-055/056 (première migration réelle), TECH-150 à 153, option de déploiement I2.

| ID | Tâche | Prérequis | Exigences | Statut |
|---|---|---|---|---|
| T4.01 | Contrat de données | V3 | FONC-091, TECH-152 | À faire |
| T4.02 | Tables éditoriales et migration schéma 2 | T4.01 | FONC-090, TECH-055, 056 | À faire |
| T4.03 | Optimisations (poids des polices, rendu) | V3 | TECH-143 | À faire |
| T4.04 | Étude de mutualisation du code (DEC-012) | T4.01 | TECH-152 | À faire |
| T4.05 | Build mono-fichier (Widget Creator) | V3 | `02` §9.6 I2 | À faire |
| T4.06 | Documentation finale | T4.01–T4.05 | TECH-153 | À faire |
| T4.07 | Recette finale, livraison v4.0.0 | T4.06 | Toutes V4 | À faire |

**Fiches V4**

- **T4.01** — `docs/contrat-donnees.md` (tables, colonnes, types, règles, stabilité garantie, colonnes réservées). Tests : `TEST-DOC-01`.
- **T4.02** — `schema.ts` v2, `migrations[2]`. Tests : `TEST-U-SCH-03`, `TEST-U-SCH-04`, `TEST-G-28`. DoD : migration testée sur une copie de document v1.
- **T4.03** — Sous-ensemble des graisses Marianne utiles, mémoïsation. Tests : `TEST-PERF-01` à `03`, `TEST-VIS-01` (pas de régression).
- **T4.04** — Note d'étude dans `06` (extraire `domain/` et `grist/` en paquet ? conditions). Pas de code sans validation.
- **T4.05** — `vite.config.monofichier.ts`, script `build:monofichier`. Tests : `TEST-G-29`. DoD : procédure dans `05`.
- **T4.06** — `README.md`, guide utilisateur, guide d'administration (`docs/guide-administration.md`), mise à jour de `00` à `07`.
- **T4.07** — PV v4.0.0, tag.

**Critères d'acceptation V4** : CA-090, CA-091 ; non-régression complète.

**Risques V4** : besoin éditorial encore flou (parade : tables minimales, additives) ; migration sur données réelles (parade : copie préalable, TEST-G-28).

## 6. Validation humaine entre versions

À la fin de chaque version, Claude Code **s'arrête** et présente :

1. la liste des tâches terminées et des écarts ;
2. le résultat de `npm run verifier` et de la CI ;
3. le PV de recette à compléter par la responsable ;
4. les décisions nécessaires pour la version suivante.

La responsable valide par écrit (message explicite dans la session, puis mention « Validé le JJ/MM/AAAA » dans le PV). Aucun tag, aucun déploiement, aucune tâche de la version suivante sans cette validation.

## 7. Matrice de traçabilité exigences ↔ tâches ↔ tests

### 7.1 Exigences fonctionnelles

| Exigence | Tâche(s) | Test(s) |
|---|---|---|
| FONC-001 | T1.12 | TEST-U-SAI-01, TEST-I-02, TEST-E2E-P2 |
| FONC-002 | T1.12 | TEST-U-SAI-02 |
| FONC-003 | T1.12 | TEST-U-SAI-04, TEST-I-01, TEST-E2E-P9 |
| FONC-004 | T1.12 | TEST-U-SAI-05, TEST-U-SAI-06, TEST-I-09, TEST-I-11, TEST-E2E-P2 |
| FONC-010 | T1.13 | TEST-U-CHA-01, TEST-I-02 |
| FONC-011 | T1.14 | TEST-U-CHA-02, TEST-I-02, TEST-E2E-P2 |
| FONC-012 | T1.14, T2.10 | TEST-E2E-NAV |
| FONC-020 | T1.15, T1.16 | TEST-U-OBJ-01, TEST-I-02, TEST-E2E-P3 |
| FONC-021 | T1.15, T1.16 | TEST-U-OBJ-01, TEST-I-02, TEST-E2E-P3 |
| FONC-022 | T1.15, T1.16 | TEST-U-OBJ-02, TEST-E2E-P3 |
| FONC-023 | T1.15 | TEST-U-OBJ-03 |
| FONC-024 | T1.15, T1.16, T1.21 | TEST-U-OBJ-04, TEST-U-ROL-01, TEST-E2E-P4, TEST-G-31 |
| FONC-025 | T1.15, T1.16, T1.21 | TEST-U-OBJ-05, TEST-C-10, TEST-E2E-P4, TEST-G-31 |
| FONC-026 | T2.02, T2.10 | TEST-GR-02, TEST-C-07 |
| FONC-027 | T1.09, T1.16, T2.03 | TEST-U-JOU-01, TEST-I-10, TEST-E2E-P4 |
| FONC-028 | T1.16 | TEST-U-OBJ-07, TEST-E2E-P3 |
| FONC-029 | T1.15 | TEST-U-OBJ-06 |
| FONC-030 | T2.07, T2.08 | TEST-U-SPR-01, TEST-I-02, TEST-E2E-P5 |
| FONC-031 | T2.07, T2.08 | TEST-U-SPR-02, TEST-E2E-P5 |
| FONC-032 | T2.07, T2.08 | TEST-U-SPR-03, TEST-E2E-P5 |
| FONC-033 | T2.07, T2.08 | TEST-U-SPR-04 |
| FONC-034 | T2.07, T2.09 | TEST-U-SPR-05, TEST-I-04, TEST-E2E-P7 |
| FONC-035 | T2.09 | TEST-U-SPR-08, TEST-E2E-P7 |
| FONC-036 | T2.07, T2.09 | TEST-U-SPR-07 |
| FONC-040 | T2.01, T2.03, T2.05 | TEST-U-ACT-01, TEST-I-02, TEST-C-01 |
| FONC-041 | T2.03, T2.05 | TEST-I-02 |
| FONC-042 | T2.01 | TEST-U-ACT-02 |
| FONC-043 | T2.01 | TEST-U-ACT-02 |
| FONC-044 | T2.01, T2.05, T2.12 | TEST-U-ACT-03, TEST-U-ACT-11, TEST-I-03 |
| FONC-045 | T2.01, T2.05 | TEST-U-ACT-04 |
| FONC-046 | T2.01, T2.05, T2.06 | TEST-U-ACT-05, TEST-E2E-P6 |
| FONC-047 | T3.10 | TEST-U-ACT-09 |
| FONC-048 | T2.05 | TEST-C-08 |
| FONC-049 | T2.01, T2.03 | TEST-U-ACT-07 |
| FONC-050 | T2.01, T2.03 | TEST-U-ACT-08 |
| FONC-051 | T2.06 | TEST-U-ACT-10, TEST-E2E-P6 |
| FONC-052 | T2.04 | TEST-U-FIL-01, TEST-E2E-FIL |
| FONC-053 | T2.04 | TEST-E2E-FIL |
| FONC-054 | T2.12 | TEST-U-ACT-11, TEST-GR-02 |
| FONC-060 | T3.02 | TEST-E2E-COCK, TEST-E2E-NAV |
| FONC-061 | T3.01, T3.02 | TEST-U-ALE-01, TEST-E2E-COCK |
| FONC-062 | T3.02, T3.04 | TEST-U-GOU-04, TEST-E2E-COCK |
| FONC-063 | T3.03 | TEST-U-GOU-01, TEST-I-02, TEST-E2E-GOUV |
| FONC-064 | T3.03 | TEST-U-GOU-02, TEST-E2E-P8 |
| FONC-065 | T3.07 | TEST-U-GOU-05, TEST-E2E-P8 |
| FONC-066 | T3.08 | TEST-U-GOU-05, TEST-E2E-SYN |
| FONC-067 | T3.04 | TEST-U-GOU-04, TEST-I-02, TEST-E2E-GANTT |
| FONC-068 | T3.05, T3.06 | TEST-U-GOU-06, TEST-E2E-GANTT |
| FONC-069 | T3.09 | TEST-U-EXP-01, TEST-E2E-SYN |
| FONC-070 | T1.13 | TEST-U-REF-01, TEST-U-REF-02, TEST-I-02 |
| FONC-071 | T1.13 | TEST-U-REF-01, TEST-I-02 |
| FONC-072 | T2.04 | TEST-U-FIL-02 |
| FONC-080 | T1.06, T1.11 | TEST-U-SCH-01, TEST-U-SCH-02, TEST-I-08, TEST-E2E-P1 |
| FONC-081 | T1.11 | TEST-U-DEM-01, TEST-E2E-P1 |
| FONC-082 | T1.08 | TEST-U-SYN-01, TEST-I-07, TEST-E2E-P6, TEST-G-22 |
| FONC-083 | T1.10 | TEST-I-05, TEST-E2E-ERR, TEST-G-24 |
| FONC-084 | Ultérieur | — |
| FONC-085 | T2.13 | TEST-U-REL-01, TEST-E2E-REL |
| FONC-086 | T2.14 | TEST-G-32 |
| FONC-087 | T1.21 | TEST-U-PRO-01, TEST-GR-05, TEST-G-31 |
| FONC-090 | T4.02 | TEST-U-SCH-04, TEST-G-28 |
| FONC-091 | T4.01 | TEST-DOC-01 |

### 7.2 Règles, indicateurs, ergonomie et sécurité fonctionnelle

| Exigence | Tâche(s) | Test(s) |
|---|---|---|
| RG-001 | T1.07, T1.10, T1.21 | TEST-I-05, TEST-G-24, TEST-G-31 |
| RG-007 | T1.21 | TEST-G-31 (aucune règle par chantier) |
| RG-043 | T2.02, T2.12 | TEST-GR-02 |
| RG-002, RG-003, RG-004 | T1.12 | TEST-U-SAI-01 à 03 |
| RG-005, RG-006 | T1.14 | TEST-U-CHA-02 |
| RG-010 à RG-012 | T1.15 | TEST-U-OBJ-01, TEST-U-OBJ-04 |
| RG-013 | T1.06 (colonnes d'audit) | TEST-G-25 |
| RG-020 à RG-025 | T2.07 | TEST-U-SPR-01 à 08 |
| RG-030 à RG-032 | T2.01 | TEST-U-ACT-06, TEST-U-ACT-08, TEST-U-OBJ-06 |
| RG-033 | T3.10 | TEST-U-ACT-09 |
| RG-040, RG-041 | T3.03 | TEST-U-GOU-02, TEST-U-GOU-03 |
| RG-042 | T2.02, T2.13 | TEST-ARCH-01 (aucune écriture d'indicateur hors relevé), TEST-GR-02 |
| RG-050 | T1.07, T1.09 | TEST-I-04, TEST-I-10 |
| RG-051 | T1.12 | TEST-U-SAI-04, TEST-C-05, TEST-E2E-P9 |
| IND-001 à IND-004 | T2.02 | TEST-GR-02 |
| IND-005, IND-009 | T2.02 | TEST-GR-02 |
| IND-006 | T2.02 | TEST-U-IND-04, TEST-GR-02 |
| IND-007 | T3.01 | TEST-U-ALE-01 |
| IND-008, IND-010, IND-011 | T3.01, T2.02 | TEST-U-IND-05 |
| UX-001 à UX-003 | T1.10 | TEST-E2E-NAV |
| UX-004 à UX-009 | T1.03, T1.10 | TEST-C-01 à 06 |
| UX-010 | T1.17 | TEST-E2E-RESP |
| UX-011 | T1.10, T3.11 | TEST-PERF-01 |
| UX-012 | T2.04 | TEST-E2E-FIL |
| UX-013 | T1.10 | TEST-VIS-03 |
| UX-020 | T1.03 | TEST-VIS-01, TEST-VIS-02, TEST-VIS-03 |
| UX-021, UX-022 | T1.17, T2.11, T3.13 | TEST-A11Y-01 à 06 |
| UX-023 | T1.03 | TEST-E2E-THEME, TEST-A11Y-04 |
| UX-024 | T1.10 | TEST-C-09 |
| UX-025 | Toutes les tâches UI | TEST-VIS-03 (revue) |
| UX-026 | T3.07 | TEST-E2E-P8 |
| SECF-001 | T1.07, T3.12 | TEST-I-05, TEST-G-24 |
| SECF-002 | T1.03, T1.17 | TEST-SEC-02 |
| SECF-003 | T1.09, T1.11 | TEST-I-08, TEST-E2E-P1 |
| SECF-004 | T1.03, T1.17 | TEST-SEC-01, TEST-C-08 |
| SECF-005 | T1.09 | TEST-SEC-03 |
| SECF-006 | T1.11 | TEST-U-DEM-01 |
| SECF-007 | T2.01 | TEST-U-ACT-08 |
| SECF-008 | Décision Q-001 | — (arbitrage, pas de test) |

### 7.3 Exigences techniques

| Exigence | Tâche(s) | Test(s) |
|---|---|---|
| TECH-001 à TECH-004 | T1.01, T1.09 | TEST-SEC-02, TEST-U-PRF-01 |
| TECH-010 à TECH-013 | T1.01 | TEST-ARCH-01 |
| TECH-020 à TECH-022 | T1.01 | TEST-SEC-06 |
| TECH-030, TECH-031 | T1.04, T1.06 | TEST-ARCH-01 |
| TECH-040 à TECH-046 | T1.06 | TEST-U-SCH-01, TEST-U-SCH-02 |
| TECH-044, TECH-047 | T2.02 | TEST-GR-02 |
| TECH-050, TECH-052 | T1.19 (procédure) | TEST-G-23 |
| TECH-051 | T3.09 | TEST-U-EXP-01 |
| TECH-055, TECH-056 | T1.06, T4.02 | TEST-U-SCH-03, TEST-G-28 |
| TECH-060 à TECH-067 | T1.02, T1.07, T1.09 | TEST-I-01, TEST-I-04, TEST-I-05, TEST-I-06, TEST-U-ACG-01 |
| TECH-070, TECH-071 | T1.05 | TEST-U-ENC-01 à 04 |
| TECH-080 à TECH-083 | T1.08 | TEST-U-SYN-01, TEST-U-SYN-02, TEST-E2E-ERR |
| TECH-090 à TECH-093 | T1.09 | TEST-I-01 |
| TECH-100 à TECH-103 | T1.01, T1.18 | TEST-SEC-02, revue de PR |
| TECH-110 à TECH-113 | T1.01, T1.03, T3.09 | TEST-SEC-01, TEST-SEC-04, TEST-SEC-07, TEST-U-EXP-01 |
| TECH-120 à TECH-122 | T1.01, T1.03 | TEST-SEC-02, TEST-SEC-06 |
| TECH-130 à TECH-134 | T1.01, T1.09 | TEST-SEC-03, TEST-SEC-05 |
| TECH-140 à TECH-143 | T3.11, T4.03 | TEST-PERF-01 à 03 |
| TECH-150 à TECH-153 | T4.01, T4.04, T4.06 | TEST-DOC-01 |
| TECH-157 à TECH-159 | T1.20 | TEST-GR-01, TEST-GR-03, TEST-GR-04 |
| TECH-160, TECH-161 | T1.21 | TEST-U-ROL-01, TEST-GR-05, TEST-G-31 |
