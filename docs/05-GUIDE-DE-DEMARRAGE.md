# 05 — Guide de démarrage (pour une personne qui ne programme pas)

> Version : 0.1 — 12/11/2026
> Ce guide explique, pas à pas, comment installer les outils, lancer le widget, le publier et l'essayer dans Grist.
> Il s'applique à **Windows**. Les étapes qui n'existeront qu'après le début du développement (tâche T1.01) sont signalées par 🔜.
> Vous pouvez à tout moment demander à Claude Code : « Explique-moi cette étape » ou « Fais cette étape avec moi ».

---

## 0. Vocabulaire minimal

| Terme | Signification simple |
|---|---|
| **Dépôt (repository)** | Le dossier du projet, avec l'historique de toutes ses modifications |
| **Git** | Le logiciel qui enregistre cet historique sur votre ordinateur |
| **GitHub** | Le site web qui conserve une copie du dépôt en ligne |
| **Commit** | Un « point de sauvegarde » nommé dans l'historique |
| **Branche** | Une copie de travail parallèle, fusionnée ensuite dans la version principale (`main`) |
| **PR (pull request)** | Une demande de fusion d'une branche, qu'on relit avant d'accepter |
| **Terminal** | Une fenêtre où l'on tape des commandes |
| **Node.js / npm** | Le moteur qui fait fonctionner les outils du projet, et son gestionnaire d'installation |
| **Build** | La fabrication des fichiers finaux du widget (dossier `dist/`) |
| **Widget personnalisé** | Une page web affichée dans une section d'un document Grist |

**Où taper les commandes ?** Dans un **terminal ouvert dans le dossier du projet**. Deux possibilités :
- dans l'application Claude (onglet Code), panneau **Terminal** ;
- ou dans **PowerShell** : ouvrir le dossier du projet dans l'Explorateur, cliquer dans la barre d'adresse, taper `powershell` puis Entrée.

Vous pouvez aussi simplement demander à Claude Code d'exécuter la commande pour vous.

## 1. Logiciels nécessaires

| Logiciel | Pourquoi | Où le trouver | Vérification (dans un terminal) |
|---|---|---|---|
| **Git** | Historique du projet | https://git-scm.com/download/win (options par défaut) | `git --version` → affiche un numéro |
| **Node.js (version LTS)** | Faire fonctionner les outils | https://nodejs.org → bouton « LTS » | `node --version` et `npm --version` |
| **Claude (application de bureau)**, onglet Code | Développer avec Claude Code | Déjà installé | — |
| **Un navigateur récent** (Edge, Firefox, Chrome) | Tester le widget | Déjà installé | — |
| **Compte GitHub** | Héberger le dépôt | https://github.com/signup | Connexion réussie |
| **Compte Grist de l'État** | Tester et utiliser le widget | https://grist.numerique.gouv.fr (connexion ProConnect) | Connexion réussie |

Facultatif :
- **GitHub CLI** (`gh`), qui permet à Claude Code de créer le dépôt et les PR pour vous : https://cli.github.com puis `gh auth login`.
- **Docker Desktop : non nécessaire et non recommandé.** Les tests dans un Grist local tournent automatiquement sur GitHub.

> ⚠️ Activez la **double authentification** sur votre compte GitHub (Settings › Password and authentication). C'est indispensable : le widget a accès à tout le document Grist.

## 2. Créer le dépôt GitHub

1. Sur https://github.com, bouton **New** (nouveau dépôt).
2. Nom : `grist-widget-pilotage` (convention de nommage GristGouv). Visibilité : **Public** (décision Q-002).
   > ⚠️ Public veut dire que **tout le monde peut lire tout le contenu et tout l'historique**, y compris un fichier supprimé ensuite. N'y mettez jamais le fichier Excel de pilotage, de vrais noms, des captures de documents réels ou des liens vers vos documents Grist (voir §15).
3. Ne cochez **rien** d'autre (pas de README : il existe déjà) → **Create repository**.
4. Dans Claude Code, demandez : « Initialise Git dans ce dossier, fais un premier commit de la documentation et relie-le au dépôt GitHub `grist-widget-pilotage` ». Claude Code exécutera l'équivalent de :

```bash
git init
```
*Rôle : transformer le dossier en dépôt Git. À exécuter une seule fois, dans le dossier du projet.*

```bash
git add README.md CLAUDE.md docs
```
*Rôle : sélectionner les fichiers à enregistrer.*

```bash
git commit -m "Documentation initiale Pilotage de la stratégie SIGNAL"
```
*Rôle : créer le premier point de sauvegarde.*

```bash
git branch -M main
```
*Rôle : nommer la branche principale `main`.*

```bash
git remote add origin https://github.com/<votre-compte>/grist-widget-pilotage.git
```
*Rôle : indiquer l'adresse du dépôt GitHub (remplacez `<votre-compte>`).*

```bash
git push -u origin main
```
*Rôle : envoyer le dépôt sur GitHub. Une fenêtre de connexion GitHub peut s'ouvrir.*

5. Sur GitHub, protégez la branche `main` : **Settings › Branches › Add branch ruleset** → cible `main` → cocher « Require a pull request before merging » et (après T1.01) « Require status checks to pass ».

## 3. Ouvrir le projet dans Claude Code

1. Ouvrir l'application Claude → onglet **Code**.
2. Choisir le dossier du projet (`widget-grist-pilotage`).
3. Claude Code lit automatiquement `CLAUDE.md` (les règles du projet).
4. Pour démarrer une tâche, écrivez par exemple : « Réalise la tâche T1.01 du plan de développement ». Claude Code créera une branche, fera la tâche, lancera les vérifications et vous présentera le résultat.

## 4. 🔜 Installer les dépendances (après T1.01)

```bash
npm install
```
*Rôle : télécharger les outils du projet (dossier `node_modules/`). À faire après chaque récupération du projet ou quand `package.json` change. Dans le dossier du projet.*

Lors de la **première** installation du DSFR (tâche T1.03), une question vous demandera d'**accepter les modalités d'utilisation du DSFR** : lisez-les et répondez vous-même (décision A3).

Le dossier `node_modules/` occupe environ 200 Mo, uniquement dans le dossier du projet. On peut le supprimer à tout moment : `npm install` le recrée.

> **Rien d'autre n'est installé sur votre ordinateur.** Les tests qui demandent un navigateur ou un Grist local tournent **sur GitHub**, qui installe ses propres outils à chaque fois puis efface tout. N'exécutez pas `npx playwright install` : cette commande télécharge environ 1 Go de navigateurs de test.

## 5. 🔜 Lancer le widget en local

```bash
npm run dev
```
*Rôle : démarrer un petit serveur sur votre ordinateur. Le terminal affiche une adresse comme `http://localhost:5173/`. Laissez ce terminal ouvert ; `Ctrl+C` pour arrêter.*

- Ouvert directement dans le navigateur, le widget affiche « Ce widget doit être ouvert dans Grist » : c'est normal.
- Pour le voir avec des données fictives sans Grist : ouvrir `http://localhost:5173/tests/harnais/?jdd=demo` (🔜 après T1.17).
- Pour l'essayer dans Grist : utiliser l'adresse `http://localhost:5173/` comme URL de widget (section 8). Cela ne fonctionne que sur **votre** ordinateur, pendant que `npm run dev` tourne.

## 6. Publier sur GitHub (au quotidien)

Claude Code gère les branches et les PR pour vous. Votre rôle :
1. Lire le résumé de la PR proposé par Claude Code.
2. Vérifier sur GitHub que la CI est **verte** (coche verte).
3. Fusionner la PR (**Merge**) quand vous êtes d'accord.

Commande utile pour récupérer la dernière version :

```bash
git pull
```
*Rôle : mettre à jour votre dossier avec la version de GitHub.*

## 7. 🔜 Activer GitHub Pages (après T1.18, avec votre accord)

1. GitHub › dépôt › **Settings › Pages** → « Source » : **GitHub Actions**.
2. GitHub › **Actions** → workflow « Déploiement GitHub Pages » → **Run workflow** → saisir le tag à publier (ex. `v1.0.0`).
3. À la fin, l'adresse s'affiche : `https://<votre-compte>.github.io/grist-widget-pilotage/`.

> Cette adresse est **publique** et sert aussi bien aux tests qu'à la production sur `grist.numerique.gouv.fr` (données non sensibles, décision DEC-007). Elle ne contient aucune donnée : les données restent dans Grist. Si l'instance refuse les URL personnalisées (point VAL-15), voir le « chemin B » du guide GristGouv dans `06`.

## 8. Créer un document Grist de test

1. Se connecter à https://grist.numerique.gouv.fr → **Add New › Create empty document**.
2. Renommer le document : **« [TEST] Pilotage de la stratégie SIGNAL »**. N'y mettez **que des données fictives**.
3. Renommer la table `Table1` en **`Synchro`** (clic sur le nom de la table dans le panneau « Raw data », ou demander l'aide de Claude Code).

## 9. Ajouter le widget par URL personnalisée

1. Dans le document : **Add New › Add widget to page**.
2. **Select Widget** : *Custom*. **Select Data** : *Synchro*. → **Add to page**.
3. Dans la nouvelle section : menu **⋮** (en haut à droite) › **Widget options**.
4. Dans le panneau de droite, rubrique *Custom* : **Enter Custom URL** → coller l'URL :
   - en développement : `http://localhost:5173/` ;
   - publié : `https://<votre-compte>.github.io/grist-widget-pilotage/`.

## 10. Attribuer les permissions

1. Toujours dans le panneau de droite : **Access level** → **Full document access**.
2. Le widget se recharge. Si Grist affiche une demande d'autorisation, cliquez **Accept**.
3. Pourquoi « accès complet » ? Le widget lit et écrit dans plusieurs tables (saisons, objectifs, actions…). C'est aussi pourquoi ce document ne doit contenir que Pilotage de la stratégie SIGNAL.

## 11. Vérifier le fonctionnement

1. 🔜 Le widget affiche l'écran **Initialisation** et la liste des tables à créer → **Créer la structure** → confirmer.
2. 🔜 Choisir **Charger des données de démonstration**.
3. Vérifier : les tables apparaissent dans « Raw data » ; la vue Chantiers affiche 7 chantiers.
4. Modifier un intitulé dans une table Grist → il doit changer dans le widget en quelques secondes (sinon, bouton **Actualiser**).
5. Le pied du widget affiche la version (« Pilotage de la stratégie SIGNAL v1.0.0 »).

Si les tables d'audit ne se remplissent pas (`CreePar`, `MajPar` vides), suivre la procédure manuelle que Claude Code ajoutera ici après la validation VAL-11 (T1.02).

### 11 bis. 🔜 Déclarer les utilisateurs et leurs rôles (après T1.21)

1. Dans le widget, onglet **Référentiels › Personnes** (ou directement dans la table `Personnes`), saisissez chaque personne avec son **rôle** et le **courriel exact de son compte Grist**.
2. Appliquez les règles d'accès décrites pas à pas dans `docs/regles-acces-grist.md` (menu Grist **Access Rules**). Elles garantissent que seul le responsable de pilotage peut valider ou modifier un objectif validé.
3. Partagez le document (bouton **Share**) : Éditeur pour les pilotes et contributeurs, Lecteur pour l'amiral et les lecteurs.
4. Vérifiez : chaque personne voit « Connecté : Nom (Rôle) » en haut du widget.

### 11 ter. 🔜 Page « Synthèse SIGNAL » pour l'amiral (après T2.14)

Suivez `docs/page-synthese-grist.md` pour créer une page Grist classique (sans widget) montrant l'avancement de la saison et de chaque chantier, et l'évolution mois par mois. L'amiral la consulte directement dans Grist.

## 12. 🔜 Commandes de test

| Commande | Rôle |
|---|---|
| `npm run verifier` | **La commande principale** : vérifie le code, les types, lance les tests, cherche des données sensibles, fabrique le widget. Si tout est vert, c'est bon. |
| `npm test` | Tests rapides uniquement |
| `npm run test:e2e` | Tests qui simulent un utilisateur dans un navigateur — **lancés automatiquement par GitHub**, pas sur votre ordinateur |
| `npm run build` | Fabrique les fichiers finaux dans `dist/` |

Toutes se lancent dans le terminal, dans le dossier du projet. Un résultat se lit ainsi : ✓ = réussi, ✗ = échec (Claude Code peut expliquer et corriger).

## 13. En cas d'erreur

| Symptôme | Cause probable | Que faire |
|---|---|---|
| `git` / `node` / `npm` « n'est pas reconnu » | Logiciel non installé ou terminal ouvert avant l'installation | Installer (§1), fermer et rouvrir le terminal |
| `npm install` échoue avec une erreur réseau | Proxy de l'environnement professionnel | Demander à Claude Code ; essayer depuis un autre réseau ; contacter le support informatique |
| Le widget reste blanc dans Grist | URL incorrecte, `npm run dev` arrêté, ou adresse bloquée par le réseau | Vérifier l'URL ; relancer `npm run dev` ; ouvrir l'URL seule dans un onglet |
| « Accès insuffisant » dans le widget | Niveau d'accès pas sur *Full document access* | §10 |
| « Structure incomplète » | Document non initialisé ou table supprimée | Écran Initialisation → *Créer la structure* (droits de propriétaire requis) |
| « Modification refusée par Grist » | Vous êtes lecteur, ou règle d'accès | Vérifier vos droits sur le document |
| Les modifications faites dans Grist n'apparaissent pas | La section n'est pas liée à la table `Synchro` | Section › *Widget options* › *Data* : choisir `Synchro` ; sinon bouton *Actualiser* |
| La CI GitHub est rouge | Un test échoue | Demander à Claude Code : « La CI est rouge sur la PR, corrige » |
| Après une mise à jour, le widget ne marche plus | Régression | Retour arrière : redéployer la version précédente (§14) |

**Règle d'or** : ne jamais coller de données réelles, de mots de passe ou de liens vers des documents réels dans le dépôt, les issues GitHub ou les messages à Claude Code destinés à être publiés.

## 15. Utiliser votre fichier Excel de pilotage (DEC-026)

Le fichier actuel est précieux pour comprendre vos colonnes, vos statuts et votre vocabulaire. Comme le dépôt est **public** :

1. Créez dans le dossier du projet un dossier **`donnees-privees/`** et placez-y le fichier. Ce dossier sera exclu de Git (`.gitignore`, dès T1.01). Avant T1.01, gardez le fichier **hors** du dossier du projet.
2. De préférence, anonymisez-le d'abord : remplacez les noms par « Personne A, B… » et retirez ce qui n'est pas utile.
3. Demandez à Claude Code : « Analyse la structure du fichier `donnees-privees/…xlsx` et compare-la au modèle de données ». Claude Code n'en recopiera **aucune valeur réelle** dans le code ou les tests.
4. Avant chaque commit, vérifiez (ou demandez à Claude Code de vérifier) que le fichier n'apparaît pas dans `git status`.

## 16. Suivre la démarche GristGouv (facultatif)

Si vous souhaitez un jour que le widget soit proposé officiellement sur `grist.numerique.gouv.fr` (« chemin B ») :

1. Le dépôt doit rester public et conforme aux critères du guide : https://github.com/gristgouv/.github/blob/main/CONTRIBUTING-fr.md.
2. Signalez-le sur le canal Tchap « Grist-Contributions » : lien, 2 ou 3 phrases de description, contexte d'usage.
3. Prévoyez une revue (premier retour sous un mois) et un audit de sécurité. Vous devez pouvoir expliquer le code sans assistant d'IA.

## 14. 🔜 Mettre à jour et revenir en arrière

**Mise à jour** (après validation d'une version) :
1. Faire une copie de sauvegarde du document Grist (**⋮ › Save copy** ou **Download**).
2. GitHub › Actions › Déploiement → *Run workflow* avec le nouveau tag.
3. Si le widget annonce « Structure à mettre à jour » : cliquer *Mettre à jour la structure*.
4. Vérifier rapidement (§11).

**Retour arrière** : GitHub › Actions › Déploiement → *Run workflow* avec le **tag précédent**. Si des données ont été abîmées : restaurer la copie de sauvegarde ou utiliser **Document History** dans Grist.
