// Interrupteur « Mode sombre » (DEC-029, UX-022, UX-023).
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { InterrupteurTheme } from '../../src/ui/composants/base/InterrupteurTheme';

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  document.documentElement.removeAttribute('data-fr-theme');
});

describe('InterrupteurTheme', () => {
  it('est un interrupteur accessible, désactivé par défaut', () => {
    render(<InterrupteurTheme />);
    const interrupteur = screen.getByRole('switch', { name: 'Mode sombre' });
    expect(interrupteur.getAttribute('aria-checked')).toBe('false');
  });

  it('active le mode sombre puis revient au mode clair', () => {
    render(<InterrupteurTheme />);
    const interrupteur = screen.getByRole('switch', { name: 'Mode sombre' });

    fireEvent.click(interrupteur);
    expect(interrupteur.getAttribute('aria-checked')).toBe('true');
    expect(document.documentElement.getAttribute('data-fr-theme')).toBe('dark');

    fireEvent.click(interrupteur);
    expect(interrupteur.getAttribute('aria-checked')).toBe('false');
    expect(document.documentElement.getAttribute('data-fr-theme')).toBe('light');
  });

  it('reprend le choix mémorisé', () => {
    window.localStorage.setItem('pilotage-signal:theme', 'sombre');
    render(<InterrupteurTheme />);
    expect(screen.getByRole('switch', { name: 'Mode sombre' }).getAttribute('aria-checked')).toBe('true');
  });
});
