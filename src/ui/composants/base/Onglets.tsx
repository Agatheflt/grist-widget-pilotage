// Onglets (UX-001) selon le motif ARIA « tabs » : flèches gauche/droite pour changer d'onglet,
// Début/Fin pour le premier/dernier ; seul l'onglet actif est dans l'ordre de tabulation.
import type { ComponentChildren } from 'preact';
import { useId, useRef } from 'preact/hooks';

export interface DefinitionOnglet {
  id: string;
  libelle: string;
}

interface ProprietesOnglets {
  libelle: string;
  onglets: DefinitionOnglet[];
  actif: string;
  onChange: (id: string) => void;
  /** Contenu de l'onglet actif. */
  children: ComponentChildren;
}

export function Onglets({ libelle, onglets, actif, onChange, children }: ProprietesOnglets) {
  const base = useId();
  const boutons = useRef<(HTMLButtonElement | null)[]>([]);

  const activer = (index: number) => {
    const onglet = onglets[index];
    if (!onglet) return;
    onChange(onglet.id);
    boutons.current[index]?.focus();
  };

  const auClavier = (evenement: KeyboardEvent, index: number) => {
    const dernier = onglets.length - 1;
    const cibles: Record<string, number> = {
      ArrowRight: index === dernier ? 0 : index + 1,
      ArrowLeft: index === 0 ? dernier : index - 1,
      Home: 0,
      End: dernier,
    };
    const cible = cibles[evenement.key];
    if (cible === undefined) return;
    evenement.preventDefault();
    activer(cible);
  };

  return (
    <div class="sg-onglets">
      <div class="sg-onglets__liste" role="tablist" aria-label={libelle}>
        {onglets.map((onglet, index) => {
          const estActif = onglet.id === actif;
          return (
            <button
              key={onglet.id}
              ref={(element) => {
                boutons.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`${base}-onglet-${onglet.id}`}
              class="sg-onglets__onglet"
              aria-selected={estActif}
              aria-controls={`${base}-panneau`}
              tabIndex={estActif ? 0 : -1}
              onClick={() => activer(index)}
              onKeyDown={(evenement) => auClavier(evenement, index)}
            >
              {onglet.libelle}
            </button>
          );
        })}
      </div>
      <div
        class="sg-onglets__panneau"
        role="tabpanel"
        id={`${base}-panneau`}
        aria-labelledby={`${base}-onglet-${actif}`}
        tabIndex={0}
      >
        {children}
      </div>
    </div>
  );
}
