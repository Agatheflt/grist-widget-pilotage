// Composant racine de l'interface.
// Tâche T1.01 : simple page d'accueil ; la coquille complète arrive en T1.10.
import { NOM_WIDGET, VERSION } from '../config';

export function App() {
  return (
    <main>
      <h1>{NOM_WIDGET} — initialisation</h1>
      <p>Version {VERSION}</p>
    </main>
  );
}
