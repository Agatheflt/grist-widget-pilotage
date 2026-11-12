// Composants de structure : accordéon, indicateur d'étapes et tuile (docs/07 §2).
import type { ComponentChildren } from 'preact';
import { useId, useState } from 'preact/hooks';
import { Icone } from '../../icones';

interface ProprietesAccordeon {
  titre: ComponentChildren;
  ouvertParDefaut?: boolean;
  children: ComponentChildren;
}

/** Accordéon : bouton avec aria-expanded qui affiche ou masque son contenu. */
export function Accordeon({ titre, ouvertParDefaut = false, children }: ProprietesAccordeon) {
  const id = useId();
  const [ouvert, setOuvert] = useState(ouvertParDefaut);
  return (
    <div class="sg-accordeon">
      <h3 class="sg-accordeon__titre">
        <button
          type="button"
          class="sg-accordeon__bouton"
          aria-expanded={ouvert}
          aria-controls={id}
          onClick={() => setOuvert(!ouvert)}
        >
          <span>{titre}</span>
          <Icone nom="chevron-bas" />
        </button>
      </h3>
      <div id={id} class="sg-accordeon__contenu" hidden={!ouvert}>
        {children}
      </div>
    </div>
  );
}

interface ProprietesEtapes {
  etapes: string[];
  /** Numéro de l'étape en cours, à partir de 1. */
  courante: number;
}

/** Indicateur d'étapes d'un assistant (ex. clôture de sprint). */
export function IndicateurEtapes({ etapes, courante }: ProprietesEtapes) {
  const suivante = etapes[courante];
  return (
    <div class="sg-etapes">
      <p class="sg-etapes__titre">
        <span class="sg-etapes__numero">
          Étape {courante} sur {etapes.length}
        </span>{' '}
        {etapes[courante - 1]}
      </p>
      <div class="sg-etapes__barre" aria-hidden="true">
        {etapes.map((etape, index) => (
          <span
            key={etape}
            class={`sg-etapes__segment${index < courante ? ' sg-etapes__segment--fait' : ''}`}
          />
        ))}
      </div>
      {suivante && <p class="sg-etapes__suivante">Étape suivante : {suivante}</p>}
    </div>
  );
}

interface ProprietesTuile {
  titre: string;
  onActiver: () => void;
  children?: ComponentChildren;
}

/** Tuile cliquable (ex. un chantier dans le cockpit) : toute la surface active le bouton du titre. */
export function Tuile({ titre, onActiver, children }: ProprietesTuile) {
  return (
    <div class="sg-tuile">
      <h3 class="sg-tuile__titre">
        <button type="button" class="sg-tuile__bouton" onClick={onActiver}>
          {titre}
        </button>
      </h3>
      {children && <div class="sg-tuile__contenu">{children}</div>}
    </div>
  );
}
