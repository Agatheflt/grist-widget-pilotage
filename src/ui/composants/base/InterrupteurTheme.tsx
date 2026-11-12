// Interrupteur « Mode sombre » (DEC-029).
// Bouton natif avec le rôle ARIA « switch » : utilisable au clavier (Entrée, Espace)
// et annoncé « activé / désactivé » par les lecteurs d'écran.
import { useState } from 'preact/hooks';
import { choisirTheme, themeEnregistre } from '../../theme';

export function InterrupteurTheme() {
  const [sombre, setSombre] = useState(themeEnregistre() === 'sombre');

  const basculer = () => {
    const nouveau = !sombre;
    setSombre(nouveau);
    choisirTheme(nouveau ? 'sombre' : 'clair');
  };

  return (
    <button type="button" role="switch" aria-checked={sombre} class="sg-interrupteur" onClick={basculer}>
      <span class="sg-interrupteur__piste" aria-hidden="true"></span>
      Mode sombre
    </button>
  );
}
