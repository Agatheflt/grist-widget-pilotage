// Préférences d'affichage mémorisées sur le poste (TECH-003).
// Le stockage local peut être indisponible (navigation privée, Widget Creator de Grist) :
// chaque accès est protégé et le widget fonctionne alors avec les valeurs par défaut (ERR-13).

const PREFIXE = 'pilotage-signal:';

/** Lit une préférence ; renvoie la valeur par défaut si elle est absente ou illisible. */
export function lirePreference(cle: string, parDefaut: string): string {
  try {
    return window.localStorage.getItem(PREFIXE + cle) ?? parDefaut;
  } catch {
    return parDefaut;
  }
}

/** Enregistre une préférence ; ne fait rien si le stockage local est indisponible. */
export function ecrirePreference(cle: string, valeur: string): void {
  try {
    window.localStorage.setItem(PREFIXE + cle, valeur);
  } catch {
    // Stockage indisponible : la préférence ne sera simplement pas mémorisée.
  }
}
