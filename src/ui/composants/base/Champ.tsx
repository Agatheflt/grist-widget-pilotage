// Champs de formulaire (docs/07 §2, docs/07 §6) : étiquette visible liée au champ, texte d'aide
// et message d'erreur reliés par aria-describedby, état d'erreur annoncé par aria-invalid.
import type { ComponentChildren } from 'preact';
import { useId } from 'preact/hooks';

interface ProprietesCommunes {
  libelle: string;
  aide?: string;
  erreur?: string;
  obligatoire?: boolean;
  desactive?: boolean;
}

/** Cadre commun : étiquette, champ, aide et erreur. */
function CadreChamp({
  id,
  libelle,
  aide,
  erreur,
  obligatoire,
  children,
}: ProprietesCommunes & { id: string; children: ComponentChildren }) {
  return (
    <div class={`sg-champ${erreur ? ' sg-champ--erreur' : ''}`}>
      <label class="sg-champ__libelle" for={id}>
        {libelle}
        {obligatoire && (
          <span class="sg-champ__obligatoire" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {aide && (
        <p class="sg-champ__aide" id={`${id}-aide`}>
          {aide}
        </p>
      )}
      {children}
      {erreur && (
        <p class="sg-champ__erreur" id={`${id}-erreur`}>
          {erreur}
        </p>
      )}
    </div>
  );
}

/** Identifiants des textes qui décrivent le champ (aide puis erreur). */
function descriptions(id: string, aide?: string, erreur?: string): string | undefined {
  const liste = [aide ? `${id}-aide` : '', erreur ? `${id}-erreur` : ''].filter(Boolean);
  return liste.length > 0 ? liste.join(' ') : undefined;
}

interface ProprietesChampTexte extends ProprietesCommunes {
  valeur: string;
  onChange: (valeur: string) => void;
  /** Texte, date (AAAA-MM-JJ) ou nombre : le navigateur fournit le clavier et le sélecteur adaptés. */
  type?: 'text' | 'date' | 'number' | 'email';
}

export function ChampTexte(props: ProprietesChampTexte) {
  const id = useId();
  const { valeur, onChange, type = 'text', aide, erreur, obligatoire, desactive } = props;
  return (
    <CadreChamp {...props} id={id}>
      <input
        id={id}
        class="sg-champ__saisie"
        // Les types de Preact distinguent chaque valeur de « type » ; les quatre valeurs permises ici
        // sont toutes des champs texte valides, d'où cette conversion.
        type={type as 'text'}
        value={valeur}
        required={obligatoire}
        disabled={desactive}
        aria-invalid={erreur ? true : undefined}
        aria-describedby={descriptions(id, aide, erreur)}
        onInput={(evenement) => onChange(evenement.currentTarget.value)}
      />
    </CadreChamp>
  );
}

interface ProprietesZoneTexte extends ProprietesCommunes {
  valeur: string;
  onChange: (valeur: string) => void;
  lignes?: number;
}

export function ZoneTexte(props: ProprietesZoneTexte) {
  const id = useId();
  const { valeur, onChange, lignes = 4, aide, erreur, obligatoire, desactive } = props;
  return (
    <CadreChamp {...props} id={id}>
      <textarea
        id={id}
        class="sg-champ__saisie"
        rows={lignes}
        value={valeur}
        required={obligatoire}
        disabled={desactive}
        aria-invalid={erreur ? true : undefined}
        aria-describedby={descriptions(id, aide, erreur)}
        onInput={(evenement) => onChange(evenement.currentTarget.value)}
      />
    </CadreChamp>
  );
}

export interface OptionListe {
  valeur: string;
  libelle: string;
}

interface ProprietesListeDeroulante extends ProprietesCommunes {
  valeur: string;
  onChange: (valeur: string) => void;
  options: OptionListe[];
  /** Texte de la première option vide (« Choisir… »). */
  invite?: string;
}

export function ListeDeroulante(props: ProprietesListeDeroulante) {
  const id = useId();
  const { valeur, onChange, options, invite, aide, erreur, obligatoire, desactive } = props;
  return (
    <CadreChamp {...props} id={id}>
      <select
        id={id}
        class="sg-champ__saisie sg-champ__liste"
        value={valeur}
        required={obligatoire}
        disabled={desactive}
        aria-invalid={erreur ? true : undefined}
        aria-describedby={descriptions(id, aide, erreur)}
        onChange={(evenement) => onChange(evenement.currentTarget.value)}
      >
        {invite !== undefined && <option value="">{invite}</option>}
        {options.map((option) => (
          <option key={option.valeur} value={option.valeur}>
            {option.libelle}
          </option>
        ))}
      </select>
    </CadreChamp>
  );
}
