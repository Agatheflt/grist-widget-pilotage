// Alerte (UX-006) : message de succès, d'information, d'avertissement ou d'erreur.
// Les erreurs sont annoncées immédiatement (role="alert"), les autres poliment (role="status").
import type { ComponentChildren } from 'preact';
import { Icone, type NomIcone } from '../../icones';

export type TypeAlerte = 'succes' | 'info' | 'avertissement' | 'erreur';

const ICONES: Record<TypeAlerte, NomIcone> = {
  succes: 'succes',
  info: 'info',
  avertissement: 'avertissement',
  erreur: 'erreur',
};

const LIBELLES: Record<TypeAlerte, string> = {
  succes: 'Succès',
  info: 'Information',
  avertissement: 'Attention',
  erreur: 'Erreur',
};

interface ProprietesAlerte {
  type: TypeAlerte;
  titre: string;
  children?: ComponentChildren;
  /** Si fourni, affiche un bouton « Fermer ». */
  onFermer?: () => void;
}

export function Alerte({ type, titre, children, onFermer }: ProprietesAlerte) {
  return (
    <div class={`sg-alerte sg-alerte--${type}`} role={type === 'erreur' ? 'alert' : 'status'}>
      <span class="sg-alerte__icone">
        <Icone nom={ICONES[type]} titre={LIBELLES[type]} />
      </span>
      <div class="sg-alerte__corps">
        <p class="sg-alerte__titre">{titre}</p>
        {children && <div class="sg-alerte__texte">{children}</div>}
      </div>
      {onFermer && (
        <button type="button" class="sg-alerte__fermer" onClick={onFermer}>
          <Icone nom="fermer" />
          <span class="sg-masque">Fermer le message « {titre} »</span>
        </button>
      )}
    </div>
  );
}
