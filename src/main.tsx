// Point d'entrée : affiche l'application dans la page.
import { render } from 'preact';
import { App } from './ui/App';

const conteneur = document.getElementById('application');

if (conteneur) {
  render(<App />, conteneur);
}
