# 02 — Cahier des charges technique

> Projet : **Pilotage de la stratégie SIGNAL**
> Version : 0.1 — 12/11/2026
> Statut : **Proposé — à valider**
> Références : faits techniques dans `00-RECHERCHE-TECHNIQUE.md` (codes `G*`, `D*`, `VAL-*`), exigences dans `01`.

Les exigences techniques portent l'identifiant `TECH-xxx`.

---

## 1. Architecture globale

```
┌──────────────────────── Navigateur de l'utilisateur ────────────────────────┐
│                                                                             │
│  Page Grist (instance Grist)                                                │
│  ┌──────────────────────────────┐   postMessage    ┌──────────────────────┐ │
│  │ Document « Pilotage de la stratégie SIGNAL » │◄────────────────►│ iframe : widget      │ │
│  │  tables Saisons, Actions…    │  (grist-plugin-  │ Pilotage de la stratégie SIGNAL      │ │
│  │  table Synchro (section)     │   api.js)        │ (fichiers statiques) │ │
│  └──────────────────────────────┘                  └──────────▲───────────┘ │
└───────────────────────────────────────────────────────────────┼─────────────┘
                                                                │ HTTPS (GET)
                                              ┌─────────────────┴────────────┐
                                              │ Hébergement statique         │
                                              │ GitHub Pages (tests fictifs) │
                                              │ (tests et production)        │
                                              └──────────────────────────────┘
```

- **TECH-001** Le widget est une application **statique** (HTML, CSS, JavaScript) sans serveur applicatif ni base de données propre.
- **TECH-002** Toutes les données métier sont lues et écrites dans le document Grist via l'API des widgets (`grist-plugin-api.js`). Grist est l'unique source de vérité.
- **TECH-003** Le seul stockage local autorisé est `localStorage` pour des préférences d'affichage non métier (onglet, filtres, « Moi », thème), toujours encapsulé dans `try/catch` (LIM-07).
- **TECH-004** Le widget ne communique avec aucun autre service que l'instance Grist (via `postMessage`) et son propre hébergement (fichiers statiques).

### 1.1 Couches logicielles

```
 ui/  (Preact + DSFR)          ← affiche l'état, déclenche des commandes
   │
 store/ (état + commandes)     ← état applicatif, sélecteurs, cas d'usage
   │
 domain/ (TypeScript pur)      ← modèles, règles, validations, indicateurs (aucune dépendance)
   │
 grist/ (adaptateur)           ← seul code qui connaît window.grist : lecture, encodage, écriture, schéma, synchro
```

- **TECH-010** La couche `domain/` n'importe rien d'autre que `domain/` (aucune dépendance à Preact, au DOM ou à Grist). Elle est testable intégralement en unitaire.
- **TECH-011** Seule la couche `grist/` accède à `window.grist`. Elle expose une interface `SourceDonnees` (§5.2) dont il existe deux implémentations : réelle (`ClientGrist`) et de test (`FauxGrist`).
- **TECH-012** La couche `ui/` n'appelle jamais `grist/` directement ; elle passe par les commandes de `store/`.
- **TECH-013** Une règle de lint (`eslint-plugin-boundaries` ou `no-restricted-imports`) vérifie automatiquement ces dépendances.

## 2. Choix des technologies

### 2.1 Comparaison

| Critère | A. JavaScript simple (sans build) | B. TypeScript + Vite + Preact | C. TypeScript + Vite + React/Vue |
|---|---|---|---|
| Installation | Aucune | Node.js + `npm install` | Idem B |
| Lisibilité à 6 vues et ~15 tables | Faible : DOM manuel, globales (cf. isaytoo) | Bonne : composants, types | Bonne |
| Sécurité XSS | Échappement manuel partout (erreurs constatées chez isaytoo) | Échappement automatique du JSX | Idem B |
| Typage des tables Grist | Aucun | Types stricts, erreurs détectées à la compilation | Idem B |
| Tests | Possibles mais harnais lourd | Vitest + Testing Library + Playwright, standard | Idem B |
| Poids | Minimal | Preact ≈ 4 Ko gzip | React ≈ 45 Ko, Vue ≈ 35 Ko |
| Intégration DSFR | Directe (HTML) | Directe (classes DSFR dans le JSX) | Directe ; bibliothèques tierces DSFR-React non officielles |
| Assistance Claude Code | Correcte | Très bonne (types = garde-fous) | Très bonne |
| Déploiement | Copie de fichiers | Build automatique par GitHub Actions | Idem B |

### 2.2 Choix recommandé (`DEC-003`)

**Option B : TypeScript + Vite + Preact.** C'est l'architecture la moins contraignante qui couvre les besoins : une seule étape de build automatisée, un framework minuscule à l'API stable, la sécurité XSS par défaut et des types qui empêchent les erreurs de nom de colonne.

| Outil | Rôle | Version |
|---|---|---|
| Node.js | Exécuter les outils de développement | LTS active au moment de T1.01 (vérifier sur nodejs.org) ; fixée dans `.nvmrc` et `package.json#engines` |
| npm | Gestionnaire de paquets | Fourni avec Node.js |
| TypeScript | Langage typé, mode `strict` | Dernière stable au moment de T1.01, fixée par `package-lock.json` |
| Vite | Serveur de développement et build | Idem |
| Preact + `@preact/signals` | Interface et état réactif | Idem |
| `@gouvfr/dsfr` | **Uniquement** couleurs (tokens, thèmes clair/sombre) et police Marianne : fichiers `core` et `scheme` (DEC-008) | **1.15.4** épinglée (version exacte, sans `^`) |
| Vitest | Tests unitaires et de composants | Idem |
| `@testing-library/preact` | Tests de composants | Idem |
| Playwright + `@axe-core/playwright` | Tests de bout en bout et accessibilité | Idem |
| ESLint + Prettier | Qualité et format du code | Idem |

- **TECH-020** Toutes les versions sont figées par `package-lock.json` versionné ; aucune dépendance n'est chargée depuis un CDN à l'exécution, hormis `grist-plugin-api.js`.
- **TECH-021** Aucune bibliothèque Kanban, Gantt, calendrier ou graphique n'est ajoutée : ces composants sont développés en DOM/SVG avec les tokens DSFR (faible volume de données, besoin d'accessibilité, contrôle du style).
- **TECH-022** Toute nouvelle dépendance d'exécution doit être justifiée dans `06-DECISIONS-ET-ARBITRAGES.md` (taille, licence, maintenance, sécurité).

## 3. Organisation du code

```
grist-widget-pilotage/
├── README.md
├── CLAUDE.md
├── CHANGELOG.md                     (créé en T1.01)
├── LICENSE                          (selon décision Q-002)
├── package.json / package-lock.json
├── .nvmrc
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── eslint.config.js
├── .prettierrc
├── .gitignore
├── .github/
│   └── workflows/
│       ├── ci.yml                   lint + types + tests + build sur chaque push/PR
│       └── deploiement-pages.yml    déploiement manuel (workflow_dispatch) d'un tag
├── index.html                       page du widget
├── src/
│   ├── main.tsx                     point d'entrée : chargement DSFR, init Grist, rendu App
│   ├── config.ts                    constantes (version, URL API Grist, délais)
│   ├── grist/
│   │   ├── types-api.ts             types minimaux de window.grist
│   │   ├── source-donnees.ts        interface SourceDonnees
│   │   ├── client-grist.ts          implémentation réelle
│   │   ├── encodage.ts              cellules Grist ⇄ valeurs du domaine
│   │   ├── schema.ts                schéma attendu (tables, colonnes, types, formules)
│   │   ├── formules/                formules Python Grist des indicateurs (un fichier par table)
│   │   ├── verification-schema.ts   compare schéma attendu / réel
│   │   ├── initialisation.ts        génère AddTable/AddColumn
│   │   ├── synchro.ts               abonnement Synchro + anti-rebond
│   │   └── actions-utilisateur.ts   constructeurs typés d'actions Grist
│   ├── domain/
│   │   ├── modeles.ts               types Saison, Chantier, Objectif…
│   │   ├── listes-valeurs.ts        statuts, priorités, types
│   │   ├── dates.ts                 dates ISO « AAAA-MM-JJ », calculs de mois
│   │   ├── regles/                  saisons.ts, chantiers.ts, objectifs.ts, sprints.ts, actions.ts, gouvernance.ts
│   │   ├── validation.ts            validations de formulaires
│   │   ├── indicateurs.ts           IND-001 … IND-011
│   │   ├── alertes.ts               IND-007
│   │   ├── journal.ts               construction des entrées de journal
│   │   └── demo/jeu-demo.ts         données de démonstration fictives
│   ├── store/
│   │   ├── etat.ts                  signaux : données, saison courante, filtres, statut synchro
│   │   ├── selecteurs.ts            données dérivées (arbres, listes filtrées)
│   │   ├── commandes.ts             cas d'usage (creerObjectif, cloturerSprint…)
│   │   └── preferences.ts           localStorage protégé
│   ├── ui/
│   │   ├── App.tsx
│   │   ├── format.ts                formats français
│   │   ├── composants/base/         composants de base du projet (couleurs et police DSFR)
│   │   ├── composants/metier/       BarreProgression, CarteAction, Kanban, Gantt, TuileChantier, ArbreObjectifs
│   │   └── vues/                    cockpit/, chantiers/, objectifs/, sprints/, backlog/, gantt/,
│   │                                gouvernance/, referentiels/, initialisation/
│   └── styles/
│       └── signal.css               styles des seuls composants métier (tokens DSFR)
├── tests/
│   ├── unit/                        miroir de src/domain et src/grist
│   ├── composants/                  tests de composants Preact
│   ├── e2e/                         scénarios Playwright (parcours P1…P9)
│   ├── harnais/                     page de test chargeant le widget avec FauxGrist
│   ├── support/                     faux-grist.ts, fabriques.ts
│   └── fixtures/                    jdd-*.json (données fictives)
└── docs/
    ├── 00 … 07                      spécifications
    ├── recette/                     procès-verbaux de recette manuelle (créés à chaque version)
    └── contrat-donnees.md           (V4) contrat pour le widget éditorial
```

- **TECH-030** Noms de fichiers en français, en minuscules avec tirets ; composants Preact en `PascalCase.tsx`.
- **TECH-031** Les identifiants Grist (tables et colonnes) sont centralisés dans `src/grist/schema.ts` ; aucun nom de colonne n'est écrit en dur ailleurs.

## 4. Modèle de données Grist

### 4.1 Principes

- **TECH-040** Un document Grist dédié contient exclusivement les tables ci-dessous (H3).
- **TECH-041** Identifiants de tables en `PascalCase` sans accent ; identifiants de colonnes en `PascalCase` sans accent ; libellés de colonnes (« label ») en français accentué.
- **TECH-042** Les relations utilisent des colonnes `Ref` / `RefList` (jamais des libellés recopiés).
- **TECH-043** Chaque table métier possède les colonnes d'audit `CreeLe`, `CreePar`, `MajLe`, `MajPar` (formules de déclenchement, G15–G17).
- **TECH-044** Les indicateurs d'avancement et de réalisation sont des **colonnes formules Grist** (DEC-011) : ils sont visibles dans Grist (amiral, page « Synthèse SIGNAL ») et lus tels quels par le widget, qui ne les recalcule pas. Les formules sont écrites dans `src/grist/formules/*.py` (fichiers lisibles, un par table), injectées par l'assistant d'initialisation et testées dans un Grist local (TECH-157). Seuls les calculs dépendant de la date du jour (retard, alertes, temps écoulé) sont **aussi** calculés par le widget à l'affichage (VAL-16).
- **TECH-047** Les formules d'indicateurs ne lisent que des colonnes de données (jamais d'autres formules d'indicateurs d'une table « fille » de façon circulaire) et traitent explicitement les cas « Non mesurable » (valeur vide `None`).
- **TECH-045** Suppression logique (`Archive = true`) pour objectifs, actions et points de gouvernance ; suppression physique réservée aux enregistrements sans dépendants, toujours confirmée.
- **TECH-046** Le schéma porte un numéro de version (`Config` clé `VersionSchema`) ; toute évolution du schéma fournit une migration (§4.6).

Colonnes d'audit communes (non répétées dans les fiches) :

| Colonne | Type Grist | Formule / comportement |
|---|---|---|
| `CreeLe` | DateTime | Formule de déclenchement `NOW()`, « appliquer aux nouveaux enregistrements » |
| `CreePar` | Text | `user.Name`, « appliquer aux nouveaux enregistrements » |
| `MajLe` | DateTime | `NOW()`, « appliquer à toute modification » |
| `MajPar` | Text | `user.Name`, « appliquer à toute modification » |

Le paramétrage exact des formules de déclenchement via `applyUserActions` (`recalcWhen`, `recalcDeps`) est à valider (VAL-11). À défaut, l'assistant d'initialisation crée les colonnes et la procédure manuelle de `05` indique comment activer le déclenchement.

### 4.2 Diagramme des relations

```
Saisons 1───* ChantiersSaison *───1 Chantiers
                 │  └── Pilote ──► Personnes ──► EquipePrincipale ──► Equipes
                 │  └── Equipes (RefList) ──► Equipes
                 ├──* Objectifs (Niveau Objectif) 1───* Objectifs (Niveau Sous-objectif, via Parent)
                 ├──* Sprints 1───* EngagementsSprint *───1 Actions
                 └──* Actions (chantier porteur) ──► Objectif, Sprint, Responsable, Equipe,
                              ChantiersAssocies (RefList ChantiersSaison), ObjectifsAssocies (RefList Objectifs),
                              Dependances (RefList Actions)
Objectifs ──► ObjectifOrigine (reconduction d'une saison à l'autre)
Saisons 1───* Jalons ──► ChantierSaison?, Objectif?
Saisons 1───* PointsGouvernance ──► ChantierSaison?, Objectif?, Action?, Porteur, PointLie
Saisons 1───* ReleveMensuel ──► ChantierSaison? (vide = ligne « Programme »)
Personnes 1───1 Profils (technique, filtrée par règle d'accès : chacun ne voit que sa ligne)
Journal  (TypeEntite + IdEntite, sans Ref pour survivre aux suppressions)
Config   (clé / valeur)
Synchro  (1 ligne, formule de signature)
V4 : SujetsCommunication, ActionsEditoriales ──► Chantiers, Objectifs, Actions (RefList)
```

### 4.3 Fiches des tables

Légende des contraintes : **O** obligatoire (contrôlé par le widget), **U** unique (contrôlé par le widget), **F** formule.

#### 4.3.1 `Saisons`

| Colonne | Type | Contraintes / valeurs | Description |
|---|---|---|---|
| `Libelle` | Text | O, U | « Saison 2026-2027 » |
| `DateDebut` | Date | O | |
| `DateFin` | Date | O, ≥ `DateDebut` | |
| `Statut` | Choice | `Préparation`, `Lancement`, `Active`, `Bilan`, `Clôturée` ; O | RG-002, RG-003 |
| `DateLancement` | Date | | Date de la réunion de lancement |
| `Bilan` | Text | | Bilan de saison |
| `Avancement` | Numeric | **F** IND-004 : moyenne des `ChantiersSaison.Avancement` non vides | % (0–100) ou vide = non mesurable |
| `TempsEcoule` | Numeric | **F** IND-008 avec `TODAY()` (recalcul à vérifier, VAL-16) | % |

- Relations : référencée par `ChantiersSaison.Saison`, `Jalons.Saison`, `PointsGouvernance.Saison`.
- Suppression : interdite dans le widget si référencée ; sinon physique avec confirmation.
- Exemple fictif : `{Libelle: "[DÉMO] Saison 2026-2027", DateDebut: 2026-09-01, DateFin: 2027-08-31, Statut: "Active"}`.

#### 4.3.2 `Chantiers` (référentiel)

| Colonne | Type | Contraintes | Description |
|---|---|---|---|
| `Code` | Text | O, U | « CH3 » |
| `Intitule` | Text | O | « Maîtriser la donnée » |
| `Description` | Text | | |
| `Ordre` | Int | O | Ordre d'affichage |
| `Actif` | Bool | défaut `true` | Désactivation au lieu de suppression |

- Suppression : interdite si référencé par `ChantiersSaison` ; sinon physique.
- Exemple : `{Code: "CH3", Intitule: "Maîtriser la donnée", Ordre: 3, Actif: true}`.

#### 4.3.3 `ChantiersSaison`

| Colonne | Type | Contraintes | Description |
|---|---|---|---|
| `Saison` | Ref:Saisons | O | |
| `Chantier` | Ref:Chantiers | O ; couple (`Saison`, `Chantier`) U | RG-005 |
| `IntituleSaison` | Text | | Intitulé propre à la saison (sinon celui du référentiel) |
| `Pilote` | Ref:Personnes | O sauf saison en `Préparation` | RG-006 |
| `Equipes` | RefList:Equipes | | Équipes contributrices |
| `Ordre` | Int | | Par défaut `Chantier.Ordre` |
| `Libelle` | Text | **F** `$Chantier.Code + " — " + ($IntituleSaison or $Chantier.Intitule)` | Affichage dans Grist |
| `Avancement` | Numeric | **F** IND-003 : moyenne des `Objectifs.Avancement` (niveau Objectif, non archivés, non abandonnés, non vides) | % ou vide |
| `NbObjectifs` | Int | **F** objectifs de niveau Objectif non archivés ni abandonnés | |
| `NbObjectifsValides` | Int | **F** dont `StatutValidation = "Validé"` | |
| `NbActionsEnRetard` | Int | **F** actions portées non archivées avec `EnRetard` | Indicatif (VAL-16) |
| `NbActionsBloquees` | Int | **F** IND-010 | |

- Suppression (retrait de la saison) : interdite si objectifs, sprints ou actions liés.
- Exemple : `{Saison: 1, Chantier: 3, Pilote: 4, Equipes: ["L", 2, 5]}`.

#### 4.3.4 `Objectifs` (objectifs et sous-objectifs)

| Colonne | Type | Contraintes / valeurs | Description |
|---|---|---|---|
| `ChantierSaison` | Ref:ChantiersSaison | O ; égal à celui du parent pour un sous-objectif | |
| `Parent` | Ref:Objectifs | vide = objectif ; renseigné = sous-objectif ; le parent doit être un objectif (RG-011) | |
| `Niveau` | Text | **F** `"Sous-objectif" if $Parent else "Objectif"` | Évite toute incohérence |
| `Intitule` | Text | O | |
| `Description` | Text | | |
| `ResultatAttendu` | Text | | |
| `Responsable` | Ref:Personnes | | Par défaut pilote |
| `Echeance` | Date | dans la saison | |
| `Ordre` | Int | O | Position parmi les frères |
| `StatutValidation` | Choice | `Brouillon`, `Soumis`, `Validé`, `À reprendre`, `Abandonné` | Pour un sous-objectif : copie du parent maintenue par le widget lors des transitions |
| `DateValidation` | Date | | RG-012 |
| `MotifStatut` | Text | O pour `À reprendre` et `Abandonné` | |
| `AvancementDeclare` | Numeric | 0–100, facultatif | Option IND-001 (Q-006) |
| `Archive` | Bool | défaut `false` | |
| `Code` | Text | **F** (ex. `CH3-O1`, `CH3-O1.2`) calculé à partir de `Ordre` | Référence courte |
| `ObjectifOrigine` | Ref:Objectifs | facultatif | Objectif de la saison précédente dont celui-ci est la reconduction (DEC-015) |
| `NbActions` | Int | **F** actions non archivées, non `Abandonnée`, dont l'objectif principal **ou** un objectif associé est cet objectif | DEC-019 |
| `NbActionsTerminees` | Int | **F** idem avec statut `Terminée` | |
| `AvancementCalcule` | Numeric | **F** sous-objectif : IND-001 ; objectif : IND-002 (moyenne des `Avancement` des sous-objectifs, ou IND-001 sur ses actions directes s'il n'a pas de sous-objectif) | % ou vide |
| `Avancement` | Numeric | **F** `$AvancementDeclare if $AvancementDeclare is not None else $AvancementCalcule` | Valeur affichée partout |
| `SourceAvancement` | Text | **F** `"Déclaré"`, `"Calculé"` ou `"Non mesurable"` | Mise en évidence (Q-006) |

Exemple de formule (`src/grist/formules/objectifs.py`, colonne `AvancementCalcule`) — à affiner en T2.02 :

```python
if $Parent:  # sous-objectif : IND-001
  if $NbActions == 0:
    return None
  return round(100.0 * $NbActionsTerminees / $NbActions)
enfants = [o for o in Objectifs.lookupRecords(Parent=$id)
           if not o.Archive and o.StatutValidation != "Abandonné" and o.Avancement is not None]
if enfants:
  return round(sum(o.Avancement for o in enfants) / len(enfants))
if $NbActions == 0:
  return None
return round(100.0 * $NbActionsTerminees / $NbActions)
```

- Suppression physique : interdite si sous-objectifs, actions, jalons ou points liés ; sinon confirmation.
- Exemple : `{ChantierSaison: 3, Parent: null, Intitule: "Ouvrir un catalogue de données fictif", Ordre: 1, StatutValidation: "Validé"}`.

#### 4.3.5 `Sprints`

| Colonne | Type | Contraintes / valeurs | Description |
|---|---|---|---|
| `ChantierSaison` | Ref:ChantiersSaison | O | |
| `Mois` | Date | O ; 1er jour du mois ; couple (`ChantierSaison`, `Mois`) U | RG-020 |
| `DateDebut` | Date | O ; dans la saison | |
| `DateFin` | Date | O ; ≥ début | |
| `ObjectifSprint` | Text | | |
| `Statut` | Choice | `Préparation`, `En cours`, `Clôturé`, `Annulé` | |
| `Bilan` | Text | | Saisi à la clôture |
| `DateCloture` | Date | | |
| `MotifAnnulation` | Text | O si `Annulé` | |
| `Libelle` | Text | **F** `$ChantierSaison.Chantier.Code + " — " + $Mois.strftime("%m/%Y")` | |
| `NbEngagements` | Int | **F** sprint clôturé : nombre d'`EngagementsSprint` ; sinon nombre d'actions dont `Sprint = $id` | |
| `NbTerminees` | Int | **F** idem avec résultat / statut `Terminée` | |
| `TauxRealisation` | Numeric | **F** IND-005 `100 * NbTerminees / NbEngagements`, vide si 0 | % |
| `TauxReport` | Numeric | **F** IND-009 (sprints clôturés) | % |

- Suppression : interdite si engagements ; préférer `Annulé`.

#### 4.3.6 `Actions`

| Colonne | Type | Contraintes / valeurs | Description |
|---|---|---|---|
| `Titre` | Text | O | |
| `Description` | Text | | |
| `ChantierSaison` | Ref:ChantiersSaison | O | **Chantier porteur** : backlog et sprints où l'action est suivie |
| `ChantiersAssocies` | RefList:ChantiersSaison | même saison, sans le porteur (DEC-019) | Chantiers auxquels l'action contribue aussi |
| `Objectif` | Ref:Objectifs | du chantier porteur (FONC-044) | Objectif principal (le plus précis) |
| `ObjectifsAssocies` | RefList:Objectifs | objectifs des chantiers associés ou du porteur ; sans l'objectif principal | L'action compte aussi dans leur avancement |
| `Sprint` | Ref:Sprints | même chantier-saison ; sprint non clôturé (RG-022) | Sprint courant |
| `Responsable` | Ref:Personnes | | |
| `Equipe` | Ref:Equipes | | |
| `Priorite` | Choice | `Haute`, `Moyenne`, `Basse` ; défaut `Moyenne` | |
| `Statut` | Choice | `À faire`, `En cours`, `Bloquée`, `Terminée`, `Abandonnée` ; défaut `À faire` | |
| `DateDebut` | Date | | |
| `Echeance` | Date | ≥ `DateDebut` | |
| `DateRealisation` | Date | renseignée à `Terminée` (RG-030) | |
| `MotifBlocage` | Text | O si `Bloquée` | |
| `DateBlocage` | Date | renseignée à `Bloquée` | |
| `Observations` | Text | | |
| `Dependances` | RefList:Actions | pas d'auto-référence, pas de cycle (contrôle widget, V3) | « dépend de » |
| `Archive` | Bool | défaut `false` | |
| `EnRetard` | Bool | **F** IND-006 avec `TODAY()` | Indicatif dans Grist ; le widget recalcule à l'affichage (VAL-16) |

- Suppression physique : seulement si jamais engagée (`EngagementsSprint` vide pour elle) et non référencée.
- Exemple : `{Titre: "Rédiger la fiche de données fictive", ChantierSaison: 3, Objectif: 12, Sprint: 7, Responsable: 5, Priorite: "Haute", Statut: "En cours", Echeance: 2027-03-20}`.

#### 4.3.7 `EngagementsSprint`

Instantané créé à la clôture d'un sprint (FONC-034, RG-025).

| Colonne | Type | Contraintes / valeurs | Description |
|---|---|---|---|
| `Sprint` | Ref:Sprints | O | |
| `Action` | Ref:Actions | O ; couple U | |
| `Resultat` | Choice | `Terminée`, `Reportée`, `Retour backlog`, `Abandonnée` | |
| `StatutCloture` | Text | O | Statut de l'action au moment de la clôture |
| `TitreCloture` | Text | O | Titre au moment de la clôture (mémoire) |
| `SprintSuivant` | Ref:Sprints | si `Reportée` | |

- Suppression : jamais dans le widget (historique).

#### 4.3.8 `Personnes`

| Colonne | Type | Contraintes | Description |
|---|---|---|---|
| `Nom` | Text | O | Nom affiché (« Dominique Test ») |
| `Fonction` | Text | | |
| `Courriel` | Text | format courriel ; U ; **O si la personne a un compte Grist** | Doit être identique à l'adresse du compte Grist (identification, DEC-016) |
| `Role` | Choice | `Responsable pilotage`, `Pilote`, `Contributeur`, `Autorité`, `Lecteur` ; O | DEC-016 |
| `EquipePrincipale` | Ref:Equipes | | |
| `Actif` | Bool | défaut `true` | |

- Saisie **à la main** par le responsable de pilotage (dans le widget ou dans Grist). Modification réservée au rôle `Responsable pilotage` par règle d'accès (DEC-023).
- Une personne peut exister sans compte Grist (responsable d'action extérieur au document) : `Courriel` alors facultatif.

#### 4.3.8 bis `Profils` (technique)

| Colonne | Type | Description |
|---|---|---|
| `Personne` | Ref:Personnes | U |
| `Courriel` | Text | **F** `$Personne.Courriel.lower()` |
| `Role` | Text | **F** `$Personne.Role` |

- Une ligne par personne ayant un courriel, créée/supprimée par le widget **dans le même lot** que la personne.
- **Règle d'accès** (DEC-016, `docs/regles-acces-grist.md`) : lecture de la ligne seulement si `rec.Courriel == user.Email.lower()` ; aucune modification sauf `Responsable pilotage` / propriétaire.
- Au démarrage, le widget lit `Profils` : 1 ligne → utilisateur identifié et rôle connu ; 0 ligne → « utilisateur non référencé » (affichage en lecture) ; plusieurs lignes → propriétaire du document (voit tout) : choix manuel de « Moi ». **À valider (VAL-17)**.

#### 4.3.9 `Equipes`

| Colonne | Type | Contraintes | Description |
|---|---|---|---|
| `Nom` | Text | O, U | « Équipe Données fictive » |
| `Description` | Text | | |
| `Active` | Bool | défaut `true` | |

#### 4.3.10 `Jalons`

| Colonne | Type | Contraintes / valeurs |
|---|---|---|
| `Intitule` | Text | O |
| `Date` | Date | O |
| `Type` | Choice | `Lancement`, `Comité`, `Livraison`, `Revue`, `Autre` |
| `Saison` | Ref:Saisons | O |
| `ChantierSaison` | Ref:ChantiersSaison | facultatif, de la même saison |
| `Objectif` | Ref:Objectifs | facultatif |
| `Atteint` | Bool | défaut `false` |
| `Description` | Text | |

#### 4.3.11 `PointsGouvernance`

| Colonne | Type | Contraintes / valeurs |
|---|---|---|
| `Type` | Choice | `Risque`, `Blocage`, `Arbitrage`, `Décision` ; O |
| `Intitule` | Text | O |
| `Description` | Text | |
| `Saison` | Ref:Saisons | O |
| `ChantierSaison` | Ref:ChantiersSaison | facultatif |
| `Objectif` | Ref:Objectifs | facultatif |
| `Action` | Ref:Actions | facultatif |
| `Criticite` | Choice | `Haute`, `Moyenne`, `Basse` |
| `Statut` | Choice | `Ouvert`, `En traitement`, `Clos` |
| `Porteur` | Ref:Personnes | |
| `Echeance` | Date | |
| `DateDecision` | Date | O si `Type = Décision` |
| `Instance` | Text | Ex. « Comité de suivi » |
| `TexteDecision` | Text | O si `Type = Décision` |
| `PointLie` | Ref:PointsGouvernance | Décision → arbitrage qu'elle clôt (RG-040) |
| `Archive` | Bool | |

#### 4.3.11 bis `ReleveMensuel` (DEC-020)

Instantané figé lors de la revue mensuelle, créé par le bouton « Figer l'avancement du mois » (rôle `Responsable pilotage`).

| Colonne | Type | Description |
|---|---|---|
| `Saison` | Ref:Saisons | O |
| `Mois` | Date | 1er jour du mois ; couple (`Mois`, `ChantierSaison`) U |
| `ChantierSaison` | Ref:ChantiersSaison | vide = ligne « Programme » |
| `Libelle` | Text | **F** code chantier ou « Programme » |
| `Avancement` | Numeric | Valeur recopiée au moment du relevé (donnée, pas formule) |
| `TempsEcoule` | Numeric | idem |
| `NbObjectifsValides` | Int | idem |
| `NbObjectifs` | Int | idem |
| `NbActionsEnRetard` | Int | idem |
| `NbActionsBloquees` | Int | idem |
| `TauxRealisationSprint` | Numeric | idem (sprint du mois) |
| `Commentaire` | Text | Message clé pour l'amiral |

- C'est la **seule** recopie volontaire d'indicateurs : elle constitue un historique (les formules donnent toujours la valeur du jour).
- Refaire un relevé pour un mois existant remplace les lignes après confirmation.

#### 4.3.12 `Journal`

Écrit par le widget **dans le même lot** que la modification qu'il trace (RG-050).

| Colonne | Type | Description |
|---|---|---|
| `DateHeure` | DateTime | Formule de déclenchement `NOW()` à la création |
| `Auteur` | Text | Formule de déclenchement `user.Name` à la création |
| `TypeEntite` | Choice | `Saison`, `ChantierSaison`, `Objectif`, `Sprint`, `Action`, `PointGouvernance` |
| `IdEntite` | Int | Identifiant de ligne (pas de Ref, pour survivre aux suppressions) |
| `LibelleEntite` | Text | Libellé au moment de l'événement |
| `Evenement` | Choice | `Création`, `Modification`, `ChangementStatut`, `Réaffectation`, `Archivage`, `Restauration`, `Suppression`, `Clôture` |
| `Champ` | Text | Colonne modifiée |
| `AncienneValeur` | Text | Valeur lisible |
| `NouvelleValeur` | Text | Valeur lisible |
| `Motif` | Text | |

Pas de colonnes `MajLe/MajPar` (journal immuable). Le journal ne remplace pas l'historique natif de Grist (« Activity »), qui reste la trace exhaustive.

#### 4.3.13 `Config`

| Colonne | Type | Description |
|---|---|---|
| `Cle` | Text (U) | Clé |
| `Valeur` | Text | Valeur (convertie par le widget) |
| `Description` | Text | Explication en français |

`Config` porte également les colonnes d'audit communes.

Clés initiales :

| Clé | Valeur par défaut | Utilisation |
|---|---|---|
| `VersionSchema` | `1` | Migrations |
| `CibleObjectifsParChantier` | `3` | FONC-022 |
| `CibleSousObjectifsParObjectif` | `3` | FONC-022 |
| `HorizonEcheancesJours` | `30` | FONC-062 |
| `SeuilBlocageJours` | `7` | IND-007, RG-041 |
| `JourLimitePreparationSprint` | `5` | IND-007 |

#### 4.3.14 `Synchro` (technique)

| Colonne | Type | Formule |
|---|---|---|
| `Signature` | Any (formule) | Voir ci-dessous |

Formule proposée (Python Grist, **à valider VAL-01**) :

```python
tables = [Saisons, Chantiers, ChantiersSaison, Objectifs, Sprints, Actions,
          EngagementsSprint, Personnes, Equipes, Jalons, PointsGouvernance,
          ReleveMensuel, Config]
parties = []
for t in tables:
  lignes = t.all
  derniere = max([r.MajLe for r in lignes if r.MajLe] or [None])
  parties.append("%d@%s" % (len(lignes), derniere))
return "|".join(parties)
```

La table contient **une seule ligne**. Elle est la table « sélectionnée » de la section du widget. Comme sa formule dépend de toutes les tables, toute création, modification ou suppression modifie `Signature`, ce qui déclenche `onRecords` (G13, G14). Toutes les tables listées, y compris `Config`, possèdent la colonne d'audit `MajLe` (TECH-043). `Journal` est exclu (il n'est jamais modifié seul), ainsi que `Profils` (filtrée par règle d'accès) et `Synchro` elle-même.

Le schéma V1 compte **16 tables** : les 13 tables listées dans la formule, plus `Journal`, `Profils` et `Synchro`.

#### 4.3.15 Tables éditoriales (V4, `FONC-090`)

| Table | Colonnes principales |
|---|---|
| `SujetsCommunication` | `Titre`, `Description`, `Saison` (Ref), `Chantiers` (RefList:Chantiers), `Objectifs` (RefList:Objectifs), `Actions` (RefList:Actions), `Statut` (Choice `Idée`, `Retenu`, `Publié`, `Abandonné`), `Responsable` (Ref:Personnes) |
| `ActionsEditoriales` | `Titre`, `Sujet` (Ref:SujetsCommunication), `Canal` (Choice, à définir), `DatePrevue`, `DatePublication`, `Statut`, `Responsable` |

Ces tables ne sont créées qu'en V4 après validation de leur contenu avec le futur besoin éditorial. Le pilotage stratégique ne les lit pas.

### 4.4 Valeurs autorisées (récapitulatif)

Les listes de valeurs sont définies **une seule fois** dans `src/domain/listes-valeurs.ts` et reportées dans les options des colonnes Choice par l'assistant d'initialisation. Le widget refuse d'écrire une valeur hors liste.

### 4.5 Export et sauvegarde

- **TECH-050** La sauvegarde repose sur Grist : téléchargement du document (`.grist`), export CSV/XLSX natif, historique des versions (« Document History »), copies (« Save copy »).
- **TECH-051** Le widget propose un export CSV des listes affichées (FONC-069, V3), généré dans le navigateur (aucun serveur).
- **TECH-052** Avant toute migration de schéma ou mise à jour majeure du widget, la procédure (`05`) impose une copie du document.

### 4.6 Migration de schéma

- **TECH-055** `src/grist/schema.ts` décrit le schéma de la version `N`. Une fonction `migrations[N]` produit les actions nécessaires pour passer de `N-1` à `N` (ajout de colonnes, de tables, de choix). Elle n'est exécutée que sur clic explicite dans l'écran Initialisation, après rappel de la sauvegarde.
- **TECH-056** Les migrations sont **additives** (pas de suppression ni de renommage de colonne automatique). Un renommage se fait par ajout + recopie + abandon documenté.

## 5. Intégration Grist

### 5.1 Initialisation du widget

Séquence dans `main.tsx` puis `grist/client-grist.ts` :

1. Charger le DSFR (CSS, JS) et appliquer le thème.
2. Vérifier que `window.grist` existe ; sinon afficher « Ce widget doit être ouvert dans Grist » (cas d'ouverture directe de l'URL).
3. Appeler `grist.ready({ requiredAccess: 'full', allowSelectBy: false })`. **Pas de `columns`** (schéma à noms fixes, LIM-02).
4. S'abonner à `grist.onOptions` : lire `settings.accessLevel` (VAL-08). Si différent de `full` → écran ERR-01.
5. Lire `grist.docApi.listTables()` puis le schéma réel (`_grist_Tables`, `_grist_Tables_column` — VAL-09) ; comparer avec `schema.ts`.
6. Si schéma incomplet → écran Initialisation (FONC-080). Sinon charger toutes les tables (`fetchTable`) en parallèle, décoder, alimenter le `store`.
7. S'abonner à `grist.onRecords` (table `Synchro`) pour la synchronisation (§5.8).

- **TECH-060** Le widget fonctionne même si la section est liée à une autre table que `Synchro` (synchronisation alors réduite au bouton « Actualiser » et au retour de focus), et l'indique dans un bandeau d'information.

### 5.2 Interface `SourceDonnees`

```ts
interface SourceDonnees {
  niveauAcces(): Promise<'none' | 'read table' | 'full' | 'inconnu'>;
  listerTables(): Promise<string[]>;
  lireSchema(): Promise<SchemaReel>;                 // tables + colonnes + types
  lireTable(tableId: IdTable): Promise<LigneBrute[]>; // décodée en lignes
  appliquer(actions: ActionGrist[]): Promise<ResultatEcriture>; // un lot atomique
  surChangement(rappel: () => void): Desabonnement;
}
```

`ClientGrist` l'implémente avec `grist.docApi` ; `FauxGrist` (tests) l'implémente en mémoire avec les mêmes règles (atomicité, colonnes inconnues refusées, références).

### 5.3 Permissions

- **TECH-061** Niveau demandé : `full` (lecture de 16 tables, écriture multi-tables, lecture des métadonnées). Justification et risques : §7.1.
- **TECH-062** Les droits de l'utilisateur (Propriétaire, Éditeur, Lecteur) et les règles d'accès s'appliquent aux écritures (VAL-07). Un refus d'écriture fait basculer le widget en lecture seule pour la session (FONC-083).
- **TECH-063** Le widget ne lit jamais de jeton d'accès (`getAccessToken`) et n'utilise pas l'API REST.

### 5.4 Opérations CRUD

Toutes les écritures passent par `grist.docApi.applyUserActions` avec des actions construites par `actions-utilisateur.ts` :

| Opération | Action Grist |
|---|---|
| Créer | `["AddRecord", table, null, {col: val}]` ; plusieurs : `["BulkAddRecord", table, [null…], {col: [vals]}]` |
| Modifier | `["UpdateRecord", table, id, {col: val}]` ; plusieurs : `["BulkUpdateRecord", table, [ids], {col: [vals]}]` |
| Supprimer | `["RemoveRecord", table, id]` ; plusieurs : `["BulkRemoveRecord", table, [ids]]` |
| Créer table | `["AddTable", table, [{id, type, isFormula, formula, label…}]]` |
| Ajouter colonne | `["AddColumn", table, colId, {type, isFormula, formula, label, widgetOptions…}]` |

- **TECH-064** **Un geste utilisateur = un appel `applyUserActions`** contenant toutes les actions nécessaires (données + journal). Exemple de la clôture de sprint : `UpdateRecord Sprints` + `BulkAddRecord EngagementsSprint` + `BulkUpdateRecord Actions` + éventuellement `AddRecord Sprints` (sprint suivant) + `BulkAddRecord Journal`. Atomicité à confirmer (VAL-05).
- **TECH-065** Référencer dans un même lot un enregistrement créé dans ce lot : Grist attribue les identifiants séquentiellement ; le widget ne présume pas l'identifiant. Si nécessaire, le lot est découpé en deux appels successifs (création, puis références) et l'échec du second est signalé avec proposition de correction. Point à valider en T1.02 (les identifiants retournés par `applyUserActions` dans `retValues`).
- **TECH-066** Pas de mise à jour optimiste en V1-V2 : l'interface affiche un indicateur de chargement, attend la réponse, puis recharge. Exception : le Kanban affiche immédiatement la carte dans la colonne cible et l'y remet en cas d'échec (UX fluide, CA-049).
- **TECH-067** Contrôle de conflit (ERR-06) : avant un `UpdateRecord` issu d'un formulaire, comparer `MajLe` connu à l'ouverture et `MajLe` courant (relu par `fetchTable` de la table concernée).

### 5.5 Encodage des valeurs (`encodage.ts`)

| Type Grist | Valeur lue (format normal, `fetchTable`) | Valeur domaine | Écriture |
|---|---|---|---|
| Text | `string` (vide `""`) | `string` | `string` |
| Int / Numeric | `number` ou `null` | `number \| null` | `number \| null` |
| Bool | `boolean` | `boolean` | `boolean` |
| Date | secondes depuis l'époque (minuit UTC) ou `null` | `string` ISO `AAAA-MM-JJ` ou `null` | secondes (UTC) — VAL-04 |
| DateTime | secondes | `Date` JS | secondes |
| Choice | `string` | union TypeScript | `string` de la liste |
| Ref | `number` (0 = vide) | `number \| null` | `number` (0 pour vide) |
| RefList | `["L", ids…]` ou `null` — VAL-04 | `number[]` | `["L", ids…]` |
| Censuré | `["C"]` | `{ censure: true }` | — |
| Erreur | `["E", …]` | `{ erreur: true }` | — |

- **TECH-070** Toute valeur inattendue est décodée en valeur « inconnue » sans exception bloquante, et compte dans un indicateur de cohérence (ERR-10).
- **TECH-071** Les dates métier sont manipulées en chaînes ISO sans heure dans le domaine pour éviter les décalages de fuseau horaire ; « aujourd'hui » est calculé en heure locale `Europe/Paris`.

### 5.6 Mapping des colonnes

Le mapping natif de Grist n'est pas utilisé (LIM-02). La correspondance est fixe et centralisée dans `schema.ts`. La vérification de schéma (§5.1 étape 5) détecte les colonnes absentes ou de type différent (ERR-03). Si un besoin de renommage par l'utilisateur apparaît, il sera traité par une option de widget en évolution ultérieure.

### 5.7 Gestion des références

- Le `store` construit des index `Map<id, entité>` par table après chaque chargement.
- Une référence vers un identifiant absent est résolue en « introuvable » (ERR-07).
- Les listes de choix des formulaires ne proposent que des éléments actifs, non archivés et cohérents (FONC-044).
- Les références inverses (objectif → actions) sont calculées dans les sélecteurs, pas stockées (pas de références bidirectionnelles Grist en V1, pour garder le schéma simple). Évolution possible si le widget éditorial en a besoin.

### 5.8 Synchronisation et événements

```
Modification (widget ou Grist) ─► MajLe change ─► Synchro.Signature recalculée
   ─► TableNotifier (section liée à Synchro) ─► message dataChange ─► grist.onRecords
   ─► comparaison de la signature ─► si différente : anti-rebond 300 ms ─► rechargement des tables
```

- **TECH-080** Rechargement complet de toutes les tables (sauf `Journal`, chargé à la demande) à chaque changement de signature ; volumes compatibles (H1, LIM-05).
- **TECH-081** Pendant qu'un formulaire est ouvert, le rechargement met à jour le `store` mais le formulaire conserve la saisie en cours ; le contrôle ERR-06 s'applique à l'enregistrement.
- **TECH-082** Mécanismes de secours : rechargement après chaque écriture réussie du widget, bouton « Actualiser », rechargement au retour de visibilité (`visibilitychange`).
- **TECH-083** La barre supérieure affiche l'état : « Synchronisé à 14:32 », « Synchronisation… », « Hors synchronisation automatique ».

### 5.9 Gestion des erreurs de synchronisation

| Cas | Traitement |
|---|---|
| `fetchTable` échoue | 3 tentatives (1 s, 2 s, 4 s), puis alerte « Impossible de charger les données » + « Réessayer » ; les données précédentes restent affichées avec la mention « données du 14:32 » |
| `applyUserActions` échoue | Message selon le code (droits, validation Grist, réseau) ; aucune nouvelle tentative automatique ; rechargement des données |
| Signature incohérente / formule en erreur | Bandeau « Synchronisation automatique indisponible » + secours TECH-082 |

### 5.10 Limitations de l'API (rappel)

LIM-01 à LIM-09 de `00`. Conséquences principales : section liée à `Synchro`, schéma fixe, accès complet, identité utilisateur non disponible côté widget.

### 5.11 Utilisation de plusieurs tables d'un même document

Avec l'accès `full`, `grist.docApi.fetchTable(tableId)` lit n'importe quelle table et `applyUserActions` écrit dans n'importe quelle table du document, y compris plusieurs dans un même lot (G4, R2). `grist.getTable(tableId)` offre les opérations `create/update/upsert/destroy` sur une table nommée (G5) ; SIGNAL lui préfère `applyUserActions` pour regrouper les écritures multi-tables.

## 6. Gestion des états

- **TECH-090** État global dans `store/etat.ts` sous forme de signaux Preact : `donnees` (tables décodées et index), `saisonCouranteId`, `vueActive`, `filtres` par vue, `etatSynchro`, `modeLectureSeule`, `messages`.
- **TECH-091** Les données dérivées (arborescence, indicateurs, listes filtrées) sont des `computed` dans `selecteurs.ts`, qui appellent les fonctions pures de `domain/`.
- **TECH-092** Les commandes (`store/commandes.ts`) suivent toujours : 1) valider avec `domain/validation.ts` et `domain/regles/*` ; 2) construire les actions Grist + entrées de journal ; 3) `source.appliquer(lot)` ; 4) recharger ; 5) message de résultat.
- **TECH-093** Aucune donnée métier n'est conservée dans `localStorage`.

## 7. Sécurité

### 7.1 Accès complet au document

- Risque : le code du widget peut lire, modifier et supprimer tout le document et pourrait en exfiltrer le contenu (G1).
- Mesures :
  - **TECH-100** Document dédié à SIGNAL (TECH-040) : le widget n'a accès à rien d'autre.
  - **TECH-101** URL du widget sous contrôle de l'équipe (dépôt maîtrisé, déploiement manuel validé, `main` protégée).
  - **TECH-102** Aucune requête réseau sortante (CSP `connect-src 'self'`), vérifiée par test (CA-103).
  - **TECH-103** Revue de code de chaque modification par une personne (relecture de la PR) avant déploiement.

### 7.2 Injections et XSS

- **TECH-110** Rendu exclusivement via JSX (échappement automatique). `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval`, `new Function` sont **interdits** par règle ESLint.
- **TECH-111** Aucune valeur de données n'est injectée dans un attribut `style`, `href` ou `src` ; les couleurs proviennent uniquement de listes fermées du code.
- **TECH-112** Export CSV : neutralisation des formules (préfixe `'` devant `=`, `+`, `-`, `@`) pour éviter l'injection dans les tableurs.
- **TECH-113** Politique de sécurité du contenu (balise `meta`) :
  `default-src 'self'; script-src 'self' <origine grist-plugin-api>; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'`.
  Le script d'application du thème (clair/sombre) est placé dans un fichier, pas en ligne ; aucun JavaScript DSFR n'est chargé (DEC-008). `'unsafe-inline'` pour les styles est nécessaire aux positions calculées (Gantt) ; à réduire si possible.

### 7.3 Hébergement GitHub Pages

- Le dépôt et les fichiers du widget sont **publics** (DEC-024). Ils ne contiennent aucune donnée : les données restent dans Grist.
- Le widget public peut être chargé par n'importe qui dans n'importe quel document Grist : sans risque pour SIGNAL (aucun secret dans le code).
- Risque de compromission du compte GitHub → code malveillant servi aux utilisateurs avec accès complet. Mesures : authentification à deux facteurs obligatoire, branche `main` protégée, déploiement manuel uniquement.
- Production sur `grist.numerique.gouv.fr` avec des données non sensibles (Q-001) : GitHub Pages est retenu pour la production (DEC-007), comme la plupart des widgets de la liste GristGouv. Point restant : acceptation des URL personnalisées par l'instance (VAL-15) ; à défaut, procédure « chemin B » du guide GristGouv (revue et audit de sécurité), ou solution de repli §9.6.
- Le dépôt applique les critères du guide de contribution GristGouv (https://github.com/gristgouv/.github/blob/main/CONTRIBUTING-fr.md) pour rester « prêt à forker » : README complet, code lisible sans outil d'IA, pas de code mort, dépendances minimales, tests unitaires et d'intégration, aucune requête externe non documentée, aucune donnée hors Grist. Une vulnérabilité éventuelle se signale par la VDP de l'État, jamais en issue publique (`SECURITY.md`, T1.01).

### 7.4 Dépendances externes

- **TECH-120** À l'exécution : uniquement `grist-plugin-api.js` (servi par l'instance Grist cible de préférence). Le DSFR et les polices sont **inclus dans le build**.
- **TECH-121** `npm audit --omit=dev` exécuté en CI ; échec en cas de vulnérabilité haute ou critique sur une dépendance d'exécution.
- **TECH-122** Dependabot (ou équivalent) activé pour les mises à jour de sécurité ; mises à jour fonctionnelles manuelles.

### 7.5 Données sensibles, journaux et tests

- **TECH-130** Aucune donnée opérationnelle SIGNAL, aucun nom réel, aucun identifiant, jeton, URL de document réel ou secret dans le dépôt (code, tests, captures, issues, commits).
- **TECH-131** Un contrôle automatique (`npm run verifier:secrets`) recherche dans le dépôt les motifs suspects (adresses de documents Grist `/doc/`, `docs.getgrist.com/` hors `docs/`, `@intradef`, `@def.gouv.fr`, chaînes ressemblant à des clés) ; il est exécuté en CI.
- **TECH-132** Les journaux console sont limités aux codes d'erreur et identifiants techniques (SECF-005) via un module `journal-technique.ts` ; mode verbeux uniquement en développement local.
- **TECH-133** Les captures d'écran de tests Playwright sont produites avec les jeux fictifs et ne sont pas publiées hors de la CI.
- **TECH-134** Les procès-verbaux de recette (`docs/recette/`) ne contiennent que des données fictives.

### 7.6 Permissions utilisateurs

Voir §5.3. Le widget n'est pas une barrière de sécurité : toute restriction réelle doit être portée par les règles d'accès Grist (SECF-001).

- **TECH-160** Règles d'accès **par rôle** (pas par chantier, Q-008), documentées dans `docs/regles-acces-grist.md` et appliquées par la propriétaire du document (DEC-023) :
  1. **Attribut utilisateur** : table `Personnes`, correspondance `user.Email` ↔ `Courriel` → `user.Personne.Role`.
  2. `Personnes`, `Profils`, `Config`, `Chantiers` : modification réservée à `Responsable pilotage` et aux propriétaires.
  3. `Profils` : lecture limitée à la ligne de l'utilisateur (`rec.Courriel == user.Email.lower()`), sauf propriétaires.
  4. `Objectifs` : modification d'un objectif dont `rec.StatutValidation == "Validé"` réservée à `Responsable pilotage` (DEC-015) ; transitions vers `Validé`, `À reprendre`, `Abandonné` réservées à `Responsable pilotage` (DEC-025).
  5. `ReleveMensuel`, changement de statut de `Saisons` : `Responsable pilotage`.
  6. Rôles `Autorité` et `Lecteur` : lecture seule sur tout le document.
- **TECH-161** Le widget lit le rôle de l'utilisateur (`Profils`) pour **masquer** les actions qui seraient refusées ; un refus de Grist reste toujours géré (ERR-04).

## 8. Performances

- **TECH-140** Chargement initial < 2 s pour le jeu `JDD-VOLUME` (3 saisons, 7 chantiers, 2 000 actions) sur un poste standard.
- **TECH-141** Calculs du widget (filtres, retards, alertes) < 100 ms pour `JDD-VOLUME` (mesuré en test unitaire) ; le temps de recalcul des formules Grist avec `JDD-VOLUME` est mesuré dans le test d'intégration Grist local.
- **TECH-142** Listes > 200 lignes paginées (composant Pagination du projet) ; Kanban limité aux actions de la saison et des filtres actifs.
- **TECH-143** Taille du build (hors polices) < 300 Ko gzip ; vérifiée en CI.

## 9. Déploiement

### 9.1 Dépôt GitHub

- Nom : `grist-widget-pilotage` (convention GristGouv `grist-widget-[nom-fonctionnel]`). Visibilité : **public** (Q-002). Licence : **MIT** (Q-013, validée le 12/11/2026), fichier `LICENSE` créé en T1.01.
- Fichiers de gouvernance : `README.md` (rôle, configuration, dépendances), `SECURITY.md` (signalement via la VDP de l'État), `.gitignore` incluant `donnees-privees/` (DEC-026).
- Authentification à deux facteurs obligatoire pour les contributeurs.
- Protection de `main` : pas de push direct, PR obligatoire, CI verte obligatoire.

### 9.2 Branches et versions

| Élément | Convention |
|---|---|
| `main` | Version stable, déployable |
| Branches de travail | `tache/T1-03-schema`, `correctif/…` — une branche par tâche du plan |
| Versions | SemVer : `v1.0.0` (fin V1), `v1.1.0` (ajouts), `v1.0.1` (correctifs) ; `v2.0.0` en fin de V2, etc. |
| Étiquettes | Tag git `vX.Y.Z` créé après validation humaine |
| Journal | `CHANGELOG.md` mis à jour à chaque PR |
| Version affichée | Pied du widget : « Pilotage de la stratégie SIGNAL vX.Y.Z » (injectée au build depuis `package.json`) |

### 9.3 GitHub Pages

- Workflow `deploiement-pages.yml` déclenché **manuellement** (`workflow_dispatch`) avec en paramètre le tag à déployer ; il exécute `npm ci`, les tests, `npm run build`, puis publie `dist/` via `actions/deploy-pages`.
- Variable `DSFR_ACCEPT_LICENSE=1` dans la CI (D3), à n'activer qu'après acceptation explicite des modalités d'utilisation par la responsable (`DEC-008`).
- `base` Vite = `/grist-widget-pilotage/`.

### 9.4 URL du widget

- Publication (tests et production) : `https://<compte-github>.github.io/grist-widget-pilotage/`.
- Développement local : `http://localhost:5173/` (Grist dans le navigateur peut charger un widget sur `localhost` ; à vérifier sur le poste, VAL-13).
- Les versions sont publiées uniquement par déploiement manuel d'un tag validé (§9.8) : l'URL de production ne change jamais, son contenu change seulement après validation.

### 9.5 Installation dans Grist (procédure détaillée dans `05`)

1. Créer un document vide « [TEST] Pilotage de la stratégie SIGNAL ».
2. Créer une table `Synchro` (ou laisser l'assistant la créer : dans ce cas, ajouter d'abord le widget sur une table quelconque, initialiser, puis changer la table de la section en `Synchro`).
3. « Add New » → « Add widget to page » → Widget : Custom → Data : `Synchro`.
4. Menu de la section → « Widget options » → URL personnalisée → coller l'URL.
5. Niveau d'accès : « Full document access » → accepter.
6. Suivre l'écran d'initialisation du widget.

### 9.6 Solutions de repli (si l'URL GitHub Pages ne peut pas être utilisée sur l'instance)

| Option | Principe | Avantages | Limites |
|---|---|---|---|
| I1. Serveur web statique interne | Copier `dist/` sur un serveur HTTPS interne (IIS, Apache, Nginx) ; URL interne dans Grist | Simple, standard, contrôlé par la DSI | Nécessite un serveur et une procédure de mise à jour |
| I2. Build mono-fichier + Widget Creator | `npm run build:monofichier` (plugin `vite-plugin-singlefile`) produit un `grist-widget-pilotage.html` autonome à coller dans le Widget Creator de Grist (G3) | Aucun hébergement ; code stocké dans le document | `localStorage` indisponible (LIM-07), fichier volumineux (polices encodées), mise à jour manuelle par copier-coller, droit « structure » requis, `grist-plugin-api.js` relatif |
| I3. Hébergement de l'instance Grist | Servir le widget depuis l'instance Grist (galerie `GRIST_WIDGET_LIST_URL`) | Intégration native | Dépend de l'administrateur de l'instance |

Recommandation (si VAL-15 échoue) : I3 via le « chemin B » GristGouv (ajout à la liste `gristgouv/widgets-config` après revue et audit), ou I2 en attendant. I1 n'est plus nécessaire (données non sensibles, instance accessible par Internet). Le build mono-fichier est prévu en V4 (T4.05) mais peut être avancé.

### 9.7 bis Tests d'intégration dans un Grist local (DEC-021)

- **TECH-157** La CI démarre l'image Docker officielle `gristlabs/grist` (version figée) comme service ; un script crée un document vide via l'API REST locale (clé d'API **générée pour le conteneur de test, jamais stockée dans le dépôt**), Playwright ouvre le document, ajoute le widget (`http://localhost:<port>` du build), accorde l'accès complet et vérifie : initialisation de la structure, création d'une saison et d'un objectif, présence des lignes dans Grist, valeurs des formules d'indicateurs pour `JDD-CALC`, synchronisation après modification directe d'une cellule.
- **TECH-158** Ces tests, comme les tests dans un navigateur, s'exécutent **uniquement en CI**. Le poste de la responsable n'exécute que `npm run verifier`, qui ne demande ni navigateur de test ni Docker (sobriété du poste, CLAUDE.md §6 bis).
- **TECH-159** Le scénario minimal exigé par le guide GristGouv (« création d'un document, interaction avec le widget ») fait partie de cette suite.

### 9.7 Tests avec un document Grist fictif

- Un document « [TEST] Pilotage de la stratégie SIGNAL » est créé et initialisé avec les données de démonstration (FONC-081).
- La recette manuelle de chaque version suit `04` §8 et donne lieu à un PV dans `docs/recette/`.

### 9.8 Procédure de mise à jour

1. Fusionner la PR (CI verte, relecture).
2. Recette sur le document de test avec l'URL locale ou une préversion.
3. Validation humaine → créer le tag `vX.Y.Z`.
4. Copie de sauvegarde du document de production (TECH-052).
5. Déclencher le déploiement du tag.
6. Si le schéma évolue : ouvrir le widget, écran Initialisation → « Mettre à jour la structure ».
7. Contrôle rapide (fumée) : ouverture, cockpit, création/suppression d'une action de test.

### 9.9 Retour arrière

- Redéployer le tag précédent (même workflow, paramètre = tag précédent) : le widget revient à la version antérieure en quelques minutes.
- Le schéma étant migré de façon additive (TECH-056), l'ancienne version fonctionne avec des colonnes supplémentaires ignorées.
- En cas de données endommagées : restaurer la copie du document (Grist « Document History » ou copie enregistrée).

## 10. Maintenance et évolutivité

- **TECH-150** Ajouter une vue = un dossier `src/ui/vues/<nom>/`, une entrée dans la navigation, des sélecteurs et commandes dédiés ; aucune modification de `grist/` sauf nouvelle table.
- **TECH-151** Ajouter une table = l'ajouter dans `schema.ts`, `modeles.ts`, une migration, le `FauxGrist`, les fixtures et `02` §4.
- **TECH-152** Le futur widget éditorial est un **projet séparé** qui lit le même document via le contrat de données (`docs/contrat-donnees.md`, V4). Le code de `domain/` utile aux deux (types, encodage) pourra être extrait en paquet partagé si le besoin est avéré (`DEC-012`).
- **TECH-153** Documentation tenue à jour à chaque tâche (CLAUDE.md).

## 11. Récapitulatif des exigences techniques

| ID | Résumé | Version |
|---|---|---|
| TECH-001…004 | Application statique, Grist source de vérité, localStorage limité, aucun autre service | V1 |
| TECH-010…013 | Couches et contrôle des dépendances | V1 |
| TECH-020…022 | Technologies et dépendances | V1 |
| TECH-030…031 | Conventions de code, schéma centralisé | V1 |
| TECH-040…047 | Principes du modèle de données, indicateurs en formules Grist | V1 (044/047 : V2 pour les formules d'indicateurs) |
| TECH-050…052 | Export, sauvegarde | V1 (050, 052), V3 (051) |
| TECH-055…056 | Migrations | V1 (mécanisme), V4 (premières migrations réelles) |
| TECH-060…067 | Initialisation, accès, CRUD | V1 |
| TECH-070…071 | Encodage | V1 |
| TECH-080…083 | Synchronisation | V1 |
| TECH-090…093 | État | V1 |
| TECH-100…103 | Accès complet | V1 |
| TECH-110…113 | XSS, CSP | V1 (112 en V3) |
| TECH-120…122 | Dépendances | V1 |
| TECH-130…134 | Données sensibles | V1 |
| TECH-140…143 | Performances | V3 (mesures), V4 (optimisation) |
| TECH-150…153 | Évolutivité | V4 |
| TECH-157…159 | Tests d'intégration dans un Grist local (Docker, CI) | V1 |
| TECH-160…161 | Règles d'accès par rôle, adaptation de l'affichage au rôle | V1 |
