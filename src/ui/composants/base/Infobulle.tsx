// Infobulle d'aide : un bouton « ? » affiche le texte au survol ET au focus clavier ; Échap la masque.
// Le texte est relié au bouton par aria-describedby : il est lu par les lecteurs d'écran.
import { useId, useState } from 'preact/hooks';
import { Icone } from '../../icones';

interface ProprietesInfobulle {
  /** Sujet de l'aide, lu avec le bouton (ex. « Aide : avancement »). */
  sujet: string;
  texte: string;
}

export function Infobulle({ sujet, texte }: ProprietesInfobulle) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return (
    <span class="sg-infobulle">
      <button
        type="button"
        class="sg-infobulle__declencheur"
        aria-describedby={id}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        onKeyDown={(evenement) => {
          if (evenement.key === 'Escape') setVisible(false);
        }}
      >
        <Icone nom="info" />
        <span class="sg-masque">Aide : {sujet}</span>
      </button>
      <span role="tooltip" id={id} class="sg-infobulle__texte" hidden={!visible}>
        {texte}
      </span>
    </span>
  );
}
