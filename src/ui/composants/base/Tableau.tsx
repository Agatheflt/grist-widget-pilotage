// Tableau triable (docs/07 §2, §6) : titre (caption), en-têtes de colonnes avec scope,
// tri par bouton dans l'en-tête et état de tri annoncé par aria-sort.
import type { ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';
import { Icone } from '../../icones';

export interface ColonneTableau {
  cle: string;
  libelle: string;
  triable?: boolean;
}

export interface LigneTableau {
  id: string;
  /** Contenu affiché de chaque colonne. */
  cellules: Record<string, ComponentChildren>;
  /** Valeurs utilisées pour le tri (sinon le contenu affiché, s'il s'agit de texte ou de nombre). */
  valeurs?: Record<string, string | number>;
}

interface ProprietesTableau {
  titre: string;
  colonnes: ColonneTableau[];
  lignes: LigneTableau[];
  /** Message affiché quand il n'y a aucune ligne (UX-007). */
  messageVide?: string;
}

type Sens = 'ascending' | 'descending';

function valeurTri(ligne: LigneTableau, cle: string): string | number {
  const valeur = ligne.valeurs?.[cle] ?? ligne.cellules[cle];
  return typeof valeur === 'number' || typeof valeur === 'string' ? valeur : '';
}

/** Trie une copie des lignes ; les textes sont comparés à la française (accents, majuscules). */
export function trierLignes(lignes: LigneTableau[], cle: string, sens: Sens): LigneTableau[] {
  const facteur = sens === 'ascending' ? 1 : -1;
  return [...lignes].sort((a, b) => {
    const va = valeurTri(a, cle);
    const vb = valeurTri(b, cle);
    const ordre =
      typeof va === 'number' && typeof vb === 'number'
        ? va - vb
        : String(va).localeCompare(String(vb), 'fr', { sensitivity: 'base', numeric: true });
    return ordre * facteur;
  });
}

export function Tableau({ titre, colonnes, lignes, messageVide = 'Aucun élément.' }: ProprietesTableau) {
  const [tri, setTri] = useState<{ cle: string; sens: Sens } | null>(null);
  const affichees = tri ? trierLignes(lignes, tri.cle, tri.sens) : lignes;

  const trierPar = (cle: string) => {
    const sens: Sens = tri?.cle === cle && tri.sens === 'ascending' ? 'descending' : 'ascending';
    setTri({ cle, sens });
  };

  return (
    <div class="sg-tableau">
      <table>
        <caption class="sg-tableau__titre">{titre}</caption>
        <thead>
          <tr>
            {colonnes.map((colonne) => {
              const sens = tri?.cle === colonne.cle ? tri.sens : undefined;
              return (
                <th key={colonne.cle} scope="col" aria-sort={colonne.triable ? (sens ?? 'none') : undefined}>
                  {colonne.triable ? (
                    <button type="button" class="sg-tableau__tri" onClick={() => trierPar(colonne.cle)}>
                      {colonne.libelle}
                      {sens && <Icone nom={sens === 'ascending' ? 'fleche-haut' : 'fleche-bas'} />}
                    </button>
                  ) : (
                    colonne.libelle
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {affichees.length === 0 ? (
            <tr>
              <td colSpan={colonnes.length} class="sg-tableau__vide">
                {messageVide}
              </td>
            </tr>
          ) : (
            affichees.map((ligne) => (
              <tr key={ligne.id}>
                {colonnes.map((colonne) => (
                  <td key={colonne.cle}>{ligne.cellules[colonne.cle]}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
