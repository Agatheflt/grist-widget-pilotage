// Interrupteur « Mode sombre » (DEC-029) : applique et mémorise le thème choisi.
import { useState } from 'preact/hooks';
import { choisirTheme, themeEnregistre } from '../../theme';
import { Interrupteur } from './Choix';

export function InterrupteurTheme() {
  const [sombre, setSombre] = useState(themeEnregistre() === 'sombre');

  const basculer = (active: boolean) => {
    setSombre(active);
    choisirTheme(active ? 'sombre' : 'clair');
  };

  return <Interrupteur libelle="Mode sombre" active={sombre} onChange={basculer} />;
}
