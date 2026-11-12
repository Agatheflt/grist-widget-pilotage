// Pagination (TECH-142) : navigation dans les listes de plus de 200 lignes.
import { Icone } from '../../icones';

/**
 * Pages à afficher : toujours la première, la dernière, la page courante et ses voisines ;
 * « null » représente des pages masquées (« … »).
 */
export function pagesAffichees(courante: number, total: number): (number | null)[] {
  const pages = new Set([1, total, courante - 1, courante, courante + 1]);
  const triees = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
  const resultat: (number | null)[] = [];
  triees.forEach((page, index) => {
    const precedente = triees[index - 1];
    if (precedente !== undefined && page - precedente > 1) resultat.push(null);
    resultat.push(page);
  });
  return resultat;
}

interface ProprietesPagination {
  page: number;
  nbPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, nbPages, onChange }: ProprietesPagination) {
  if (nbPages <= 1) return null;
  return (
    <nav class="sg-pagination" aria-label="Pagination">
      <ul class="sg-pagination__liste">
        <li>
          <button
            type="button"
            class="sg-pagination__page"
            disabled={page === 1}
            onClick={() => onChange(page - 1)}
          >
            <Icone nom="chevron-gauche" />
            <span class="sg-masque">Page précédente</span>
          </button>
        </li>
        {pagesAffichees(page, nbPages).map((numero, index) =>
          numero === null ? (
            <li key={`trou-${index}`} aria-hidden="true" class="sg-pagination__trou">
              …
            </li>
          ) : (
            <li key={numero}>
              <button
                type="button"
                class="sg-pagination__page"
                aria-label={`Page ${numero}`}
                aria-current={numero === page ? 'page' : undefined}
                onClick={() => onChange(numero)}
              >
                {numero}
              </button>
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            class="sg-pagination__page"
            disabled={page === nbPages}
            onClick={() => onChange(page + 1)}
          >
            <Icone nom="chevron-droite" />
            <span class="sg-masque">Page suivante</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
