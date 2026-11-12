// Tests des composants de base (T1.22) : TEST-C-02, C-03, C-06, C-11 et comportements clavier.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { useState } from 'preact/hooks';
import { Alerte } from '../../src/ui/composants/base/Alerte';
import { Badge } from '../../src/ui/composants/base/Badge';
import { Bouton } from '../../src/ui/composants/base/Bouton';
import { ChampTexte, ListeDeroulante } from '../../src/ui/composants/base/Champ';
import { CaseACocher, GroupeRadio, Interrupteur } from '../../src/ui/composants/base/Choix';
import { Etiquette } from '../../src/ui/composants/base/Etiquette';
import { Infobulle } from '../../src/ui/composants/base/Infobulle';
import { ModaleConfirmation } from '../../src/ui/composants/base/Modale';
import { Onglets } from '../../src/ui/composants/base/Onglets';
import { Pagination, pagesAffichees } from '../../src/ui/composants/base/Pagination';
import { Accordeon, IndicateurEtapes, Tuile } from '../../src/ui/composants/base/Structure';
import { Tableau, trierLignes, type LigneTableau } from '../../src/ui/composants/base/Tableau';

afterEach(cleanup);

describe('Bouton', () => {
  it('exécute son action quand il est actif', () => {
    const action = vi.fn();
    render(<Bouton onClick={action}>Créer</Bouton>);
    fireEvent.click(screen.getByRole('button', { name: 'Créer' }));
    expect(action).toHaveBeenCalledOnce();
  });

  it('reste atteignable mais n’agit pas quand il est désactivé', () => {
    const action = vi.fn();
    render(
      <Bouton onClick={action} desactive raisonDesactivation="Saison clôturée">
        Modifier
      </Bouton>,
    );
    const bouton = screen.getByRole('button', { name: 'Modifier' });
    expect(bouton.getAttribute('aria-disabled')).toBe('true');
    expect(bouton.getAttribute('title')).toBe('Saison clôturée');
    fireEvent.click(bouton);
    expect(action).not.toHaveBeenCalled();
  });

  it('garde un nom accessible en mode « icône seule »', () => {
    render(
      <Bouton icone="fermer" iconeSeule>
        Fermer le panneau
      </Bouton>,
    );
    expect(screen.getByRole('button', { name: 'Fermer le panneau' })).toBeTruthy();
  });
});

describe('Alerte (TEST-C-03)', () => {
  it('annonce les erreurs immédiatement et les autres messages poliment', () => {
    render(
      <>
        <Alerte type="erreur" titre="Modification refusée" />
        <Alerte type="succes" titre="Enregistré" />
      </>,
    );
    expect(screen.getByRole('alert').textContent).toContain('Modification refusée');
    expect(screen.getByRole('status').textContent).toContain('Enregistré');
  });

  it('propose un bouton de fermeture nommé', () => {
    const fermer = vi.fn();
    render(<Alerte type="info" titre="Synchronisation" onFermer={fermer} />);
    fireEvent.click(screen.getByRole('button', { name: 'Fermer le message « Synchronisation »' }));
    expect(fermer).toHaveBeenCalledOnce();
  });
});

describe('Badge et étiquette (TEST-C-06)', () => {
  it('affiche toujours un texte', () => {
    render(<Badge type="erreur" texte="Bloquée" />);
    expect(screen.getByText('Bloquée')).toBeTruthy();
  });

  it('permet de retirer un filtre', () => {
    const retirer = vi.fn();
    render(<Etiquette libelle="CH3" onRetirer={retirer} />);
    fireEvent.click(screen.getByRole('button', { name: /CH3.*retirer le filtre/ }));
    expect(retirer).toHaveBeenCalledOnce();
  });
});

describe('Champs de formulaire', () => {
  it('relie l’étiquette, l’aide et l’erreur au champ', () => {
    render(
      <ChampTexte
        libelle="Titre"
        valeur=""
        onChange={() => undefined}
        aide="Texte court."
        erreur="Le titre est obligatoire."
        obligatoire
      />,
    );
    const champ = screen.getByLabelText(/Titre/);
    expect(champ.getAttribute('aria-invalid')).toBe('true');
    const decrit = champ.getAttribute('aria-describedby')?.split(' ') ?? [];
    const textes = decrit.map((id) => document.getElementById(id)?.textContent);
    expect(textes).toEqual(['Texte court.', 'Le titre est obligatoire.']);
  });

  it('transmet la saisie', () => {
    const changer = vi.fn();
    render(<ChampTexte libelle="Titre" valeur="" onChange={changer} />);
    fireEvent.input(screen.getByLabelText('Titre'), { target: { value: 'Nouvelle action' } });
    expect(changer).toHaveBeenCalledWith('Nouvelle action');
  });

  it('affiche le texte saisi tel quel, sans l’interpréter comme du HTML', () => {
    render(<ChampTexte libelle="Titre" valeur="<b>gras</b>" onChange={() => undefined} />);
    expect((screen.getByLabelText('Titre') as HTMLInputElement).value).toBe('<b>gras</b>');
  });

  it('propose les options d’une liste déroulante', () => {
    const changer = vi.fn();
    render(
      <ListeDeroulante
        libelle="Priorité"
        valeur=""
        onChange={changer}
        invite="Choisir"
        options={[
          { valeur: 'haute', libelle: 'Haute' },
          { valeur: 'basse', libelle: 'Basse' },
        ]}
      />,
    );
    fireEvent.change(screen.getByLabelText('Priorité'), { target: { value: 'basse' } });
    expect(changer).toHaveBeenCalledWith('basse');
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Choisir', 'Haute', 'Basse']);
  });
});

describe('Choix', () => {
  it('coche une case', () => {
    const changer = vi.fn();
    render(<CaseACocher libelle="Afficher les archives" coche={false} onChange={changer} />);
    fireEvent.click(screen.getByLabelText('Afficher les archives'));
    expect(changer).toHaveBeenCalledWith(true);
  });

  it('regroupe les boutons radio sous une légende', () => {
    const changer = vi.fn();
    render(
      <GroupeRadio
        legende="Statut"
        valeur="a"
        onChange={changer}
        options={[
          { valeur: 'a', libelle: 'À faire' },
          { valeur: 'b', libelle: 'En cours' },
        ]}
      />,
    );
    expect(screen.getByRole('group', { name: 'Statut' })).toBeTruthy();
    fireEvent.click(screen.getByLabelText('En cours'));
    expect(changer).toHaveBeenCalledWith('b');
  });

  it('bascule un interrupteur', () => {
    const changer = vi.fn();
    render(<Interrupteur libelle="Notifications" active={false} onChange={changer} />);
    fireEvent.click(screen.getByRole('switch', { name: 'Notifications' }));
    expect(changer).toHaveBeenCalledWith(true);
  });
});

describe('Onglets (TEST-C-11)', () => {
  function OngletsDeTest() {
    const [actif, setActif] = useState('a');
    return (
      <Onglets
        libelle="Vues"
        actif={actif}
        onChange={setActif}
        onglets={[
          { id: 'a', libelle: 'Chantiers' },
          { id: 'b', libelle: 'Objectifs' },
          { id: 'c', libelle: 'Sprints' },
        ]}
      >
        <p>Contenu {actif}</p>
      </Onglets>
    );
  }

  it('change d’onglet aux flèches et avec Début/Fin', () => {
    render(<OngletsDeTest />);
    const premier = screen.getByRole('tab', { name: 'Chantiers' });
    expect(premier.getAttribute('aria-selected')).toBe('true');
    expect(premier.getAttribute('tabindex')).toBe('0');

    fireEvent.keyDown(premier, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Objectifs' }).getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement?.textContent).toBe('Objectifs');

    fireEvent.keyDown(document.activeElement as Element, { key: 'End' });
    expect(screen.getByRole('tab', { name: 'Sprints' }).getAttribute('aria-selected')).toBe('true');

    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Chantiers' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('tabpanel').textContent).toBe('Contenu a');
  });
});

describe('Modale de confirmation (TEST-C-02)', () => {
  function ConfirmationDeTest({ confirmer }: { confirmer: () => void }) {
    const [ouverte, setOuverte] = useState(false);
    return (
      <>
        <button type="button" onClick={() => setOuverte(true)}>
          Archiver l’action
        </button>
        <ModaleConfirmation
          ouverte={ouverte}
          titre="Archiver l'action ?"
          message="L'action disparaîtra du Kanban."
          libelleConfirmer="Archiver"
          danger
          onConfirmer={() => {
            confirmer();
            setOuverte(false);
          }}
          onAnnuler={() => setOuverte(false)}
        />
      </>
    );
  }

  it('affiche la conséquence, se ferme avec Échap et rend le focus au déclencheur', () => {
    const confirmer = vi.fn();
    render(<ConfirmationDeTest confirmer={confirmer} />);
    const declencheur = screen.getByRole('button', { name: 'Archiver l’action' });
    declencheur.focus();
    fireEvent.click(declencheur);

    const dialogue = screen.getByRole('dialog', { name: "Archiver l'action ?" });
    expect(dialogue.textContent).toContain("L'action disparaîtra du Kanban.");

    fireEvent.keyDown(dialogue, { key: 'Escape' });
    expect(confirmer).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(declencheur);
  });

  it('exécute l’action confirmée', () => {
    const confirmer = vi.fn();
    render(<ConfirmationDeTest confirmer={confirmer} />);
    fireEvent.click(screen.getByRole('button', { name: 'Archiver l’action' }));
    fireEvent.click(screen.getByRole('button', { name: 'Archiver' }));
    expect(confirmer).toHaveBeenCalledOnce();
  });
});

describe('Infobulle (TEST-C-11)', () => {
  it('s’affiche au focus et se masque avec Échap', () => {
    render(<Infobulle sujet="avancement" texte="Actions terminées / actions comptées." />);
    const bouton = screen.getByRole('button', { name: 'Aide : avancement' });
    const bulle = document.getElementById(bouton.getAttribute('aria-describedby') ?? '');
    expect(bulle?.hidden).toBe(true);
    fireEvent.focus(bouton);
    expect(bulle?.hidden).toBe(false);
    fireEvent.keyDown(bouton, { key: 'Escape' });
    expect(bulle?.hidden).toBe(true);
  });
});

describe('Accordéon, étapes, tuile', () => {
  it('ouvre et referme un accordéon', () => {
    render(
      <Accordeon titre="Objectif 1">
        <p>Sous-objectifs</p>
      </Accordeon>,
    );
    const bouton = screen.getByRole('button', { name: 'Objectif 1' });
    expect(bouton.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(bouton);
    expect(bouton.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Sous-objectifs')).toBeTruthy();
  });

  it('indique l’étape en cours et la suivante', () => {
    render(<IndicateurEtapes etapes={['Revue', 'Bilan', 'Récapitulatif']} courante={2} />);
    expect(screen.getByText(/Étape 2 sur 3/)).toBeTruthy();
    expect(screen.getByText('Étape suivante : Récapitulatif')).toBeTruthy();
  });

  it('active une tuile par son bouton de titre', () => {
    const activer = vi.fn();
    render(<Tuile titre="CH3 — Maîtriser la donnée" onActiver={activer} />);
    fireEvent.click(screen.getByRole('button', { name: 'CH3 — Maîtriser la donnée' }));
    expect(activer).toHaveBeenCalledOnce();
  });
});

describe('Tableau', () => {
  const lignes: LigneTableau[] = [
    { id: '1', cellules: { titre: 'Écrire' } },
    { id: '2', cellules: { titre: 'archiver' } },
    { id: '3', cellules: { titre: 'Bloquer' } },
  ];

  it('trie à la française, sans tenir compte des accents ni des majuscules', () => {
    expect(trierLignes(lignes, 'titre', 'ascending').map((l) => l.id)).toEqual(['2', '3', '1']);
    expect(trierLignes(lignes, 'titre', 'descending').map((l) => l.id)).toEqual(['1', '3', '2']);
  });

  it('annonce le tri dans l’en-tête de colonne', () => {
    render(
      <Tableau
        titre="Actions"
        colonnes={[{ cle: 'titre', libelle: 'Titre', triable: true }]}
        lignes={lignes}
      />,
    );
    const entete = screen.getByRole('columnheader', { name: 'Titre' });
    expect(entete.getAttribute('aria-sort')).toBe('none');
    fireEvent.click(screen.getByRole('button', { name: 'Titre' }));
    expect(entete.getAttribute('aria-sort')).toBe('ascending');
    expect(screen.getAllByRole('cell').map((c) => c.textContent)).toEqual(['archiver', 'Bloquer', 'Écrire']);
  });

  it('affiche un message quand il est vide', () => {
    render(
      <Tableau
        titre="Actions"
        colonnes={[{ cle: 'titre', libelle: 'Titre' }]}
        lignes={[]}
        messageVide="Rien."
      />,
    );
    expect(screen.getByRole('cell').textContent).toBe('Rien.');
  });
});

describe('Pagination', () => {
  it('calcule les pages visibles avec des trous', () => {
    expect(pagesAffichees(1, 1)).toEqual([1]);
    expect(pagesAffichees(5, 12)).toEqual([1, null, 4, 5, 6, null, 12]);
    expect(pagesAffichees(2, 4)).toEqual([1, 2, 3, 4]);
  });

  it('signale la page courante et change de page', () => {
    const changer = vi.fn();
    render(<Pagination page={3} nbPages={12} onChange={changer} />);
    expect(screen.getByRole('button', { name: 'Page 3' }).getAttribute('aria-current')).toBe('page');
    fireEvent.click(screen.getByRole('button', { name: 'Page suivante' }));
    expect(changer).toHaveBeenCalledWith(4);
  });

  it('ne s’affiche pas pour une seule page', () => {
    const { container } = render(<Pagination page={1} nbPages={1} onChange={() => undefined} />);
    expect(container.innerHTML).toBe('');
  });
});
