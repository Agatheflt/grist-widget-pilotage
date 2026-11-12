# Sonde Grist — mode d'emploi (tâche T1.02)

La sonde est une petite page de test. Ajoutée comme widget dans un document Grist **fictif**, elle vérifie le fonctionnement réel de l'API Grist (points VAL-01 à VAL-19 de `docs/00-RECHERCHE-TECHNIQUE.md` §7) et confirme que la pile TypeScript fonctionne dans Grist (DEC-003).

Durée : environ 30 minutes, plus un contrôle le lendemain (VAL-16).

## 1. Adresse de la sonde

Après publication sur GitHub Pages (avec ton accord) :

```
https://agatheflt.github.io/grist-widget-pilotage/outils/sonde-grist/
```

## 2. Préparer un document de test

1. Sur https://grist.numerique.gouv.fr, crée un document vide nommé **« [TEST] Sonde SIGNAL »**. N'y mets aucune donnée réelle.
2. **Add New › Add widget to page** : Widget **Custom**, Data **Table1** → **Add to page**.
3. Menu **⋮** de la section › **Widget options** › **Enter Custom URL** : colle l'adresse de la sonde.
4. **Access level** : **Full document access** → accepte.

Si la sonde s'affiche avec « Connecté à Grist », **VAL-15 est validé** : l'instance accepte les widgets par URL personnalisée.

## 3. Lancer les essais (dans l'ordre)

| Ordre | Bouton | Ce qu'il faut regarder |
|---|---|---|
| 1 | VAL-03 / VAL-09 — **Lire** | Le journal décrit le format des tables |
| 2 | VAL-11 — **Créer** | Quatre tables « Sonde… » apparaissent dans **Raw data**. Ouvre `SondeTest` : les colonnes `CreeLe`, `CreePar` et `MajLe` doivent être des « trigger formulas » (icône de déclencheur dans le panneau de colonne) |
| 3 | VAL-04 — **Écrire et relire** | Le journal affiche la forme de chaque valeur relue |
| 4 | VAL-06 (manuel) | Fais **Ctrl+Z** dans Grist : la ligne « Essai de types » disparaît-elle en une fois ? Refais ensuite l'essai VAL-04 |
| 5 | VAL-05 — **Tester** | La ligne du journal doit être verte (« OK ») |
| 6 | VAL-10 — **Tester** | Le journal indique ce que devient une référence vers une ligne supprimée |
| 7 | VAL-07 — **Tenter une écriture** | Avec ton compte : écriture acceptée. Si tu as un second compte, partage-lui le document en **Lecteur** et refais l'essai avec lui : il doit être refusé |
| 8 | VAL-01 / VAL-02 (manuel) | Dans **Widget options › Data**, choisis la table **SondeSynchro**. Ouvre une vue tableau de `SondeTest`, modifie une cellule : une ligne « onRecords » doit apparaître dans le journal. Colle ensuite 20 lignes d'un coup et compte les lignes « onRecords » |
| 9 | VAL-18 — **Tenter** | Une nouvelle page `SondeTest` est-elle apparue dans Grist ? |
| 10 | VAL-17 et VAL-19 (facultatif, avancé) | Voir §4 |
| 11 | **Copier le rapport** | Colle le rapport dans la conversation avec Claude Code |
| 12 | VAL-16 (le lendemain) | Rouvre `SondeTest` sans rien modifier : la colonne `Aujourdhui` affiche-t-elle la nouvelle date ? |
| 13 | **Supprimer** (nettoyage) | Supprime les tables de test ; supprime à la main la page créée par VAL-18 |

## 4. Essais avancés sur les règles d'accès (VAL-17, VAL-19)

À faire seulement si tu disposes d'un second compte Grist, sinon on les reprendra en T1.21.

1. Dans `SondeProfils`, ajoute deux lignes : ton courriel Grist et celui du second compte.
2. Menu **Access Rules** › table `SondeProfils` : règle « lecture refusée si `rec.Courriel != user.Email` » (sauf propriétaires).
3. Avec chaque compte, clique **Compter les lignes visibles** : on attend 1 ligne pour le compte non propriétaire.
4. VAL-19 : dans Access Rules, essaie **Add user attributes** : nom `Profil`, table `SondeProfils`, correspondance `user.Email` ↔ `Courriel`. Indique si l'écran le permet.

## 5. Confidentialité

- Le rapport ne contient que des formes de valeurs, des compteurs et des messages techniques. Il ne contient ni le nom du document ni son adresse.
- Ne copie pas l'adresse du document de test dans le dépôt GitHub.
