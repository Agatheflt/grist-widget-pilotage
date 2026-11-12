# 01 — Cahier des charges fonctionnel

> Projet : **Pilotage de la stratégie SIGNAL**
> Version : 0.1 — 12/11/2026
> Statut global : **Proposé — à valider par la responsable du projet**
> Toutes les données d'exemple sont **fictives** (personnes, équipes, objectifs, dates).

## Conventions

- Chaque exigence possède un identifiant stable : `FONC-xxx` (fonctionnelle), `UX-xxx` (ergonomie), `SECF-xxx` (sécurité fonctionnelle), `IND-xxx` (indicateur), `RG-xxx` (règle métier), `CA-xxx` (critère d'acceptation), `Q-xxx` (question à arbitrer).
- Un identifiant n'est **jamais réutilisé** ni renuméroté. Une exigence supprimée est marquée « Retirée ».
- Colonne **Version** : version du plan de développement (`03`) dans laquelle l'exigence est livrée : V1, V2, V3, V4 ou « Ultérieur ».
- Colonne **Statut** : `Proposé` (non validé), `Validé` (accord explicite de la responsable), `Retiré`. **Toutes les exigences sont actuellement `Proposé`.**
- Les tests associés (`TEST-xxx`) figurent dans `04-STRATEGIE-DE-TESTS.md` ; la matrice de traçabilité est dans `03-PLAN-DE-DEVELOPPEMENT.md`.
- Les noms de tables et de colonnes Grist cités entre accents graves (`Actions.Statut`) sont définis dans `02-CAHIER-DES-CHARGES-TECHNIQUE.md`.

---

## 1. Présentation du projet

Pilotage de la stratégie SIGNAL est un **widget personnalisé Grist** qui offre une interface visuelle pour piloter la stratégie SIGNAL de transformation numérique : saisons annuelles, chantiers, objectifs et sous-objectifs, sprints mensuels, backlog d'actions, points de gouvernance (risques, blocages, arbitrages, décisions) et jalons.

Le widget s'affiche dans une section de page d'un document Grist. Il lit et écrit directement dans les tables de ce document : **Grist reste l'unique source de vérité**. Aucun serveur applicatif n'est ajouté.

## 2. Contexte et besoins

### 2.1 Contexte

- SIGNAL est organisée en **chantiers annuels** (sept en 2026, liste configurable).
- Chaque année (une **saison**), chaque pilote de chantier définit en septembre **trois objectifs annuels**, chacun décliné en **trois sous-objectifs**. Ils sont présentés lors d'une **réunion de lancement** au chef du bureau numérique et à l'amiral du numérique, puis validés.
- L'exécution est suivie par **sprints mensuels** préparés avec chaque pilote.
- Les réunions de suivi exigent une vision consolidée (avancement, retards, blocages, arbitrages).

### 2.2 Besoins exprimés

| Besoin | Description |
|---|---|
| B1 | Travailler au quotidien dans une interface visuelle, sans manipuler les tables Grist |
| B2 | Conserver l'historique des saisons, préparer la suivante |
| B3 | Formaliser et valider les objectifs et sous-objectifs |
| B4 | Préparer, suivre et clôturer les sprints mensuels |
| B5 | Gérer un backlog d'actions par chantier |
| B6 | Préparer et animer les réunions de gouvernance |
| B7 | Préparer la réutilisation des données par un futur widget éditorial |
| B8 | Respecter le DSFR, le RGAA et les contraintes d'un environnement professionnel |

### 2.3 Hypothèses de départ

- **H1** : une vingtaine d'utilisateurs actifs, moins de 10 saisons, moins de 15 chantiers par saison, moins de 5 000 actions au total.
- **H2** : les utilisateurs disposent d'un compte sur l'instance Grist et des droits définis par le propriétaire du document.
- **H3** : un document Grist est dédié à Pilotage de la stratégie SIGNAL (il ne contient pas d'autres données).
- **H4** : l'interface est en français uniquement.
- **H5** : usage sur poste de travail (largeur ≥ 1024 px) ; usage occasionnel sur écran réduit ou section Grist étroite.

## 3. Objectifs du produit

| ID | Objectif | Mesure de réussite proposée |
|---|---|---|
| OBJ-1 | Réduire le temps de préparation d'une réunion de suivi | La vue « Revue de chantier » suffit à animer la réunion sans export manuel |
| OBJ-2 | Fiabiliser la donnée | Zéro double saisie ; chaque action rattachée à un chantier-saison |
| OBJ-3 | Rendre visibles retards et blocages | Toute action en retard ou bloquée apparaît dans le cockpit |
| OBJ-4 | Conserver la mémoire du programme | Saisons et sprints clôturés consultables avec leur bilan |
| OBJ-5 | Être maintenable par une équipe non experte | Chaque évolution passe par les documents de ce dépôt et des tests automatisés |

## 4. Périmètre fonctionnel

### 4.1 Dans le périmètre

Saisons, référentiel des chantiers, chantiers par saison, objectifs et sous-objectifs, validation, sprints, backlog, Kanban, Gantt/calendrier, cockpit, points de gouvernance, jalons, personnes, équipes, journal des modifications importantes, initialisation du document, données de démonstration.

### 4.2 Hors périmètre de la première version

- Pilotage éditorial et communication (futur second widget ; seul le modèle de données est préparé en V4).
- Envoi de courriels, notifications, intégrations externes (messagerie, agenda, webhooks).
- Gestion fine des droits **dans** le widget (les droits sont ceux de Grist).
- Saisie de temps passé, budget, charge.
- Multilingue.
- Application mobile.

### 4.3 MVP

Le **MVP** est atteint à la fin de la **V2** : il permet le pilotage opérationnel quotidien (saisons, chantiers, objectifs, sprints, backlog, Kanban) **et la revue mensuelle avec l'amiral** grâce aux indicateurs calculés dans Grist, à la page Grist native « Synthèse SIGNAL » et au relevé mensuel. Le cockpit du widget, le Gantt et le reporting avancé sont livrés en V3. Ce découpage est une proposition (`DEC-010`).

| Domaine | MVP (V1 + V2) | Évolutions (V3, V4, ultérieur) |
|---|---|---|
| Saisons | Création, statut, sélection, consultation des saisons passées, préparation de la suivante | Comparaison inter-saisons |
| Chantiers | Référentiel, chantier-saison, pilote, équipes | Fiche chantier enrichie (risques, jalons) en V3 |
| Objectifs | Arborescence 3×3, validation, verrouillage, journal | Demande de modification formalisée (V3) |
| Sprints | Préparation, démarrage, suivi, clôture, report, historique | Bilan consolidé tous chantiers (V3) |
| Backlog | Actions, statuts, priorités, responsables, blocage, Kanban, filtres, archivage | Dépendances visualisées (V3), commentaires multiples (ultérieur) |
| Gouvernance | Indicateurs visibles dans Grist, page « Synthèse SIGNAL », relevé mensuel (V2) | Cockpit, points de gouvernance, jalons, Gantt, revue de chantier, synthèse mensuelle (V3) |
| Utilisateurs | Table des personnes avec rôles, identification automatique, règles d'accès par rôle (V1) | — |
| Intégration | — | Modèle éditorial (V4) |

## 5. Utilisateurs et responsabilités

Les rôles ci-dessous sont enregistrés dans la table `Personnes` (colonne `Role`), saisie à la main par le responsable de pilotage (DEC-016).

| Rôle (`Personnes.Role`) | Exemple fictif | Responsabilités | Usage principal | Droits Grist (partage du document) |
|---|---|---|---|---|
| **Autorité** (amiral du numérique, chef du bureau numérique) | « Autorité A » | Arbitre ; reçoit la revue mensuelle | Page Grist « Synthèse SIGNAL », cockpit, revue de chantier (lecture) | Lecteur |
| **Responsable pilotage** (PMO) | « Camille Exemple » | Administre saisons, personnes et référentiels ; **saisit la validation des objectifs** ; seul à modifier un objectif validé ; fige le relevé mensuel ; anime la gouvernance | Toutes les vues | Propriétaire |
| **Pilote** (de chantier) | « Dominique Test » | Définit les objectifs, prépare et clôture les sprints de son chantier | Objectifs, Sprints, Backlog | Éditeur |
| **Contributeur** | « Alex Fictif » | Met à jour ses actions | Backlog / Kanban | Éditeur |
| **Lecteur** | « Observateur O » | Consulte | Cockpit, Chantiers | Lecteur |

- **RG-001** Le widget n'accorde aucun droit : il applique les droits Grist. Les restrictions propres à un rôle (validation et modification des objectifs validés, gestion des personnes, relevé mensuel) sont garanties par des **règles d'accès Grist par rôle** (DEC-023, TECH-160) ; le widget adapte en plus son affichage au rôle de l'utilisateur identifié (FONC-087).
- **RG-007** Il n'y a **pas** de restriction par chantier : tout éditeur peut modifier les actions et sprints de tous les chantiers (Q-008).

## 6. Organisation des saisons et des chantiers

### 6.1 Saisons

Une saison est un cycle annuel : **préparation → lancement → exécution → bilan → clôture**.

| Statut (`Saisons.Statut`) | Signification | Transitions autorisées |
|---|---|---|
| `Préparation` | Saison future en cours de préparation (chantiers, pilotes, objectifs en brouillon) | → `Lancement` |
| `Lancement` | Objectifs présentés, en cours de validation | → `Active`, → `Préparation` |
| `Active` | Exécution (sprints) | → `Bilan` |
| `Bilan` | Fin d'exécution, rédaction des bilans | → `Clôturée`, → `Active` |
| `Clôturée` | Archivée, consultation seule dans le widget | → `Bilan` (réouverture, responsable de pilotage, confirmation) |

| ID | Exigence | Version | Statut |
|---|---|---|---|
| FONC-001 | Créer une saison : libellé (ex. « Saison 2026-2027 »), date de début, date de fin, statut initial `Préparation`. | V1 | Proposé |
| FONC-002 | Faire évoluer le statut d'une saison selon les transitions du tableau ci-dessus, avec confirmation. | V1 | Proposé |
| FONC-003 | Sélectionner la saison affichée dans un sélecteur global ; par défaut, la saison `Active` (sinon la plus récente). Les saisons `Clôturée` sont affichées en lecture seule. | V1 | Proposé |
| FONC-004 | Préparer la saison suivante : créer une saison et reprendre, après confirmation, la liste des chantiers actifs et de leurs pilotes de la saison choisie comme modèle. Les objectifs ne sont pas copiés automatiquement ; le pilote ou le responsable de pilotage peut **reconduire** un objectif (et ses sous-objectifs) de la saison précédente : copie au statut `Brouillon`, liée à l'original (`ObjectifOrigine`), librement modifiable (Q-007). | V1 | Proposé |

- **RG-002** Au plus **une** saison au statut `Active` à un instant donné.
- **RG-003** Une saison ne peut passer à `Clôturée` que si tous ses sprints sont `Clôturé` ou `Annulé`. Sinon, le widget liste les sprints concernés.
- **RG-004** Les dates de fin sont postérieures aux dates de début (vrai pour saisons, sprints, actions, jalons).

### 6.2 Chantiers

Le **référentiel des chantiers** (`Chantiers`) est permanent ; la participation d'un chantier à une saison (`ChantiersSaison`) porte le pilote et les équipes de l'année. Un chantier peut ainsi changer de pilote ou d'intitulé d'une saison à l'autre sans perdre son historique.

Référentiel initial (fictif quant aux pilotes, réel quant aux intitulés fournis) :

| Code | Intitulé |
|---|---|
| CH1 | Conduite du changement |
| CH2 | Compétences |
| CH3 | Maîtriser la donnée |
| CH4 | Outils et services numériques |
| CH5 | Dorsale numérique |
| CH6 | Zero Trust Data Centric Security |
| CH7 | Combattre grâce à la donnée / Compile to Combat |

| ID | Exigence | Version | Statut |
|---|---|---|---|
| FONC-010 | Gérer le référentiel des chantiers : code, intitulé, description, ordre d'affichage, actif/inactif. Un chantier utilisé n'est pas supprimable, seulement désactivable. | V1 | Proposé |
| FONC-011 | Associer un chantier à une saison (`ChantiersSaison`) avec pilote (personne), équipes contributrices et intitulé spécifique éventuel pour la saison. | V1 | Proposé |
| FONC-012 | Vue Chantiers : liste des chantiers de la saison et fiche détaillée (pilote, équipes, objectifs, avancement, sprint en cours). | V1 (avancement en V2) | Proposé |

- **RG-005** Un chantier n'apparaît qu'une fois par saison.
- **RG-006** Chaque chantier-saison a un et un seul pilote (personne). Le pilote peut être vide en `Préparation` uniquement ; une alerte est affichée.

## 7. Modèle fonctionnel des objectifs

### 7.1 Hiérarchie

```
Saison
└── Chantier-saison
    └── Objectif annuel (cible : 3)
        └── Sous-objectif (cible : 3 par objectif)
            └── Actions (backlog)
```

Une action peut aussi être rattachée directement à un objectif ou seulement au chantier-saison (action transverse).

| ID | Exigence | Version | Statut |
|---|---|---|---|
| FONC-020 | Créer et modifier un objectif annuel : chantier-saison, intitulé, description, résultat attendu, responsable (par défaut le pilote), échéance, ordre. | V1 | Proposé |
| FONC-021 | Créer et modifier un sous-objectif rattaché à un objectif : intitulé, description, responsable, échéance, ordre. | V1 | Proposé |
| FONC-022 | Signaler par une alerte **non bloquante** l'écart à la cible « 3 objectifs par chantier-saison » et « 3 sous-objectifs par objectif » (valeurs paramétrables dans `Config`). | V1 | Proposé |
| FONC-023 | Identifier responsable et échéance de chaque objectif et sous-objectif ; l'échéance d'un sous-objectif doit être comprise dans la saison. | V1 | Proposé |
| FONC-024 | Gérer le statut de validation d'un objectif (voir 7.2). Le statut d'un sous-objectif suit celui de son objectif. Les transitions vers `Validé`, `À reprendre` et `Abandonné` sont **saisies par le responsable de pilotage** (Q-005). | V1 | Validé (12/11/2026) |
| FONC-025 | Un objectif `Validé` (et ses sous-objectifs) n'est modifiable que **par le responsable de pilotage**, avec motif obligatoire consigné au journal ; pour les autres rôles, ses champs sont verrouillés. Lors d'une nouvelle saison, l'objectif peut être **reconduit** (FONC-004) puis modifié librement. Garantie par règle d'accès Grist (TECH-160). | V1 | Validé (12/11/2026) |
| FONC-026 | Afficher l'avancement de chaque sous-objectif, objectif, chantier et de la saison selon `IND-001` à `IND-004`, calculé par des **formules Grist** visibles directement dans Grist ; la source (« Calculé », « Déclaré », « Non mesurable ») est mise en évidence. | V2 | Validé (12/11/2026) |
| FONC-027 | Consigner au journal (`Journal`) les modifications importantes : changement de statut de validation, modification d'un champ verrouillé, changement de responsable, archivage. | V1 | Proposé |
| FONC-028 | Vue Objectifs : arborescence dépliable chantier → objectif → sous-objectif, avec statut, responsable, échéance, avancement. | V1 | Proposé |
| FONC-029 | Archiver un objectif ou un sous-objectif (suppression logique) ; un objectif archivé n'entre plus dans les calculs. | V1 | Proposé |

### 7.2 Statuts de validation (proposition, `Q-005`)

Statuts et rôles **validés** le 12/11/2026 (Q-005).

| Statut (`Objectifs.StatutValidation`) | Signification | Qui |
|---|---|---|
| `Brouillon` | En rédaction | Pilote |
| `Soumis` | Prêt pour la réunion de lancement | Pilote |
| `Validé` | Validé en réunion de lancement ; sert de référence | Responsable de pilotage (saisie de la décision) |
| `À reprendre` | Renvoyé pour modification (motif obligatoire) | Responsable de pilotage |
| `Abandonné` | Retiré en cours de saison (motif obligatoire) | Responsable de pilotage |

Transitions : `Brouillon → Soumis → Validé` ; `Soumis → À reprendre → Soumis` ; `Validé → À reprendre` ; tout statut → `Abandonné`.

- **RG-010** Un sous-objectif ne peut exister sans objectif parent.
- **RG-011** Un sous-objectif n'a pas d'enfant (deux niveaux maximum).
- **RG-012** La validation d'un objectif enregistre la date de validation et, en option, une référence vers la décision (`PointsGouvernance`) en V3.
- **RG-013** Le widget ne peut pas garantir qui valide (pas de contrôle d'identité) ; l'auteur réel est enregistré par Grist (`MajPar`).

## 8. Fonctionnement des sprints

### 8.1 Principe retenu (proposition, `Q-004`)

Un **sprint** est défini **par chantier-saison et par mois** (ex. « CH3 — Mars 2027 »). Le cockpit regroupe les sprints d'un même mois. Ce choix reflète le processus décrit (« chaque pilote est contacté pour préparer son sprint »).

| Statut (`Sprints.Statut`) | Signification |
|---|---|
| `Préparation` | Périmètre en cours de constitution |
| `En cours` | Mois en cours d'exécution |
| `Clôturé` | Bilan enregistré, figé |
| `Annulé` | Sprint non tenu (motif) |

| ID | Exigence | Version | Statut |
|---|---|---|---|
| FONC-030 | Préparer un sprint : chantier-saison, mois, dates (pré-remplies : premier et dernier jour du mois), objectif du sprint (texte court), statut `Préparation`. | V2 | Proposé |
| FONC-031 | Définir le périmètre : sélectionner des actions du backlog du chantier-saison (non terminées, non archivées, non engagées dans un autre sprint actif) ; création d'action possible depuis cet écran. | V2 | Proposé |
| FONC-032 | Démarrer un sprint (`Préparation → En cours`) avec confirmation. | V2 | Proposé |
| FONC-033 | Suivre un sprint en cours : actions par statut, actions en retard, actions bloquées, avancement du sprint (`IND-005`). | V2 | Proposé |
| FONC-034 | Clôturer un sprint : pour chaque action non terminée, choisir **Reporter au sprint suivant**, **Remettre au backlog** ou **Abandonner** ; enregistrer un bilan textuel ; l'ensemble est écrit en une opération atomique et crée les engagements (`EngagementsSprint`). | V2 | Proposé |
| FONC-035 | Consulter l'historique des sprints d'un chantier-saison et le bilan de chaque sprint clôturé (actions engagées, résultat, taux de réalisation, reports). | V2 | Proposé |
| FONC-036 | Annuler un sprint en `Préparation` ou `En cours` (motif obligatoire) ; ses actions retournent au backlog. | V2 | Proposé |

- **RG-020** Un seul sprint `En cours` par chantier-saison ; un seul sprint par chantier-saison et par mois.
- **RG-021** Les dates d'un sprint sont comprises dans celles de la saison.
- **RG-022** Une action est engagée dans au plus un sprint non clôturé (`Actions.Sprint`).
- **RG-023** « Reporter » exige qu'un sprint suivant existe ou soit créé à la volée (le widget propose de créer le sprint du mois suivant en `Préparation`).
- **RG-024** Un sprint `Clôturé` est figé : ses engagements ne sont plus modifiables dans le widget.
- **RG-025** Le bilan d'un sprint conserve, pour chaque action engagée, son statut à la clôture même si l'action évolue ensuite.

## 9. Gestion du backlog

| ID | Exigence | Version | Statut |
|---|---|---|---|
| FONC-040 | Créer une action : titre (obligatoire), description, chantier-saison (obligatoire), objectif ou sous-objectif (facultatif), responsable, équipe, priorité, statut, date de début, échéance, observations. | V2 | Proposé |
| FONC-041 | Modifier une action depuis un panneau latéral ou une modale. | V2 | Proposé |
| FONC-042 | Statuts d'action : `À faire`, `En cours`, `Bloquée`, `Terminée`, `Abandonnée`. | V2 | Proposé |
| FONC-043 | Priorités : `Haute`, `Moyenne`, `Basse` (défaut `Moyenne`). | V2 | Proposé |
| FONC-044 | Garantir la cohérence des rattachements : l'objectif principal appartient au chantier porteur de l'action ; le sprint appartient au chantier porteur ; chantiers et objectifs associés appartiennent à la même saison. | V2 | Proposé |
| FONC-054 | Rattacher une action à **plusieurs chantiers** : un chantier **porteur** (backlog, sprint, pilotage) et des **chantiers associés**, avec des **objectifs associés** ; l'action compte dans l'avancement de chacun de ses objectifs ; elle apparaît dans le backlog des chantiers associés avec la mention « Contribue — porté par CHx » (Q-011, modèle à valider Q-012). | V2 | Proposé |
| FONC-045 | Affecter un responsable (personne) et une équipe ; proposer par défaut l'équipe principale du responsable. | V2 | Proposé |
| FONC-046 | Passer une action en `Bloquée` exige un motif de blocage ; quitter `Bloquée` conserve le dernier motif dans le journal. | V2 | Proposé |
| FONC-047 | Déclarer des dépendances (« dépend de ») entre actions ; afficher un avertissement si une action dépendante est démarrée alors qu'une prédécesseure n'est pas terminée. | V3 | Proposé |
| FONC-048 | Saisir des observations (texte libre, champ unique horodaté par Grist). | V2 | Proposé |
| FONC-049 | Réaffecter une action (responsable, équipe, chantier-saison) ; un changement de chantier-saison efface l'objectif et le sprint après confirmation ; consigné au journal. | V2 | Proposé |
| FONC-050 | Archiver une action (suppression logique) ; restaurer une action archivée ; supprimer définitivement une action jamais engagée dans un sprint, avec confirmation. | V2 | Proposé |
| FONC-051 | Kanban : colonnes = statuts ; déplacer une carte par glisser-déposer **et** par commande clavier/menu « Déplacer vers… ». | V2 | Proposé |
| FONC-052 | Filtrer le backlog : chantier, objectif, sprint, responsable, équipe, priorité, statut, « en retard », « bloquées », texte libre. | V2 | Proposé |
| FONC-053 | Afficher le backlog en liste (tableau triable) ou en Kanban. | V2 | Proposé |

- **RG-030** Une action `Terminée` reçoit automatiquement une date de réalisation (date du jour, modifiable).
- **RG-031** Une action `Terminée` ou `Abandonnée` n'est jamais « en retard ».
- **RG-032** Une action archivée n'apparaît ni dans le Kanban ni dans les calculs ; elle reste visible via le filtre « Afficher les archives ».
- **RG-033** Passer une action à `Terminée` alors qu'elle a des dépendances non terminées est autorisé, avec avertissement (V3).

### 9.1 Fonctionnalités étudiées et non retenues pour le MVP

| Fonctionnalité | Analyse | Proposition |
|---|---|---|
| Fil de commentaires multiples | Utile en animation, mais nécessite une table et une UI dédiées | Ultérieur ; un champ « Observations » suffit en MVP |
| Pièces jointes | Grist les gère nativement | Hors widget ; consultation dans Grist |
| Estimation (points, charge) | Non demandée, risque de surcharge | Non retenu |
| Étiquettes libres | Redondant avec chantier/objectif/équipe | Non retenu |
| Récurrence d'actions | Non demandée | Non retenu |
| Modèles d'actions | Peu utile au démarrage | Ultérieur |

## 10. Gouvernance et reporting

| ID | Exigence | Version | Statut |
|---|---|---|---|
| FONC-060 | Cockpit : avancement de chaque chantier de la saison (`IND-003`), statut de validation des objectifs, sprint du mois. | V3 | Proposé |
| FONC-061 | Cockpit : alertes calculées (`IND-007`) : actions en retard, actions bloquées, objectifs non validés après la date de lancement, chantiers sans sprint préparé pour le mois courant, points de gouvernance ouverts nécessitant un arbitrage. | V3 | Proposé |
| FONC-062 | Cockpit : échéances et jalons des 30 prochains jours (paramètre `Config.HorizonEcheancesJours`). | V3 | Proposé |
| FONC-063 | Gérer les points de gouvernance : type (`Risque`, `Blocage`, `Arbitrage`, `Décision`), intitulé, description, chantier-saison, objectif et action liés (facultatifs), criticité, statut, porteur, date d'échéance. | V3 | Proposé |
| FONC-064 | Enregistrer une décision : date, instance (ex. « Comité de suivi »), texte de la décision ; une décision peut clore un arbitrage. Historique des décisions filtrable. | V3 | Proposé |
| FONC-065 | Vue « Revue de chantier » : synthèse d'un chantier-saison pour une réunion (objectifs et avancement, sprint en cours, retards, blocages, points ouverts), optimisée pour la projection et l'impression. | V3 | Proposé |
| FONC-066 | Synthèse mensuelle consolidée (tous chantiers) d'un mois donné : sprints, taux de réalisation, reports, alertes, décisions du mois ; imprimable. | V3 | Proposé |
| FONC-067 | Gérer les jalons : intitulé, date, type (`Lancement`, `Comité`, `Livraison`, `Revue`, `Autre`), saison, chantier-saison et objectif facultatifs, atteint oui/non. | V3 | Proposé |
| FONC-068 | Vue Gantt / Calendrier : objectifs, sous-objectifs, actions (avec dates) et jalons sur une frise temporelle ; vue calendrier mensuelle des échéances. | V3 | Proposé |
| FONC-069 | Export CSV des listes affichées (backlog filtré, points de gouvernance). | V3 | Proposé |

- **RG-040** Un point de type `Arbitrage` est « ouvert » tant qu'aucune décision liée ne l'a clos.
- **RG-041** Un point `Blocage` peut être lié à une action ; il est indépendant du statut `Bloquée` de l'action (qui reste la source du Kanban). Le widget propose de créer un point de blocage quand une action passe en `Bloquée` depuis plus de `Config.SeuilBlocageJours` jours (V3).
- **RG-042** Les indicateurs sont des **colonnes formules Grist** (source unique, visibles dans Grist par l'amiral) ; le widget les lit sans les recalculer, sauf ceux qui dépendent de la date du jour (retard, alertes, temps écoulé) qu'il recalcule aussi à l'affichage (DEC-011). Seul le relevé mensuel recopie volontairement des valeurs, pour l'historique (FONC-085).

| ID | Exigence | Version | Statut |
|---|---|---|---|
| FONC-085 | **Relevé mensuel** : le responsable de pilotage fige l'avancement du mois (une ligne par chantier-saison + une ligne « Programme » dans `ReleveMensuel`, avec un commentaire clé) ; l'évolution mois par mois est consultable (tableau et graphique). | V2 | Proposé |
| FONC-086 | **Page Grist native « Synthèse SIGNAL »** (sans widget) : avancement de la saison et de chaque chantier, objectifs validés, actions en retard/bloquées, évolution des relevés mensuels (graphique natif Grist). Créée par une procédure documentée (ou par l'assistant si l'API le permet, VAL-18). | V2 | Proposé |

## 11. Description détaillée des interfaces

### 11.0 Structure générale

> Dans toute cette section, les termes « onglets DSFR », « modale DSFR », « alerte DSFR », « tableau DSFR », « badge », « tag », « accordéon », « tuile » désignent les **composants propres au projet**, dessinés avec les couleurs et la police Marianne du DSFR et reprenant ses comportements d'accessibilité. Les composants DSFR eux-mêmes ne sont pas utilisés (DEC-008, `07`).

```
┌──────────────────────────────────────────────────────────────┐
│ Pilotage de la stratégie SIGNAL   [Saison 2026-2027 ▾]   [Moi : — ▾]  [⟳]    │  barre supérieure
├──────────────────────────────────────────────────────────────┤
│ Cockpit | Chantiers | Objectifs | Sprints | Backlog | Gantt  │  onglets du projet  
├──────────────────────────────────────────────────────────────┤
│                     contenu de la vue                        │
└──────────────────────────────────────────────────────────────┘
```

- **UX-001** Navigation principale par onglets DSFR ; l'onglet actif est mémorisé localement.
- **UX-002** Le sélecteur de saison est global et s'applique à toutes les vues.
- **UX-003** Le bouton « Actualiser » recharge les données et affiche l'heure de dernière synchronisation.
- **UX-004** Les formulaires de création/modification s'ouvrent dans une **modale DSFR** (largeur réduite) ou un panneau latéral (largeur ≥ 992 px).
- **UX-005** Toute action destructrice ou irréversible (archivage, suppression, clôture, changement de statut de saison) demande une confirmation explicite décrivant la conséquence.
- **UX-006** Tout message (succès, erreur, information) utilise les composants Alerte DSFR ; les succès disparaissent après 5 s, les erreurs restent jusqu'à fermeture.
- **UX-007** Chaque vue propose un **état vide** expliquant quoi faire et offrant le bouton d'action principal.
- **UX-008** En lecture seule (droits insuffisants ou saison clôturée), les boutons de modification sont masqués et un bandeau l'indique.
- **UX-009** Les libellés, statuts et priorités ont toujours un texte ; la couleur n'est jamais le seul porteur d'information.
- **UX-010** L'interface reste utilisable à partir de **360 px** de largeur de section (affichage dégradé : onglets en liste déroulante, Kanban en colonnes empilées, Gantt remplacé par une liste chronologique).
- **UX-011** Le temps de réponse perçu après une action utilisateur est inférieur à 1 s (indicateur de chargement au-delà de 300 ms), conformément à la loi de Doherty.
- **UX-012** Pas plus de 7 filtres visibles simultanément ; filtres secondaires repliés (loi de Hick, loi de Miller).
- **UX-013** Les actions principales sont placées de façon constante (en haut à droite de chaque vue) (loi de Jakob, cohérence).

### 11.1 Vue Cockpit (V3)

| Rubrique | Contenu |
|---|---|
| Objectif | Vision consolidée de la saison pour décider et prioriser |
| Utilisateurs | Autorité, responsable de pilotage, pilotes, lecteurs |
| Données | Saison (statut, dates, % temps écoulé `IND-008`) ; par chantier : pilote, avancement `IND-003`, objectifs validés / total, sprint du mois (statut, taux `IND-005`), nb actions en retard, nb bloquées ; alertes `IND-007` ; échéances et jalons à 30 jours ; points de gouvernance ouverts |
| Filtres | Saison (global), chantier (multi), « mes chantiers » |
| Actions | Ouvrir un chantier, ouvrir une alerte (navigue vers l'élément filtré), ouvrir la revue de chantier, ouvrir la synthèse mensuelle |
| Interactions | Tuiles de chantier cliquables ; liste d'alertes triée par gravité puis échéance |
| Navigation | Clic sur une tuile → Vue Chantiers (fiche) ; clic sur une alerte → vue concernée avec filtre appliqué |
| État vide | « Aucune saison. Créez la première saison pour commencer. » + bouton « Créer une saison » (si droits) ; saison sans chantier : « Ajoutez les chantiers de la saison. » |
| Erreurs | Données non chargées : alerte d'erreur + bouton « Réessayer » |
| Confirmations | Aucune (vue de lecture) |
| Contraintes Grist | Doit tenir sans défilement horizontal à 992 px ; tuiles en grille 1, 2 ou 3 colonnes selon la largeur |

### 11.2 Vue Chantiers (V1)

| Rubrique | Contenu |
|---|---|
| Objectif | Consulter et administrer les chantiers de la saison |
| Utilisateurs | Tous ; administration par le responsable de pilotage |
| Données | Liste : ordre, code, intitulé, pilote, équipes, nb objectifs (validés/total), avancement (V2). Fiche : description, pilote, équipes, objectifs, sprint en cours (V2), historique des sprints (V2), points ouverts (V3) |
| Filtres | Actif/inactif ; recherche texte |
| Actions | Ajouter un chantier à la saison (depuis le référentiel ou en créant un nouveau chantier), modifier le chantier-saison (pilote, équipes, intitulé), retirer un chantier de la saison (si aucun objectif ni action), gérer le référentiel (onglet secondaire « Référentiel ») |
| Interactions | Sélection d'un chantier dans la liste → fiche à droite (≥ 992 px) ou en page (< 992 px) ; fil d'Ariane « Chantiers › CH3 » |
| Navigation | Depuis la fiche : liens vers Objectifs, Sprints, Backlog filtrés sur ce chantier |
| État vide | « Aucun chantier pour cette saison. » + boutons « Reprendre les chantiers de la saison précédente » et « Ajouter un chantier » |
| Erreurs | Doublon de chantier dans la saison (`RG-005`) : message sous le champ |
| Confirmations | Retrait d'un chantier de la saison ; désactivation d'un chantier du référentiel |
| Contraintes Grist | Liste + fiche côte à côte uniquement ≥ 992 px |

### 11.3 Vue Objectifs (V1)

| Rubrique | Contenu |
|---|---|
| Objectif | Construire, valider et suivre la hiérarchie objectifs / sous-objectifs |
| Utilisateurs | Pilotes (rédaction), responsable de pilotage (validation), autorité (consultation) |
| Données | Arborescence par chantier : objectif (ordre, intitulé, statut de validation, responsable, échéance, avancement V2, nb sous-objectifs), sous-objectifs (idem, nb actions V2) ; indicateur de cible 3×3 |
| Filtres | Chantier, statut de validation, responsable, « archivés » |
| Actions | Créer un objectif, créer un sous-objectif, modifier, changer le statut de validation (Soumettre, Valider, Renvoyer, Abandonner), archiver, réordonner (boutons monter/descendre) |
| Interactions | Accordéons DSFR par chantier et par objectif ; badge de statut ; actions groupées « Valider les objectifs soumis du chantier » (confirmation listant les objectifs) |
| Navigation | Clic sur un sous-objectif → Backlog filtré sur ce sous-objectif (V2) |
| État vide | Chantier sans objectif : « Aucun objectif. Le pilote définit 3 objectifs annuels. » + « Créer un objectif » |
| Erreurs | Modification d'un champ verrouillé (`FONC-025`) : champ désactivé avec infobulle « Objectif validé : renvoyez-le pour modification » |
| Confirmations | Validation, renvoi (motif obligatoire), abandon (motif obligatoire), archivage |
| Contraintes Grist | Arborescence lisible à 360 px (indentation limitée à 16 px par niveau) |

### 11.4 Vue Sprints (V2)

| Rubrique | Contenu |
|---|---|
| Objectif | Préparer, exécuter et clôturer les sprints mensuels |
| Utilisateurs | Pilotes, responsable de pilotage |
| Données | Sélecteur mois ; pour chaque chantier : sprint (statut, dates, objectif du sprint, nb actions, taux) ; détail : actions engagées (titre, responsable, statut, échéance, retard, blocage) |
| Filtres | Mois, chantier, statut de sprint |
| Actions | Créer le sprint du mois, ajouter/retirer des actions (préparation), démarrer, clôturer (assistant), annuler, consulter le bilan |
| Interactions | **Assistant de clôture** en 3 étapes (Indicateur d'étapes DSFR) : 1) revue des actions non terminées avec choix par action (Reporter / Backlog / Abandonner, défaut Reporter), 2) bilan textuel, 3) récapitulatif et confirmation |
| Navigation | Lien vers l'action (panneau d'édition) ; lien vers le Kanban filtré sur le sprint |
| État vide | « Aucun sprint pour ce mois. » + « Préparer le sprint de [mois] » |
| Erreurs | Sprint déjà existant pour ce mois (`RG-020`) ; échec d'écriture de la clôture : aucune modification appliquée (atomicité), message et bouton « Réessayer » |
| Confirmations | Démarrage, clôture (récapitulatif), annulation (motif) |
| Contraintes Grist | Assistant utilisable en modale plein écran de section |

### 11.5 Vue Backlog / Kanban (V2)

| Rubrique | Contenu |
|---|---|
| Objectif | Gérer les actions au quotidien |
| Utilisateurs | Tous les profils contributeurs |
| Données | Carte : titre, chantier (code), sous-objectif (abrégé), responsable, priorité (badge), échéance (badge « En retard » si `IND-006`), icône et texte « Bloquée » ; liste : mêmes champs + sprint |
| Filtres | `FONC-052` ; filtres actifs affichés en tags DSFR supprimables ; bouton « Réinitialiser » |
| Actions | Créer une action, modifier, déplacer (statut), archiver, restaurer, basculer Liste / Kanban (contrôle segmenté DSFR) |
| Interactions | Glisser-déposer entre colonnes ; menu « Déplacer vers… » sur chaque carte (clavier) ; déposer en `Bloquée` ouvre la saisie du motif ; déposer en `Terminée` renseigne la date de réalisation |
| Navigation | Clic sur une carte → panneau d'édition ; lien vers objectif |
| État vide | « Aucune action ne correspond aux filtres. » + « Réinitialiser les filtres » ; backlog vide : « Créez la première action du chantier. » |
| Erreurs | Écriture refusée (droits) : la carte revient à sa colonne d'origine et un message s'affiche |
| Confirmations | Archivage, suppression définitive, abandon |
| Contraintes Grist | 5 colonnes : défilement horizontal **dans** la zone Kanban uniquement ; < 768 px : colonnes empilées repliables |

### 11.6 Vue Gantt / Calendrier (V3)

| Rubrique | Contenu |
|---|---|
| Objectif | Visualiser échéances, jalons et périodes de réalisation |
| Utilisateurs | Responsable de pilotage, pilotes, autorité |
| Données | Lignes groupées chantier → objectif → sous-objectif → actions datées ; barres (début → échéance, ou début → date de réalisation) ; losanges pour jalons ; ligne « aujourd'hui » ; sprints en bandes de fond |
| Filtres | Chantier, niveau de détail (objectifs / sous-objectifs / actions), période (saison, trimestre, mois), responsable |
| Actions | Zoom (mois / trimestre / saison), ouvrir un élément, basculer Gantt / Calendrier, imprimer |
| Interactions | Survol / focus d'une barre : infobulle (intitulé, dates, statut) ; pas de modification de dates par glisser en V3 (évolution ultérieure) |
| Navigation | Clic → panneau d'édition de l'élément |
| État vide | « Aucun élément daté sur la période. Renseignez des échéances pour les voir ici. » |
| Erreurs | Éléments sans date : compteur « 12 éléments sans date » avec lien vers la liste |
| Confirmations | Aucune |
| Contraintes Grist | < 768 px : liste chronologique groupée par mois à la place du Gantt ; équivalent textuel (tableau) accessible pour lecteurs d'écran |

### 11.7 Vues secondaires

| Vue | Version | Contenu |
|---|---|---|
| Revue de chantier | V3 | `FONC-065` ; mise en page imprimable (`@media print`) |
| Synthèse mensuelle | V3 | `FONC-066` |
| Gouvernance | V3 | Liste des points (`FONC-063`, `FONC-064`), filtres type/statut/chantier/criticité |
| Référentiels | V1 | Personnes, équipes, chantiers (`FONC-070`, `FONC-071`, `FONC-010`) |
| Initialisation | V1 | Assistant de schéma (`FONC-080`), données de démonstration (`FONC-081`) |

### 11.8 Exigences transverses

| ID | Exigence | Version | Statut |
|---|---|---|---|
| FONC-070 | Gérer les personnes (saisie manuelle par le responsable de pilotage) : nom affiché, fonction, courriel (obligatoire pour une personne ayant un compte Grist, identique à l'adresse du compte), **rôle**, équipe principale, actif/inactif. Une personne référencée n'est pas supprimable, seulement désactivable. | V1 | Validé (12/11/2026) |
| FONC-071 | Gérer les équipes : nom, description, active/inactive. | V1 | Proposé |
| FONC-072 | Filtrer « Mes éléments » dans toutes les vues, pour la personne identifiée (FONC-087) ou, à défaut, choisie comme « Moi » (mémorisé sur le poste). | V2 | Proposé |
| FONC-087 | **Identifier l'utilisateur connecté** et son rôle sans aucune écriture, grâce à la table `Profils` filtrée par règle d'accès (DEC-016) ; afficher « Connecté : Nom (Rôle) » ; masquer les actions non autorisées pour ce rôle ; utilisateur non référencé → consultation seule et message « Demandez au responsable de pilotage de vous ajouter ». | V1 | Proposé |
| FONC-080 | À l'ouverture, vérifier le schéma du document ; si des tables ou colonnes manquent, afficher la liste et proposer, **sur clic explicite d'un utilisateur ayant les droits**, de les créer. Aucune écriture automatique au chargement. | V1 | Proposé |
| FONC-081 | Proposer le chargement d'un jeu de données de démonstration **fictif** uniquement si le document ne contient aucune saison. | V1 | Proposé |
| FONC-082 | Répercuter dans le widget les modifications faites directement dans Grist sans rechargement de la page (synchronisation automatique) ; à défaut, bouton « Actualiser ». | V1 | Proposé |
| FONC-083 | Détecter l'absence d'accès complet et afficher la procédure pour l'accorder ; détecter le refus d'écriture et passer en lecture seule. | V1 | Proposé |
| FONC-084 | Recherche globale (actions, objectifs, points) depuis la barre supérieure. | Ultérieur | Proposé |
| FONC-090 | Modèle de données permettant de relier sujets de communication et actions éditoriales aux chantiers, objectifs et actions (tables créées vides, aucune interface). | V4 | Proposé |
| FONC-091 | Documenter le contrat de données (tables, colonnes, règles) utilisable par le futur widget éditorial. | V4 | Proposé |

## 12. Parcours utilisateurs

Chaque parcours est testé de bout en bout (`TEST-E2E-xx`, voir `04`).

### P1 — Initialiser le document (V1)

1. La responsable de pilotage ajoute le widget dans une page Grist, accorde l'accès complet.
2. Le widget détecte un document vide : écran « Initialisation » listant les 16 tables à créer.
3. Elle clique « Créer la structure » → confirmation → création en une opération.
4. Le widget propose « Charger des données de démonstration » ou « Commencer avec un document vide ».
5. Résultat : la vue Chantiers s'affiche.

### P2 — Préparer une saison et ses chantiers (V1)

1. Sélecteur de saison → « Nouvelle saison » → libellé « Saison 2027-2028 », dates 01/09/2027 – 31/08/2028.
2. Le widget propose de reprendre les chantiers de « Saison 2026-2027 » → confirmation → 7 chantiers-saison créés avec leurs pilotes.
3. Elle modifie le pilote de CH5 (« Dominique Test » → « Alex Fictif »).

### P3 — Créer un objectif et ses sous-objectifs (V1)

1. Vue Objectifs → chantier CH3 → « Créer un objectif ».
2. Saisie : intitulé « Ouvrir un catalogue de données fictif », résultat attendu, échéance 30/06/2027 → Enregistrer.
3. « Ajouter un sous-objectif » ×3.
4. Le compteur affiche « 1/3 objectifs » (alerte d'information non bloquante).
5. « Soumettre » → statut `Soumis`.

### P4 — Valider les objectifs en réunion de lancement (V1)

1. Saison au statut `Lancement`. Vue Objectifs, filtre « Soumis ».
2. Pour CH3 : « Valider les objectifs soumis » → confirmation listant 3 objectifs → statuts `Validé`, date de validation enregistrée, entrées au journal.
3. Un objectif de CH6 est « Renvoyé » avec le motif « Préciser le résultat attendu ».

### P5 — Préparer un sprint (V2)

1. Vue Sprints, mois « Mars 2027 », CH3 → « Préparer le sprint ».
2. Objectif du sprint : « Publier le premier jeu de données fictif ».
3. « Ajouter des actions » : sélection de 5 actions du backlog (cases à cocher) → Enregistrer.
4. Le 1er mars : « Démarrer » → confirmation → statut `En cours`.

### P6 — Déplacer une action dans le Kanban (V2)

1. Vue Backlog, mode Kanban, filtre Sprint = « CH3 — Mars 2027 ».
2. Glisser la carte « Rédiger la fiche de données fictive » de `À faire` à `En cours` → enregistrement, confirmation discrète.
3. Au clavier : focus sur la carte → menu « Déplacer vers… » → `Bloquée` → modale « Motif du blocage » → Enregistrer.
4. Une modification de la même action faite dans la table Grist par un collègue apparaît dans le Kanban sans recharger la page.

### P7 — Clôturer un sprint et consulter le bilan (V2)

1. Le 31 mars : vue Sprints → sprint CH3 → « Clôturer ».
2. Étape 1 : 2 actions non terminées ; l'une « Reporter », l'autre « Remettre au backlog ».
3. Le widget propose de créer le sprint « CH3 — Avril 2027 » (inexistant) → accepté.
4. Étape 2 : bilan textuel. Étape 3 : récapitulatif (5 engagées, 3 terminées, 1 reportée, 1 au backlog, taux 60 %) → « Clôturer ».
5. Le sprint passe `Clôturé` ; le bilan est consultable dans l'historique.

### P8 — Préparer une revue de chantier (V3)

1. Cockpit → tuile CH3 → « Revue de chantier ».
2. La vue présente avancement, sprint, retards, blocages, points ouverts.
3. Pendant la réunion, une décision est saisie (« Arbitrage : prioriser le jeu A ») ; l'arbitrage lié est clos.
4. Impression ou projection.

### P9 — Consulter une saison passée (V1)

1. Sélecteur de saison → « Saison 2025-2026 (Clôturée) ».
2. Toutes les vues sont en lecture seule avec bandeau ; le bilan des sprints est consultable.

## 13. Règles métier (récapitulatif)

| ID | Règle | Contrôle |
|---|---|---|
| RG-001 | Les droits sont ceux de Grist | Lecture seule si écriture refusée |
| RG-002 | Une seule saison `Active` | Bloquant à l'activation |
| RG-003 | Clôture de saison seulement si sprints clôturés/annulés | Bloquant |
| RG-004 | Date de fin ≥ date de début | Bloquant (formulaire) |
| RG-005 | Un chantier une fois par saison | Bloquant |
| RG-006 | Un pilote par chantier-saison (vide toléré en préparation) | Alerte |
| RG-010 | Sous-objectif ⇒ parent objectif | Bloquant |
| RG-011 | Deux niveaux maximum | Bloquant |
| RG-012 | Date de validation enregistrée | Automatique |
| RG-013 | Auteur enregistré par Grist | Automatique (Grist) |
| RG-020 | Un sprint par chantier-saison et par mois ; un seul `En cours` | Bloquant |
| RG-021 | Sprint inclus dans la saison | Bloquant |
| RG-022 | Une action dans au plus un sprint non clôturé | Bloquant |
| RG-023 | Report ⇒ sprint suivant existant ou créé | Assistant |
| RG-024 | Sprint clôturé figé | Bloquant (widget) |
| RG-025 | Bilan conservé à la clôture | Automatique (engagements) |
| RG-030 | Date de réalisation à la terminaison | Automatique, modifiable |
| RG-031 | Terminée/Abandonnée jamais en retard | Calcul |
| RG-032 | Archivé exclu des calculs | Calcul |
| RG-033 | Dépendances non bloquantes | Avertissement |
| RG-040 | Arbitrage ouvert tant que non décidé | Calcul |
| RG-041 | Blocage d'action ≠ point de blocage | Proposition de création |
| RG-007 | Pas de restriction par chantier | Architecture |
| RG-042 | Indicateurs calculés par formules Grist, recopiés seulement dans le relevé mensuel | Architecture |
| RG-043 | Une action compte dans l'avancement de son objectif principal et de ses objectifs associés | Calcul (formule Grist) |
| RG-050 | Toute écriture multi-enregistrements est atomique | Architecture |
| RG-051 | Une saison `Clôturée` est en lecture seule dans le widget | Bloquant (widget) |

## 14. Indicateurs et formules de calcul proposées

> Principe **validé** le 12/11/2026 (Q-006, DEC-018) : avancement calculé, avec option déclarée mise en évidence. Les indicateurs IND-001 à IND-005, IND-009 et IND-010 sont des **colonnes formules Grist** (`02` §4.3) testées avec des cas chiffrés dans un Grist local (`04`). IND-006, IND-007, IND-008 et IND-011 dépendent de la date du jour : ils existent en formule Grist (valeur indicative) **et** sont recalculés par le widget (`src/domain/indicateurs.ts`). Notation : « actions comptées » = actions non archivées et non `Abandonnée`, dont l'objectif principal **ou un objectif associé** est l'objectif considéré (RG-043).

| ID | Indicateur | Formule proposée | Cas particuliers |
|---|---|---|---|
| IND-001 | Avancement d'un sous-objectif | `nb actions comptées Terminée / nb actions comptées` (en %, arrondi à l'entier) | 0 action comptée → « Non mesurable » (pas 0 %). **Option** (`Q-006`) : avancement déclaré par le pilote (`Objectifs.AvancementDeclare`, 0–100) prioritaire s'il est renseigné, avec affichage « déclaré » |
| IND-002 | Avancement d'un objectif | Moyenne simple des avancements mesurables de ses sous-objectifs ; s'il n'a pas de sous-objectif, IND-001 appliqué à ses actions directes | Sous-objectifs `Abandonné` ou archivés exclus ; aucun mesurable → « Non mesurable » |
| IND-003 | Avancement d'un chantier-saison | Moyenne simple des avancements mesurables de ses objectifs | Idem |
| IND-004 | Avancement de la saison | Moyenne simple des avancements des chantiers-saison | Idem |
| IND-005 | Taux de réalisation d'un sprint | `nb engagements Terminée / nb engagements` (à la clôture) ; en cours : `actions du sprint Terminée / actions du sprint` | Sprint vide → « Non mesurable » |
| IND-006 | Action en retard | `Echeance < aujourd'hui` ET statut ∉ {`Terminée`, `Abandonnée`} ET non archivée | Sans échéance → jamais en retard |
| IND-007 | Alertes du cockpit | Liste : actions en retard (gravité selon priorité), actions bloquées depuis > `SeuilBlocageJours` (défaut 7), objectifs non `Validé` alors que la saison est `Active`, chantiers sans sprint du mois courant au-delà du `JourLimitePreparationSprint` (défaut 5), arbitrages ouverts échus, jalons non atteints échus | Gravité : Haute / Moyenne / Info |
| IND-008 | Temps écoulé de la saison | `(aujourd'hui − début) / (fin − début)` borné à [0 ; 100 %] | Permet de comparer avancement et temps |
| IND-009 | Taux de report d'un sprint | `nb engagements Reportée / nb engagements` | — |
| IND-010 | Nombre d'actions bloquées par chantier | Comptage statut `Bloquée` non archivées | — |
| IND-011 | Écart avancement / temps | `IND-003 − IND-008` ; négatif = en retard sur le calendrier | Affichage informatif uniquement |

Aucun indicateur composite (score, météo) n'est proposé : leur pondération serait arbitraire.

## 15. Gestion des erreurs et cas particuliers

| ID | Situation | Comportement attendu |
|---|---|---|
| ERR-01 | Widget ouvert sans accès complet | Écran explicatif avec procédure (« Widget options › Access level › Full document access ») |
| ERR-02 | Tables/colonnes manquantes | Écran d'initialisation (`FONC-080`) ; utilisateur sans droit de structure : message « Demandez au propriétaire du document » |
| ERR-03 | Colonne de type inattendu | Message listant la colonne, le type attendu et le type trouvé ; le widget reste en lecture seule |
| ERR-04 | Écriture refusée (droits, règles d'accès) | Message « Modification refusée par Grist » + détail technique repliable ; état réaffiché depuis Grist |
| ERR-05 | Écriture échouée (réseau, conflit) | Message + « Réessayer » ; aucune modification partielle (atomicité) |
| ERR-06 | Donnée modifiée par un autre utilisateur pendant l'édition | À l'enregistrement, si `MajLe` a changé depuis l'ouverture, avertissement « Cet élément a été modifié par [MajPar] » avec choix « Écraser » / « Annuler et recharger » |
| ERR-07 | Référence orpheline (personne supprimée dans Grist) | Afficher « Personne introuvable (#id) » ; ne pas planter |
| ERR-08 | Cellule censurée par une règle d'accès | Afficher « Non accessible » |
| ERR-09 | Erreur de formule Grist dans une cellule | Afficher « Erreur de calcul » ; journal console sans donnée |
| ERR-10 | Données incohérentes (objectif d'un autre chantier) | Badge « Incohérence » sur l'élément et liste dans l'écran Initialisation › Contrôle de cohérence |
| ERR-11 | Aucune saison | État vide du cockpit (`11.1`) |
| ERR-12 | Plusieurs saisons `Active` (modifiées dans Grist) | Alerte ; la plus récente est utilisée ; proposition de corriger |
| ERR-13 | `localStorage` indisponible | Fonctionnement normal sans mémorisation des préférences |
| ERR-14 | Volume important (> 5 000 actions) | Message d'information sur les performances ; pagination des listes |

## 16. Exigences UX/UI

Les exigences `UX-001` à `UX-013` (§11) s'appliquent. Compléments :

| ID | Exigence | Version |
|---|---|---|
| UX-020 | Respect de `07-DESIGN-SYSTEM-DSFR.md` : couleurs (tokens) et police Marianne du DSFR, composants propres au projet (pas de composants DSFR) | V1 |
| UX-021 | Conformité visée RGAA 4.1 niveau AA pour les composants du widget | V1 |
| UX-022 | Navigation complète au clavier (ordre logique, focus visible, piège de focus dans les modales) | V1 |
| UX-023 | Mode clair et mode sombre selon le système (`data-fr-scheme="system"`), choix manuel dans la barre supérieure | V1 |
| UX-024 | Formats français : dates `JJ/MM/AAAA`, mois « mars 2027 », pourcentages « 60 % » | V1 |
| UX-025 | Libellés sans jargon technique Grist (« table », « row id » interdits dans l'UI courante) | V1 |
| UX-026 | Impression lisible des vues Revue et Synthèse (A4 paysage) | V3 |

## 17. Exigences de sécurité fonctionnelle

| ID | Exigence | Version |
|---|---|---|
| SECF-001 | Le widget ne contourne jamais les droits Grist ; il n'implémente aucun contrôle d'accès propre présenté comme une sécurité | V1 |
| SECF-002 | Aucune donnée n'est envoyée hors du document Grist (pas d'API tierce, pas de télémétrie, pas de police ou script externe autre que l'API Grist) | V1 |
| SECF-003 | Aucune écriture n'est effectuée sans action explicite de l'utilisateur | V1 |
| SECF-004 | Les contenus saisis sont affichés comme du texte (jamais interprétés comme HTML) | V1 |
| SECF-005 | Les journaux techniques (console) ne contiennent pas de contenu métier, seulement des identifiants techniques et codes d'erreur | V1 |
| SECF-006 | Les données de démonstration et de test sont fictives et identifiées comme telles (préfixe « [DÉMO] » dans le libellé de saison) | V1 |
| SECF-007 | Les suppressions définitives sont limitées aux éléments sans dépendance et toujours confirmées | V1 |
| SECF-008 | Le niveau de sensibilité des données SIGNAL est arbitré avant tout usage réel (`Q-001`) | Avant usage réel |

## 18. Fonctionnalités futures

| Fonctionnalité | Version envisagée |
|---|---|
| Règles d'accès Grist par chantier (pilote = éditeur de son chantier) | V3 (documentation) |
| Demande de modification d'objectif validé avec circuit | V3 |
| Dépendances visualisées dans le Gantt | V3 |
| Modèle éditorial (sujets de communication, actions éditoriales) | V4 |
| Second widget « SIGNAL Éditorial » | Après V4 |
| Commentaires multiples par action | Ultérieur |
| Modification des dates par glisser dans le Gantt | Ultérieur |
| Comparaison de saisons | Ultérieur |
| Recherche globale (`FONC-084`) | Ultérieur |

## 19. Critères d'acceptation testables

Format : *Étant donné / Quand / Alors*. Chaque critère est vérifié par au moins un test (`04`).

| ID | Exigence | Critère |
|---|---|---|
| CA-001 | FONC-001 | Étant donné un document initialisé, quand je crée la saison « Saison 2027-2028 » du 01/09/2027 au 31/08/2028, alors une ligne `Saisons` existe avec ces valeurs et le statut `Préparation`. |
| CA-002 | FONC-002, RG-002 | Étant donné une saison `Active`, quand j'active une autre saison, alors l'action est refusée avec le message « Une saison est déjà active ». |
| CA-003 | FONC-003, RG-051 | Quand je sélectionne une saison `Clôturée`, alors aucun bouton de modification n'est affiché et un bandeau « Saison clôturée — consultation seule » est visible. |
| CA-004 | FONC-004 | Étant donné la saison modèle avec 7 chantiers-saison, quand je prépare la saison suivante en reprenant les chantiers, alors 7 chantiers-saison sont créés avec les mêmes pilotes et aucun objectif n'est copié ; quand je reconduis un objectif validé, une copie `Brouillon` liée à l'original (`ObjectifOrigine`) est créée avec ses sous-objectifs, et l'original reste inchangé. |
| CA-010 | FONC-010 | Quand je tente de supprimer un chantier référencé par un chantier-saison, alors seule la désactivation est proposée. |
| CA-011 | FONC-011, RG-005 | Quand j'ajoute deux fois CH3 à la même saison, alors la seconde tentative est refusée. |
| CA-012 | FONC-012 | La fiche d'un chantier-saison affiche pilote, équipes et la liste de ses objectifs. |
| CA-020 | FONC-020, FONC-021 | Quand je crée un objectif puis trois sous-objectifs, alors l'arborescence affiche 1 objectif contenant 3 sous-objectifs dans l'ordre saisi. |
| CA-021 | FONC-022 | Un chantier-saison avec 2 objectifs affiche l'information « 2/3 objectifs » sans bloquer l'enregistrement. |
| CA-022 | FONC-023 | Une échéance de sous-objectif hors saison est refusée avec un message sous le champ. |
| CA-023 | FONC-024 | Les transitions non listées en 7.2 ne sont pas proposées (ex. `Brouillon → Validé`). |
| CA-024 | FONC-025, FONC-024 | Connecté avec le rôle `Pilote`, les champs d'un objectif `Validé` sont désactivés et une modification tentée directement dans Grist est refusée par la règle d'accès ; connecté avec le rôle `Responsable pilotage`, la modification est possible, exige un motif et crée une entrée `Journal`. |
| CA-025 | FONC-026, IND-001..004 | Avec le jeu de test `JDD-CALC`, les avancements affichés égalent les valeurs attendues documentées dans `04`. |
| CA-026 | FONC-027 | Chaque changement de statut de validation crée une entrée `Journal` (entité, identifiant, champ, ancienne et nouvelle valeur). |
| CA-027 | FONC-028 | L'arborescence est navigable au clavier (accordéons ouvrables avec Entrée/Espace). |
| CA-028 | FONC-029, RG-032 | Un objectif archivé disparaît de l'arborescence par défaut et n'entre plus dans IND-003. |
| CA-030 | FONC-030, RG-020 | La création d'un second sprint pour le même chantier-saison et le même mois est refusée. |
| CA-031 | FONC-031, RG-022 | Une action engagée dans un sprint non clôturé n'est pas proposée pour un autre sprint. |
| CA-032 | FONC-032 | Le démarrage d'un sprint alors qu'un autre est `En cours` pour le même chantier-saison est refusé. |
| CA-033 | FONC-033 | Le suivi d'un sprint affiche les nombres d'actions par statut, en retard et bloquées, cohérents avec les données. |
| CA-034 | FONC-034, RG-025, RG-050 | Après clôture : le sprint est `Clôturé`, un engagement existe par action engagée avec le bon résultat, les actions reportées pointent vers le sprint suivant, les actions remises au backlog n'ont plus de sprint ; si l'écriture échoue, aucune de ces modifications n'existe. |
| CA-035 | FONC-035 | Le bilan d'un sprint clôturé reste identique après modification ultérieure du statut d'une de ses actions. |
| CA-036 | FONC-036 | L'annulation exige un motif et remet les actions au backlog. |
| CA-040 | FONC-040 | Une action sans titre ou sans chantier-saison ne peut pas être enregistrée. |
| CA-041 | FONC-041 | Une modification d'action est visible dans la table Grist `Actions` après enregistrement. |
| CA-042 | FONC-042, FONC-043 | Les listes de statuts et de priorités proposées sont exactement celles de §9. |
| CA-043 | FONC-044 | Seuls les objectifs du chantier-saison de l'action sont proposés. |
| CA-044 | FONC-045 | À la sélection d'un responsable, son équipe principale est pré-remplie. |
| CA-045 | FONC-046 | Le passage en `Bloquée` sans motif est impossible. |
| CA-046 | FONC-048 | Les observations saisies sont enregistrées et réaffichées à l'identique, y compris les caractères `<`, `>`, `&`, `"`, `'`. |
| CA-047 | FONC-049 | Le changement de chantier-saison d'une action vide son objectif et son sprint après confirmation et crée une entrée `Journal`. |
| CA-048 | FONC-050 | Une action engagée dans un sprint ne propose pas la suppression définitive, seulement l'archivage. |
| CA-049 | FONC-051 | Une carte déplacée par glisser-déposer **ou** par le menu clavier change de statut dans Grist ; en cas d'échec, elle revient à sa colonne. |
| CA-050 | FONC-052 | Les filtres combinés appliquent OU à l'intérieur d'un critère et ET entre critères. |
| CA-051 | FONC-053 | La bascule Liste/Kanban conserve les filtres. |
| CA-053 | FONC-054, RG-043 | Une action portée par CH3, associée à CH5 et à un sous-objectif de CH5, apparaît dans le backlog de CH5 avec la mention « Contribue — porté par CH3 », n'est proposée que dans les sprints de CH3, et sa terminaison augmente l'avancement des deux sous-objectifs. |
| CA-085 | FONC-085 | Après « Figer l'avancement de mars 2027 », `ReleveMensuel` contient une ligne par chantier-saison et une ligne « Programme » avec les valeurs du jour ; refaire le relevé demande confirmation et remplace les lignes. |
| CA-086 | FONC-086 | Un compte `Lecteur` ouvrant la page Grist « Synthèse SIGNAL » voit l'avancement de la saison et de chaque chantier, identique à celui du widget. |
| CA-087 | FONC-087 | Connecté avec un compte dont le courriel figure dans `Personnes`, le widget affiche « Connecté : Nom (Rôle) » sans avoir écrit dans le document ; avec un compte absent de `Personnes`, il affiche le message d'utilisateur non référencé et la consultation seule. |
| CA-052 | FONC-047 | (V3) Démarrer une action dont une prédécesseure n'est pas terminée affiche un avertissement non bloquant. |
| CA-060 | FONC-060 | Le cockpit affiche une tuile par chantier-saison avec avancement, objectifs validés/total, sprint du mois. |
| CA-061 | FONC-061, IND-007 | Avec `JDD-ALERTES`, la liste d'alertes correspond exactement à la liste attendue. |
| CA-062 | FONC-062 | Les échéances et jalons des 30 prochains jours sont listés par date croissante. |
| CA-063 | FONC-063 | Un point de gouvernance peut être créé, lié à une action, et filtré par type. |
| CA-064 | FONC-064, RG-040 | La saisie d'une décision liée à un arbitrage passe l'arbitrage à `Clos`. |
| CA-065 | FONC-065 | La revue de chantier s'imprime sur A4 paysage sans contenu tronqué. |
| CA-066 | FONC-066 | La synthèse de mars 2027 du jeu `JDD-SAISONS` affiche les taux attendus. |
| CA-067 | FONC-067 | Un jalon créé apparaît dans le Gantt et dans le cockpit s'il est dans l'horizon. |
| CA-068 | FONC-068 | Le Gantt affiche barres et jalons à la bonne position et propose un équivalent tableau. |
| CA-069 | FONC-069 | L'export CSV contient les lignes filtrées, en UTF-8 avec séparateur `;`. |
| CA-070 | FONC-070, FONC-071 | Une personne ou équipe référencée ne peut être que désactivée. |
| CA-072 | FONC-072 | Pour l'utilisateur identifié (ou après choix de « Moi »), le filtre « Mes éléments » ne montre que les éléments dont je suis responsable ou pilote. |
| CA-080 | FONC-080, SECF-003 | À l'ouverture sur un document vide, aucune table n'est créée tant que je n'ai pas cliqué et confirmé. |
| CA-081 | FONC-081, SECF-006 | Le chargement de démonstration n'est proposé que si `Saisons` est vide ; les saisons créées portent le préfixe « [DÉMO] ». |
| CA-082 | FONC-082 | Une modification d'une action faite dans la vue tableau Grist apparaît dans le widget en moins de 3 s sans action de ma part (sous réserve de `VAL-01`), ou après clic sur « Actualiser ». |
| CA-083 | FONC-083 | Avec un accès « Read selected table », l'écran explicatif s'affiche ; avec un compte Lecteur, les boutons de modification sont masqués. |
| CA-090 | FONC-090 | Les tables éditoriales existent avec les références prévues et aucun écran ne les manipule. |
| CA-091 | FONC-091 | Le document de contrat de données liste toutes les tables et colonnes exposées. |
| CA-100 | UX-010 | À 360 px de largeur de section, aucune vue ne présente de défilement horizontal de page. |
| CA-101 | UX-021, UX-022 | L'analyse axe-core de chaque vue ne relève aucune violation « serious » ou « critical » ; toutes les actions sont réalisables au clavier. |
| CA-102 | UX-023 | En thème sombre, tous les textes respectent un contraste ≥ 4,5:1. |
| CA-103 | SECF-002 | L'inspection réseau ne montre aucune requête hors de l'hôte du widget et de l'instance Grist. |
| CA-104 | SECF-004 | Une action intitulée `<img src=x onerror=alert(1)>` s'affiche comme texte et n'exécute rien. |
| CA-105 | SECF-005 | Les messages console émis pendant les tests E2E ne contiennent aucun intitulé métier du jeu de données. |
| CA-106 | ERR-06 | Une modification concurrente détectée affiche l'avertissement de conflit. |

## 20. Questions métier restant à arbitrer

Réponses reçues le 12/11/2026 ; détail et conséquences dans `06-DECISIONS-ET-ARBITRAGES.md`.

| ID | Question | Réponse / recommandation | Statut |
|---|---|---|---|
| Q-001 | Instance Grist de production et sensibilité des données | `grist.numerique.gouv.fr`, données non sensibles | Répondue |
| Q-002 | Dépôt public ou privé | Public | Répondue |
| Q-003 | Usage du DSFR et des polices Marianne | Autorisé ; couleurs et polices uniquement, pas les composants | Répondue |
| Q-004 | Granularité des sprints | Par chantier et par mois | Répondue |
| Q-005 | Statuts de validation, qui valide | Statuts acceptés ; saisie par le responsable de pilotage | Répondue |
| Q-006 | Calcul de l'avancement | Calculé, avec option déclarée mise en évidence | Répondue |
| Q-007 | Modification des objectifs validés | Seulement lors d'une nouvelle saison (reconduction) ou par le responsable de pilotage | Répondue |
| Q-008 | Restriction des droits par chantier | Non | Répondue |
| Q-009 | Jalons par chantier ou programme | Les deux (chantier facultatif) | Répondue |
| Q-010 | Nom du produit | « Pilotage de la stratégie SIGNAL » | Répondue |
| Q-011 | Actions sur plusieurs chantiers | Oui, certaines se croisent | Répondue |
| Q-012 | Modèle des actions multi-chantiers : chantier porteur + chantiers et objectifs associés ? | Recommandé : oui (FONC-054) | **Ouverte** (bloque V2) |
| Q-013 | Licence du dépôt public | MIT (sous condition de fonctionnement dans Grist) | Répondue |
| Q-014 | Quels éléments figurent dans la revue mensuelle avec l'amiral (contenu du relevé et de la page « Synthèse ») ? Le fichier Excel actuel pourra servir de référence. | Proposition FONC-085, FONC-086 | Ouverte (avant V2) |
