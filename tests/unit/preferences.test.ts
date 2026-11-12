// Préférences d'affichage (TECH-003, ERR-13, TEST-U-PRF-01).
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ecrirePreference, lirePreference } from '../../src/store/preferences';

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe('préférences', () => {
  it('renvoie la valeur par défaut quand rien n’est enregistré', () => {
    expect(lirePreference('theme', 'clair')).toBe('clair');
  });

  it('enregistre puis relit une préférence', () => {
    ecrirePreference('theme', 'sombre');
    expect(lirePreference('theme', 'clair')).toBe('sombre');
  });

  it('fonctionne sans erreur quand le stockage local est indisponible', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('stockage indisponible');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('stockage indisponible');
    });
    expect(() => ecrirePreference('theme', 'sombre')).not.toThrow();
    expect(lirePreference('theme', 'clair')).toBe('clair');
  });
});
