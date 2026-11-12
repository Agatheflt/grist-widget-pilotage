// Modale (UX-004, UX-005) : élément <dialog> natif ouvert avec showModal(), qui bloque le reste de la page.
// Échap ferme la modale ; à la fermeture, le focus revient sur l'élément qui l'avait ouverte (docs/07 §6).
import type { ComponentChildren } from 'preact';
import { useEffect, useId, useRef } from 'preact/hooks';
import { Icone } from '../../icones';
import { Bouton } from './Bouton';

interface ProprietesModale {
  ouverte: boolean;
  titre: string;
  onFermer: () => void;
  children: ComponentChildren;
  /** Boutons du pied de modale ; le bouton principal en dernier. */
  actions?: ComponentChildren;
}

export function Modale({ ouverte, titre, onFermer, children, actions }: ProprietesModale) {
  const idTitre = useId();
  const dialogue = useRef<HTMLDialogElement>(null);
  const declencheur = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = dialogue.current;
    if (!element) return;
    if (ouverte && !element.open) {
      declencheur.current = document.activeElement as HTMLElement | null;
      if (typeof element.showModal === 'function') element.showModal();
      else element.setAttribute('open', ''); // navigateur ou environnement de test sans showModal
      element.querySelector<HTMLElement>('button, input, select, textarea, [tabindex]')?.focus();
    } else if (!ouverte && element.open) {
      if (typeof element.close === 'function') element.close();
      else element.removeAttribute('open');
      declencheur.current?.focus();
    }
  }, [ouverte]);

  const auClavier = (evenement: KeyboardEvent) => {
    if (evenement.key === 'Escape') {
      evenement.preventDefault();
      onFermer();
    }
  };

  return (
    <dialog
      ref={dialogue}
      class="sg-modale"
      aria-labelledby={idTitre}
      onKeyDown={auClavier}
      onCancel={(evenement) => {
        // Échap natif : on laisse le composant parent décider de la fermeture.
        evenement.preventDefault();
        onFermer();
      }}
    >
      <div class="sg-modale__entete">
        <h2 class="sg-modale__titre" id={idTitre}>
          {titre}
        </h2>
        <button type="button" class="sg-modale__fermer" onClick={onFermer}>
          <Icone nom="fermer" />
          <span class="sg-masque">Fermer la fenêtre « {titre} »</span>
        </button>
      </div>
      <div class="sg-modale__corps">{children}</div>
      {actions && <div class="sg-modale__actions">{actions}</div>}
    </dialog>
  );
}

interface ProprietesConfirmation {
  ouverte: boolean;
  titre: string;
  /** Conséquence de l'action, en clair (UX-005). */
  message: ComponentChildren;
  libelleConfirmer: string;
  onConfirmer: () => void;
  onAnnuler: () => void;
  /** Action destructrice (suppression, archivage…) : bouton de confirmation en style « danger ». */
  danger?: boolean;
}

/** Modale de confirmation d'une action irréversible ou importante (UX-005). */
export function ModaleConfirmation({
  ouverte,
  titre,
  message,
  libelleConfirmer,
  onConfirmer,
  onAnnuler,
  danger,
}: ProprietesConfirmation) {
  return (
    <Modale
      ouverte={ouverte}
      titre={titre}
      onFermer={onAnnuler}
      actions={
        <>
          <Bouton variante="secondaire" onClick={onAnnuler}>
            Annuler
          </Bouton>
          <Bouton variante={danger ? 'danger' : 'primaire'} onClick={onConfirmer}>
            {libelleConfirmer}
          </Bouton>
        </>
      }
    >
      <p>{message}</p>
    </Modale>
  );
}
