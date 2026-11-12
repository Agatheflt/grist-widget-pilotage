// Bandeau d'information permanent (UX-008) : lecture seule, saison clôturée, mode démonstration.
import type { ComponentChildren } from 'preact';
import { Icone } from '../../icones';

export function Bandeau({ children }: { children: ComponentChildren }) {
  return (
    <div class="sg-bandeau" role="note">
      <Icone nom="info" />
      <p class="sg-bandeau__texte">{children}</p>
    </div>
  );
}
