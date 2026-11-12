// Point d'entrée : charge l'identité visuelle, applique le thème, affiche l'application.

// Couleurs (variables, thèmes clair et sombre) et police Marianne du DSFR, sans ses composants (DEC-008).
import '@gouvfr/dsfr/dist/core/core.min.css';
import '@gouvfr/dsfr/dist/scheme/scheme.min.css';
// Styles du projet, adossés aux variables du DSFR.
import './styles/variables.css';
import './styles/base.css';
import './styles/composants.css';

import { render } from 'preact';
import { App } from './ui/App';
import { appliquerTheme, themeEnregistre } from './ui/theme';

// Le thème mémorisé est appliqué avant l'affichage pour limiter le « flash » de couleur.
appliquerTheme(themeEnregistre());

const conteneur = document.getElementById('application');

if (conteneur) {
  render(<App />, conteneur);
}
