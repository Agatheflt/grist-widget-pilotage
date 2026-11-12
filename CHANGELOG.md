# Journal des modifications

Format : une section par version (SemVer). Les modifications en cours sont listées sous « Non publié ».

## Non publié

### Ajouté

- **T1.01 — Initialisation du projet** : TypeScript (mode strict), Vite, Preact, Vitest, Testing Library, Playwright, ESLint (règles de couches TECH-013 et d'interdiction des API dangereuses TECH-110), Prettier, stylelint.
- Scripts npm : `dev`, `build`, `apercu`, `types`, `lint`, `format`, `test`, `test:couverture`, `test:e2e`, `verifier:secrets`, `verifier`.
- Contrôle automatique des données sensibles (`scripts/verifier-secrets.mjs`).
- Intégration continue GitHub Actions (`.github/workflows/ci.yml`).
- Licence MIT, politique de sécurité (`SECURITY.md`), `.gitignore` excluant `donnees-privees/` et les fichiers de données.
- Page minimale du widget et premiers tests (unitaire, composant, bout en bout).

- **T1.02 — Sonde de validation de l'API Grist** (`outils/sonde-grist/`) : page de test publiée avec le widget, essais VAL-01 à VAL-19, rapport copiable sans données du document, mode d'emploi pas à pas ; fonctions utilitaires testées.
- Workflow de déploiement GitHub Pages **manuel** (`.github/workflows/deploiement-pages.yml`), avancé depuis T1.18 pour publier la sonde.
- Section « Résultats de validation » dans `docs/00` (§8), à remplir avec le rapport de la sonde.

- Résultats de la première série d'essais de la sonde consignés dans `docs/00` §8 (VAL-03, 04, 05, 08, 09, 10, 13, 14, 15 confirmés).
- **Clôture de T1.02** : VAL-01 (synchronisation par la table `Synchro`), VAL-02 (un événement par écriture), VAL-06, VAL-11 (colonnes `MajLe` créées en deux temps) et VAL-18 (création de page par l'API) confirmés ; VAL-16 non vérifié, sans impact bloquant. Règle de création des colonnes de déclenchement reportée dans `docs/02` §4.1 et T1.06.

- **T1.03 — Couleurs et police DSFR, thème, CSP** :
  - `@gouvfr/dsfr` 1.15.4 (version exacte), seuls les fichiers « cœur » et « thème » sont importés (DEC-008) ;
  - variables du projet `--sg-*` adossées aux couleurs DSFR, styles de base ;
  - thème clair par défaut et interrupteur « Mode sombre » mémorisé (DEC-029) ;
  - politique de sécurité du contenu (CSP) dans la page du widget ;
  - règles stylelint : pas de couleur en dur, pas de `!important`, classes `sg-*` uniquement ;
  - acceptation des modalités DSFR enregistrée (`.dsfr.yml`, DEC-030) et déclarée dans la CI ;
  - tests : préférences, thème, interrupteur, CSP, test de bout en bout du mode sombre.

### Modifié

- Sonde : textes relus masqués (seule la longueur est affichée), nettoyage de toutes les tables « Sonde… » (doublons compris), affichage de la table liée à la section (VAL-01).

- Tests dans un navigateur et dans un Grist local exécutés uniquement par la CI GitHub (DEC-028) ; aucun navigateur de test installé sur le poste.
