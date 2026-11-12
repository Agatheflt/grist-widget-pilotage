// Sonde de validation de l'API Grist (tâche T1.02, points VAL-01 à VAL-19 de docs/00 §7).
// Cette page s'ouvre comme widget personnalisé dans un document Grist FICTIF.
// Elle n'écrit dans le document que lorsqu'on clique sur un bouton d'essai.
import { version } from '../../package.json';
import {
  actionsCreationTables,
  actionsSuppressionTables,
  afficherValeurRelue,
  colonne,
  reglagesRecalcul,
  compterLignes,
  dateEnSecondesUTC,
  decrireFormatTable,
  decrireValeur,
  formaterRapport,
  type ActionGrist,
  type Entree,
  type Statut,
} from './outils';

// --- Partie de l'API Grist utilisée par la sonde (docs/00 §2) ---------------------------

interface ApiGrist {
  ready(options: { requiredAccess: string }): void;
  onOptions(rappel: (options: unknown, reglages?: { accessLevel?: string }) => void): void;
  onRecords(rappel: (lignes: unknown[]) => void): void;
  on(evenement: string, rappel: (message: Record<string, unknown>) => void): void;
  docApi: {
    listTables(): Promise<string[]>;
    fetchTable(tableId: string): Promise<unknown>;
    applyUserActions(actions: ActionGrist[]): Promise<unknown>;
  };
}

declare global {
  interface Window {
    grist?: ApiGrist;
  }
}

// --- Journal -------------------------------------------------------------------------------

const entrees: Entree[] = [];
const elementJournal = document.getElementById('journal');
const elementEtat = document.getElementById('etat');

/** Ajoute une ligne au journal affiché (texte uniquement, jamais de HTML). */
function noter(essai: string, statut: Statut, message: string): void {
  const entree: Entree = { essai, statut, message, heure: new Date().toLocaleTimeString('fr-FR') };
  entrees.push(entree);
  const ligne = document.createElement('li');
  ligne.textContent = `[${entree.heure}] ${essai} — ${statut} — ${message}`;
  if (statut === 'OK') ligne.className = 'ok';
  if (statut === 'ÉCHEC') ligne.className = 'echec';
  elementJournal?.append(ligne);
}

/** Attend le nombre de millisecondes indiqué. */
function attendre(millisecondes: number): Promise<void> {
  return new Promise((resoudre) => setTimeout(resoudre, millisecondes));
}

/** Message d'erreur lisible, quelle que soit la forme de l'erreur. */
function texteErreur(erreur: unknown): string {
  return erreur instanceof Error ? erreur.message : String(erreur);
}

// --- Démarrage : connexion à Grist (VAL-08, VAL-13, VAL-15, VAL-01, VAL-02, VAL-14) --------

const grist = window.grist;
let nbEvenementsOnRecords = 0;
let themeSignale = false;
let tableLiee: unknown;

if (!grist) {
  if (elementEtat) {
    elementEtat.textContent =
      "L'API Grist est absente : ouvrez cette page comme widget personnalisé dans un document Grist.";
  }
} else {
  grist.ready({ requiredAccess: 'full' });

  grist.onOptions((_options, reglages) => {
    const niveau = reglages?.accessLevel ?? 'non fourni';
    if (elementEtat) elementEtat.textContent = `Connecté à Grist. Niveau d'accès : ${niveau}.`;
    noter('VAL-15', 'OK', "La page s'affiche dans Grist par URL personnalisée et l'API répond.");
    noter(
      'VAL-08',
      'INFO',
      `settings.accessLevel = ${niveau} ; clés reçues : ${Object.keys(reglages ?? {}).join(', ')}`,
    );
  });

  grist.onRecords((lignes) => {
    nbEvenementsOnRecords += 1;
    noter(
      'VAL-01/02',
      'INFO',
      `onRecords n° ${nbEvenementsOnRecords} reçu (${lignes.length} ligne(s) dans la table liée).`,
    );
  });

  grist.on('message', (message) => {
    if (message.theme !== undefined && !themeSignale) {
      themeSignale = true;
      noter('VAL-14', 'INFO', `Grist envoie un thème au widget (${decrireValeur(message.theme)}).`);
    }
    // Indique la table liée à la section, indispensable pour interpréter VAL-01.
    if (typeof message.tableId === 'string' && message.tableId !== tableLiee) {
      tableLiee = message.tableId;
      noter('VAL-01/02', 'INFO', `Table liée à la section du widget : ${message.tableId}.`);
    }
  });
}

// --- Essais ----------------------------------------------------------------------------------

/** Exécute un essai qui a besoin de l'API Grist, en consignant toute erreur. */
async function avecGrist(essai: string, action: (api: ApiGrist) => Promise<void>): Promise<void> {
  if (!grist) {
    noter(essai, 'ÉCHEC', 'API Grist absente.');
    return;
  }
  try {
    await action(grist);
  } catch (erreur) {
    noter(essai, 'ÉCHEC', texteErreur(erreur));
  }
}

/** Identifiants des lignes créées, lus dans le résultat de applyUserActions (TECH-065). */
function identifiantsCrees(resultat: unknown): unknown[] {
  const valeurs = (resultat as { retValues?: unknown[] } | null)?.retValues;
  return Array.isArray(valeurs) ? valeurs : [];
}

interface Essai {
  id: string;
  titre: string;
  consigne: string;
  bouton?: string;
  executer?: () => Promise<void>;
}

const essais: Essai[] = [
  {
    id: 'VAL-03 / VAL-09',
    titre: 'Lire les tables et la structure du document',
    consigne:
      'Liste les tables et lit les tables techniques de structure (_grist_Tables, _grist_Tables_column).',
    bouton: 'Lire',
    executer: () =>
      avecGrist('VAL-03/09', async (api) => {
        const tables = await api.docApi.listTables();
        noter('VAL-03', 'INFO', `listTables : ${tables.length} table(s) : ${tables.join(', ')}`);
        const structure = await api.docApi.fetchTable('_grist_Tables');
        noter('VAL-03', 'OK', `fetchTable('_grist_Tables') → ${decrireFormatTable(structure)}`);
        const colonnes = await api.docApi.fetchTable('_grist_Tables_column');
        noter(
          'VAL-09',
          'OK',
          `fetchTable('_grist_Tables_column') → ${compterLignes(colonnes)} colonne(s) lues`,
        );
      }),
  },
  {
    id: 'VAL-11',
    titre: 'Créer les tables de test',
    consigne:
      'Crée SondeEquipes, SondeTest (un champ de chaque type + colonnes de déclenchement), SondeSynchro et SondeProfils. ' +
      'Vérifiez ensuite dans Grist que les colonnes CreeLe, CreePar et MajLe sont bien des « formules de déclenchement ».',
    bouton: 'Créer',
    executer: () =>
      avecGrist('VAL-11', async (api) => {
        const resultat = await api.docApi.applyUserActions(actionsCreationTables());
        noter('VAL-11', 'OK', `Tables créées. Résultat : ${decrireValeur(resultat)}.`);
      }),
  },
  {
    id: 'VAL-04',
    titre: 'Écrire puis relire une valeur de chaque type',
    consigne: 'Ajoute deux équipes et une ligne SondeTest, puis affiche la forme de chaque valeur relue.',
    bouton: 'Écrire et relire',
    executer: () =>
      avecGrist('VAL-04', async (api) => {
        const equipes = await api.docApi.applyUserActions([
          ['BulkAddRecord', 'SondeEquipes', [null, null], { Nom: ['Équipe A fictive', 'Équipe B fictive'] }],
        ]);
        const ids = identifiantsCrees(equipes)[0];
        noter(
          'VAL-04',
          'INFO',
          `retValues de BulkAddRecord : ${decrireValeur(ids)} (${JSON.stringify(ids)})`,
        );
        const [idA, idB] = Array.isArray(ids) ? ids : [];
        await api.docApi.applyUserActions([
          [
            'AddRecord',
            'SondeTest',
            null,
            {
              Titre: 'Essai de types',
              Quand: dateEnSecondesUTC('2027-03-20'),
              Fait: true,
              Nombre: 12.5,
              Etat: 'À faire',
              Etiquettes: ['L', 'A', 'B'],
              Equipe: idA,
              Equipes: ['L', idA, idB],
            },
          ],
        ]);
        const table = await api.docApi.fetchTable('SondeTest');
        for (const nom of [
          'Quand',
          'Fait',
          'Nombre',
          'Etat',
          'Etiquettes',
          'Equipe',
          'Equipes',
          'CreeLe',
          'CreePar',
          'Aujourdhui',
        ]) {
          const valeur = colonne(table, nom).at(-1);
          noter('VAL-04', 'INFO', `${nom} relu : ${afficherValeurRelue(valeur)}`);
        }
      }),
  },
  {
    id: 'VAL-11 (bis)',
    titre: 'La colonne MajLe change-t-elle après une modification ?',
    consigne:
      'Affiche le réglage de recalcul de MajLe, ajoute une ligne, la modifie 2 secondes plus tard, puis compare MajLe avant et après.',
    bouton: 'Vérifier MajLe',
    executer: () =>
      avecGrist('VAL-11', async (api) => {
        const reglages = reglagesRecalcul(
          await api.docApi.fetchTable('_grist_Tables_column'),
          await api.docApi.fetchTable('_grist_Tables'),
          'SondeTest',
          'MajLe',
        );
        noter('VAL-11', 'INFO', `Réglage de MajLe : ${reglages}.`);
        const creation = await api.docApi.applyUserActions([
          ['AddRecord', 'SondeTest', null, { Titre: 'Essai MajLe' }],
        ]);
        const id = identifiantsCrees(creation)[0];
        const lireMajLe = async () => {
          const table = await api.docApi.fetchTable('SondeTest');
          return colonne(table, 'MajLe')[colonne(table, 'id').indexOf(id)];
        };
        const avant = await lireMajLe();
        await attendre(2000);
        await api.docApi.applyUserActions([
          ['UpdateRecord', 'SondeTest', id, { Titre: 'Essai MajLe modifié' }],
        ]);
        const apres = await lireMajLe();
        const change = typeof avant === 'number' && typeof apres === 'number' && apres > avant;
        noter(
          'VAL-11',
          change ? 'OK' : 'ÉCHEC',
          `MajLe avant : ${JSON.stringify(avant)}, après modification : ${JSON.stringify(apres)}.`,
        );
      }),
  },
  {
    id: 'VAL-01 / VAL-02',
    titre: 'Le widget est-il prévenu d’une modification dans une autre table ?',
    consigne:
      'Prérequis : dans « Widget options › Data », choisissez SondeSynchro (le journal doit afficher « Table liée … SondeSynchro »). ' +
      'L’essai modifie une ligne de SondeTest, puis 20 lignes à la suite, et compte les événements onRecords reçus.',
    bouton: 'Tester la synchronisation',
    executer: () =>
      avecGrist('VAL-01', async (api) => {
        if (tableLiee !== 'SondeSynchro') {
          noter(
            'VAL-01',
            'ÉCHEC',
            `La section est liée à ${String(tableLiee)} : choisissez SondeSynchro puis recommencez.`,
          );
          return;
        }
        const ids = colonne(await api.docApi.fetchTable('SondeTest'), 'id');
        if (ids.length === 0) {
          noter('VAL-01', 'ÉCHEC', 'SondeTest est vide : lancez d’abord l’essai VAL-04.');
          return;
        }
        const depart = nbEvenementsOnRecords;
        await api.docApi.applyUserActions([
          ['UpdateRecord', 'SondeTest', ids[0], { Nombre: Date.now() % 1000 }],
        ]);
        await attendre(2000);
        const recus = nbEvenementsOnRecords - depart;
        noter(
          'VAL-01',
          recus > 0 ? 'OK' : 'ÉCHEC',
          `Modification d'une cellule de SondeTest : ${recus} événement(s) onRecords reçu(s) via SondeSynchro.`,
        );
        const departRafale = nbEvenementsOnRecords;
        for (let i = 0; i < 20; i += 1) {
          await api.docApi.applyUserActions([['UpdateRecord', 'SondeTest', ids[0], { Nombre: i }]]);
        }
        await attendre(2000);
        noter(
          'VAL-02',
          'INFO',
          `20 écritures successives : ${nbEvenementsOnRecords - departRafale} événement(s) reçu(s).`,
        );
      }),
  },
  {
    id: 'VAL-05',
    titre: 'Atomicité d’un lot d’actions',
    consigne: 'Envoie un lot dont la seconde action est invalide : la première ne doit pas être appliquée.',
    bouton: 'Tester',
    executer: () =>
      avecGrist('VAL-05', async (api) => {
        const avant = compterLignes(await api.docApi.fetchTable('SondeTest'));
        try {
          await api.docApi.applyUserActions([
            ['AddRecord', 'SondeTest', null, { Titre: 'Ne doit pas exister' }],
            ['UpdateRecord', 'SondeTest', 999999, { ColonneInexistante: 1 }],
          ]);
          noter('VAL-05', 'ÉCHEC', 'Le lot invalide a été accepté.');
        } catch (erreur) {
          noter('VAL-05', 'INFO', `Lot refusé comme prévu : ${texteErreur(erreur)}`);
        }
        const apres = compterLignes(await api.docApi.fetchTable('SondeTest'));
        noter('VAL-05', apres === avant ? 'OK' : 'ÉCHEC', `Lignes avant : ${avant}, après : ${apres}.`);
      }),
  },
  {
    id: 'VAL-10',
    titre: 'Référence vers une ligne supprimée',
    consigne: 'Crée une équipe, la référence depuis SondeTest, supprime l’équipe puis relit la référence.',
    bouton: 'Tester',
    executer: () =>
      avecGrist('VAL-10', async (api) => {
        const creation = await api.docApi.applyUserActions([
          ['AddRecord', 'SondeEquipes', null, { Nom: 'Équipe à supprimer' }],
        ]);
        const idEquipe = identifiantsCrees(creation)[0];
        const ligne = await api.docApi.applyUserActions([
          ['AddRecord', 'SondeTest', null, { Titre: 'Référence orpheline', Equipe: idEquipe }],
        ]);
        const idLigne = identifiantsCrees(ligne)[0];
        await api.docApi.applyUserActions([['RemoveRecord', 'SondeEquipes', idEquipe]]);
        const table = await api.docApi.fetchTable('SondeTest');
        const position = colonne(table, 'id').indexOf(idLigne);
        const valeur = colonne(table, 'Equipe')[position];
        noter(
          'VAL-10',
          'INFO',
          `Après suppression, Equipe vaut ${JSON.stringify(valeur)} (référence vers ${JSON.stringify(idEquipe)}).`,
        );
      }),
  },
  {
    id: 'VAL-07',
    titre: 'Écriture selon les droits',
    consigne:
      'Ajoute puis supprime une ligne. À refaire avec un compte « Lecteur » du document : l’écriture doit être refusée.',
    bouton: 'Tenter une écriture',
    executer: () =>
      avecGrist('VAL-07', async (api) => {
        const resultat = await api.docApi.applyUserActions([
          ['AddRecord', 'SondeTest', null, { Titre: 'Essai de droits' }],
        ]);
        const id = identifiantsCrees(resultat)[0];
        await api.docApi.applyUserActions([['RemoveRecord', 'SondeTest', id]]);
        noter('VAL-07', 'INFO', 'Écriture acceptée (normal pour un propriétaire ou un éditeur).');
      }),
  },
  {
    id: 'VAL-17',
    titre: 'Lecture filtrée par une règle d’accès',
    consigne:
      'Après avoir ajouté des lignes dans SondeProfils et une règle d’accès « lecture seulement si rec.Courriel == user.Email », ' +
      'comptez les lignes visibles avec chaque compte.',
    bouton: 'Compter les lignes visibles',
    executer: () =>
      avecGrist('VAL-17', async (api) => {
        const profils = await api.docApi.fetchTable('SondeProfils');
        noter('VAL-17', 'INFO', `Lignes visibles dans SondeProfils : ${compterLignes(profils)}.`);
      }),
  },
  {
    id: 'VAL-18',
    titre: 'Créer une page par l’API',
    consigne:
      'Tente d’ajouter une section de page pour SondeTest avec l’action CreateViewSection (expérimental).',
    bouton: 'Tenter',
    executer: () =>
      avecGrist('VAL-18', async (api) => {
        const tables = await api.docApi.fetchTable('_grist_Tables');
        const position = colonne(tables, 'tableId').indexOf('SondeTest');
        const refTable = colonne(tables, 'id')[position];
        const resultat = await api.docApi.applyUserActions([
          ['CreateViewSection', refTable, 0, 'record', null, null],
        ]);
        noter(
          'VAL-18',
          'OK',
          `CreateViewSection accepté : ${decrireValeur(resultat)}. Vérifiez la nouvelle page dans Grist.`,
        );
      }),
  },
  {
    id: 'Nettoyage',
    titre: 'Supprimer les tables de test',
    consigne:
      'Supprime toutes les tables « Sonde… ». La page éventuellement créée par VAL-18 est à supprimer à la main.',
    bouton: 'Supprimer',
    executer: () =>
      avecGrist('Nettoyage', async (api) => {
        const actions = actionsSuppressionTables(await api.docApi.listTables());
        if (actions.length > 0) await api.docApi.applyUserActions(actions);
        noter('Nettoyage', 'OK', `${actions.length} table(s) de test supprimée(s).`);
      }),
  },
  {
    id: 'VAL-01 (manuel, complément)',
    titre: 'Modification faite directement dans Grist',
    consigne:
      'Section liée à SondeSynchro : modifiez une cellule de SondeTest dans une vue tableau Grist ; une ligne « onRecords » doit apparaître.',
  },
  {
    id: 'VAL-06 (manuel)',
    titre: 'Annulation',
    consigne:
      'Après l’essai VAL-04, faites Ctrl+Z dans Grist : la ligne ajoutée d’un seul lot doit disparaître en une fois.',
  },
  {
    id: 'VAL-16 (manuel)',
    titre: 'Recalcul de TODAY()',
    consigne:
      'Gardez SondeTest jusqu’au lendemain : la colonne Aujourdhui a-t-elle changé sans modification du document ?',
  },
  {
    id: 'VAL-19 (manuel)',
    titre: 'Attribut utilisateur dans les règles d’accès',
    consigne:
      'Dans Access Rules, essayez d’ajouter un attribut utilisateur lié à une table par le courriel, puis une condition utilisant user.<attribut>.',
  },
];

// --- Affichage des essais ------------------------------------------------------------------

const conteneurEssais = document.getElementById('essais');

for (const essai of essais) {
  const bloc = document.createElement('section');
  bloc.className = 'essai';
  const titre = document.createElement('h3');
  titre.textContent = `${essai.id} — ${essai.titre}`;
  const consigne = document.createElement('p');
  consigne.textContent = essai.consigne;
  bloc.append(titre, consigne);
  if (essai.bouton && essai.executer) {
    const executer = essai.executer;
    const bouton = document.createElement('button');
    bouton.type = 'button';
    bouton.textContent = essai.bouton;
    bouton.addEventListener('click', async () => {
      bouton.disabled = true;
      await executer();
      bouton.disabled = false;
    });
    bloc.append(bouton);
  } else {
    noter(essai.id.replace(' (manuel)', ''), 'À FAIRE', essai.titre);
  }
  conteneurEssais?.append(bloc);
}

// --- Copie du rapport ----------------------------------------------------------------------

document.getElementById('copier')?.addEventListener('click', async () => {
  const rapport = formaterRapport(entrees, version);
  const zone = document.getElementById('rapport') as HTMLTextAreaElement | null;
  const retour = document.getElementById('copie');
  try {
    await navigator.clipboard.writeText(rapport);
    if (retour) retour.textContent = ' Rapport copié : collez-le dans la conversation avec Claude Code.';
  } catch {
    // Copie automatique refusée : on affiche le rapport pour une copie manuelle.
    if (zone) {
      zone.hidden = false;
      zone.value = rapport;
      zone.select();
    }
    if (retour)
      retour.textContent = ' Copie automatique impossible : sélectionnez le texte ci-dessous et copiez-le.';
  }
});

export {};
