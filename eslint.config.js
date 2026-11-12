// Règles de qualité du code (ESLint).
// Elles appliquent automatiquement deux exigences des spécifications :
//  - TECH-013 : respect des couches (ui → store → domain ; seul grist/ parle à Grist) ;
//  - TECH-110 : interdiction des API qui permettent d'injecter du HTML ou du code.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

// API dangereuses interdites partout (TECH-110).
const apiDangereuses = [
  {
    selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
    message: 'Interdit (TECH-110) : affiche le texte avec JSX, qui échappe automatiquement le HTML.',
  },
  {
    selector: 'AssignmentExpression > MemberExpression.left[property.name=/^(innerHTML|outerHTML)$/]',
    message: 'Interdit (TECH-110) : innerHTML/outerHTML permettent une injection de code.',
  },
  {
    selector: 'CallExpression[callee.property.name=/^(insertAdjacentHTML|write|writeln)$/]',
    message: 'Interdit (TECH-110) : insertAdjacentHTML et document.write permettent une injection de code.',
  },
];

// Accès à l'API Grist interdit hors de src/grist/ (TECH-011).
const accesGristInterdit = {
  selector: "MemberExpression[object.name='window'][property.name='grist']",
  message: "Seul le code de src/grist/ peut utiliser l'API Grist (TECH-011).",
};

// Fabrique une règle d'import interdisant certains dossiers.
const interdireImports = (dossiers, message) => ({
  'no-restricted-imports': ['error', { patterns: [{ group: dossiers, message }] }],
});

export default tseslint.config(
  { ignores: ['dist/', 'coverage/', 'node_modules/', 'playwright-report/', 'test-results/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-restricted-syntax': ['error', ...apiDangereuses, accesGristInterdit],
      'no-restricted-globals': ['error', { name: 'grist', message: 'Utiliser src/grist/ (TECH-011).' }],
    },
  },
  {
    // La couche grist/ est la seule autorisée à toucher window.grist.
    files: ['src/grist/**'],
    rules: {
      'no-restricted-syntax': ['error', ...apiDangereuses],
      'no-restricted-globals': 'off',
    },
  },
  {
    // domain/ : TypeScript pur, aucune dépendance (TECH-010).
    files: ['src/domain/**'],
    rules: interdireImports(
      ['**/grist/**', '**/store/**', '**/ui/**', 'preact', 'preact/*', '@preact/*'],
      'La couche domain/ ne dépend de rien (TECH-010).',
    ),
  },
  {
    // store/ ne connaît pas l'interface.
    files: ['src/store/**'],
    rules: interdireImports(['**/ui/**'], "La couche store/ ne dépend pas de l'interface (TECH-012)."),
  },
  {
    // ui/ passe toujours par store/ (TECH-012).
    files: ['src/ui/**'],
    rules: interdireImports(['**/grist/**'], "L'interface passe par store/, jamais par grist/ (TECH-012)."),
  },
);
