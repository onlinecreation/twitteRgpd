# TwitteRgpd

[🇫🇷 French](README.fr.md)

TwitteRgpd is a script that displays a Twitter feed using the official widget, but asks the user for permission before loading anything. This makes it GDPR (General Data Protection Regulation) friendly.

## Usage

1. Add a `div` element to your HTML page where you want the Twitter feed to appear.
2. Include the `twitteRgpd.js` script in your HTML page.
3. Call the `deploy` function with the `div` element and the desired configuration options.

Example:

```html
<div id="myTwitterFeed">Loading…</div>
<script src="twitteRgpd.js"></script>
<script>
twitteRgpd.deploy(document.getElementById('myTwitterFeed'), {
    account: 'OnlineCreation',
    width: 200,
    height: 150,
    theme: 'light',
});
</script>
```

In order to speed up the loading of your page, you are advised to include the `<script>` tags at the end of your HTML page, just before the closing `</body>` tag.

## Configuration

The following configuration options are available:

- account: the Twitter account to display.
- width: the width of the widget.
- height: the height of the widget.
- theme: the theme of the widget (light or dark).
- language: the language of the widget (if not set, the browser language will be used).
- translation: the translation of the widget (if not set, the default translation will be used).
- removeStylesheet: if true, the default stylesheet will not be injected (default: false).
- stylesheet: a stylesheet to inject (default: null).
- tweetLimit: the number of tweets to display (default: 0 = let Twitter decide).
- chrome: the chrome of the widget (default: null).
- forceReload: if true, the page will be reloaded when the user accepts the connection with Twitter (default: false). This is useful if you display several Twitter feeds on the same page.

You can find more information about the "chrome" option [here](https://developer.twitter.com/en/docs/twitter-for-websites/timelines/overview).

## Translation

The following translations are available:
- ar: Arabic
- ca: Catalan
- de: German
- en: English
- eo: Esperanto
- es: Spanish
- eu: Basque
- fr: French
- gl: Galician
- he: Hebrew
- hi: Hindi
- it: Italian
- ja: Japanese
- ko: Korean
- nl: Dutch
- oc: Occitan
- pl: Polish
- pt: Portuguese
- ru: Russian
- tw: Chinese (traditional)
- uk: Ukrainian
- zh: Chinese (simplified)

You are welcome to contribute new translations or to improve existing ones.

If you wish to customize the translation, you can pass a translation object to the `translation` option. The object must contain the following keys:

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

## Styling

The widget is displayed in a `div` element with the `twitteRgpd` class. You can style it as you wish. You may add a custom stylesheet to the `stylesheet` option. You also may use the `removeStylesheet` option to prevent the default stylesheet from being injected.

The following classes are also available:
-  `twitteRgpd-title`
-  `twitteRgpd-message`
-  `twitteRgpd-buttons`
-  `twitteRgpd-accept`
-  `twitteRgpd-refuse`
-  `twitteRgpd-changeMind`
-  `twitteRgpd-accepted`
-  `twitteRgpd-unload`
-  `twitteRgpd-unblock`

## License

TwitteRgpd is released under the MIT License. 

Copyright © 2023 OnlineCreation

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Credits

TwitteRgpd is developed by [OnlineCreation](https://www.onlinecreation.pro/).

