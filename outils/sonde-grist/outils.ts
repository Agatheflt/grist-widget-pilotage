// Fonctions utilitaires de la sonde Grist (tâche T1.02).
// Elles ne dépendent pas de Grist : elles sont testées dans tests/unit/sonde-outils.test.ts.

/** Une action Grist telle qu'envoyée à docApi.applyUserActions (ex. ["AddRecord", "Table", null, {...}]). */
export type ActionGrist = unknown[];

/** Statut d'un essai consigné dans le journal. */
export type Statut = 'OK' | 'ÉCHEC' | 'INFO' | 'À FAIRE';

/** Une ligne du journal de la sonde. */
export interface Entree {
  essai: string;
  statut: Statut;
  message: string;
  heure: string;
}

/** Préfixe des tables créées par la sonde : elles sont faciles à repérer et à supprimer. */
export const PREFIXE = 'Sonde';

/** Noms des tables de test, dans l'ordre de création. */
export const TABLES_SONDE = ['SondeEquipes', 'SondeTest', 'SondeSynchro', 'SondeProfils'] as const;

/**
 * Convertit une date « AAAA-MM-JJ » en secondes depuis le 1er janvier 1970, à minuit UTC.
 * C'est l'encodage supposé des colonnes Date de Grist (à confirmer par VAL-04).
 */
export function dateEnSecondesUTC(dateIso: string): number {
  const correspondance = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateIso);
  if (!correspondance) throw new Error(`Date invalide : ${dateIso}`);
  const [, annee, mois, jour] = correspondance;
  return Date.UTC(Number(annee), Number(mois) - 1, Number(jour)) / 1000;
}

/**
 * Décrit une valeur reçue de Grist sans afficher son contenu métier :
 * seulement son type et sa forme (ex. « liste encodée ['L', …] de 2 éléments »).
 */
export function decrireValeur(valeur: unknown): string {
  if (valeur === null) return 'null';
  if (valeur === undefined) return 'undefined';
  if (Array.isArray(valeur)) {
    const [code, ...reste] = valeur;
    if (typeof code === 'string' && code.length === 1) {
      return `liste encodée ['${code}', …] de ${reste.length} élément(s)`;
    }
    return `tableau de ${valeur.length} élément(s)`;
  }
  if (valeur instanceof Date) return 'objet Date JavaScript';
  if (typeof valeur === 'object') return `objet (clés : ${Object.keys(valeur).join(', ') || 'aucune'})`;
  return typeof valeur;
}

/**
 * Décrit la forme d'un résultat de docApi.fetchTable (VAL-03) :
 * format « colonnes » ({ id: [...], Col: [...] }) ou « lignes » ([{...}, ...]).
 */
export function decrireFormatTable(resultat: unknown): string {
  if (Array.isArray(resultat)) return `format lignes : ${resultat.length} ligne(s)`;
  if (resultat && typeof resultat === 'object') {
    const colonnes = Object.keys(resultat);
    const ids = (resultat as Record<string, unknown>).id;
    const nbLignes = Array.isArray(ids) ? ids.length : 'inconnu';
    return `format colonnes : ${colonnes.length} colonne(s) [${colonnes.join(', ')}], ${nbLignes} ligne(s)`;
  }
  return `format inattendu : ${decrireValeur(resultat)}`;
}

/** Nombre de lignes d'une table renvoyée par fetchTable (format colonnes ou lignes). */
export function compterLignes(resultat: unknown): number {
  if (Array.isArray(resultat)) return resultat.length;
  const ids = (resultat as Record<string, unknown> | null)?.id;
  return Array.isArray(ids) ? ids.length : 0;
}

/** Valeurs d'une colonne d'une table renvoyée par fetchTable au format colonnes. */
export function colonne(resultat: unknown, nom: string): unknown[] {
  const valeurs = (resultat as Record<string, unknown> | null)?.[nom];
  return Array.isArray(valeurs) ? valeurs : [];
}

/**
 * Actions de création des tables de test (VAL-01, VAL-04, VAL-11, VAL-16, VAL-17).
 * Les colonnes de déclenchement utilisent recalcWhen : 0 = à la création, 2 = à toute modification.
 * Premier essai (12/11/2026) : recalcWhen passé dans AddTable semble ignoré (MajLe ne change pas
 * après une modification). Il est donc aussi appliqué ensuite par ModifyColumn.
 */
export function actionsCreationTables(): ActionGrist[] {
  return [
    ['AddTable', 'SondeEquipes', [{ id: 'Nom', type: 'Text' }]],
    [
      'AddTable',
      'SondeTest',
      [
        { id: 'Titre', type: 'Text' },
        { id: 'Quand', type: 'Date' },
        { id: 'Fait', type: 'Bool' },
        { id: 'Nombre', type: 'Numeric' },
        { id: 'Etat', type: 'Choice', widgetOptions: JSON.stringify({ choices: ['À faire', 'Terminée'] }) },
        { id: 'Etiquettes', type: 'ChoiceList', widgetOptions: JSON.stringify({ choices: ['A', 'B', 'C'] }) },
        { id: 'Equipe', type: 'Ref:SondeEquipes' },
        { id: 'Equipes', type: 'RefList:SondeEquipes' },
        { id: 'CreeLe', type: 'DateTime:Europe/Paris', isFormula: false, formula: 'NOW()', recalcWhen: 0 },
        { id: 'CreePar', type: 'Text', isFormula: false, formula: 'user.Name', recalcWhen: 0 },
        { id: 'MajLe', type: 'DateTime:Europe/Paris', isFormula: false, formula: 'NOW()', recalcWhen: 2 },
        { id: 'Aujourdhui', type: 'Date', isFormula: true, formula: 'TODAY()' },
      ],
    ],
    ['ModifyColumn', 'SondeTest', 'MajLe', { recalcWhen: 2, recalcDeps: null }],
    [
      'AddTable',
      'SondeSynchro',
      [
        {
          id: 'Signature',
          type: 'Any',
          isFormula: true,
          formula:
            'lignes = SondeTest.all\n' +
            'derniere = max([r.MajLe for r in lignes if r.MajLe] or [None])\n' +
            'return "%d@%s" % (len(lignes), derniere)',
        },
      ],
    ],
    ['AddRecord', 'SondeSynchro', null, {}],
    ['AddTable', 'SondeProfils', [{ id: 'Courriel', type: 'Text' }]],
  ];
}

/**
 * Actions de suppression de toutes les tables de test présentes dans le document,
 * y compris les doublons créés par Grist (ex. « SondeTest2 »). Les autres tables ne sont jamais touchées.
 */
export function actionsSuppressionTables(tablesDuDocument: string[]): ActionGrist[] {
  return tablesDuDocument
    .filter((table) => table.startsWith(PREFIXE))
    .reverse()
    .map((table) => ['RemoveTable', table]);
}

/** Réglages de recalcul d'une colonne, lus dans _grist_Tables_column (VAL-11). */
export function reglagesRecalcul(
  colonnesDuDocument: unknown,
  tablesDuDocument: unknown,
  tableId: string,
  colId: string,
): string {
  const refTable = colonne(tablesDuDocument, 'id')[colonne(tablesDuDocument, 'tableId').indexOf(tableId)];
  const ids = colonne(colonnesDuDocument, 'colId');
  const parents = colonne(colonnesDuDocument, 'parentId');
  const position = ids.findIndex((id, i) => id === colId && parents[i] === refTable);
  if (position < 0) return 'colonne introuvable';
  const quand = colonne(colonnesDuDocument, 'recalcWhen')[position];
  const deps = colonne(colonnesDuDocument, 'recalcDeps')[position];
  return `recalcWhen = ${JSON.stringify(quand)}, recalcDeps = ${JSON.stringify(deps)}`;
}

/**
 * Texte affiché pour une valeur relue : les textes ne sont jamais affichés (ils peuvent contenir
 * un nom réel, comme la colonne CreePar), seulement leur longueur ; les autres valeurs le sont.
 */
export function afficherValeurRelue(valeur: unknown): string {
  if (typeof valeur === 'string') return `string de ${valeur.length} caractère(s) (contenu masqué)`;
  return `${decrireValeur(valeur)} = ${JSON.stringify(valeur)}`;
}

/** Met en forme le rapport à copier pour Claude Code : seulement les résultats, sans données du document. */
export function formaterRapport(entrees: Entree[], version: string): string {
  const lignes = entrees.map((e) => `[${e.heure}] ${e.essai} — ${e.statut} — ${e.message}`);
  return [`Rapport de la sonde Grist (widget v${version})`, ...lignes].join('\n');
}
