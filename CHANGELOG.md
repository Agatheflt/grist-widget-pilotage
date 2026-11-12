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

### Modifié

- Tests dans un navigateur et dans un Grist local exécutés uniquement par la CI GitHub (DEC-028) ; aucun navigateur de test installé sur le poste.
