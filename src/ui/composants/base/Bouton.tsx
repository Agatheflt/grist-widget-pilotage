// Bouton (docs/07 §2) : élément <button> natif.
// Un bouton « désactivé » reste atteignable au clavier (aria-disabled) pour que son libellé et la raison
// de sa désactivation restent lisibles ; il n'exécute alors aucune action.
import type { ComponentChildren } from 'preact';
import { Icone, type NomIcone } from '../../icones';

export type VarianteBouton = 'primaire' | 'secondaire' | 'tertiaire' | 'danger';

interface ProprietesBouton {
  children: ComponentChildren;
  onClick?: () => void;
  variante?: VarianteBouton;
  icone?: NomIcone;
  /** Masque le texte (il reste lu par les lecteurs d'écran) : bouton « icône seule ». */
  iconeSeule?: boolean;
  desactive?: boolean;
  /** Raison affichée en infobulle native quand le bouton est désactivé. */
  raisonDesactivation?: string;
  type?: 'button' | 'submit';
}

export function Bouton({
  children,
  onClick,
  variante = 'primaire',
  icone,
  iconeSeule = false,
  desactive = false,
  raisonDesactivation,
  type = 'button',
}: ProprietesBouton) {
  const activer = () => {
    if (!desactive) onClick?.();
  };
  return (
    <button
      type={type}
      class={`sg-bouton sg-bouton--${variante}${iconeSeule ? ' sg-bouton--icone-seule' : ''}`}
      aria-disabled={desactive ? true : undefined}
      title={desactive ? raisonDesactivation : undefined}
      onClick={activer}
    >
      {icone && <Icone nom={icone} />}
      <span class={iconeSeule ? 'sg-masque' : undefined}>{children}</span>
    </button>
  );
}
