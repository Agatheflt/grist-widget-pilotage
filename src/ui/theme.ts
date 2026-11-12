// Thème clair / sombre du widget (DEC-029) : clair par défaut, interrupteur « Mode sombre ».
// Les couleurs sombres viennent des variables du DSFR, activées par l'attribut data-fr-theme.
import { ecrirePreference, lirePreference } from '../store/preferences';

export type Theme = 'clair' | 'sombre';

const CLE_PREFERENCE = 'theme';

/** Thème mémorisé sur le poste, clair par défaut. */
export function themeEnregistre(): Theme {
  return lirePreference(CLE_PREFERENCE, 'clair') === 'sombre' ? 'sombre' : 'clair';
}

/** Applique le thème à la page (attributs lus par le DSFR et par le navigateur). */
export function appliquerTheme(theme: Theme, racine: HTMLElement = document.documentElement): void {
  const valeurDsfr = theme === 'sombre' ? 'dark' : 'light';
  racine.setAttribute('data-fr-theme', valeurDsfr);
  racine.style.colorScheme = valeurDsfr;
}

/** Applique le thème et le mémorise. */
export function choisirTheme(theme: Theme): void {
  appliquerTheme(theme);
  ecrirePreference(CLE_PREFERENCE, theme);
}
