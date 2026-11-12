// Cases à cocher, boutons radio, contrôle segmenté et interrupteur (docs/07 §2).
// Ce sont des éléments natifs mis en forme : ils restent accessibles au clavier et aux lecteurs d'écran.
import type { ComponentChildren } from 'preact';
import { useId } from 'preact/hooks';
import type { OptionListe } from './Champ';

interface ProprietesCaseACocher {
  libelle: string;
  coche: boolean;
  onChange: (coche: boolean) => void;
  desactive?: boolean;
}

export function CaseACocher({ libelle, coche, onChange, desactive }: ProprietesCaseACocher) {
  const id = useId();
  return (
    <div class="sg-choix">
      <input
        id={id}
        type="checkbox"
        class="sg-choix__case"
        checked={coche}
        disabled={desactive}
        onChange={(evenement) => onChange(evenement.currentTarget.checked)}
      />
      <label for={id}>{libelle}</label>
    </div>
  );
}

interface ProprietesGroupeRadio {
  legende: string;
  valeur: string;
  onChange: (valeur: string) => void;
  options: OptionListe[];
  /** Affichage en ligne compacte (« contrôle segmenté »), pour 2 à 4 options courtes. */
  segmente?: boolean;
  erreur?: string;
}

export function GroupeRadio({ legende, valeur, onChange, options, segmente, erreur }: ProprietesGroupeRadio) {
  const nom = useId();
  return (
    <fieldset class={`sg-groupe${segmente ? ' sg-groupe--segmente' : ''}`}>
      <legend class="sg-groupe__legende">{legende}</legend>
      <div class="sg-groupe__options">
        {options.map((option) => {
          const id = `${nom}-${option.valeur}`;
          return (
            <div class="sg-choix" key={option.valeur}>
              <input
                id={id}
                type="radio"
                class="sg-choix__radio"
                name={nom}
                value={option.valeur}
                checked={valeur === option.valeur}
                onChange={() => onChange(option.valeur)}
              />
              <label for={id}>{option.libelle}</label>
            </div>
          );
        })}
      </div>
      {erreur && <p class="sg-champ__erreur">{erreur}</p>}
    </fieldset>
  );
}

/** Contrôle segmenté : groupe de boutons radio affiché en ligne (ex. Liste / Kanban). */
export function ControleSegmente(props: Omit<ProprietesGroupeRadio, 'segmente'>) {
  return <GroupeRadio {...props} segmente />;
}

interface ProprietesInterrupteur {
  libelle: ComponentChildren;
  active: boolean;
  onChange: (active: boolean) => void;
}

/** Interrupteur marche/arrêt : bouton natif avec le rôle « switch » (activé / désactivé). */
export function Interrupteur({ libelle, active, onChange }: ProprietesInterrupteur) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      class="sg-interrupteur"
      onClick={() => onChange(!active)}
    >
      <span class="sg-interrupteur__piste" aria-hidden="true"></span>
      {libelle}
    </button>
  );
}
