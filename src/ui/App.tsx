// Composant racine de l'interface.
// T1.03 : barre supérieure avec l'interrupteur « Mode sombre » ; la coquille complète arrive en T1.10.
import { NOM_WIDGET, VERSION } from '../config';
import { InterrupteurTheme } from './composants/base/InterrupteurTheme';

export function App() {
  return (
    <div class="sg-application">
      <header class="sg-barre">
        <p class="sg-version">Version {VERSION}</p>
        <InterrupteurTheme />
      </header>
      <main class="sg-contenu">
        <h1 class="sg-barre__titre">{NOM_WIDGET} — initialisation</h1>
      </main>
    </div>
  );
}
