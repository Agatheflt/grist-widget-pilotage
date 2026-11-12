// Thème clair / sombre (DEC-029, UX-023).
import { afterEach, describe, expect, it } from 'vitest';
import { appliquerTheme, choisirTheme, themeEnregistre } from '../../src/ui/theme';

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute('data-fr-theme');
});

describe('thème', () => {
  it('est clair par défaut', () => {
    expect(themeEnregistre()).toBe('clair');
  });

  it('applique les attributs attendus par le DSFR et le navigateur', () => {
    appliquerTheme('sombre');
    expect(document.documentElement.getAttribute('data-fr-theme')).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
    appliquerTheme('clair');
    expect(document.documentElement.getAttribute('data-fr-theme')).toBe('light');
  });

  it('mémorise le thème choisi', () => {
    choisirTheme('sombre');
    expect(themeEnregistre()).toBe('sombre');
  });
});
