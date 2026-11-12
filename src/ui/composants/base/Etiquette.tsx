// Étiquette (filtre actif) ; avec onRetirer, elle devient un bouton « Retirer le filtre … ».
import { Icone } from '../../icones';

interface ProprietesEtiquette {
  libelle: string;
  onRetirer?: () => void;
}

export function Etiquette({ libelle, onRetirer }: ProprietesEtiquette) {
  if (!onRetirer) return <span class="sg-etiquette">{libelle}</span>;
  return (
    <button type="button" class="sg-etiquette sg-etiquette--retirable" onClick={onRetirer}>
      {libelle}
      <Icone nom="fermer" />
      <span class="sg-masque">(retirer le filtre)</span>
    </button>
  );
}
