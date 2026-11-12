# Sécurité

## Signaler une vulnérabilité

**Ne publiez jamais une faille de sécurité dans une issue GitHub publique.**

Ce widget s'exécute avec un accès complet au document Grist qui l'héberge. Si vous découvrez une vulnérabilité (accès à des données qui ne sont pas les vôtres, injection de code, perturbation du service) :

- utilisez la politique de divulgation de vulnérabilités de l'État : https://vdp.numerique.gouv.fr/p/Policy (formulaire : https://vdp.numerique.gouv.fr/p/Send-a-report) ;
- ou contactez en privé les mainteneurs du dépôt.

Merci d'indiquer la version du widget (affichée en bas de l'interface), les étapes pour reproduire le problème et son impact.

## Principes appliqués

- Aucune donnée n'est stockée hors de Grist ; aucune requête n'est envoyée à un service tiers.
- Le dépôt ne contient que des données fictives, aucun identifiant, jeton ou secret (contrôle automatique `npm run verifier:secrets`).
- Les contenus saisis sont toujours affichés comme du texte, jamais interprétés comme du HTML.

Voir `docs/02-CAHIER-DES-CHARGES-TECHNIQUE.md` §7.
