// Badge de statut (docs/07 §3.3) : le texte est toujours présent, la couleur ne fait que le renforcer (UX-009).
export type TypeBadge = 'neutre' | 'info' | 'succes' | 'avertissement' | 'erreur' | 'nouveau';

interface ProprietesBadge {
  texte: string;
  type?: TypeBadge;
}

export function Badge({ texte, type = 'neutre' }: ProprietesBadge) {
  return <span class={`sg-badge sg-badge--${type}`}>{texte}</span>;
}
