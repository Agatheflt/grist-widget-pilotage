// Vérifie l'affichage du composant racine.
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { App } from '../../src/ui/App';

describe('App', () => {
  it('affiche le titre du widget', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Pilotage de la stratégie SIGNAL — initialisation' }),
    ).toBeTruthy();
  });
});
