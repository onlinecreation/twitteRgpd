# TwitteRgpd

[🇬🇧 English](README.md)

TwitteRgpd est un script qui affiche un flux Twitter en utilisant le widget officiel, mais demande la permission de l'utilisateur avant de charger quoi que ce soit. Cela le rend conforme au RGPD (Règlement général sur la protection des données).

## Utilisation

1. Ajoutez un élément div à votre page HTML où vous voulez que le flux Twitter apparaisse.
2. Incluez le script `twitteRgpd.min.js` dans votre page HTML.
3. Appelez la fonction `deploy` avec l'élément `div` et les options de configuration souhaitées.

Exemple :

```html
<div id="myTwitterFeed">Loading…</div>
<script src="twitteRgpd.min.js"></script>
<script>
twitteRgpd.deploy(document.getElementById('myTwitterFeed'), {
    account: 'OnlineCreation',
    width: 200,
    height: 150,
    theme: 'light',
});
</script>
```

Pour accélérer le chargement de votre page, il est conseillé d'inclure les balises `<script>` à la fin de votre page HTML, juste avant la balise de fermeture `</body>`.

## Configuration

Les options de configuration suivantes sont disponibles :

- account : le compte Twitter à afficher.
- width : la largeur du widget.
- height : la hauteur du widget.
- theme : le thème du widget (clair ou foncé).
- language : la langue du widget (si elle n'est pas définie, la langue du navigateur sera utilisée).
- translation : la traduction du widget (si elle n'est pas définie, la traduction par défaut sera utilisée).
- removeStylesheet : si true, la feuille de style par défaut ne sera pas injectée (par défaut : false).
- stylesheet : une feuille de style à injecter (par défaut : null).
- tweetLimit : le nombre de tweets à afficher (par défaut : 0 = laissez Twitter décider).
- chrome : le chrome du widget (par défaut : null).
- forceReload : si true, la page sera rechargée lorsque l'utilisateur acceptera la connexion avec Twitter (par défaut : false). Ceci est utile si vous affichez plusieurs flux Twitter sur la même page.

Vous pouvez trouver plus d'informations sur l'option "chrome" [ici](https://developer.twitter.com/en/docs/twitter-for-websites/timelines/overview).

## Traduction

Les traductions suivantes sont disponibles :

- ar : arabe
- ca : catalan
- de : allemand
- en : anglais
- eo : espéranto
- es : espagnol
- eu : basque
- fr : français
- gl : galicien
- he : hébreu
- hi : hindi
- it : italien
- ja : japonais
- ko : coréen
- nl : néerlandais
- oc : occitan
- pl : polonais
- pt : portugais
- ru : russe
- tw : chinois (traditionnel)
- uk : ukrainien
- zh : chinois (simplifié)

N'hésitez pas à proposer des traductions supplémentaires ou à améliorer les traductions existantes.

Si vous souhaitez personnaliser la traduction, vous pouvez passer un objet de traduction à l'option translation. L'objet doit contenir les clés suivantes :

```javascript
{
    'translation': {
        'en': {
            'direction': 'ltr',
            'title': 'Do you want to display our Twitter feed?',
            'message': 'A connection with Twitter will be made, this connection may share some of your personal data with Twitter.',
            'accept': 'Accept and display Twitter',
            'refuse': 'Refuse and hide Twitter',
            'refuseMessage': 'You have refused the loading of the Twitter widget. You can change your mind by clicking on the button below.',
            'acceptMessage': 'You have allowed the loading of the Twitter widget. You can change your mind by clicking on the button below.',
            'changeMind': 'Change your mind',
            'loading': 'Loading Twitter widget...',
            'blocked': 'The Twitter widget is blocked by your web browser. If you see an icon like this in your browser, click on it to unblock it.'
        }
    }
}
```

## Style

Le widget est affiché dans un élément `div` avec la classe `twitteRgpd`. Vous pouvez le styler comme vous le souhaitez. Vous pouvez ajouter une feuille de style personnalisée à l'option `stylesheet`. Vous pouvez également utiliser l'option `removeStylesheet` pour empêcher l'injection de la feuille de style par défaut.

Les classes suivantes sont également disponibles :

- twitteRgpd-title
- twitteRgpd-message
- twitteRgpd-buttons
- twitteRgpd-accept
- twitteRgpd-refuse
- twitteRgpd-changeMind
- twitteRgpd-accepted
- twitteRgpd-unload
- twitteRgpd-unblock

## Licence

TwitteRgpd est publié sous la licence MIT.

Traduction à titre informatif :

```text
Copyright © 2023 OnlineCreation

La permission est accordée, gratuitement, à toute personne obtenant une copie de ce logiciel et des fichiers de documentation associés (le « Logiciel »), de traiter le Logiciel sans restriction, y compris, sans limitation, les droits d'utilisation, de copie, de modification, de fusion, de publication, de distribution, de sous-licence et/ou de vente de copies du Logiciel, et de permettre aux personnes auxquelles le Logiciel est fourni de le faire, sous réserve des conditions suivantes :

L'avis de droit d'auteur ci-dessus et cet avis de permission doivent être inclus dans toutes les copies ou portions substantielles du Logiciel.

LE LOGICIEL EST FOURNI « TEL QUEL », SANS GARANTIE D'AUCUNE SORTE, EXPRESSE OU IMPLICITE, Y COMPRIS, MAIS SANS S'Y LIMITER, LES GARANTIES DE QUALITÉ MARCHANDE, D'ADAPTATION À UN USAGE PARTICULIER ET DE NON-VIOLATION. EN AUCUN CAS, LES AUTEURS OU LES TITULAIRES DE DROITS D'AUTEUR NE SERONT RESPONSABLES DE TOUTE RÉCLAMATION, DOMMAGE OU AUTRE RESPONSABILITÉ, QUE CE SOIT DANS LE CADRE D'UN CONTRAT, D'UN DÉLIT OU AUTRE, EN PROVENANCE, EN LIEN OU EN RELATION AVEC LE LOGICIEL OU SON UTILISATION OU D'AUTRES TRANSACTIONS DANS LE LOGICIEL.
```

## Crédits

TwitteRgpd est développé par [OnlineCreation](https://www.onlinecreation.pro/).