// Petit jeu d'icônes dessinées pour le projet (docs/07 §1) : traits simples, sans dépendance.
// Une icône est décorative par défaut (masquée aux lecteurs d'écran) ; avec `titre`, elle est annoncée.

export type NomIcone =
  | 'chevron-bas'
  | 'chevron-gauche'
  | 'chevron-droite'
  | 'fermer'
  | 'info'
  | 'succes'
  | 'erreur'
  | 'avertissement'
  | 'plus'
  | 'fleche-haut'
  | 'fleche-bas';

// Tracés SVG sur une grille de 24 × 24.
const TRACES: Record<NomIcone, string> = {
  'chevron-bas': 'M6 9l6 6 6-6',
  'chevron-gauche': 'M15 6l-6 6 6 6',
  'chevron-droite': 'M9 6l6 6-6 6',
  fermer: 'M6 6l12 12M18 6L6 18',
  info: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M12 11v6M12 7.5v.5',
  succes: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M8 12l3 3 5-6',
  erreur: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M9 9l6 6M15 9l-6 6',
  avertissement: 'M12 3L2 20h20L12 3M12 10v5M12 17.5v.5',
  plus: 'M12 5v14M5 12h14',
  'fleche-haut': 'M12 19V5M6 11l6-6 6 6',
  'fleche-bas': 'M12 5v14M6 13l6 6 6-6',
};

interface ProprietesIcone {
  nom: NomIcone;
  /** Texte annoncé aux lecteurs d'écran ; sans titre, l'icône est décorative. */
  titre?: string;
}

export function Icone({ nom, titre }: ProprietesIcone) {
  return (
    <svg
      class="sg-icone"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      role={titre ? 'img' : undefined}
      aria-hidden={titre ? undefined : true}
      aria-label={titre}
      focusable="false"
    >
      <path d={TRACES[nom]} />
    </svg>
  );
}
