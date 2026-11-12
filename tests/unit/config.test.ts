// Vérifie que les constantes générales sont correctes.
import { describe, expect, it } from 'vitest';
import { NOM_WIDGET, VERSION } from '../../src/config';
import { version } from '../../package.json';

describe('config', () => {
  it('porte le nom retenu pour le widget', () => {
    expect(NOM_WIDGET).toBe('Pilotage de la stratégie SIGNAL');
  });

  it('reprend la version de package.json', () => {
    expect(VERSION).toBe(version);
  });
});
