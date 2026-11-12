# 06 — Décisions et arbitrages

> Version : 0.2 — 12/11/2026 (intègre les réponses de la responsable du projet)
> Ce registre consigne les décisions de conception. Une décision n'est acquise que si son statut est « Validée ».
> Pour valider : indiquer dans la session Claude Code « Je valide DEC-xxx » (ou la modification souhaitée) ; Claude Code met à jour le statut et la date ici.

Statuts : `À valider`, `Validée (JJ/MM/AAAA)`, `Modifiée (JJ/MM/AAAA)`, `Rejetée (JJ/MM/AAAA)`, `Retirée`.

---

## Partie A — Réponses reçues le 12/11/2026

| Question | Réponse de la responsable | Décision(s) concernée(s) |
|---|---|---|
| Q-001 | Instance de l'État `grist.numerique.gouv.fr`, données **non sensibles** | DEC-007 |
| Q-002 | Dépôt **public** (nécessaire pour les tests) | DEC-024 |
| Q-003 | Autorisé ; on utilise **uniquement les couleurs et les polices** du DSFR, **pas ses composants** | DEC-008 |
| Q-004 | Sprints **par chantier et par mois** | DEC-009 |
| Q-005 | Statuts de validation acceptés ; saisie par le **responsable de pilotage** | DEC-025 |
| Q-006 | Avancement **calculé**, avec option **déclarée** mise en évidence | DEC-018 |
| Q-007 | Objectifs validés modifiables **uniquement au moment d'une nouvelle saison ou par le responsable de pilotage** | DEC-015 |
| Q-008 | **Pas** de restriction des droits par chantier | DEC-023 |
| Q-009 | Jalons au niveau programme **et** par chantier (facultatif) | — (déjà prévu) |
| Q-010 | Nom retenu : **« Pilotage de la stratégie SIGNAL »** | DEC-024 |
| Q-011 | **Oui**, certaines actions concernent plusieurs chantiers | DEC-019 |
| DEC-011 | Les indicateurs doivent être **visibles dans Grist** (revue mensuelle avec l'amiral ; l'amiral consulte Grist directement) | DEC-011, DEC-020 |
| DEC-016 | Les utilisateurs seront saisis **à la main** dans une table, avec un **rôle** | DEC-016 |
| Données | Données **fictives** pour le moment ; un fichier Excel de pilotage réel pourra être transmis | DEC-026 |
| Tests E2E | Le guide de contribution GristGouv suggère la compétence (« skill ») `playwright-skill` | DEC-022 |

## Partie B — Questions restant à trancher

B1 et B3 ont été tranchés le 12/11/2026 ; **B2 et B4 restent ouverts** (ils bloquent la V2, pas le démarrage).

### B1. Pile technique (`DEC-003`) — ✅ tranché

- **Réponse de la responsable (12/11/2026)** : « Je valide TypeScript et la licence MIT tant que le widget arrive à fonctionner sur Grist. »
- **Décision** : TypeScript + Vite + Preact, sous la **condition** que le widget fonctionne dans Grist. Le code TypeScript est transformé en JavaScript ordinaire au moment du build : Grist reçoit une simple page web, comme pour un widget écrit directement en JavaScript.
- **Vérification de la condition** : par étapes, sur `grist.numerique.gouv.fr`, avec un document fictif.
  1. T1.02 : la sonde, construite avec cette pile, s'ouvre dans Grist et communique avec l'API.
  2. T1.18 : le widget publié sur GitHub Pages fonctionne dans Grist (VAL-15).
- **Si la condition échoue** à cause de la pile, et non de l'instance : arrêt, information de la responsable et réexamen de DEC-003 avant toute suite.

### B2. Actions multi-chantiers (`Q-012`, `DEC-019`) — bloque le modèle de données des actions (V2)

- **Recommandation** : chaque action garde **un chantier porteur** (qui la met dans son backlog et ses sprints) et peut avoir des **chantiers associés** et des **objectifs associés** d'autres chantiers. L'action compte dans l'avancement de **chacun** de ses objectifs (principal et associés). Elle apparaît dans le backlog des chantiers associés avec la mention « Contribue — porté par CH3 ».
- **Alternative** : une action sans chantier porteur, rattachée à plusieurs chantiers à égalité. Inconvénient : on ne sait plus dans quel sprint elle est suivie, ni qui la pilote.

### B3. Licence du dépôt public (`Q-013`, `DEC-024`) — ✅ tranché

- **Décision (12/11/2026)** : licence **MIT**, sous la même condition de bon fonctionnement dans Grist (la licence ne l'affecte pas).
- Mise en œuvre en T1.01 : fichier `LICENSE` (texte MIT standard) et champ `"license": "MIT"` dans `package.json`.
- Le titulaire du copyright reste à préciser au moment de T1.01 : la responsable à titre personnel, ou son administration.

### B4. Indicateurs calculés par des formules Grist (`DEC-011`) — bloque V2

- Ton besoin est validé : l'amiral doit voir l'avancement dans Grist.
- **Recommandation** : les indicateurs deviennent des **colonnes formules Grist**, qui sont donc la seule source de vérité. Le widget les lit et les affiche sans les recalculer. Les formules sont testées automatiquement dans un Grist local (`DEC-021`).
- **Conséquence** : l'amiral voit les mêmes chiffres dans le widget, dans une page Grist « Synthèse » et dans les exports.

---

## Partie C — Registre des décisions

### DEC-001 — Grist source de vérité, aucun backend
Widget statique ; toutes les données dans le document Grist ; aucun serveur ni service tiers. **Statut** : Validée (12/11/2026, principes du cahier des charges).

### DEC-002 — Widget indépendant (option B)
- **Décision** : ne pas dériver le code d'isaytoo (monolithe de 527 Ko, failles XSS, fichier LICENSE absent).
- Idées réutilisées : faux Grist, rechargement anti-rebond, Kanban en glisser-déposer, Gantt maison.
- **Statut** : À valider.

### DEC-003 — TypeScript + Vite + Preact
Voir B1. **Statut** : Validée (12/11/2026), sous condition de fonctionnement dans Grist (vérifiée en T1.02 puis T1.18).

### DEC-004 — Accès complet et document dédié
`requiredAccess: 'full'` ; un document Grist ne contenant que le pilotage SIGNAL. **Statut** : À valider (inhérent au besoin multi-tables).

### DEC-005 — Schéma à noms fixes, initialisation sur clic
Aucune écriture au chargement ; création des tables manquantes seulement sur action explicite. **Statut** : À valider.

### DEC-006 — Synchronisation par la table `Synchro`
Section liée à une table dont la formule dépend de toutes les autres ; mécanismes de secours. **Condition** : résultat de VAL-01. **Statut** : À valider.

### DEC-007 — Hébergement
- **Contexte** : production sur `grist.numerique.gouv.fr` (accessible par Internet), données non sensibles (Q-001).
- **Décision** : hébergement sur **GitHub Pages** pour les tests **et** la production. Le serveur interne n'est plus nécessaire. Le build mono-fichier reste une solution de repli.
- **Point à vérifier (VAL-15)** : l'instance `grist.numerique.gouv.fr` accepte-t-elle un widget par **URL personnalisée** ? La liste de widgets proposée par défaut est gérée par l'équipe GristGouv (dépôt `gristgouv/widgets-config`).
- **Si l'URL personnalisée est refusée** : soumettre le widget au « chemin B » du guide GristGouv. Cela suppose un signalement sur Tchap, une revue et un audit de sécurité avant la mise en production.
- **Statut** : Validée (12/11/2026), sous réserve de VAL-15.

### DEC-008 — Usage du DSFR : couleurs et polices uniquement
- **Décision** :
  - utiliser les **tokens de couleur** du DSFR (thèmes clair et sombre) et la police **Marianne** ;
  - **ne pas** utiliser les composants DSFR (ni leur CSS, ni leur JavaScript) ;
  - les composants de l'interface sont écrits pour le projet, en reprenant les règles d'accessibilité (RGAA) et l'esprit visuel du DSFR.
- **Mise en œuvre** : import des seuls fichiers « cœur » (`core`) et « thème » (`scheme`) du paquet `@gouvfr/dsfr` 1.15.4, version figée. Pas de bloc marque, pas de Marianne institutionnelle (logo).
- **Statut** : Validée (12/11/2026) ; mise en œuvre détaillée dans `07`.

### DEC-009 — Sprints par chantier et par mois
**Statut** : Validée (12/11/2026).

### DEC-010 — Périmètre du MVP
- **Proposition révisée** : MVP = V1 + V2, avec en plus, dans la V2 :
  - les indicateurs en formules Grist ;
  - une **page Grist native « Synthèse SIGNAL »** visible par l'amiral ;
  - le **relevé mensuel d'avancement** (`DEC-020`).
- Motif : la revue mensuelle avec l'amiral est un besoin immédiat. Le cockpit du widget reste en V3.
- **Statut** : À valider.

### DEC-011 — Indicateurs en colonnes formules Grist
- **Besoin** : Validé (12/11/2026).
- **Mise en œuvre** : voir B4. Les formules sont écrites en Python Grist, versionnées dans `src/grist/formules/` et installées par l'assistant d'initialisation. Elles sont testées dans un Grist local (`DEC-021`).
- **Exceptions** : les calculs qui dépendent de la date du jour (retard, alertes) sont **aussi** recalculés par le widget à l'affichage. Une formule Grist utilisant `TODAY()` peut en effet ne pas être recalculée chaque jour (VAL-16).
- **Statut** : À valider (mise en œuvre).

### DEC-012 — Widget éditorial séparé, contrat de données
**Statut** : À valider.

### DEC-013 — Objectifs et sous-objectifs dans une seule table
Table `Objectifs` avec `Parent` et `Niveau` calculé. **Statut** : À valider.

### DEC-014 — Historique : journal ciblé + historique natif Grist
**Statut** : À valider.

### DEC-015 — Modification des objectifs validés
- **Règle (Q-007)** : un objectif `Validé` n'est modifiable que :
  - par le **responsable de pilotage**, à tout moment, avec un motif tracé au journal ;
  - ou **lors de la préparation d'une nouvelle saison**, par **reconduction** : l'objectif est copié dans la nouvelle saison puis modifié librement. L'original reste inchangé dans l'historique.
- **Garantie** : une règle d'accès Grist par rôle (`DEC-023`) refuse la modification à toute autre personne, même si elle passe directement par Grist.
- **Statut** : Validée sur le fond (12/11/2026) ; mise en œuvre à valider.

### DEC-016 — Utilisateurs, rôles et identification
- **Décision (réponse DEC-016)** : la table `Personnes` est saisie à la main par le responsable de pilotage. Elle porte un `Role` et le `Courriel` du compte Grist de chaque personne.
- **Rôles** : `Responsable pilotage`, `Pilote`, `Contributeur`, `Autorité`, `Lecteur`.
- **Identification automatique (proposition)** : une table technique `Profils` contient une ligne par personne. Une règle d'accès Grist ne laisse chaque utilisateur voir **que sa propre ligne** (`rec.Courriel == user.Email`). Le widget lit cette table, sans aucune écriture : il sait ainsi qui est connecté et avec quel rôle.
- **Point à valider** : VAL-17.
- **Si VAL-17 échoue** : choix manuel de « Moi » mémorisé sur le poste.
- **Remarque** : le rôle sert à adapter l'affichage ; la **sécurité** reste assurée par les règles d'accès Grist (`DEC-023`).
- **Statut** : Validée sur le fond (12/11/2026) ; table `Profils` à valider.

### DEC-017 — Dépendances et exports
Aucune bibliothèque par CDN (hors API Grist) ; impression navigateur ; export CSV maison. Conforme au critère GristGouv « pas de dépendances superflues ». **Statut** : À valider.

### DEC-018 — Règles de calcul de l'avancement
IND-001 à IND-004 (`01` §14) : comptage des actions terminées, moyennes simples, « Non mesurable » sans action, avancement déclaré prioritaire et signalé. **Statut** : Validée (12/11/2026).

### DEC-019 — Actions multi-chantiers
Voir B2 : chantier porteur + chantiers et objectifs associés. **Statut** : besoin Validé (12/11/2026) ; modèle À valider (`Q-012`).

### DEC-020 — Relevé mensuel et page Grist de synthèse
- **Proposition** :
  - (1) Une table `ReleveMensuel` : le responsable de pilotage clique « Figer l'avancement du mois ». Une ligne est alors créée par chantier-saison (avancement, objectifs validés, actions en retard, actions bloquées, taux du sprint), plus une ligne « Programme ». On peut ainsi présenter l'**évolution** mois par mois.
  - (2) Une **page Grist native « Synthèse SIGNAL »** affiche les tables `ChantiersSaison` et `ReleveMensuel` avec un graphique natif Grist. L'amiral la consulte sans passer par le widget.
- **Statut** : À valider.

### DEC-021 — Tests d'intégration dans un vrai Grist local
- **Contexte** : le guide GristGouv exige des tests d'intégration couvrant au minimum « création d'un document, interaction avec le widget ».
- **Proposition** : la CI GitHub Actions démarre **Grist (image Docker officielle `gristlabs/grist`)**. Playwright y crée un document, installe le widget, vérifie le scénario de base et les valeurs des formules d'indicateurs (`JDD-CALC`).
- **En local** : ces tests ne sont pas exécutés (DEC-028).
- **Statut** : À valider.

### DEC-022 — Compétence Playwright pour Claude Code
- **Contexte** : le guide GristGouv cite `https://github.com/testdino-hq/playwright-skill`. C'est une collection de guides Markdown sur les bonnes pratiques Playwright. Le guide précise qu'elle n'a pas été testée formellement et qu'il faut la prendre comme « un point de départ ».
- **Proposition** : installer les packs `core` et `ci` au début de T1.17, **avec ton accord au moment de l'installation** (contenu tiers). Les tests produits avec son aide sont relus et exécutés avant fusion.
- **Ne pas confondre** avec `lackeyjb/playwright-skill`, qui exécute du code Playwright à la volée : il n'est pas retenu.
- **Statut** : À valider.

### DEC-023 — Règles d'accès Grist par rôle (et non par chantier)
- **Décision** :
  - pas de restriction par chantier (Q-008) ;
  - des règles d'accès par **rôle** sont nécessaires pour DEC-015 (objectifs validés) et pour la table `Personnes` (modifiable seulement par le responsable de pilotage) ;
  - la table `Profils` fait l'objet d'un filtrage par ligne (DEC-016).
- Les règles sont décrites dans `docs/regles-acces-grist.md` (tâche T1.21) et appliquées par la propriétaire du document.
- **Statut** : À valider.

### DEC-024 — Nom, dépôt public et conformité GristGouv
- **Nom** : « Pilotage de la stratégie SIGNAL ».
- **Dépôt** : `grist-widget-pilotage`, **public**, conformément à la convention de nommage du guide GristGouv.
- **Critères GristGouv appliqués** : README (rôle, configuration, dépendances) ; code lisible sans outil d'IA ; aucun code mort ; tests unitaires et d'intégration ; aucune requête externe non documentée ; aucune donnée hors Grist.
- **Licence** : MIT (voir B3).
- **Statut** : Validée (12/11/2026).

### DEC-025 — Validation des objectifs par le responsable de pilotage
Statuts de `01` §7.2 acceptés. Les transitions `Soumis → Validé`, `→ À reprendre` et `→ Abandonné` sont réservées au rôle `Responsable pilotage` (règle d'accès + affichage). **Statut** : Validée (12/11/2026).

### DEC-026 — Utilisation du fichier Excel de pilotage actuel
- **Proposition** : le fichier sert uniquement à **comprendre la structure** (colonnes, statuts, vocabulaire) et à rendre les données fictives réalistes.
- **Règles** :
  - il n'est **jamais** ajouté au dépôt (dépôt public) ;
  - il est placé dans un dossier exclu par `.gitignore` (`donnees-privees/`) ou hors du projet ;
  - il est de préférence anonymisé ;
  - aucune valeur réelle n'est recopiée dans les fixtures.
- **Statut** : À valider.

### DEC-027 — Volumétrie et périmètre (« un widget qui fait une chose bien »)
- **Contexte** : le guide GristGouv privilégie des widgets au périmètre limité. Le pilotage SIGNAL est un outil complet.
- **Proposition** : assumer un widget unique pour l'usage interne. Si une publication en « chemin B » est envisagée, discuter du périmètre avec l'équipe GristGouv (le Gantt pourrait par exemple devenir un widget séparé).
- **Statut** : À valider (non bloquant).

---

## Partie D — Écarts et décisions prises en cours de développement

### DEC-028 — Sobriété du poste : tests lourds uniquement sur GitHub (12/11/2026, pendant T1.01)

- **Contexte** : pendant T1.01, les navigateurs de test Playwright (environ 1,1 Go) ont été téléchargés sur le poste de la responsable sans accord préalable. Le Firefox de test n'y fonctionnait pas.
- **Décision de la responsable** : supprimer ces navigateurs ; ne pas solliciter ni encombrer son ordinateur.
- **Mise en œuvre** :
  - le dossier des navigateurs a été supprimé ;
  - les tests dans un navigateur (`test:e2e`) et dans un Grist local (`test:grist`) s'exécutent **uniquement en CI** ;
  - en local, seuls `npm install` (dans le dossier du projet) et `npm run verifier` sont utilisés ;
  - toute autre installation demande un accord préalable (CLAUDE.md §6 bis).
- **Conséquence** : pour les tâches d'interface, le résultat des tests navigateur n'arrive qu'après envoi sur GitHub (quelques minutes).
- **Statut** : Validée (12/11/2026).

### DEC-029 — Thème : clair par défaut, interrupteur « Mode sombre » (12/11/2026, avant T1.03)

- **Contexte** : Grist transmet un thème au widget (VAL-14). Mais `grist.numerique.gouv.fr` ne propose pas de choix clair/sombre à ses utilisateurs : Grist y est toujours affiché en clair (constat de la responsable).
- **Décision de la responsable** :
  - le widget s'affiche **en clair par défaut**, comme Grist ;
  - un **interrupteur « Mode sombre »** permet de passer en sombre ; le choix est mémorisé sur le poste (`localStorage`, protégé par `try/catch`) ;
  - le thème du système d'exploitation et celui envoyé par Grist ne sont **pas** suivis.
- **Mise en œuvre** : attributs `data-fr-theme` et `color-scheme` posés sur `<html>` par le widget, en s'appuyant sur les variables du thème sombre du DSFR (`scheme`). Aucun JavaScript DSFR n'est utilisé (DEC-008).
- **Réversibilité** : forte. Suivre le thème de Grist reste possible si l'instance propose un jour un mode sombre.
- **Statut** : Validée (12/11/2026).

### DEC-030 — Acceptation des modalités d'utilisation du DSFR (12/11/2026)

- La responsable a lu et accepté les modalités d'utilisation du DSFR (https://www.systeme-de-design.gouv.fr/version-courante/fr/a-propos/modalites-d-utilisation) le 12/11/2026, avant l'installation du paquet `@gouvfr/dsfr` 1.15.4.
- Cette acceptation est reportée dans la CI (`DSFR_ACCEPT_LICENSE=1`) et pour les installations locales du projet.
- **Statut** : Validée (12/11/2026).
