# 04 — Stratégie de tests et assurance qualité

> Version : 0.1 — 12/11/2026 — Statut : **Proposé — à valider**
> Toutes les données de test sont **fictives**.

## 1. Principes

1. **Automatiser d'abord** : tout ce qui peut être vérifié sans Grist l'est automatiquement (domaine, adaptateur avec faux Grist, interface dans un harnais).
2. **Tester les règles là où elles vivent** : la couche `domain/` concentre règles et calculs → la majorité des tests y sont unitaires et rapides.
3. **Un faux Grist fidèle** : `tests/support/faux-grist.ts` implémente `SourceDonnees` en mémoire avec les mêmes contraintes que Grist (atomicité des lots, colonnes inconnues refusées, identifiants séquentiels, références, refus d'écriture simulable). Ses comportements sont recalés sur les résultats de la validation `T1.02` (VAL-01 à VAL-14).
4. **Valider dans un vrai Grist** ce qui ne peut pas l'être autrement (événements, encodages réels, droits), par une recette manuelle guidée à chaque version.
5. **Aucune donnée réelle** dans les tests, captures ou journaux.
6. **Chaque exigence a au moins un test** (matrice dans `03` §7).

## 2. Pyramide et outils

| Niveau | Outil | Emplacement | Exécution | Proportion visée |
|---|---|---|---|---|
| Unitaire (domaine, encodage, schéma) | Vitest | `tests/unit/` | `npm test` — local et CI | ~65 % |
| Intégration (store + adaptateur + FauxGrist) | Vitest | `tests/unit/integration/` | `npm test` | ~15 % |
| Composants (UI isolée) | Vitest + `@testing-library/preact` + jsdom | `tests/composants/` | `npm test` | ~10 % |
| Bout en bout (parcours) | Playwright (Chromium, Firefox) sur le **harnais** | `tests/e2e/` | `npm run test:e2e` — **CI uniquement** (aucun navigateur de test installé sur le poste) | ~10 % |
| **Intégration dans un vrai Grist local** (DEC-021) | Playwright + image Docker `gristlabs/grist` | `tests/grist/` | `npm run test:grist` — **CI uniquement** | quelques scénarios clés |
| Accessibilité | `@axe-core/playwright` | `tests/e2e/a11y/` | `npm run test:e2e` | — |
| Visuel | Playwright `toHaveScreenshot` | `tests/e2e/visuel/` | `npm run test:visuel` (CI) | — |
| Recette dans Grist | Manuelle, check-list | `docs/recette/` | À chaque version | — |

**Le harnais** (`tests/harnais/index.html`) charge le widget compilé et définit un objet `window.grist` simulé, adossé au `FauxGrist` et à un jeu de données choisi par paramètre d'URL (`?jdd=demo`). Il permet aussi de simuler un changement externe (« modification faite dans Grist ») et un refus d'écriture.

## 3. Commandes

| Commande | Rôle | Où l'exécuter |
|---|---|---|
| `npm test` | Tests unitaires, d'intégration et de composants | Terminal, à la racine du projet |
| `npm run test:couverture` | Idem + rapport de couverture (`coverage/`) | Idem |
| `npm run test:e2e` | Tests de bout en bout et d'accessibilité (lance le harnais) | **Exécuté par la CI GitHub** ; ne pas installer les navigateurs sur le poste de la responsable (CLAUDE.md §6 bis) |
| `npm run test:visuel` | Comparaison de captures | Idem |
| `npm run test:grist` | Tests d'intégration dans un Grist local (démarre un conteneur Docker) | **Exécuté par la CI GitHub uniquement** |
| `npm run lint` | ESLint + stylelint + règles d'architecture | Idem |
| `npm run types` | Vérification TypeScript (`tsc --noEmit`) | Idem |
| `npm run verifier:secrets` | Recherche de données sensibles (TECH-131) | Idem |
| `npm run verifier` | Enchaîne lint, types, tests, secrets, build | Idem — **à lancer avant chaque PR** |

Seuils de couverture (CI bloquante) : `src/domain/` ≥ 90 % des lignes ; `src/grist/` ≥ 80 % ; global ≥ 70 %.

## 4. Jeux de données fictives

Fichiers `tests/fixtures/*.json` construits par des fabriques (`tests/support/fabriques.ts`) ; noms de personnes manifestement fictifs (« Dominique Test », « Alex Fictif », « Camille Exemple »), équipes « Équipe A/B/C fictive ».

| Jeu | Contenu | Utilisé pour |
|---|---|---|
| `JDD-VIDE` | Document initialisé sans données | États vides, P1 |
| `JDD-DEMO` | 1 saison `[DÉMO]` active, 7 chantiers, 7 pilotes, 21 objectifs, 63 sous-objectifs, ~150 actions, 3 mois de sprints, jalons, points de gouvernance | Démonstration (FONC-081), E2E, visuel, a11y |
| `JDD-SAISONS` | 3 saisons : 2024-2025 `Clôturée`, 2025-2026 `Active`, 2026-2027 `Préparation` ; chantier CH8 ajouté puis désactivé ; changement de pilote d'une saison à l'autre | FONC-003, FONC-004, P9, FONC-066 |
| `JDD-CALC` | Cas chiffrés : sous-objectif sans action, avec actions toutes abandonnées, avec avancement déclaré, objectif sans sous-objectif, éléments archivés, **action multi-chantiers** (porteur CH3, associée à un sous-objectif de CH5), sprints clôturés avec reports | IND-001 à IND-006, IND-009 à IND-011, RG-043 (valeurs attendues documentées dans le fichier, utilisées par les formules Grist **et** le widget) |
| `JDD-ROLES` | Une personne par rôle avec courriel fictif (`@exemple.test`), une personne sans courriel, un utilisateur Grist absent de `Personnes` | FONC-087, TECH-160, DEC-023 |
| `JDD-ALERTES` | Date du jour figée (`2027-03-10`) ; actions en retard de chaque priorité, bloquée depuis 3 et 10 jours, objectifs non validés, chantier sans sprint au 6 du mois, arbitrage échu, jalon non atteint échu | IND-007, FONC-061 |
| `JDD-SPRINTS` | Sprint en préparation, en cours (avec actions dans chaque statut), clôturé (avec engagements), annulé ; mois suivant sans sprint | FONC-030 à FONC-036 |
| `JDD-ANOMALIES` | Référence orpheline, cellule censurée `["C"]`, erreur de formule `["E"]`, deux saisons actives, objectif rattaché au mauvais chantier, caractères spéciaux et tentative HTML dans les titres, textes de 2 000 caractères, dates vides | ERR-03 à ERR-12, SECF-004 |
| `JDD-VOLUME` | 3 saisons, 7 chantiers, 2 000 actions, 300 sprints | Performances TECH-140 à TECH-143 |

La date du jour est **injectée** (horloge factice) dans tous les tests dépendant du temps.

## 5. Catalogue des tests automatisés

### 5.1 Tests unitaires du domaine

| ID | Objet | Exigences / règles |
|---|---|---|
| TEST-U-SAI-01 | Création de saison valide / invalide (libellé vide, fin < début, libellé en double) | FONC-001, RG-004 |
| TEST-U-SAI-02 | Transitions de statut autorisées et refusées ; une seule saison active | FONC-002, RG-002 |
| TEST-U-SAI-03 | Clôture refusée si sprints non clôturés | RG-003 |
| TEST-U-SAI-04 | Choix de la saison par défaut (active, sinon la plus récente) ; lecture seule si clôturée | FONC-003, RG-051 |
| TEST-U-SAI-05 | Préparation de la saison suivante : liste des chantiers-saison à créer, pilotes repris, objectifs non copiés, chantiers inactifs exclus | FONC-004 |
| TEST-U-CHA-01 | Référentiel : code unique, suppression refusée si utilisé, désactivation | FONC-010 |
| TEST-U-CHA-02 | Chantier-saison : unicité par saison, pilote obligatoire hors préparation | FONC-011, RG-005, RG-006 |
| TEST-U-OBJ-01 | Création objectif / sous-objectif, parent obligatoire, deux niveaux max, chantier-saison identique au parent | FONC-020, FONC-021, RG-010, RG-011 |
| TEST-U-OBJ-02 | Écart à la cible 3×3 (paramétrable) | FONC-022 |
| TEST-U-OBJ-03 | Échéance dans la saison | FONC-023 |
| TEST-U-OBJ-04 | Machine à états de validation, motif obligatoire, date de validation, propagation aux sous-objectifs | FONC-024, RG-012 |
| TEST-U-OBJ-05 | Champs verrouillés d'un objectif validé | FONC-025 |
| TEST-U-OBJ-06 | Archivage exclu des calculs | FONC-029, RG-032 |
| TEST-U-OBJ-07 | Construction de l'arborescence ordonnée | FONC-028 |
| TEST-U-SPR-01 | Création : un sprint par chantier-saison et par mois, dates dans la saison, dates par défaut du mois | FONC-030, RG-020, RG-021 |
| TEST-U-SPR-02 | Actions éligibles au périmètre | FONC-031, RG-022 |
| TEST-U-SPR-03 | Démarrage refusé si un sprint est déjà en cours | FONC-032, RG-020 |
| TEST-U-SPR-04 | Comptages de suivi (statuts, retards, blocages) | FONC-033 |
| TEST-U-SPR-05 | Plan de clôture : engagements, reports, retours backlog, abandons, sprint suivant à créer, journal | FONC-034, RG-023, RG-025 |
| TEST-U-SPR-06 | Sprint clôturé non modifiable | RG-024 |
| TEST-U-SPR-07 | Annulation : motif obligatoire, actions remises au backlog | FONC-036 |
| TEST-U-SPR-08 | Bilan d'un sprint clôturé calculé depuis les engagements | FONC-035 |
| TEST-U-ACT-01 | Validation d'action : titre et chantier-saison obligatoires, échéance ≥ début | FONC-040, RG-004 |
| TEST-U-ACT-02 | Listes de statuts et priorités, valeurs par défaut | FONC-042, FONC-043 |
| TEST-U-ACT-03 | Cohérence objectif/sprint avec le chantier-saison | FONC-044 |
| TEST-U-ACT-04 | Équipe par défaut du responsable | FONC-045 |
| TEST-U-ACT-05 | Blocage : motif obligatoire, date de blocage, journal à la sortie | FONC-046 |
| TEST-U-ACT-06 | Terminaison : date de réalisation ; terminée/abandonnée jamais en retard | RG-030, RG-031 |
| TEST-U-ACT-07 | Réaffectation : effacement objectif/sprint au changement de chantier, journal | FONC-049 |
| TEST-U-ACT-08 | Archivage, restauration, suppression autorisée seulement sans engagement | FONC-050, SECF-007 |
| TEST-U-ACT-09 | Dépendances : pas d'auto-référence, détection de cycle, avertissement au démarrage | FONC-047, RG-033 |
| TEST-U-ACT-10 | Changement de statut par Kanban : transitions et effets (motif, date) | FONC-051 |
| TEST-U-FIL-01 | Filtres combinés OU/ET, texte libre insensible aux accents et à la casse | FONC-052 |
| TEST-U-FIL-02 | Filtre « Mes éléments » | FONC-072 |
| TEST-U-IND-01 à 03 | **Retirés** : IND-001 à IND-005 et IND-009 sont des formules Grist, testées par `TEST-GR-02` (DEC-011) | — |
| TEST-U-IND-04 | IND-006 en retard calculé par le widget (frontières : échéance = aujourd'hui → pas en retard) | IND-006 |
| TEST-U-IND-05 | IND-008, IND-011 calculés par le widget ; IND-010 lu depuis la formule | IND-008, IND-010, IND-011 |
| TEST-U-ACT-11 | Actions multi-chantiers : porteur obligatoire, chantiers associés de la même saison sans le porteur, objectifs associés cohérents, sprint uniquement du porteur, mention « Contribue » | FONC-054, FONC-044 |
| TEST-U-SAI-06 | Reconduction d'un objectif : copie `Brouillon` avec sous-objectifs, `ObjectifOrigine` renseigné, original inchangé | FONC-004, FONC-025 |
| TEST-U-REF-02 | Personnes : rôle obligatoire, courriel unique et en minuscules, ligne `Profils` créée/supprimée dans le même lot | FONC-070, DEC-016 |
| TEST-U-ROL-01 | Actions permises par rôle (validation, modification d'objectif validé, personnes, relevé) | FONC-024, FONC-025, TECH-161 |
| TEST-U-PRO-01 | Identification depuis `Profils` : 0 ligne → non référencé, 1 ligne → utilisateur et rôle, plusieurs → choix manuel | FONC-087 |
| TEST-U-REL-01 | Relevé mensuel : une ligne par chantier-saison + « Programme », valeurs recopiées, remplacement d'un relevé existant après confirmation | FONC-085 |
| TEST-U-ALE-01 | Liste d'alertes exacte avec `JDD-ALERTES` et horloge figée | IND-007, FONC-061 |
| TEST-U-GOU-01 | Points de gouvernance : champs obligatoires selon le type | FONC-063 |
| TEST-U-GOU-02 | Décision liée clôt l'arbitrage ; historique des décisions trié | FONC-064, RG-040 |
| TEST-U-GOU-03 | Proposition de point de blocage au-delà du seuil | RG-041 |
| TEST-U-GOU-04 | Jalons : validation, horizon 30 jours | FONC-067, FONC-062 |
| TEST-U-GOU-05 | Données de revue de chantier et de synthèse mensuelle | FONC-065, FONC-066 |
| TEST-U-GOU-06 | Calcul des positions du Gantt (dates → coordonnées), éléments sans date | FONC-068 |
| TEST-U-EXP-01 | Export CSV : séparateur, UTF-8 avec BOM, neutralisation des formules | FONC-069, TECH-112 |
| TEST-U-REF-01 | Personnes et équipes : désactivation si référencées, courriel valide | FONC-070, FONC-071 |
| TEST-U-JOU-01 | Entrées de journal générées pour chaque événement important | FONC-027 |
| TEST-U-DEM-01 | Jeu de démonstration : proposé seulement si aucune saison ; préfixe [DÉMO] ; aucune donnée non fictive | FONC-081, SECF-006 |

### 5.2 Tests unitaires de l'adaptateur Grist

| ID | Objet | Exigences |
|---|---|---|
| TEST-U-ENC-01 | Décodage de chaque type (Text, Int, Numeric, Bool, Date, DateTime, Choice, Ref, RefList, vides) | TECH-070, TECH-071 |
| TEST-U-ENC-02 | Encodage pour écriture (dates en secondes UTC, RefList `["L",…]`, Ref vide = 0) | TECH-070 |
| TEST-U-ENC-03 | Valeurs spéciales : `["C"]`, `["E",…]`, valeurs inattendues → pas d'exception | ERR-07, ERR-08, ERR-09, TECH-070 |
| TEST-U-ENC-04 | Dates autour des changements d'heure et en fin de mois (fuseau `Europe/Paris`) | TECH-071 |
| TEST-U-SCH-01 | Vérification de schéma : tables/colonnes manquantes, types différents | FONC-080, ERR-02, ERR-03 |
| TEST-U-SCH-02 | Génération des actions d'initialisation (16 tables, colonnes, choix, formules) | FONC-080 |
| TEST-U-SCH-03 | Migrations additives, ordre, idempotence | TECH-055, TECH-056 |
| TEST-U-SCH-04 | (V4) Migration vers le schéma 2 : tables éditoriales et leurs références créées, aucune vue ne les lit | FONC-090 |
| TEST-DOC-01 | (V4) Contrôle automatique que chaque table/colonne de `schema.ts` figure dans `docs/contrat-donnees.md` | FONC-091 |
| TEST-U-ACG-01 | Constructeurs d'actions Grist (Add/Update/Remove, versions Bulk, champs homogènes par lot) | TECH-064 |
| TEST-U-SYN-01 | Synchro : changement de signature → rechargement après anti-rebond ; signature identique → rien ; rafale → un seul rechargement | FONC-082, TECH-080 |
| TEST-U-SYN-02 | Secours : rechargement après écriture et au retour de visibilité | TECH-082 |
| TEST-U-PRF-01 | Préférences : `localStorage` indisponible → valeurs par défaut sans erreur | ERR-13, TECH-003 |

### 5.3 Tests d'intégration (store + FauxGrist)

| ID | Objet | Exigences |
|---|---|---|
| TEST-I-01 | Chargement initial complet et construction des index | TECH-060, FONC-003 |
| TEST-I-02 | CRUD de chaque table via les commandes (création, modification, archivage, suppression) | FONC-001, FONC-010, FONC-011, FONC-020, FONC-021, FONC-030, FONC-040, FONC-041, FONC-063, FONC-067, FONC-070, FONC-071 |
| TEST-I-03 | Relations : références résolues, orphelines signalées, listes de choix cohérentes | FONC-044, ERR-07, ERR-10 |
| TEST-I-04 | Atomicité : un lot dont une action échoue ne modifie rien (clôture de sprint) | RG-050, FONC-034, ERR-05 |
| TEST-I-05 | Refus d'écriture → lecture seule + message | FONC-083, ERR-04, RG-001 |
| TEST-I-06 | Conflit de modification (MajLe changé) | ERR-06, TECH-067 |
| TEST-I-07 | Modification externe simulée → store mis à jour | FONC-082 |
| TEST-I-08 | Aucune écriture au chargement, même sur document vide | SECF-003, FONC-080 |
| TEST-I-09 | Préparation de saison suivante de bout en bout | FONC-004 |
| TEST-I-10 | Journal écrit dans le même lot que la modification | FONC-027, RG-050 |
| TEST-I-11 | Reconduction d'objectifs lors de la préparation de saison, de bout en bout | FONC-004 |

### 5.4 Tests de composants

| ID | Objet | Exigences |
|---|---|---|
| TEST-C-01 | Formulaires : messages d'erreur DSFR sous les champs, focus sur la première erreur | UX-004, UX-022, FONC-040 |
| TEST-C-02 | Modale de confirmation : texte de conséquence, boutons, retour du focus | UX-005 |
| TEST-C-03 | Alertes : succès auto-masqué, erreur persistante | UX-006 |
| TEST-C-04 | États vides de chaque vue | UX-007 |
| TEST-C-05 | Lecture seule : boutons masqués, bandeau | UX-008, RG-051 |
| TEST-C-06 | Badges : texte présent pour chaque statut | UX-009 |
| TEST-C-07 | `BarreProgression` : attributs ARIA, « Non mesurable », mention « déclaré » | FONC-026, UX-021 |
| TEST-C-08 | Carte d'action : rendu des titres contenant du HTML comme texte | SECF-004 |
| TEST-C-09 | Formats français des dates et pourcentages | UX-024 |
| TEST-C-10 | Champs verrouillés avec infobulle (rôle autre que responsable de pilotage) | FONC-025 |
| TEST-C-11 | Composants de base : comportement clavier conforme aux motifs ARIA (onglets, modale, accordéon, infobulle) | UX-022, `07` §2 |

### 5.5 Tests de bout en bout (harnais Playwright)

| ID | Parcours | Exigences |
|---|---|---|
| TEST-E2E-P1 | Initialisation d'un document vide + démonstration | FONC-080, FONC-081, SECF-003 |
| TEST-E2E-P2 | Préparer une saison et ses chantiers | FONC-001, FONC-004, FONC-011 |
| TEST-E2E-P3 | Créer un objectif et 3 sous-objectifs, soumettre | FONC-020–024, FONC-028 |
| TEST-E2E-P4 | Valider / renvoyer des objectifs | FONC-024, FONC-025, FONC-027 |
| TEST-E2E-P5 | Préparer et démarrer un sprint | FONC-030–032 |
| TEST-E2E-P6 | Kanban : glisser-déposer, clavier, blocage, modification externe | FONC-051, FONC-046, FONC-082 |
| TEST-E2E-P7 | Clôturer un sprint, consulter le bilan | FONC-034, FONC-035 |
| TEST-E2E-P8 | Revue de chantier, décision, impression | FONC-065, FONC-064 |
| TEST-E2E-P9 | Saison passée en lecture seule | FONC-003, RG-051 |
| TEST-E2E-NAV | Navigation entre onglets, liens cockpit → vues filtrées, fil d'Ariane, mémorisation de l'onglet | UX-001, UX-002, FONC-012, FONC-060 |
| TEST-E2E-FIL | Filtres backlog, tags supprimables, réinitialisation, bascule liste/Kanban | FONC-052, FONC-053, UX-012 |
| TEST-E2E-COCK | Cockpit avec `JDD-ALERTES` | FONC-060, FONC-061, FONC-062 |
| TEST-E2E-GANTT | Gantt/Calendrier : rendu, équivalent tableau, liste mobile | FONC-068, FONC-067 |
| TEST-E2E-GOUV | Création de points de gouvernance, filtres | FONC-063 |
| TEST-E2E-SYN | Synthèse mensuelle et export CSV | FONC-066, FONC-069 |
| TEST-E2E-ERR | Accès insuffisant, schéma incomplet, échec de chargement avec réessai | ERR-01, ERR-02, FONC-083, TECH-083 |
| TEST-E2E-RESP | Chaque vue à 360, 768, 1280 px sans défilement horizontal de page | UX-010, CA-100 |
| TEST-E2E-THEME | Bascule clair/sombre | UX-023 |
| TEST-E2E-REL | Figer l'avancement du mois, consulter l'évolution (tableau et courbe) | FONC-085 |

### 5.6 Sécurité, performance

| ID | Objet | Exigences |
|---|---|---|
| TEST-SEC-01 | Données `JDD-ANOMALIES` contenant `<img src=x onerror=…>`, `"><script>` : aucun script exécuté (écouteur `dialog` Playwright) | SECF-004, TECH-110 |
| TEST-SEC-02 | Aucune requête réseau hors origine du harnais pendant tous les E2E | SECF-002, TECH-004, TECH-102 |
| TEST-SEC-03 | Messages console pendant les E2E : aucun libellé métier du jeu de données | SECF-005, TECH-132 |
| TEST-SEC-04 | ESLint : API dangereuses interdites (`innerHTML`, `eval`…) | TECH-110 |
| TEST-SEC-05 | `npm run verifier:secrets` sur le dépôt | TECH-130, TECH-131 |
| TEST-SEC-06 | `npm audit --omit=dev` sans vulnérabilité haute/critique | TECH-121 |
| TEST-SEC-07 | CSP présente dans `dist/index.html` et sans `unsafe-eval` | TECH-113 |
| TEST-ARCH-01 | Règles d'import entre couches | TECH-010–013 |
| TEST-PERF-01 | Chargement + calcul avec `JDD-VOLUME` < 2 s (harnais) | TECH-140 |
| TEST-PERF-02 | Indicateurs `JDD-VOLUME` < 100 ms (Vitest bench) | TECH-141 |
| TEST-PERF-03 | Taille du build < 300 Ko gzip hors polices | TECH-143 |

### 5.6 bis Intégration dans un vrai Grist local (Docker, CI — DEC-021)

Exigé par le guide de contribution GristGouv (« création d'un document, interaction avec le widget »). L'image Docker `gristlabs/grist` (version figée) est démarrée par la CI ; une clé d'API de test est générée pour le conteneur et n'est jamais enregistrée.

| ID | Objet | Exigences |
|---|---|---|
| TEST-GR-01 | Scénario de base : créer un document, ajouter le widget par URL, accorder l'accès complet, initialiser la structure, créer une saison, un chantier-saison et un objectif ; vérifier les lignes dans les tables Grist | TECH-157, TECH-159, FONC-080, FONC-001, FONC-020 |
| TEST-GR-02 | Formules d'indicateurs : charger `JDD-CALC`, comparer les colonnes formules (`Avancement`, `SourceAvancement`, `TauxRealisation`, `TauxReport`, `NbActionsBloquees`, `EnRetard`…) aux valeurs attendues ; vérifier que le widget affiche les mêmes valeurs | IND-001 à IND-006, IND-009, IND-010, FONC-026, FONC-054, RG-043, TECH-044, TECH-047 |
| TEST-GR-03 | Synchronisation : modifier une cellule par l'API REST du conteneur ; le widget se met à jour (VAL-01) | FONC-082, TECH-080 |
| TEST-GR-04 | Atomicité réelle : lot invalide de clôture de sprint → aucune modification (VAL-05) | RG-050 |
| TEST-GR-05 | Règles d'accès par rôle et identification : appliquer les règles de `docs/regles-acces-grist.md`, ouvrir le widget avec deux comptes de test (`Pilote`, `Responsable pilotage`) ; vérifier l'identification et le refus de modifier un objectif validé (si le conteneur permet plusieurs comptes ; sinon couvert par TEST-G-31) | FONC-087, TECH-160, DEC-016, DEC-023 |

### 5.7 Accessibilité et visuel

Voir `07` §9 : `TEST-A11Y-01` à `TEST-A11Y-06`, `TEST-VIS-01` à `TEST-VIS-03` (exigences UX-020 à UX-023, CA-101, CA-102).

## 6. Tests de non-régression

- Toute la suite automatisée est exécutée à chaque push et PR (`ci.yml`) ; une PR ne peut être fusionnée que si elle est verte.
- Chaque anomalie corrigée donne lieu à un test reproduisant le cas (préfixe `REG-<numéro>` dans le nom du test).
- Les captures de référence (`TEST-VIS-01`) ne sont mises à jour que volontairement, avec mention dans la PR.

## 7. Tests de déploiement

| ID | Objet | Type |
|---|---|---|
| TEST-DEP-01 | Le workflow construit `dist/` avec la bonne `base` et la version injectée | Automatisé (CI) |
| TEST-DEP-02 | Après déploiement, l'URL GitHub Pages répond (HTTP 200) et sert `index.html` contenant la version attendue | Automatisé (étape finale du workflow, `curl`) |
| TEST-DEP-03 | Polices et icônes DSFR chargées (aucune 404) depuis l'URL publiée | Manuel (outils du navigateur) puis automatisable |
| TEST-DEP-04 | Le widget publié fonctionne dans le document Grist de test (fumée : ouverture, cockpit, création/suppression d'une action de test) | Manuel |
| TEST-DEP-05 | Retour arrière : redéploiement du tag précédent et vérification de la version affichée | Manuel, une fois par version majeure |

## 8. Validations manuelles dans Grist

Document dédié « [TEST] Pilotage de la stratégie SIGNAL », données fictives, deux comptes de test (Éditeur et Lecteur) si possible.

### 8.1 Validation technique initiale (tâche T1.02)

`TEST-G-01` à `TEST-G-19` correspondent un pour un à `VAL-01` à `VAL-19` (`00` §7). Ils sont réalisés de préférence sur `grist.numerique.gouv.fr`, avec un document fictif. Résultat consigné dans `00` (section « Résultats de validation ») ; le `FauxGrist` est ajusté en conséquence.

### 8.2 Recette de version (check-list, PV dans `docs/recette/vX.Y.Z.md`)

| ID | Vérification | Versions |
|---|---|---|
| TEST-G-20 | Ajout du widget par URL, accès complet, initialisation sur document vide | V1+ |
| TEST-G-21 | Création d'une saison, des chantiers, d'objectifs ; vérification des lignes dans les tables Grist | V1+ |
| TEST-G-22 | Modification d'une ligne dans une vue tableau Grist → visible dans le widget sans recharger | V1+ |
| TEST-G-23 | Annulation (Ctrl+Z) dans Grist d'une opération du widget | V1+ |
| TEST-G-24 | Compte Lecteur : widget en lecture seule, aucune écriture possible | V1+ |
| TEST-G-25 | Colonnes d'audit `CreePar`/`MajPar` renseignées avec le bon utilisateur | V1+ |
| TEST-G-26 | Parcours P5 à P7 dans Grist | V2+ |
| TEST-G-27 | Cockpit, Gantt, revue de chantier, impression depuis Grist | V3+ |
| TEST-G-28 | Migration de schéma sur une copie de document de version précédente | V4 |
| TEST-G-29 | Build mono-fichier dans le Widget Creator | V4 |
| TEST-G-30 | Lecteur d'écran (TEST-A11Y-05) | V2, V3 |
| TEST-G-31 | Règles d'accès par rôle sur `grist.numerique.gouv.fr` : identification (`Profils`), pilote ne pouvant pas modifier un objectif validé ni valider, responsable de pilotage le pouvant, lecteur en lecture seule ; aucune règle par chantier | V1+ |
| TEST-G-32 | Page « Synthèse SIGNAL » vue avec un compte `Lecteur` : chiffres identiques à ceux du widget | V2+ |

## 9. Critères de qualité par version (« définition de prêt à livrer »)

- `npm run verifier` vert ; CI verte sur `main`.
- Couverture conforme aux seuils.
- Tous les tests listés pour la version dans la matrice (`03` §7) existent et passent.
- Recette Grist réalisée, PV rédigé, anomalies bloquantes corrigées.
- Documentation mise à jour (CHANGELOG, `03` statuts des tâches, `00` si nouveaux faits).
