# 00 — Recherche technique

> Projet : **Pilotage de la stratégie SIGNAL** — widget personnalisé Grist
> Version du document : 0.1 (proposition) — 12/11/2026
> Statut : **À valider**
> Toutes les données citées en exemple sont **fictives**.

Ce document rassemble les informations techniques vérifiées avant la conception. Il distingue :

- **[FAIT]** : information lue dans une source officielle ou dans le code source, avec sa référence ;
- **[HYPOTHÈSE]** : déduction raisonnable non confirmée par une source ;
- **[À VALIDER]** : point qui devra être testé dans un véritable document Grist avant d'être considéré comme acquis.

---

## 1. Sources consultées

Toutes les sources ont été consultées le **12/11/2026**.

### 1.1 Grist — documentation officielle

| Réf. | Source | URL | Accès |
|---|---|---|---|
| G1 | Guide « Custom widgets » | https://support.getgrist.com/widget-custom/ | OK |
| G2 | Module `grist_plugin_api` (référence API) | https://support.getgrist.com/code/modules/grist_plugin_api/ | OK |
| G3 | Widget Creator | https://support.getgrist.com/widget-creator/ | OK |
| G4 | Interface `GristDocAPI` | https://support.getgrist.com/code/interfaces/grist_plugin_api.GristDocAPI/ | OK |
| G5 | Interface `TableOperations` | https://support.getgrist.com/code/interfaces/TableOperations.TableOperations/ | OK |
| G6 | Interface `ReadyPayload` | https://support.getgrist.com/code/interfaces/grist_plugin_api.ReadyPayload/ | OK |
| G7 | Interface `GristView` | https://support.getgrist.com/code/interfaces/grist_plugin_api.GristView/ | OK |
| G8 | Interface `FetchSelectedOptions` | https://support.getgrist.com/code/interfaces/grist_plugin_api.FetchSelectedOptions/ | OK |
| G9 | Interface `ColumnToMap` | https://support.getgrist.com/code/interfaces/grist_plugin_api.ColumnToMap/ | OK |
| G10 | Interface `WidgetAPI` | https://support.getgrist.com/code/interfaces/grist_plugin_api.WidgetAPI/ | OK |
| G11 | Script de l'API | https://docs.getgrist.com/grist-plugin-api.js | OK (lu partiellement, ~40 000 premiers caractères) |
| G12 | Dépôt `gristlabs/grist-widget` | https://github.com/gristlabs/grist-widget | OK (README et arborescence) |
| G13 | Code source `grist-plugin-api.ts` | https://raw.githubusercontent.com/gristlabs/grist-core/main/app/plugin/grist-plugin-api.ts | OK |
| G14 | Code source `WidgetFrame.ts` | https://raw.githubusercontent.com/gristlabs/grist-core/main/app/client/components/WidgetFrame.ts | OK |
| G15 | Horodatages (formules de déclenchement) | https://support.getgrist.com/timestamps/ | OK |
| G16 | Exemple « auto-stamps » | https://support.getgrist.com/examples/2021-07-auto-stamps/ | OK |
| G17 | Formules de déclenchement | https://support.getgrist.com/formulas/#trigger-formulas | OK |
| G18 | Colonnes de référence | https://support.getgrist.com/col-refs/ (section *two-way references*) | OK |
| G19 | Règles d'accès | https://support.getgrist.com/access-rules/ | OK (partie basse lue en résumé) |
| G20 | Auto-hébergement | https://support.getgrist.com/self-managed/ | Partiel |
| G21 | README `grist-core` | https://github.com/gristlabs/grist-core | Partiel (variables d'environnement non lues intégralement) |
| G22 | Grist de l'État (La Suite numérique) | https://lasuite.numerique.gouv.fr/produits/grist | OK |

**Sources inaccessibles ou vides :**

- https://grist.numerique.gouv.fr/ : page de chargement uniquement (application), aucun contenu documentaire lisible.
- https://docs.numerique.gouv.fr : aucun contenu Grist.
- https://github.com/numerique-gouv/grist : 404.
- https://support.getgrist.com/examples/2021-03-timestamps/ : 404 (remplacée par G16).
- Pages non lues : `OpOptions`, `UpsertOptions`, `CursorPos`, `grist-data-format.md`.

### 1.2 Projet de référence

| Réf. | Source | URL | Accès |
|---|---|---|---|
| R1 | Dépôt `isaytoo/grist-project-manager-widget` | https://github.com/isaytoo/grist-project-manager-widget | OK |
| R2 | README.md, GUIDE_MAPPING.md, index.html, widget.js, package.json | `raw.githubusercontent.com/isaytoo/grist-project-manager-widget/main/…` | OK (`widget.js` lu à ~34 % verbatim, le reste par extraits) |
| R3 | tests/ (`harnais.js`, `tout.js`, `package.json`, liste des fichiers) | idem | OK (fichiers `t0` à `t8` non lus individuellement) |
| R4 | LICENSE | idem | **404 — fichier absent** |

### 1.3 Système de Design de l'État (DSFR)

| Réf. | Source | URL | Accès |
|---|---|---|---|
| D1 | Accueil DSFR (v1.15 courante) | https://www.systeme-de-design.gouv.fr/ | OK via navigateur (403 pour les outils de lecture automatique) |
| D2 | Périmètre d'application | https://www.systeme-de-design.gouv.fr/version-courante/fr/premiers-pas/perimetre-d-application | OK via navigateur |
| D3 | Prise en main développeur | https://www.systeme-de-design.gouv.fr/version-courante/fr/premiers-pas/vous-etes-developpeur/prise-en-main | OK via navigateur |
| D4 | Liste des composants | https://www.systeme-de-design.gouv.fr/version-courante/fr/composants | OK via navigateur |
| D5 | Couleurs | https://www.systeme-de-design.gouv.fr/version-courante/fr/fondamentaux/couleurs | OK via navigateur |
| D6 | Grille et points de rupture | https://www.systeme-de-design.gouv.fr/version-courante/fr/fondamentaux/grille-et-points-de-rupture | OK via navigateur |
| D7 | Dépôt GitHub DSFR | https://github.com/GouvernementFR/dsfr | OK |
| D8 | Notes de version | https://github.com/GouvernementFR/dsfr/releases | OK |
| D9 | CGU DSFR | https://github.com/GouvernementFR/dsfr/blob/main/doc/legal/cgu.md | OK |
| D10 | Licence DSFR | https://github.com/GouvernementFR/dsfr/blob/main/LICENSE.md | OK |
| D11 | Page npm `@gouvfr/dsfr` | https://www.npmjs.com/package/@gouvfr/dsfr | **403** (la version sera vérifiée par `npm view @gouvfr/dsfr version`) |

Les pages DSFR suivantes n'ont pas été lues en détail et devront l'être au moment du développement de chaque composant : typographie, espacement, icônes, paramètres d'affichage, page de chaque composant utilisé, API JavaScript DSFR.

### 1.3 bis Communauté Grist Gouv (consulté le 12/11/2026, à la demande de la responsable)

| Réf. | Source | URL | Accès |
|---|---|---|---|
| GG1 | Guide de contribution (FR) | https://github.com/gristgouv/.github/blob/main/CONTRIBUTING-fr.md | OK |
| GG2 | Organisation GristGouv | https://github.com/gristgouv | OK |
| GG3 | Liste des widgets proposés sur les instances LaSuite et ANCT | https://github.com/gristgouv/widgets-config (`widget-list.json`) | OK (lu en résumé) |
| GG4 | Compétence Playwright citée par GG1 | https://github.com/testdino-hq/playwright-skill | OK |
| GG5 | Autre compétence du même nom (non citée par GG1) | https://github.com/lackeyjb/playwright-skill | OK |

Faits retenus :

- **[FAIT]** GG1 décrit deux chemins.
  - **Chemin A** : l'équipe GristGouv peut forker un widget public, sans démarche de l'auteur.
  - **Chemin B** : hébergement sur l'instance DINUM/ANCT. Le dépôt doit être public. On signale le widget sur le canal Tchap « Grist-Contributions », puis viennent une revue (premier retour sous 1 mois) et un **audit de sécurité avant mise en production**.
- **[FAIT]** Critères de qualité de GG1 :
  - un code lisible sans outil d'IA, avec des noms explicites et un `README.md` (rôle, configuration, dépendances) ;
  - un périmètre limité (« un widget qui fait une chose bien ») ;
  - des tests unitaires sur les fonctionnalités principales et des tests d'intégration couvrant au minimum « création d'un document, interaction avec le widget » ;
  - pas de dépendances superflues ni de code mort ;
  - aucune requête vers des services externes non documentés ;
  - aucun stockage de données utilisateur hors de Grist.
- **[FAIT]** Aucun linter ni formateur n'est imposé. L'aide de l'IA est acceptée, mais le contenu doit être relu, compris et testé. Le dépôt doit être nommé `grist-widget-[nom-fonctionnel]`. Les failles de sécurité se signalent par la VDP de l'État (https://vdp.numerique.gouv.fr/p/Policy), jamais en issue publique.
- **[FAIT]** GG1 n'impose ni licence, ni CI, ni DSFR, ni hébergement particulier.
- **[FAIT]** GG3 contient environ 50 widgets proposés par défaut sur les instances LaSuite/ANCT, la plupart hébergés sur GitHub Pages. Ses champs : `name`, `url`, `widgetId`, `published`, `accessLevel`, `renderAfterReady`, `description`, `authors`.
- **[HYPOTHÈSE]** La liste GG3 est une galerie choisie par l'équipe ; elle n'empêche pas forcément l'ajout d'un widget par URL personnalisée. **[À VALIDER] VAL-15.**
- **[FAIT]** GG4 est une collection de guides Markdown de bonnes pratiques Playwright (79 guides en packs `core`, `ci`, `frontend`…), installable par `npx skills add testdino-hq/playwright-skill`. GG1 précise qu'elle n'a pas été testée formellement et qu'il faut la prendre comme un point de départ.
- **[FAIT]** GG5 est un outil différent : il exécute du code Playwright à la volée, navigateur visible. Il n'est pas retenu (DEC-022).

### 1.4 Ergonomie

| Réf. | Source | URL | Accès |
|---|---|---|---|
| U1 | Laws of UX | https://lawsofux.com/ | Non relu dans cette session ; principes connus (Hick, Fitts, Jakob, Miller, Tesler, proximité, Von Restorff, Doherty, effet de position sérielle) appliqués dans `01` et `07`. **[À VALIDER]** par relecture lors du développement de l'UI. |

---

## 2. Informations techniques vérifiées — API des widgets Grist

### 2.1 Chargement de l'API

- **[FAIT]** Le script est `https://docs.getgrist.com/grist-plugin-api.js` (G1, G2). Le Widget Creator recommande le chemin relatif `grist-plugin-api.js`, servi par l'instance Grist elle-même (G3).
- **[HYPOTHÈSE]** Pour une instance auto-hébergée ou isolée (réseau interne), charger le script depuis l'instance Grist (`https://<instance>/grist-plugin-api.js`) plutôt que depuis `docs.getgrist.com`. À confirmer pour l'instance cible.
- **Décision envisagée** : le widget chargera le script depuis une URL configurable au moment de la construction (`VITE_GRIST_PLUGIN_API_URL`), par défaut `https://docs.getgrist.com/grist-plugin-api.js`.

### 2.2 `grist.ready()`

- **[FAIT]** Signature : `ready(settings?: ReadyPayload): void`. Grist ne communique pas avec le widget tant que `ready` n'a pas été appelé (G2).
- **[FAIT]** Propriétés de `ReadyPayload` (G6) :
  - `requiredAccess?: string` — niveau d'accès demandé ; si non accordé, Grist demande à l'utilisateur et recharge le widget ;
  - `columns?: ColumnsToMap` — colonnes attendues pour le mapping ;
  - `allowSelectBy?: boolean` — le widget peut servir de source de liaison (« Select By ») ;
  - `onEditOptions?: () => unknown` — ajoute un bouton « Open configuration ».
- **[FAIT]** Valeurs d'accès : `none`, `read table`, `full` ; libellés « No document access », « Read selected table », « Full document access » (G1).
- **[FAIT]** Recommandation officielle : appeler `grist.ready()` puis s'abonner aux événements (G1).

### 2.3 Niveaux d'accès

| Niveau | Effet (G1, G3, G8) |
|---|---|
| `none` | Aucun accès aux données ; niveau par défaut d'un widget par URL. |
| `read table` | Lecture de la seule table liée à la section. Niveau par défaut du Widget Creator. |
| `full` | Lecture **et modification de tout le document**, y compris possibilité d'envoyer ses données à un tiers. Requis pour `includeColumns: 'normal' | 'all'`. |

- **[FAIT]** G1 indique que l'accès complet permet à la page de « lire et modifier le document ».
- **[HYPOTHÈSE forte]** Le widget agit avec les droits de l'utilisateur connecté et reste soumis aux règles d'accès (G19 n'est pas explicite pour les widgets ; G1 l'indique pour d'autres extensions). **[À VALIDER]** avec un compte « Lecteur » et un compte « Éditeur » dans un document de test.

### 2.4 Événements

- **[FAIT]** `onRecord(callback(record | null, mappings), options?)` : changement de ligne sélectionnée ou de ses valeurs (G2).
- **[FAIT]** `onRecords(callback(records[], mappings), options?)` : changement des enregistrements de la table liée ; par défaut `format: 'rows'`, `keepEncoded: false` (G2).
- **[FAIT]** `onNewRecord(callback(mappings))` : sélection de la ligne vide (G2).
- **[FAIT]** `onOptions(callback(options | null, settings))` : à chaque changement d'options et lors du `ready` initial ; `settings` contient `accessLevel` et `linking` (G2, G11). G1 écrit `interaction.access_level`, le type indique `accessLevel` → **[À VALIDER]** à l'exécution.
- **[FAIT — code source]** Dans G13, `onRecords` s'abonne aux messages et ne réagit que si `msg.tableId` et `msg.dataChange` sont présents ; il relit alors `docApi.fetchSelectedTable(options)`.
- **[FAIT — code source]** Dans G14, la classe `TableNotifier` émet `dataChange: true` lorsque les lignes triées **de la vue de la section** changent (`sortedRows` → `rowNotify`, ou changement du mapping). `RecordNotifier` émet `dataChange: false` sur déplacement du curseur.
- **Conséquence [FAIT déduit du code]** : une modification dans une autre table que celle de la section **ne déclenche pas** `onRecords`, sauf si elle modifie une valeur (y compris calculée par formule) d'une ligne de la table de la section.
- **[FAIT]** `GristDocAPI` ne propose que des méthodes ponctuelles (promesses), aucun abonnement (G4). `fetchTable` fournit un instantané.

### 2.5 Lecture des données

- **[FAIT]** `grist.docApi.fetchTable(tableId)` : renvoie toute la table, colonne `id` incluse (G4). Format colonne (`{ id: [...], Col: [...] }`) **[À VALIDER]** sur l'instance cible.
- **[FAIT]** `grist.docApi.listTables()` : liste triée des identifiants de tables (G4).
- **[FAIT]** `grist.docApi.getDocName()` (G4).
- **[FAIT]** `grist.fetchSelectedTable(options?)` et `grist.fetchSelectedRecord(rowId, options?)` (G2). Les versions de `GristView` ont `keepEncoded: true` et `format: 'columns'` par défaut (G7).
- **[FAIT]** `FetchSelectedOptions` (G8) : `format` (`rows`|`columns`), `expandRefs` (défaut `true`), `keepEncoded`, `includeColumns` (`shown` par défaut ; `normal`/`all` exigent l'accès complet), `cellFormat` (`normal`|`typed`).
- **[FAIT]** Lecture des métadonnées : le projet isaytoo lit `_grist_Tables` et `_grist_Tables_column` via `fetchTable` (R2). **[À VALIDER]** que cette lecture reste autorisée sur l'instance cible ; elle sert à vérifier le schéma.

### 2.6 Écriture des données

- **[FAIT]** `grist.docApi.applyUserActions(actions: any[][], options?)` (G4). Actions utilisées par R2 et testées par son faux Grist : `AddTable`, `AddColumn`, `ModifyColumn`, `AddRecord`, `BulkAddRecord`, `UpdateRecord`, `BulkUpdateRecord`, `RemoveRecord`, `BulkRemoveRecord`.
- **[FAIT]** `grist.getTable(tableId?)` renvoie un `TableOperations` (G2) : `create`, `update`, `upsert`, `destroy`, `getTableId` (G5). Il n'y a **pas** de méthode de lecture. Une table inexistante ne provoque d'erreur qu'au moment de l'opération.
- **[FAIT — code source]** Le code de G11 renvoie une erreur 400 si les enregistrements d'un même `update` n'ont pas tous les mêmes champs.
- **[HYPOTHÈSE forte]** Un seul appel `applyUserActions` contenant plusieurs actions est appliqué de façon atomique (tout ou rien) et apparaît comme une seule entrée annulable dans l'historique Grist. Le faux Grist de R3 l'implémente ainsi. **[À VALIDER]** dans Grist.
- **[FAIT]** `grist.selectedTable` = `TableOperations` de la table liée (G2).

### 2.7 Mapping des colonnes

- **[FAIT]** `ColumnToMap` (G9) : `name` (obligatoire), `title`, `description`, `type` (liste séparée par des virgules, défaut `Any`), `optional`, `allowMultiple`, `strictType`.
- **[FAIT]** Types listés (G1) : `Int`, `Numeric`, `Text`, `Date`, `DateTime`, `Bool`, `Choice`, `ChoiceList`, `Ref`, `RefList`, `Attachments`.
- **[FAIT]** `grist.mapColumnNames(record)` et `grist.mapColumnNamesBack(record)` ; le mapping renvoie `null` si une colonne obligatoire n'est pas mappée (G1). Une colonne supprimée ou de type incompatible est retirée automatiquement du mapping (G1).
- **Limite** : le mapping ne concerne **que la table liée à la section**. Il ne permet pas de mapper les colonnes d'autres tables.
- **Décision envisagée** : SIGNAL utilise un **schéma à noms fixes** (documenté dans `02`) et une vérification de schéma, plutôt que le mapping Grist, car le widget lit plusieurs tables.

### 2.8 Options persistantes

- **[FAIT]** `grist.setOption`, `getOption`, `setOptions`, `getOptions`, `clearOptions` (G2, G10). Les options sont enregistrées **dans la section du document**, pas par utilisateur ; une modification par un lecteur reste locale tant qu'elle n'est pas enregistrée (bouton « Save » dans l'en-tête de section) (G1).
- **[FAIT]** G1 recommande d'appliquer les options depuis `onOptions` plutôt que de les lire avec `getOption`.
- **Décision envisagée** : options de section réservées aux réglages partagés de la vue (vue par défaut, saison affichée par défaut) ; préférences individuelles (filtres, personne « moi ») en `localStorage`, encapsulé dans `try/catch`.

### 2.9 Liaison entre sections

- **[FAIT]** `allowSelectBy: true` dans `ready` (G6). La méthode `grist.allowSelectBy()` est **dépréciée** (G2).
- **[FAIT]** `grist.setCursorPos({ rowId })` et `grist.setSelectedRows(rowIds | null)` (G2).
- **[FAIT]** Types de liaison (G2, G11) : `Filter:Summary-Group`, `Filter:Col->Col`, `Filter:Row->Col`, `Summary`, `Show-Referenced-Records`, `Cursor:Same-Table`, `Cursor:Reference`, `Error:Invalid`.
- **Décision envisagée** : pas de liaison avec d'autres sections en V1 (le widget est autonome). Évolution possible : `setCursorPos` pour ouvrir dans Grist la ligne d'une action.

### 2.10 Encodage des valeurs

- **[FAIT]** Format `normal` : Date = nombre de secondes depuis l'époque Unix ; Ref = identifiant de ligne (G2).
- **[FAIT]** Format `typed` : Date = `["d", secondes]`, RefList = `["r", tableId, [ids]]`, erreur de formule = `["E", …]` (G2).
- **[FAIT]** Codes `GristObjCode` (G11) : `L` liste, `l` lookup, `O` dictionnaire, `D` DateTime, `d` Date, `S` skip, `C` censuré (règles d'accès), `R` référence, `r` liste de références, `E` erreur, `P` en attente, `U` non sérialisable, `V` versions.
- **[HYPOTHÈSE]** Dans `fetchTable` (format normal), RefList et ChoiceList sont encodés `["L", v1, v2, …]` et une liste vide vaut `null` ou `["L"]`. **[À VALIDER]** (tâche T1.02).
- **[HYPOTHÈSE]** Une Date s'écrit comme un nombre de secondes correspondant à minuit UTC du jour. **[À VALIDER]**.
- **[FAIT]** Une cellule censurée par les règles d'accès est encodée `["C"]` → le widget doit l'afficher comme « Non accessible ».

### 2.11 Iframe, navigateur et sécurité

- **[FAIT — code source]** G14 : un widget chargé **par URL** est un `<iframe src="…">` **sans attribut `sandbox`**, avec `allow="clipboard-write"` et d'éventuels attributs ajoutés par le déploiement (`hooks.iframeAttributes`).
- **[FAIT — code source]** Un widget du **Widget Creator** (contenu `srcdoc`) est chargé avec `sandbox="allow-scripts"` **sans `allow-same-origin`** : origine opaque, donc `localStorage` inaccessible (exception levée).
- **[FAIT]** La communication passe par `postMessage` encapsulé par l'API (G13).
- **[FAIT]** Le jeton de `getAccessToken` donne accès à l'API REST (G2). SIGNAL n'en a pas besoin et **ne l'utilisera pas**.
- **[FAIT]** Aucune variable documentée ne permet de restreindre les URL de widgets dans un Grist auto-hébergé (G20, G21 partiels). `GRIST_WIDGET_LIST_URL` définit seulement une galerie.

### 2.12 Formules utiles côté Grist

- **[FAIT]** Horodatage de création : `NOW()` avec « Apply to new records » ; de modification : « Apply on record changes » (G15).
- **[FAIT]** Auteur : `user.Name`, `user.Email`, `user.UserID` en formule de déclenchement (G16, G17).
- **[FAIT]** Ces colonnes restent modifiables à la main sauf règle d'accès contraire (G15).
- **[FAIT]** Références bidirectionnelles : colonne inverse créée automatiquement, de type Reference List si plusieurs liens ; impossible sur une colonne formule (G18).
- **[À VALIDER]** Effet de la suppression d'une ligne référencée (cellule vidée ? référence « orpheline » affichée en rouge ?). Non documenté dans G18.

### 2.13 Instance Grist de l'État

- **[FAIT]** G22 : « plateforme d'équipe gratuite de l'État », hébergée SecNumCloud, connexion ProConnect, utilisée dans « 15 ministères ».
- **[HYPOTHÈSE]** L'éligibilité et l'usage par le ministère des Armées / la Marine nationale, ainsi que la possibilité d'y héberger des données de pilotage, ne sont pas confirmés. → Question d'arbitrage `Q-001` (voir `06`).

---

## 3. Informations vérifiées — DSFR

- **[FAIT]** Version courante : **v1.15.4** (D1, D3, D8). Archive ZIP 46,1 Mo disponible sur D3.
- **[FAIT]** Installation : `npm create @gouvfr/dsfr@latest` (acceptation interactive des modalités d'utilisation) ; version précise : `npm create @gouvfr/dsfr@latest -- --dsfr-version=1.15.4` ; en intégration continue : `DSFR_ACCEPT_LICENSE=1 npm install @gouvfr/dsfr@1.15.4` (D3).
- **[FAIT]** Depuis v1.14.2, les fichiers compilés ne sont plus téléchargeables depuis les « releases » GitHub (D8).
- **[FAIT]** Fichiers : `dist/dsfr.min.css` (core + scheme + component), `dist/utility/utility.min.css` (icônes et utilitaires), `dist/dsfr/dsfr.module.min.js` et `dist/dsfr/dsfr.nomodule.min.js` (les deux sont obligatoires), découpage modulaire `dist/core`, `dist/scheme`, `dist/component`, `dist/components/<nom>/` (D3).
- **[FAIT]** Les dossiers `fonts/` (Marianne, Spectral en woff/woff2), `favicon/` et `icons/` doivent respecter des chemins relatifs précis (D3).
- **[FAIT]** Thèmes : attribut `data-fr-scheme` sur `<html>` avec `system`, `light` ou `dark` ; script anti-flash dans `<head>` qui lit `localStorage.scheme` (D3). Depuis v1.15.0, le composant « Paramètres d'affichage » se désactive sans `data-fr-scheme` (D8).
- **[FAIT]** Méthodologie de nommage BEM, préfixe `fr-` (D3).
- **[FAIT]** Points de rupture : SM 576 px, MD 768 px, LG 992 px, XL 1248 px ; gouttières 16 px puis 24 px dès LG ; classes `fr-container`, `fr-container--fluid`, `fr-grid-row`, `fr-grid-row--gutters`, `fr-col-*` (D6).
- **[FAIT]** Palette obligatoire, interdiction d'autres couleurs ; catégories primaires, neutres, système (info, warning, error, success), illustratives (17 couleurs) ; tokens de décision à utiliser en priorité pour les composants inédits ; accentuation autorisée seulement pour Badge, Carte, Citation, Mise en avant, Mise en exergue, Tableau, Tag, Tuile (D5).
- **[FAIT]** Toute information visuelle (couleur) doit être accompagnée d'une information textuelle ; conformité RGAA 4 exigée (D5).
- **[FAIT]** Liste des composants (D4) — voir `07-DESIGN-SYSTEM-DSFR.md`. **Aucun composant « barre de progression »** n'existe.
- **[FAIT]** Périmètre (D2) : DSFR obligatoire pour les sites publics de l'État depuis la circulaire 6411-SG du 07/07/2023, indissociable du domaine `.gouv.fr` ; utilisation **interdite** hors de l'État. La Marine nationale relève de l'État (ministère des Armées).
- **[FAIT]** Licence (D10) : Licence Ouverte Etalab 2.0, avec exceptions pour certains éléments (polices Marianne) ; LICENSE.md indique un usage réservé à l'administration et aux domaines `.gouv.fr`. CGU (D9) : intention `.gouv.fr`, fondamentaux non modifiables, procédure d'agrément SIG pour les sites de l'État, conditions séparées pour les polices Marianne.
- **[HYPOTHÈSE]** Un outil interne (non destiné aux citoyens) embarqué dans Grist n'est pas un « site Internet mis à disposition des citoyens » au sens de la circulaire ; l'usage du DSFR y est possible pour une entité de l'État, mais hors `.gouv.fr`. **[À VALIDER]** avec le Responsable de design du ministère des Armées (`Q-003`).
- **[À VALIDER]** Redistribution des polices Marianne dans un dépôt public et sur GitHub Pages (`Q-003`).
- **[RÉPONSE du 12/11/2026]** Q-003 : usage autorisé, limité aux **couleurs et polices** ; les composants DSFR ne sont pas utilisés (DEC-008, `07`). Les polices ne sont pas versionnées dans le dépôt : elles proviennent du paquet npm au moment du build.
- **[À VALIDER]** Absence de conflit entre le CSS DSFR et l'iframe Grist : l'iframe isole les styles du document parent, donc **[HYPOTHÈSE forte]** aucun conflit avec Grist ; risque restant : hauteur disponible faible, modales DSFR dans un espace réduit.

---

## 4. Audit du projet de référence `isaytoo/grist-project-manager-widget`

### 4.1 Licence et réutilisation

- **[FAIT]** README, `index.html` et GUIDE_MAPPING déclarent **Apache-2.0**, copyright de l'auteur, 2026.
- **[FAIT]** Le fichier `LICENSE` est **absent** (404) ; `package.json` n'a pas de champ `license`.
- **Conséquence** : la déclaration Apache-2.0 autoriserait en principe la réutilisation avec mention du copyright et de la licence, mais l'absence du texte rend la situation juridiquement moins nette. **Aucun code ne sera copié.** Seules des idées d'architecture (non protégées) sont reprises.

### 4.2 Architecture constatée

| Aspect | Constat |
|---|---|
| Structure | `index.html` (~162 Ko, CSS inline) + `widget.js` (~527 Ko), JavaScript sans module, nombreuses variables globales |
| Outillage | aucun bundler, aucune dépendance ; script `dev` = `python3 -m http.server 8091` |
| Bibliothèques | `grist-plugin-api.js`, `html2canvas 1.4.1`, `jspdf 2.5.1` depuis CDN **sans SRI**, pas de CSP |
| Accès | `grist.ready({ requiredAccess: 'full' })`, pas de mapping Grist |
| Tables | ~20 tables `PM_*` lues par nom fixe ; mapping maison stocké dans `PM_Config` mais contourné à plusieurs endroits |
| Synchronisation | `onRecords` + anti-rebond 500 ms → `loadAllData()` (rechargement complet), ignoré si une modale est ouverte |
| Écritures | `applyUserActions` (~30 appels), création de tables/colonnes **au chargement**, réécriture d'une ligne technique à chaque chargement pour identifier l'utilisateur |
| Vues | calendrier, Kanban (DnD HTML5 natif), tableau, Gantt (div positionnées en px, export PDF), modèles, statistiques (SVG), équipe, paramètres |
| Filtres | multi-critères : OU à l'intérieur d'un critère, ET entre critères ; état en `localStorage` par nom de document |
| Responsables | texte libre séparé par des virgules (emails ou noms) |
| i18n | dictionnaires fr/en, chaînes codées en dur résiduelles, clés dupliquées |
| Tests | Node + `jsdom` ; harnais chargeant le vrai HTML/JS ; faux Grist en mémoire gérant les actions principales (tout ou rien) ; l'initialisation réelle n'est pas testée |
| Hébergement | incohérent : GitHub Pages (README), Vercel (« About »), URL GristLabs (`package.json`) |

### 4.3 Points de sécurité relevés

- Rendu par concaténation + `innerHTML` ; la fonction d'échappement n'échappe pas l'apostrophe et n'est pas appliquée partout (catégories, noms de responsables, couleurs, statuts insérés dans des attributs). Avec un accès complet, une **XSS stockée** permettrait de modifier tout le document.
- Jeton d'accès passé dans l'URL (`?auth=`), exposé dans les journaux.
- Détection des rôles côté client (contournable), écritures de schéma et de données à chaque ouverture.
- Notifications vers un webhook externe (données personnelles transmises à un tiers).

### 4.4 Éléments pertinents pour SIGNAL

| Élément | Pertinence | Reprise |
|---|---|---|
| Faux Grist en mémoire pour les tests | Forte | Idée reprise, réécrite en TypeScript (`tests/support/faux-grist.ts`) |
| Rechargement complet anti-rebond | Forte (volumes faibles) | Repris, avec une table `Synchro` pour capter les changements multi-tables |
| Kanban en DnD HTML5 natif | Moyenne | Repris + **alternative clavier** obligatoire (RGAA) |
| Gantt maison en DOM/SVG | Forte (pas de dépendance lourde) | Repris en SVG/CSS avec tokens DSFR |
| Filtres OU/ET | Forte | Repris |
| Création de schéma automatique | Utile mais risquée | Reprise **uniquement sur action explicite** de l'utilisateur |
| Identification par écriture au chargement | Non pertinente | **Rejetée** (écritures non sollicitées) |
| Export PDF via CDN | Faible en V1 | Rejeté en V1 (impression navigateur `@media print` à la place) |
| Notifications par webhook | Hors périmètre | Rejeté (transfert vers un tiers) |
| Responsables en texte libre | Non pertinente | Rejetée : référence vers `Personnes` |

### 4.5 Comparaison A / B

| Critère | A. Dériver le code existant | B. Widget indépendant inspiré |
|---|---|---|
| Maintenabilité | Faible : fichier unique de 527 Ko, globales, doublons | Bonne : modules typés et séparés |
| Simplicité pour une novice | Trompeuse : pas de build, mais code impossible à faire évoluer sans régression | Un outillage à installer, mais une structure lisible et guidée par Claude Code |
| Tests | Harnais partiel, initialisation non testée | Tests unitaires du domaine, adaptateur testé avec faux Grist, E2E |
| Sécurité | XSS à corriger partout, jeton en URL, CDN sans SRI | Échappement par défaut (JSX), aucune dépendance CDN hors API Grist, CSP |
| Adéquation métier | Modèle « projet/tâche » générique, éloigné des saisons/chantiers/objectifs 3×3/sprints | Modèle conçu pour SIGNAL |
| DSFR | Styles maison à remplacer intégralement | DSFR dès le départ |
| Licence | Incertaine (LICENSE absent) | Aucune dépendance juridique |
| Coût initial | Plus faible en apparence | Plus élevé (V1 dédiée aux fondations) |

**Recommandation : option B.** Voir `DEC-002` dans `06-DECISIONS-ET-ARBITRAGES.md`.

---

## 5. Limitations identifiées

| ID | Limitation | Conséquence pour SIGNAL |
|---|---|---|
| LIM-01 | Pas d'événement de changement pour les tables autres que celle de la section | Table technique `Synchro` + rechargements explicites (voir `02` §6) |
| LIM-02 | Mapping de colonnes limité à la table de la section | Schéma à noms fixes + vérification de schéma |
| LIM-03 | Accès `full` = tout le document | Document Grist dédié à SIGNAL, rien d'autre dedans ; revue de sécurité |
| LIM-04 | Pas d'API « utilisateur courant » pour le widget | Auteurs enregistrés par formules de déclenchement côté Grist ; filtre « moi » choisi par l'utilisateur |
| LIM-05 | `fetchTable` charge des tables entières | Acceptable pour les volumes estimés (< 5 000 actions) ; à surveiller |
| LIM-06 | Options de widget partagées par la section, pas par utilisateur | Préférences personnelles en `localStorage` |
| LIM-07 | Widget Creator : `localStorage` indisponible | Mode dégradé sans mémorisation des préférences |
| LIM-08 | Hauteur et largeur de section variables, souvent réduites | Mise en page par largeur de conteneur (voir `07`) |
| LIM-09 | Pas de restriction d'URL de widget documentée | Responsabilité de l'administrateur Grist ; URL officielle documentée |
| LIM-10 | Le site DSFR bloque les outils de lecture automatique | Consultation via navigateur ; copie locale de la version installée via npm (`node_modules/@gouvfr/dsfr/example`) |

---

## 6. Décisions envisagées (détail dans `06`)

1. Widget indépendant (option B) — `DEC-002`.
2. TypeScript + Vite + Preact, DSFR via npm épinglé — `DEC-003`.
3. Accès `full`, document Grist dédié — `DEC-004`.
4. Schéma à noms fixes, assistant d'initialisation sur clic — `DEC-005`.
5. Synchronisation par table `Synchro` + rechargements explicites — `DEC-006`.
6. GitHub Pages réservé aux tests sur données fictives ; hébergement interne pour l'usage réel — `DEC-007`.

---

## 7. Points à valider dans un véritable document Grist

Ces points sont traités par la tâche de validation technique **T1.02** (voir `03`). Chaque résultat sera consigné dans ce document (section 8, à créer lors de la tâche).

| ID | Point à valider | Méthode |
|---|---|---|
| VAL-01 | `onRecords` se déclenche quand une formule de `Synchro` change suite à une modification dans une autre table | Modifier une action dans la vue Grist et observer le journal du widget |
| VAL-02 | Délai et fréquence des événements (rafales) | Modifier 20 lignes en collage multiple |
| VAL-03 | Format de retour de `fetchTable` (colonnes, `id`) | Journaliser la réponse |
| VAL-04 | Encodage lecture/écriture des Date, RefList, ChoiceList, Bool, cellules vides | Écrire puis relire des valeurs de test |
| VAL-05 | Atomicité d'un `applyUserActions` multi-actions en cas d'erreur | Envoyer un lot dont la dernière action est invalide |
| VAL-06 | Une annulation (Ctrl+Z) dans Grist annule un lot complet | Clôturer un sprint fictif puis annuler |
| VAL-07 | Le widget respecte les règles d'accès (compte Lecteur : écritures refusées) | Deux comptes de test |
| VAL-08 | Valeur exacte de `settings.accessLevel` dans `onOptions` | Journaliser |
| VAL-09 | Lecture de `_grist_Tables` / `_grist_Tables_column` autorisée | Appel `fetchTable` |
| VAL-10 | Comportement d'une Ref quand la ligne cible est supprimée | Supprimer une personne référencée |
| VAL-11 | `AddTable` / `AddColumn` avec formules de déclenchement (`recalcWhen`, `recalcDeps`) via `applyUserActions` | Exécuter l'assistant d'initialisation |
| VAL-12 | Chargement du DSFR (polices, icônes) dans l'iframe depuis GitHub Pages | Inspection réseau du navigateur |
| VAL-13 | Accessibilité de l'URL du widget depuis le poste de travail cible (réseau professionnel, proxy) | Test sur un poste représentatif |
| VAL-14 | Grist transmet-il son thème (clair/sombre) au widget ? | Observer les messages `theme` (fonction interne `onThemeChange` dans G13) |
| VAL-15 | `grist.numerique.gouv.fr` accepte-t-il un widget par **URL personnalisée** (GitHub Pages) avec accès complet ? | Ajouter la sonde par URL dans un document fictif sur l'instance |
| VAL-16 | Une formule utilisant `TODAY()` (ex. `Actions.EnRetard`) est-elle recalculée chaque jour, ou seulement à l'ouverture ou à la modification du document ? | Observer la valeur d'un jour sur l'autre sans modifier le document |
| VAL-17 | Identification sans écriture : avec une règle d'accès de lecture limitée à `rec.Courriel == user.Email.lower()` sur `Profils`, `fetchTable('Profils')` ne renvoie-t-il que la ligne de l'utilisateur ? Quel est le comportement pour le propriétaire du document ? | Deux comptes fictifs ; journaliser la réponse |
| VAL-18 | L'assistant peut-il créer une page native (vues, sections, graphique) via `applyUserActions` (`AddView`, `AddSection`…), ou faut-il une procédure manuelle ? | Essai dans un document fictif ; à défaut, procédure `docs/page-synthese-grist.md` |
| VAL-19 | Les règles d'accès « attribut utilisateur » (table `Personnes`, `user.Personne.Role`) et les conditions sur `rec`/`newRec` permettent-elles d'exprimer TECH-160 ? | Essai sur document fictif, consigné dans `docs/regles-acces-grist.md` |

---

## 8. Résultats de validation (tâche T1.02)

> Section remplie à partir du rapport de la sonde (`outils/sonde-grist/`, mode d'emploi `outils/sonde-grist/MODE-EMPLOI.md`), exécutée dans un document **fictif** sur `grist.numerique.gouv.fr`.
> Statuts : **Confirmé**, **Infirmé**, **Partiel**, **Non testé**.

| ID | Résultat | Statut | Conséquence |
|---|---|---|---|
| VAL-01 | — | Non testé | — |
| VAL-02 | — | Non testé | — |
| VAL-03 | — | Non testé | — |
| VAL-04 | — | Non testé | — |
| VAL-05 | — | Non testé | — |
| VAL-06 | — | Non testé | — |
| VAL-07 | — | Non testé | — |
| VAL-08 | — | Non testé | — |
| VAL-09 | — | Non testé | — |
| VAL-10 | — | Non testé | — |
| VAL-11 | — | Non testé | — |
| VAL-12 | Reporté à T1.03 (intégration des couleurs et polices DSFR) | Non testé | — |
| VAL-13 | — | Non testé | — |
| VAL-14 | — | Non testé | — |
| VAL-15 | — | Non testé | — |
| VAL-16 | — | Non testé | — |
| VAL-17 | — | Non testé | — |
| VAL-18 | — | Non testé | — |
| VAL-19 | — | Non testé | — |
