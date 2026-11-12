// Vitrine des composants de base (T1.22) : chaque composant, dans ses différents états,
// avec des données fictives. Sert à la validation visuelle et aux tests d'accessibilité.
import '@gouvfr/dsfr/dist/core/core.min.css';
import '@gouvfr/dsfr/dist/scheme/scheme.min.css';
import '../../src/styles/variables.css';
import '../../src/styles/base.css';
import '../../src/styles/composants.css';

import type { ComponentChildren } from 'preact';
import { render } from 'preact';
import { useState } from 'preact/hooks';
import { appliquerTheme, themeEnregistre } from '../../src/ui/theme';
import { Alerte } from '../../src/ui/composants/base/Alerte';
import { Badge } from '../../src/ui/composants/base/Badge';
import { Bandeau } from '../../src/ui/composants/base/Bandeau';
import { Bouton } from '../../src/ui/composants/base/Bouton';
import { ChampTexte, ListeDeroulante, ZoneTexte } from '../../src/ui/composants/base/Champ';
import { CaseACocher, ControleSegmente, GroupeRadio, Interrupteur } from '../../src/ui/composants/base/Choix';
import { Etiquette } from '../../src/ui/composants/base/Etiquette';
import { Infobulle } from '../../src/ui/composants/base/Infobulle';
import { InterrupteurTheme } from '../../src/ui/composants/base/InterrupteurTheme';
import { Modale, ModaleConfirmation } from '../../src/ui/composants/base/Modale';
import { Onglets } from '../../src/ui/composants/base/Onglets';
import { Pagination } from '../../src/ui/composants/base/Pagination';
import { Accordeon, IndicateurEtapes, Tuile } from '../../src/ui/composants/base/Structure';
import { Tableau } from '../../src/ui/composants/base/Tableau';

appliquerTheme(themeEnregistre());

const PRIORITES = [
  { valeur: 'haute', libelle: 'Haute' },
  { valeur: 'moyenne', libelle: 'Moyenne' },
  { valeur: 'basse', libelle: 'Basse' },
];

function Section({ titre, children }: { titre: string; children: ComponentChildren }) {
  return (
    <section class="sg-vitrine__section" aria-labelledby={`section-${titre}`}>
      <h2 id={`section-${titre}`}>{titre}</h2>
      <div class="sg-vitrine__exemples">{children}</div>
    </section>
  );
}

function Vitrine() {
  const [titre, setTitre] = useState('Rédiger la fiche de données fictive');
  const [echeance, setEcheance] = useState('2027-03-20');
  const [description, setDescription] = useState('');
  const [priorite, setPriorite] = useState('moyenne');
  const [archives, setArchives] = useState(false);
  const [affichage, setAffichage] = useState('liste');
  const [statut, setStatut] = useState('afaire');
  const [notifications, setNotifications] = useState(true);
  const [onglet, setOnglet] = useState('chantiers');
  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [confirmationOuverte, setConfirmationOuverte] = useState(false);
  const [page, setPage] = useState(3);
  const [message, setMessage] = useState('');
  const [filtres, setFiltres] = useState(['CH3', 'Priorité haute', 'En retard']);

  return (
    <div class="sg-application">
      <header class="sg-barre">
        <p class="sg-version">Vitrine des composants (données fictives)</p>
        <InterrupteurTheme />
      </header>
      <main class="sg-contenu">
        <h1>Vitrine des composants</h1>
        <p>
          Chaque composant est présenté dans ses différents états. Basculez le mode sombre pour les vérifier.
        </p>
        <p role="status">{message}</p>

        <Section titre="Boutons">
          <Bouton onClick={() => setMessage('Bouton principal activé.')}>Créer un objectif</Bouton>
          <Bouton variante="secondaire">Annuler</Bouton>
          <Bouton variante="tertiaire" icone="plus">
            Ajouter une action
          </Bouton>
          <Bouton variante="danger" onClick={() => setConfirmationOuverte(true)}>
            Archiver
          </Bouton>
          <Bouton icone="fermer" iconeSeule variante="tertiaire">
            Fermer le panneau
          </Bouton>
          <Bouton desactive raisonDesactivation="Saison clôturée : consultation seule">
            Modifier
          </Bouton>
        </Section>

        <Section titre="Alertes et bandeau">
          <Alerte type="succes" titre="Objectif enregistré" />
          <Alerte type="info" titre="Synchronisation">
            Données à jour à 14:32.
          </Alerte>
          <Alerte type="avertissement" titre="2 objectifs sur 3">
            La cible est de 3 objectifs par chantier.
          </Alerte>
          <Alerte
            type="erreur"
            titre="Modification refusée par Grist"
            onFermer={() => setMessage('Alerte fermée.')}
          >
            Vos droits ne permettent pas cette modification.
          </Alerte>
          <Bandeau>Saison clôturée — consultation seule.</Bandeau>
        </Section>

        <Section titre="Badges et étiquettes">
          <Badge texte="À faire" />
          <Badge type="info" texte="En cours" />
          <Badge type="erreur" texte="Bloquée" />
          <Badge type="succes" texte="Terminée" />
          <Badge type="avertissement" texte="En retard" />
          <Badge type="nouveau" texte="Soumis" />
          <div>
            {filtres.map((filtre) => (
              <Etiquette
                key={filtre}
                libelle={filtre}
                onRetirer={() => setFiltres(filtres.filter((f) => f !== filtre))}
              />
            ))}
            <Etiquette libelle="Étiquette simple" />
          </div>
        </Section>

        <Section titre="Champs de formulaire">
          <ChampTexte libelle="Titre de l'action" valeur={titre} onChange={setTitre} obligatoire />
          <ChampTexte
            libelle="Échéance"
            type="date"
            valeur={echeance}
            onChange={setEcheance}
            aide="Doit être comprise dans la saison."
          />
          <ChampTexte
            libelle="Titre (exemple d'erreur)"
            valeur=""
            onChange={() => undefined}
            obligatoire
            erreur="Le titre est obligatoire."
          />
          <ChampTexte
            libelle="Champ désactivé"
            valeur="Valeur verrouillée"
            onChange={() => undefined}
            desactive
          />
          <ZoneTexte libelle="Description" valeur={description} onChange={setDescription} />
          <ListeDeroulante
            libelle="Priorité"
            valeur={priorite}
            onChange={setPriorite}
            options={PRIORITES}
            invite="Choisir une priorité"
          />
        </Section>

        <Section titre="Choix">
          <CaseACocher libelle="Afficher les archives" coche={archives} onChange={setArchives} />
          <GroupeRadio
            legende="Statut de l'action"
            valeur={statut}
            onChange={setStatut}
            options={[
              { valeur: 'afaire', libelle: 'À faire' },
              { valeur: 'encours', libelle: 'En cours' },
              { valeur: 'terminee', libelle: 'Terminée' },
            ]}
          />
          <ControleSegmente
            legende="Affichage du backlog"
            valeur={affichage}
            onChange={setAffichage}
            options={[
              { valeur: 'liste', libelle: 'Liste' },
              { valeur: 'kanban', libelle: 'Kanban' },
            ]}
          />
          <Interrupteur libelle="Notifications fictives" active={notifications} onChange={setNotifications} />
        </Section>

        <Section titre="Onglets">
          <Onglets
            libelle="Vues du widget"
            onglets={[
              { id: 'chantiers', libelle: 'Chantiers' },
              { id: 'objectifs', libelle: 'Objectifs' },
              { id: 'sprints', libelle: 'Sprints' },
            ]}
            actif={onglet}
            onChange={setOnglet}
          >
            <p>Contenu de l'onglet « {onglet} ».</p>
          </Onglets>
        </Section>

        <Section titre="Modales">
          <Bouton variante="secondaire" onClick={() => setModaleOuverte(true)}>
            Ouvrir un formulaire
          </Bouton>
          <Modale
            ouverte={modaleOuverte}
            titre="Créer une action"
            onFermer={() => setModaleOuverte(false)}
            actions={
              <>
                <Bouton variante="secondaire" onClick={() => setModaleOuverte(false)}>
                  Annuler
                </Bouton>
                <Bouton
                  onClick={() => {
                    setModaleOuverte(false);
                    setMessage('Action fictive enregistrée.');
                  }}
                >
                  Enregistrer
                </Bouton>
              </>
            }
          >
            <ChampTexte libelle="Titre" valeur={titre} onChange={setTitre} obligatoire />
          </Modale>
          <ModaleConfirmation
            ouverte={confirmationOuverte}
            titre="Archiver l'action ?"
            message="L'action disparaîtra du Kanban et des calculs d'avancement. Vous pourrez la restaurer depuis les archives."
            libelleConfirmer="Archiver"
            danger
            onConfirmer={() => {
              setConfirmationOuverte(false);
              setMessage('Action fictive archivée.');
            }}
            onAnnuler={() => setConfirmationOuverte(false)}
          />
        </Section>

        <Section titre="Aide, accordéon, étapes">
          <p>
            Avancement{' '}
            <Infobulle sujet="avancement" texte="Actions terminées / actions non abandonnées (IND-001)." />
          </p>
          <Accordeon titre="CH3 — Objectif 1 : ouvrir un catalogue de données fictif" ouvertParDefaut>
            <p>Sous-objectifs fictifs du chantier.</p>
          </Accordeon>
          <Accordeon titre="CH3 — Objectif 2 : former les équipes fictives">
            <p>Contenu replié par défaut.</p>
          </Accordeon>
          <IndicateurEtapes
            etapes={['Actions non terminées', 'Bilan du sprint', 'Récapitulatif']}
            courante={2}
          />
        </Section>

        <Section titre="Tuiles">
          <div class="sg-vitrine__grille">
            <Tuile titre="CH3 — Maîtriser la donnée" onActiver={() => setMessage('Tuile CH3 activée.')}>
              <p>Pilote : Dominique Test</p>
            </Tuile>
            <Tuile titre="CH5 — Dorsale numérique" onActiver={() => setMessage('Tuile CH5 activée.')}>
              <p>Pilote : Alex Fictif</p>
            </Tuile>
          </div>
        </Section>

        <Section titre="Tableau et pagination">
          <Tableau
            titre="Actions du sprint (fictives)"
            colonnes={[
              { cle: 'titre', libelle: 'Titre', triable: true },
              { cle: 'responsable', libelle: 'Responsable', triable: true },
              { cle: 'statut', libelle: 'Statut' },
              { cle: 'echeance', libelle: 'Échéance', triable: true },
            ]}
            lignes={[
              {
                id: '1',
                cellules: {
                  titre: 'Publier le jeu A',
                  responsable: 'Alex Fictif',
                  statut: <Badge type="info" texte="En cours" />,
                  echeance: '20/03/2027',
                },
                valeurs: { echeance: '2027-03-20' },
              },
              {
                id: '2',
                cellules: {
                  titre: 'Écrire la fiche',
                  responsable: 'Camille Exemple',
                  statut: <Badge type="succes" texte="Terminée" />,
                  echeance: '05/03/2027',
                },
                valeurs: { echeance: '2027-03-05' },
              },
              {
                id: '3',
                cellules: {
                  titre: 'Bloquer le créneau',
                  responsable: 'Dominique Test',
                  statut: <Badge type="erreur" texte="Bloquée" />,
                  echeance: '12/03/2027',
                },
                valeurs: { echeance: '2027-03-12' },
              },
            ]}
          />
          <Tableau
            titre="Tableau vide"
            colonnes={[{ cle: 'titre', libelle: 'Titre' }]}
            lignes={[]}
            messageVide="Aucune action ne correspond aux filtres."
          />
          <Pagination page={page} nbPages={12} onChange={setPage} />
        </Section>
      </main>
    </div>
  );
}

const conteneur = document.getElementById('application');
if (conteneur) render(<Vitrine />, conteneur);
