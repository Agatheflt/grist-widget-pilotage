// Recherche de données sensibles dans les fichiers du dépôt (TECH-130, TECH-131).
// Le dépôt est public : ce contrôle bloque la CI s'il trouve un motif suspect.
// Usage : npm run verifier:secrets
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

// Fichiers suivis par Git ou nouveaux mais non ignorés (le dossier donnees-privees/ est ignoré).
const fichiers = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], {
  encoding: 'utf8',
})
  .split('\n')
  .filter(Boolean);

// Extensions de fichiers de données qui ne doivent jamais être publiées.
const extensionsInterdites = /\.(xlsx|xls|grist|sqlite)$/i;

// Motifs de contenu suspects.
const motifs = [
  {
    nom: 'Adresse de document Grist',
    regle: /(getgrist\.com|grist\.numerique\.gouv\.fr)\/(o\/[\w-]+\/)?(doc\/)?[A-Za-z0-9]{12,}/,
  },
  { nom: 'Courriel du ministère', regle: /[\w.-]+@(intradef\.gouv\.fr|def\.gouv\.fr)/i },
  { nom: 'Clé privée', regle: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { nom: 'Jeton GitHub', regle: /\b(ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})\b/ },
  {
    nom: 'Clé ou jeton en clair',
    regle: /(api[_-]?key|token|secret|password|mot_de_passe)\s*[:=]\s*['"][A-Za-z0-9+/_-]{20,}['"]/i,
  },
];

const anomalies = [];

for (const fichier of fichiers) {
  if (extensionsInterdites.test(fichier)) {
    anomalies.push(`${fichier} : fichier de données interdit dans le dépôt`);
    continue;
  }
  let contenu;
  try {
    contenu = readFileSync(fichier, 'utf8');
  } catch {
    continue; // fichier supprimé ou illisible : ignoré
  }
  contenu.split('\n').forEach((ligne, index) => {
    for (const { nom, regle } of motifs) {
      if (regle.test(ligne)) anomalies.push(`${fichier}:${index + 1} : ${nom}`);
    }
  });
}

if (anomalies.length > 0) {
  console.error('Données potentiellement sensibles détectées :');
  for (const anomalie of anomalies) console.error(`  - ${anomalie}`);
  process.exit(1);
}

console.log(`Aucune donnée sensible détectée (${fichiers.length} fichiers vérifiés).`);
