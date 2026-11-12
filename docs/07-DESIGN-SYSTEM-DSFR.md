# 07 — Identité visuelle DSFR appliquée au widget

> Version : 0.2 — 12/11/2026 — Statut : **Validé sur le principe (DEC-008), mise en œuvre proposée**
> Sources : `00-RECHERCHE-TECHNIQUE.md` §1.3 et §3 (références D1 à D11).
> **Règle** : aucune interface n'est développée sans respecter ce document (`UX-020`).

---

## 0. Cadre retenu (DEC-008)

- L'usage du DSFR est **autorisé** pour ce widget interne (réponse Q-003 du 12/11/2026).
- **Périmètre** : on reprend **uniquement les couleurs** (palette, tokens, thèmes clair et sombre) et **la police Marianne**.
- **On n'utilise pas les composants DSFR** : ni leur CSS, ni leur JavaScript, ni leurs classes `fr-*` de composants (`fr-btn`, `fr-modal`, `fr-tabs`…).
- Les composants de l'interface (boutons, onglets, modales, formulaires, tableaux, badges…) sont **écrits pour le projet**, dans `src/ui/composants/base/`, et appliquent les règles d'accessibilité RGAA.
- **Leur apparence s'inspire de shadcn/ui** (DEC-031, 12/11/2026). La bibliothèque elle-même n'est pas utilisée : elle demande React, Tailwind CSS et Radix UI. Les marqueurs de ce style :
  - angles arrondis (`--sg-rayon-*`), bordures fines, ombres légères (`--sg-ombre-*`) ;
  - anneau de focus coloré (`--sg-anneau`) ;
  - champs encadrés sur tout le pourtour ;
  - boutons « plein », « contour » et « fantôme » ;
  - badges et étiquettes en pastille, sans majuscules ;
  - onglets et contrôle segmenté en pastilles sur fond gris ;
  - modale arrondie sur fond assombri et flouté ;
  - cartes (tuiles) ombrées ;
  - tableau aéré dans un cadre arrondi, avec survol des lignes.
- **Les couleurs restent exclusivement celles du DSFR** : formes et proportions viennent de shadcn/ui, couleurs du DSFR.
- **Interdits** : bloc marque « République française », Marianne institutionnelle (logo), devise, tout élément pouvant faire croire à un site officiel `.gouv.fr`.

## 1. Version et fichiers retenus

| Élément | Valeur |
|---|---|
| Paquet | `@gouvfr/dsfr` |
| Version | **1.15.4** (courante au 12/11/2026), épinglée exactement |
| Installation | `npm create @gouvfr/dsfr@latest -- --dsfr-version=1.15.4` (acceptation interactive des modalités d'utilisation **par la responsable**) ; en CI : `DSFR_ACCEPT_LICENSE=1` |
| Vérification | `npm view @gouvfr/dsfr version` au moment de T1.03 ; si une version plus récente existe, consigner le choix dans `06` |

**Fichiers importés** (depuis `node_modules/@gouvfr/dsfr/dist/`, recopiés dans le build par Vite) :

| Fichier | Contenu utilisé |
|---|---|
| `core/core.min.css` | Variables de couleur (tokens), `@font-face` Marianne, typographie de base, réinitialisation, focus |
| `scheme/scheme.min.css` | Variables du thème sombre |
| `fonts/` (Marianne, woff2/woff) | Police |

**Non importés** : `dsfr.min.css` (complet), `component/`, `components/*`, `utility/` (icônes et utilitaires), tous les fichiers JavaScript (`dsfr.module.min.js`…), `favicon/`, la police Spectral.

**À vérifier en T1.03 (VAL-12)** :
- `core.min.css` contient bien les déclarations de variables et de polices sans dépendre des composants ;
- le thème sombre fonctionne en posant nous-mêmes l'attribut `data-fr-theme="dark"` sur `<html>`, sans le JavaScript DSFR ;
- `core` ne stylise pas les éléments HTML d'une façon qui gêne nos composants.

**Résultat de T1.03 (VAL-12 confirmé)** : `core` convient tel quel. Le repli par extraction des variables n'a pas été nécessaire.

**Icônes** : celles du DSFR ne sont pas importées. On utilise **11 icônes SVG dessinées pour le projet** (`src/ui/icones.tsx`) : chevrons, fermer, info, succès, erreur, avertissement, plus, flèches de tri. Comme elles ont été dessinées pour le projet, aucune licence tierce ne s'applique.

**Survols (DEC-031)** : bouton principal et bouton danger légèrement assombris (`color-mix`, 88 % de la couleur + noir) ; boutons « contour » et « fantôme » sur fond gris (`--sg-fond-survol`).

**Bordure des champs** : `--sg-bordure-champ` (gris DSFR `grey-625-425`), contraste d'environ 3,1:1 en clair comme en sombre (minimum RGAA pour les composants d'interface).

## 2. Composants du projet

Tous dans `src/ui/composants/base/`, chacun avec son test de composant et une page de démonstration (`outils/vitrine/`). Le modèle d'accessibilité suit les motifs ARIA de référence (WAI-ARIA Authoring Practices).

| Besoin | Composant du projet | Exigences d'accessibilité principales |
|---|---|---|
| Navigation entre vues | `Onglets` | `role="tablist"`/`tab`/`tabpanel`, flèches gauche/droite, `aria-selected` ; < 576 px : liste déroulante native |
| Actions | `Bouton` (primaire, secondaire, tertiaire, icône seule, danger) | `<button>`, libellé accessible, état désactivé `aria-disabled` + explication |
| Formulaires | `ChampTexte` (types texte, date, nombre, courriel), `ZoneTexte` — fichier `Champ.tsx` | `<label>` lié, message d'aide et d'erreur via `aria-describedby`, `aria-invalid` |
| Listes | `ListeDeroulante` (`<select>` natif) | Natif, donc accessible |
| Recherche dans une longue liste | `ListeRecherche` (V2, si > 50 options) | Motif « combobox » ARIA |
| Choix | `CaseACocher`, `GroupeRadio`, `Interrupteur` | Éléments natifs stylisés ; `fieldset`/`legend` |
| Bascules | `ControleSegmente` | Groupe de radios natifs |
| Tableaux | `Tableau` (tri, pagination) | `caption`, `th scope`, `aria-sort`, boutons de tri |
| Statuts | `Badge` | Texte toujours présent ; icône décorative masquée |
| Filtres actifs | `Etiquette` supprimable | Bouton « Retirer le filtre X » |
| Messages | `Alerte` (succès, erreur, info, avertissement) | `role="status"` (succès, info) ou `role="alert"` (erreur) |
| Bandeau permanent | `Bandeau` | Texte lisible, non masquable s'il est critique |
| Confirmations, formulaires | `Modale` | `<dialog>` natif (`showModal`), focus piégé et rendu à l'élément déclencheur, fermeture par Échap, titre `aria-labelledby` |
| Aide | `Infobulle` | Déclenchée au survol **et** au focus, `aria-describedby`, fermeture par Échap |
| Arborescence | `Accordeon` | `<button aria-expanded aria-controls>` |
| Étapes | `IndicateurEtapes` | Texte « Étape 2 sur 3 : … » |
| Tuiles du cockpit | `Tuile` | Lien ou bouton unique couvrant la tuile, titre explicite |
| Pagination | `Pagination` | `nav aria-label`, page courante `aria-current` |
| Thème | `InterrupteurTheme` (« Mode sombre », DEC-029) | Bouton natif avec `role="switch"` et `aria-checked` ; mémorisé en `localStorage` |
| Barre de progression | `BarreProgression` (§5.1) | `role="progressbar"` |

**Principe** : préférer les éléments HTML natifs (`<button>`, `<select>`, `<dialog>`, `<details>` si pertinent), qui sont accessibles par défaut, à des reconstructions en `<div>`.

## 3. Règles typographiques et colorimétriques

### 3.1 Typographie

- Police : **Marianne** uniquement (graisses 300, 400, 700 ; italique si nécessaire). Pas de Spectral.
- Taille de base 16 px (1 rem) ; échelle reprise du DSFR : titres de vue 1.5 rem, titres de bloc 1.25 rem, texte 1 rem, petit texte 0.875 rem, très petit 0.75 rem. Hauteurs de ligne 1.5 pour le texte.
- Hiérarchie sémantique : un seul `h1` par vue, pas de saut de niveau.

### 3.2 Couleurs

- **Interdiction** d'utiliser des couleurs hors de la palette DSFR (D5). Aucun code hexadécimal dans `src/styles/` : uniquement des `var(--…)` DSFR.
- Utiliser en priorité les **tokens de décision** : arrière-plans, textes, bordures, actions. Ils changent automatiquement entre clair et sombre. Les noms exacts sont relevés dans `core.css` en T1.03 et listés dans `src/styles/variables.css`, qui fait l'alias vers nos usages, par exemple `--signal-fond: var(--background-default-grey)`.
- **Couleurs système** (info, warning, error, success) : réservées aux états et statuts.
- **Couleurs illustratives** : uniquement pour distinguer les chantiers (Gantt, tuiles, bordure des cartes). Elles sont toujours doublées du code chantier en texte.
- Toute couleur porteuse de sens est doublée d'un texte ou d'une icône avec libellé (UX-009).

### 3.3 Correspondance statuts → badges (proposition)

| Domaine | Valeur | Couleur du badge |
|---|---|---|
| Action | À faire | Neutre (gris) |
| Action | En cours | Info |
| Action | Bloquée | Erreur |
| Action | Terminée | Succès |
| Action | Abandonnée | Neutre |
| Action | En retard (dérivé) | Avertissement, texte « En retard » |
| Action | Contribue (chantier associé) | Neutre, texte « Contribue — porté par CHx » |
| Validation | Brouillon / Soumis / Validé / À reprendre / Abandonné | Neutre / Info / Succès / Avertissement / Neutre |
| Sprint | Préparation / En cours / Clôturé / Annulé | Neutre / Info / Succès / Neutre |
| Priorité | Haute / Moyenne / Basse | Texte + icône flèche, sans couleur système |
| Avancement | Calculé / Déclaré / Non mesurable | Texte sous la barre ; « Déclaré » mis en évidence par une icône et une infobulle |
| Gouvernance | Criticité Haute / Moyenne / Basse | Erreur / Avertissement / Neutre |

Tous les badges ont la forme d'une pastille, sans majuscules (DEC-031).

### 3.4 Espacements et grille

- Échelle d'espacement DSFR (multiples de 4 px : 4, 8, 12, 16, 24, 32, 40, 48), exposée en variables `--signal-espace-1` à `--signal-espace-8`.
- Mise en page en CSS Grid / Flexbox maison. Les classes de grille DSFR ne sont pas utilisées (elles font partie de `core`, mais on ne s'en sert pas, pour rester indépendant).
- Points de rupture DSFR conservés : 576, 768, 992, 1248 px.

## 4. Adaptations propres au widget Grist

| Sujet | Adaptation |
|---|---|
| Isolation | L'iframe isole les styles du document Grist : pas de conflit attendu (VAL-12) |
| Structure | Pas d'en-tête ni de pied de site. Barre supérieure compacte : saison, utilisateur connecté et rôle, actualiser, thème, version |
| Hauteur | `html, body { height: 100% }` ; barre et onglets fixes ; zone de contenu défilante |
| Largeur | Media queries sur la largeur de l'iframe, qui est celle de la section |
| Modales | Hauteur maximale = hauteur de section ; contenu défilant ; plein écran sous 576 px |
| Thème | **Clair par défaut**, comme Grist sur `grist.numerique.gouv.fr` ; interrupteur « Mode sombre » mémorisé sur le poste (DEC-029). Ni le thème du système ni celui envoyé par Grist ne sont suivis. `src/ui/theme.ts` pose `data-fr-theme` et `color-scheme` sur `<html>` avant le premier affichage (code chargé depuis un fichier, conforme à la CSP) |
| Impression | `@media print` : barre et onglets masqués, fond blanc, A4 paysage |
| Widget Creator (repli I2) | `localStorage` indisponible : thème « Système » forcé |

## 5. Composants métier

Construits avec les composants de base et les tokens. Chacun a des états actif, survol, focus, sélectionné, désactivé et erreur.

### 5.1 Barre de progression (`BarreProgression`)

- `<div role="progressbar" aria-valuenow aria-valuemin="0" aria-valuemax="100" aria-label="Avancement de …">`, avec la valeur « 60 % » en texte à côté.
- Remplissage : couleur d'action principale (bleu France) ; fond : token de contraste gris. Pas de rouge ni de vert selon le niveau (pas de jugement implicite).
- « Non mesurable » : barre vide à motif hachuré, plus le texte.
- « Déclaré » : icône et mention « déclaré par le pilote », avec une infobulle qui donne la valeur calculée.

### 5.2 Carte d'action et Kanban

- Carte : `article` avec titre, badges (priorité, retard, bloquée, contribue), responsable, échéance ; bordure gauche à la couleur du chantier porteur, code du chantier en texte.
- Glisser-déposer HTML5, plus une **alternative clavier obligatoire** : le bouton « Déplacer » ouvre une `Modale` de choix du statut. Le résultat est annoncé dans une région `aria-live="polite"`.
- Colonnes : `section` avec titre et compteur. Sous 768 px, colonnes empilées repliables.

### 5.3 Gantt

- Grille CSS ou SVG ; axe des mois ; libellés à gauche ; barres à la couleur du chantier ; jalons en losanges ; ligne « aujourd'hui ».
- Barres focusables avec `aria-label` complet ; **équivalent tableau** accessible ; liste chronologique sous 768 px.

### 5.4 Calendrier mensuel

- `table` sémantique de 7 colonnes, lundi en premier ; jour courant signalé par une bordure **et** le texte « aujourd'hui » masqué visuellement.

### 5.5 Cockpit et revue mensuelle

- Tuiles par chantier : code et intitulé, pilote, `BarreProgression`, badges (objectifs validés, actions en retard, actions bloquées).
- Graphique d'évolution mensuelle (`ReleveMensuel`) : courbe SVG simple. Il est accompagné d'un **tableau de données** équivalent et respecte les couleurs DSFR.

### 5.6 Arborescence des objectifs

- `Accordeon` imbriqués sur deux niveaux ; en-tête : code, intitulé, badge de validation, barre de progression compacte.

## 6. Exigences d'accessibilité

Référentiel : **RGAA 4.1**, niveau AA visé (`UX-021`). En l'absence des composants DSFR, déjà audités, l'accessibilité repose **entièrement** sur nos composants : les tests §9 sont donc obligatoires dès T1.03.

| Thème RGAA | Exigence |
|---|---|
| Couleurs | Information jamais portée par la seule couleur ; contraste ≥ 4,5:1 pour le texte et ≥ 3:1 pour les éléments graphiques, en clair **et** en sombre |
| Images et icônes | Icônes décoratives : `aria-hidden="true"` ; icônes informatives : alternative textuelle |
| Tableaux | `caption`, `th scope`, `aria-sort` |
| Liens et boutons | Intitulés explicites (texte masqué si besoin) |
| Scripts | Rôles ARIA conformes aux motifs ; messages d'état dans `aria-live` |
| Formulaires | Étiquettes visibles liées ; champs obligatoires signalés ; erreurs associées |
| Structure | Titres hiérarchisés ; régions `main` et `nav` ; lien d'évitement |
| Présentation | Zoom 200 % sans perte ; focus toujours visible (contour de 2 px, couleur de focus DSFR) |
| Navigation | Ordre de tabulation logique ; focus piégé dans les modales puis rendu à l'élément déclencheur |
| Consultation | Pas de limite de temps ; respect de `prefers-reduced-motion` |

## 7. Responsive design

| Largeur de section | Comportement |
|---|---|
| < 576 px | Navigation par liste déroulante ; formulaires et modales en plein écran ; Kanban empilé ; Gantt remplacé par une liste ; défilement horizontal limité à l'intérieur des tableaux |
| 576–767 px | Tuiles sur 1 colonne |
| 768–991 px | Onglets ; tuiles sur 2 colonnes ; Kanban défilant horizontalement dans sa zone ; Gantt actif |
| 992–1247 px | Liste et fiche côte à côte ; panneau d'édition latéral ; tuiles sur 3 colonnes |
| ≥ 1248 px | Tuiles sur 4 colonnes |

Largeur minimale supportée : 360 px (UX-010). Jamais de défilement horizontal au niveau de la page.

## 8. Conventions pour les développements futurs

1. Réutiliser un composant de `src/ui/composants/base/`. S'il n'en existe aucun, en créer un nouveau, documenté ici et présenté dans la vitrine, plutôt qu'un style isolé dans une vue.
2. Aucune classe de composant DSFR (`fr-btn`, `fr-modal`…) dans le code (DEC-008). Préfixe de nos classes : `sg-` (par exemple `sg-bouton`, `sg-bouton--secondaire`), selon la méthode BEM.
3. Aucune couleur hors variables DSFR ; aucun `!important`.
4. Libellés de boutons à l'infinitif (« Créer un objectif »), vocabulaire métier, pas de jargon Grist.
5. Un seul bouton primaire par écran ou modale ; une action destructrice demande toujours une confirmation.
6. États vides : titre, explication, action principale.
7. Messages d'erreur : ce qui s'est passé, pourquoi, quoi faire.
8. Formats français : `JJ/MM/AAAA`, `60 %` avec espace insécable.
9. Lois de l'UX : Hick (limiter les choix visibles), Fitts (cibles ≥ 44 px), Jakob (conventions familières), Miller (≤ 7 éléments par groupe), Doherty (retour visible en moins de 400 ms), Von Restorff (alertes distinctes), proximité (regrouper ce qui va ensemble), Tesler (valeurs par défaut).
10. Code lisible sans outil d'IA, composants courts et commentés (critère GristGouv).

## 9. Tests de conformité visuelle et d'accessibilité

| ID | Test | Outil | Automatisé |
|---|---|---|---|
| TEST-A11Y-01 | axe-core sur chaque vue et sur la vitrine, thèmes clair et sombre : aucune violation `serious` ou `critical` | Playwright + `@axe-core/playwright` | Oui |
| TEST-A11Y-02 | Parcours P3, P6 et P7 réalisés entièrement au clavier | Playwright | Oui |
| TEST-A11Y-03 | Modales : focus piégé puis rendu, fermeture par Échap | Playwright | Oui |
| TEST-A11Y-04 | Contrastes de tous les composants, en clair et en sombre | axe-core (`color-contrast`) | Oui |
| TEST-A11Y-05 | Lecteur d'écran (NVDA + Firefox) sur Kanban, Gantt, assistant de clôture, modales | Manuel | Non |
| TEST-A11Y-06 | Zoom 200 % et largeur 360 px | Playwright + manuel | Partiel |
| TEST-VIS-01 | Captures de référence par vue et par largeur (360, 768, 1280 px) | Playwright `toHaveScreenshot` | Oui |
| TEST-VIS-02 | Aucune couleur codée en dur, aucune classe `fr-*` de composant, aucun `!important` | stylelint + ESLint (règle maison) | Oui |
| TEST-VIS-03 | Revue visuelle par la responsable à chaque version | Manuel | Non |

axe-core ne couvre qu'une partie des critères du RGAA. Un audit RGAA complet est recommandé avant une diffusion large.
