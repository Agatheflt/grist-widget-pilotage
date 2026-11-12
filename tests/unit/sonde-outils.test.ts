// Tests des fonctions utilitaires de la sonde Grist (T1.02).
import { describe, expect, it } from 'vitest';
import {
  actionsCreationTables,
  actionsSuppressionTables,
  afficherValeurRelue,
  colonne,
  compterLignes,
  dateEnSecondesUTC,
  decrireFormatTable,
  decrireValeur,
  formaterRapport,
  TABLES_SONDE,
} from '../../outils/sonde-grist/outils';

describe('dateEnSecondesUTC', () => {
  it('convertit une date en secondes à minuit UTC', () => {
    expect(dateEnSecondesUTC('1970-01-02')).toBe(86400);
    expect(dateEnSecondesUTC('2027-03-20')).toBe(Date.UTC(2027, 2, 20) / 1000);
  });

  it('refuse une date mal formée', () => {
    expect(() => dateEnSecondesUTC('20/03/2027')).toThrow('Date invalide');
  });
});

describe('decrireValeur', () => {
  it('décrit la forme sans révéler le contenu', () => {
    expect(decrireValeur(null)).toBe('null');
    expect(decrireValeur('texte secret')).toBe('string');
    expect(decrireValeur(12)).toBe('number');
    expect(decrireValeur(['L', 1, 2])).toBe("liste encodée ['L', …] de 2 élément(s)");
    expect(decrireValeur([1, 2, 3])).toBe('tableau de 3 élément(s)');
    expect(decrireValeur(new Date(0))).toBe('objet Date JavaScript');
    expect(decrireValeur({ a: 1 })).toBe('objet (clés : a)');
  });
});

describe('lecture des tables', () => {
  const tableColonnes = { id: [1, 2], Titre: ['a', 'b'] };

  it('reconnaît le format colonnes et le format lignes', () => {
    expect(decrireFormatTable(tableColonnes)).toBe('format colonnes : 2 colonne(s) [id, Titre], 2 ligne(s)');
    expect(decrireFormatTable([{ id: 1 }])).toBe('format lignes : 1 ligne(s)');
    expect(decrireFormatTable(5)).toBe('format inattendu : number');
  });

  it('compte les lignes et lit une colonne', () => {
    expect(compterLignes(tableColonnes)).toBe(2);
    expect(compterLignes([{}, {}, {}])).toBe(3);
    expect(compterLignes(null)).toBe(0);
    expect(colonne(tableColonnes, 'Titre')).toEqual(['a', 'b']);
    expect(colonne(tableColonnes, 'Absente')).toEqual([]);
  });
});

describe('actions de la sonde', () => {
  it('crée uniquement des tables préfixées « Sonde »', () => {
    const tablesCreees = actionsCreationTables()
      .filter((action) => action[0] === 'AddTable')
      .map((action) => action[1]);
    expect(tablesCreees).toEqual([...TABLES_SONDE]);
  });

  it('supprime toutes les tables « Sonde… », doublons compris, et elles seules', () => {
    const tables = ['Test_table', ...TABLES_SONDE, 'SondeTest2', 'Actions'];
    expect(actionsSuppressionTables(tables).map((action) => action[1])).toEqual([
      'SondeTest2',
      ...[...TABLES_SONDE].reverse(),
    ]);
  });

  it('ne supprime rien quand il n’y a aucune table de test', () => {
    expect(actionsSuppressionTables(['Test_table'])).toEqual([]);
  });
});

describe('afficherValeurRelue', () => {
  it('masque le contenu des textes', () => {
    expect(afficherValeurRelue('Nom Réel')).toBe('string de 8 caractère(s) (contenu masqué)');
  });

  it('affiche les autres valeurs', () => {
    expect(afficherValeurRelue(['L', 7, 8])).toBe('liste encodée [\'L\', …] de 2 élément(s) = ["L",7,8]');
    expect(afficherValeurRelue(12.5)).toBe('number = 12.5');
  });
});

describe('formaterRapport', () => {
  it('liste les essais avec leur statut', () => {
    const rapport = formaterRapport(
      [{ essai: 'VAL-03', statut: 'OK', message: 'format colonnes', heure: '10:00:00' }],
      '0.1.0',
    );
    expect(rapport).toBe(
      'Rapport de la sonde Grist (widget v0.1.0)\n[10:00:00] VAL-03 — OK — format colonnes',
    );
  });
});
