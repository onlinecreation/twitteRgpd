/**
 * TwitteRgpd
 * Twitter widget GDPR friendly
 * This script asks your visitors if they allow the Twitter widget to be loaded
 * Author: https://www.onlinecreation.pro
 */

const twitteRgpd = {
    defaultConfiguration: {
        account: null,
        width: null,
        height: null,
        theme: 'light',
        language: null,
        translation: {},
        removeStylesheet: false,
        stylesheet: null,
        tweetLimit: 0,
        chrome: '',
        forceReload: false,
    },
    deploy: (containerElement, configuration) => {
        const id = twitteRgpd.storeConfiguration(containerElement, configuration);
        // if the user has already refused, show the refuse message
        if (twitteRgpd.getCookie('twitteRgpd') === '0') {
            twitteRgpd.displayRefuseMessage(containerElement, id, () => {
                twitteRgpd.changeMindFunction(id);
            });
        } else if (twitteRgpd.getCookie('twitteRgpd') === '1') {
            // if the user has already accepted, load the widget
            twitteRgpd.doLoadTwitter(containerElement, id, () => {
                twitteRgpd.changeMindFunction(id);
            });
        } else {
            // if the user has not already accepted or refused, display the question
            twitteRgpd.displayQuestion(containerElement, id, () => {
                twitteRgpd.acceptFunction(id);
            },
            () => {
                twitteRgpd.refuseFunction(id);
            });
        }
        // inject the CSS
        twitteRgpd.injectCSS(id);
    },
    acceptFunction: (id) => {
        // set the cookie
        twitteRgpd.setCookie('twitteRgpd', '1', 365);
        if (twitteRgpd.getConfig(id, 'forceReload')) {
            // reload the page
            location.reload();
        } else {
            // load the twitter widget
            twitteRgpd.doLoadTwitter(twitteRgpd.getConfig(id, 'containerElement'), id, () => {
                twitteRgpd.changeMindFunction(id);
            });
        }
    },
    refuseFunction: (id) => {
        // set the cookie
        twitteRgpd.setCookie('twitteRgpd', '0', 365);
        // display the refuse message
        twitteRgpd.displayRefuseMessage(twitteRgpd.getConfig(id, 'containerElement'), id, () => {
            twitteRgpd.changeMindFunction(id);
        });
    },
    changeMindFunction: (id) => {
        // remove the cookie
        twitteRgpd.setCookie('twitteRgpd', '', -1);
        // display the question again
        twitteRgpd.displayQuestion(twitteRgpd.getConfig(id, 'containerElement'), id, () => {
            twitteRgpd.acceptFunction(id);
        }, () => {
            twitteRgpd.refuseFunction(id);
        });
    },
    getConfig: (id, property) => {
        if (window.twitteRgpd && window.twitteRgpd[id] && window.twitteRgpd[id].configuration && window.twitteRgpd[id].configuration[property]) {
            return window.twitteRgpd[id].configuration[property];
        }
        return null;
    },
    storeConfiguration: (containerElement, configuration) => {
        // generate the widget id
        const id = twitteRgpd.generateId();
        if (!window.twitteRgpd) {
            window.twitteRgpd = {};
        }
        window.twitteRgpd[id] = {};
        // set the configuration
        const defaultConfiguration = twitteRgpd.defaultConfiguration;
        const myConfiguration = {};
        for (const property in defaultConfiguration) {
            if (configuration[property] === undefined) {
                myConfiguration[property] = defaultConfiguration[property];
            } else {
                myConfiguration[property] = configuration[property];
            }
        }
        myConfiguration.containerElement = containerElement;
        window.twitteRgpd[id].configuration = myConfiguration;
        return id;
    },
    detectLanguage: () => {
        let lang = navigator.language || navigator.userLanguage;
        lang = lang.substr(0, 2);
        return lang;
    },
    defineLanguage: (id) => {
        if (twitteRgpd.getConfig(id, 'language')) {
            return twitteRgpd.getConfig(id, 'language');
        }
        return twitteRgpd.detectLanguage();
    },
    displayQuestion: (containerElement, id, acceptFunction, refuseFunction) => {
        const html = `
            <div class="twitteRgpd" id="` + id + `" dir="` + twitteRgpd._(id, 'direction') + `">
                <div class="twitteRgpd-title"><strong>` + twitteRgpd._(id, 'title') + `</strong></div>
                <div class="twitteRgpd-message">` + twitteRgpd._(id, 'message') + `</div>
                <div class="twitteRgpd-buttons">
                    <button class="twitteRgpd-accept">` + twitteRgpd._(id, 'accept') + `</button>
                    <button class="twitteRgpd-refuse">` + twitteRgpd._(id, 'refuse') + `</button>
                </div>
            </div>
        `;
        containerElement.innerHTML = html;
        const acceptButton = document.querySelector('#' + id + ' .twitteRgpd-accept');
        const refuseButton = document.querySelector('#' + id + ' .twitteRgpd-refuse');
        acceptButton.addEventListener('click', acceptFunction);
        refuseButton.addEventListener('click', refuseFunction);
    },
    displayRefuseMessage: (containerElement, id, changeMindFunction) => {
        const html = `
            <div class="twitteRgpd" id="` + id + `" dir="` + twitteRgpd._(id, 'direction') + `">
                <div class="twitteRgpd-message">` + twitteRgpd._(id, 'refuseMessage') + `</div>
                <div class="twitteRgpd-buttons">
                    <button class="twitteRgpd-changeMind">` + twitteRgpd._(id, 'changeMind') + `</button>
                </div>
            </div>
        `;
        containerElement.innerHTML = html;
        const changeMindButton = document.querySelector('#' + id + ' .twitteRgpd-changeMind');
        changeMindButton.addEventListener('click', changeMindFunction);
    },
    doLoadTwitter: (containerElement, id, changeMindFunction) => {
        if (twitteRgpd.getConfig(id, 'account') != '') {
            const account = twitteRgpd.getConfig(id, 'account');
            const width = (twitteRgpd.getConfig(id, 'width') ? 'data-width="' + twitteRgpd.getConfig(id, 'width') + '"':'');
            const height = (twitteRgpd.getConfig(id, 'height')? 'data-height="' + twitteRgpd.getConfig(id, 'height') + '"':'');
            const theme = (twitteRgpd.getConfig(id, 'theme') ? 'data-theme="' + twitteRgpd.getConfig(id, 'theme') + '"':'');
            const dataChrome = (twitteRgpd.getConfig(id, 'chrome') ? 'data-chrome="' + twitteRgpd.getConfig(id, 'chrome') + '"':'');
            const tweetLimit = (twitteRgpd.getConfig(id, 'tweetLimit') && twitteRgpd.getConfig(id, 'tweetLimit') > 0 ? 'data-tweet-limit="' + Number(twitteRgpd.getConfig(id, 'tweetLimit')) + '"':'');
            const html = `
            <div class="twitteRgpd" id="` + id + `">
                <a class="twitter-timeline" ` + width + ` ` + height + ` " data-dnt="true" ` + theme + ` ` + dataChrome + ` ` + tweetLimit + ` href="https://twitter.com/` + account + `?ref_src=twsrc%5Etfw">
                    <div class="twitteRgpd-unload" dir="` + twitteRgpd._(id, 'direction') + `">` + twitteRgpd._(id, 'loading') + `</div>
                </a>
                <div class="twitteRgpd-accepted"><small dir="` + twitteRgpd._(id, 'direction') + `">` + twitteRgpd._(id, 'acceptMessage') + `<br><a href="#" class="twitteRgpd-changeMind-small">` + twitteRgpd._(id, 'changeMind') + `</a></small></div>
            </div>`;
            containerElement.innerHTML = html;
            const changeMindButton = document.querySelector('#' + id + ' .twitteRgpd-changeMind-small');
            changeMindButton.addEventListener('click', changeMindFunction);
            // load the script
            const script = document.createElement('script');
            script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
            script.setAttribute('charset', 'utf-8');
            document.head.appendChild(script);
            setTimeout(function() {
                if (document.querySelector('#' + id + ' .twitteRgpd-unload')) {
                    document.querySelector('#' + id + ' .twitteRgpd-unload').innerHTML = twitteRgpd._(id, 'blocked') + `<br><svg class="twitteRgpd-unblock" style="height: 1em; vertical-align: -.125em;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 34.3L48.5 114.9C45.8 160.5 53 231.7 83.2 301.2s83.4 137.3 172.8 175.9c89.4-38.7 142.6-106.4 172.8-175.9s37.4-140.7 34.7-186.3L256 34.3zM494.3 92.5l1.2 20.5c2.9 50-4.9 126.3-37.3 200.9c-32.7 75.2-91.1 150-189.4 192.6L256 512l-12.7-5.5C144.9 463.9 86.5 389.2 53.9 313.9C21.4 239.3 13.6 162.9 16.6 113l1.2-20.5L36.9 85 244.4 4.5 256 0l11.6 4.5L475.1 85l19.2 7.4z"/></svg>`;
                }
            }, 5000);
            setTimeout(function() {
                if (document.querySelector('#' + id + ' .twitteRgpd-accepted')) {
                    document.querySelector('#' + id + ' .twitteRgpd-accepted').style.display = 'none';
                }
            }, 10000);
        } else {
            throw new Error('TwitteRgpd: no account defined');
        }
    },
    injectCSS: (id) => {
        if (window.twitteRgpdInjectedCSS) {
            return;
        }
        const defaultStylesheet = `
        .twitteRgpd-title {
            font-size: 1.2em;
            margin-bottom: 10px;
        }
        .twitteRgpd-message {
            margin-bottom: 10px;
        }
        .twitteRgpd-buttons {
            text-align: right;
        }
        .twitteRgpd-accept, .twitteRgpd-refuse, .twitteRgpd-changeMind {
            background-color: #1da1f2;
            color: #fff;
            border: none;
            border-radius: 5px;
            padding: 5px 10px;
            cursor: pointer;
        }
        .twitteRgpd-accept:hover, .twitteRgpd-refuse:hover, .twitteRgpd-changeMind:hover {
            background-color: #0c85d0;
        }
        .twitteRgpd-accepted {
            margin-top: 10px;
            text-align: center;
            line-height: 0.8em;
            font-size: 0.8em;
            opacity: 0.8;
        }
        .twitteRgpd-unload {
            text-align: center;
            font-size: 1.2em;
            font-weight: bold;
            margin-top: 10px;
        }
        .twitteRgpd-unblock {
            text-align: center;
            font-size: 1.2em;
        }`;
        let myStylesheet = '';
        if (!twitteRgpd.getConfig(id, 'removeStylesheet') || twitteRgpd.getConfig(id, 'removeStylesheet') !== true) {
            myStylesheet = defaultStylesheet;
        }
        if (twitteRgpd.getConfig(id, 'stylesheet')) {
            myStylesheet += twitteRgpd.getConfig(id, 'stylesheet');
        }
        const style = document.createElement('style');
        style.innerHTML = myStylesheet;
        document.head.appendChild(style);
        window.twitteRgpdInjectedCSS = true;
    },
    getCookie: (cookieName) => {
        const cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].split('=');
            if (cookie[0].trim() == cookieName) {
                return cookie[1];
            }
        }
        return null;
    },
    setCookie: (cookieName, value, days) => {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = 'expires=' + date.toUTCString();
        document.cookie = cookieName + '=' + value + ';' + expires + ';path=/';
    },
    cookieExists: (cookieName) => {
        return twitteRgpd.getCookie(cookieName) != null;
    },
    _: (id, key) => {
        const language = twitteRgpd.defineLanguage(id);
        return twitteRgpd._i18n(id, language, key);
    },
    generateId: () => {
        let id = 'twitteRgpd-';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 10; i++) {
            id += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return id;
    },
    _i18n: (id, language, key) => {
        const translations = {
            'fr': {
                'direction': 'ltr',
                'title': 'Souhaitez-vous afficher notre fil Twitter ?',
                'message': 'Une connexion avec Twitter sera opérée, cette connexion est susceptible de partager certaines de vos données personnelles avec Twitter.',
                'accept': 'Accepter et afficher Twitter',
                'refuse': 'Refuser et masquer Twitter',
                'refuseMessage': 'Vous avez refusé le chargement du widget Twitter. Vous pouvez changer d\'avis en cliquant sur le bouton ci-dessous.',
                'acceptMessage': 'Vous avez accepté le chargement du widget Twitter. Vous pouvez changer d\'avis en cliquant sur le bouton ci-dessous.',
                'changeMind': 'Changer d\'avis',
                'loading': 'Chargement du widget Twitter...',
                'blocked': 'Le widget Twitter est bloqué par votre navigateur. Si vous voyez une icône ressemblant à ceci dans votre navigateur, cliquez dessus pour le débloquer.'
            },
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
            },
            'eo': {
                'direction': 'ltr',
                'title': 'Ĉu vi volas montri nian Twitter-fluon?',
                'message': 'Konigado kun Twitter estos farita, tiu konekto povas dividi iujn el viaj personaj datumoj kun Twitter.',
                'accept': 'Akcepti kaj montri Twitter',
                'refuse': 'Rifuzi kaj kaŝi Twitter',
                'refuseMessage': 'Vi rifuzis la ŝarĝadon de la Twitter-viŝeto. Vi povas ŝanĝi vian opinion per klako sur la butono sube.',
                'acceptMessage': 'Vi permesis la ŝarĝadon de la Twitter-viŝeto. Vi povas ŝanĝi vian opinion per klako sur la butono sube.',
                'changeMind': 'Ŝanĝi vian opinion',
                'loading': 'Ŝarĝante Twitter-viŝeton...',
                'blocked': 'La Twitter-viŝeto estas blokita de via retumilo. Se vi vidas ikonon kiel ĉi tiu en via retumilo, klaku ĝin por malbloki ĝin.'
            },
            'es': {
                'direction': 'ltr',
                'title': '¿Quiere mostrar nuestro feed de Twitter?',
                'message': 'Se establecerá una conexión con Twitter, esta conexión puede compartir algunos de sus datos personales con Twitter.',
                'accept': 'Aceptar y mostrar Twitter',
                'refuse': 'Rechazar y ocultar Twitter',
                'refuseMessage': 'Ha rechazado la carga del widget de Twitter. Puede cambiar de opinión haciendo clic en el botón de abajo.',
                'acceptMessage': 'Ha permitido la carga del widget de Twitter. Puede cambiar de opinión haciendo clic en el botón de abajo.',
                'changeMind': 'Cambiar de opinión',
                'loading': 'Cargando el widget de Twitter...',
                'blocked': 'El widget de Twitter está bloqueado por su navegador web. Si ve un icono como este en su navegador, haga clic en él para desbloquearlo.'
            },
            'ja': {
                'direction': 'ltr',
                'title': 'Twitterフィードを表示しますか？',
                'message': 'Twitterとの接続が確立され、この接続によりTwitterとの間で個人データが共有される可能性があります。',
                'accept': 'Twitterを許可して表示',
                'refuse': 'Twitterを拒否して非表示',
                'refuseMessage': 'Twitterウィジェットの読み込みを拒否しました。下のボタンをクリックすると、考えを変えることができます。',
                'acceptMessage': 'Twitterウィジェットの読み込みを許可しました。下のボタンをクリックすると、考えを変えることができます。',
                'changeMind': '考えを変える',
                'loading': 'Twitterウィジェットの読み込み中...',
                'blocked': 'Twitterウィジェットは、Webブラウザーによってブロックされています。ブラウザーにこのようなアイコンが表示された場合は、クリックしてブロックを解除してください。'
            },
            'de': {
                'direction': 'ltr',
                'title': 'Möchten Sie unseren Twitter-Feed anzeigen?',
                'message': 'Es wird eine Verbindung zu Twitter hergestellt. Diese Verbindung kann einige Ihrer persönlichen Daten mit Twitter teilen.',
                'accept': 'Akzeptieren und Twitter anzeigen',
                'refuse': 'Ablehnen und Twitter ausblenden',
                'refuseMessage': 'Sie haben das Laden des Twitter-Widgets abgelehnt. Sie können Ihre Meinung ändern, indem Sie auf die Schaltfläche unten klicken.',
                'acceptMessage': 'Sie haben das Laden des Twitter-Widgets erlaubt. Sie können Ihre Meinung ändern, indem Sie auf die Schaltfläche unten klicken.',
                'changeMind': 'Meinung ändern',
                'loading': 'Twitter-Widget wird geladen...',
                'blocked': 'Das Twitter-Widget wird von Ihrem Webbrowser blockiert. Wenn Sie ein Symbol wie dieses in Ihrem Browser sehen, klicken Sie darauf, um es zu entsperren.'
            },
            'it': {
                'direction': 'ltr',
                'title': 'Vuoi visualizzare il nostro feed Twitter?',
                'message': 'Verrà stabilita una connessione con Twitter, questa connessione potrebbe condividere alcuni dei tuoi dati personali con Twitter.',
                'accept': 'Accetta e visualizza Twitter',
                'refuse': 'Rifiuta e nascondi Twitter',
                'refuseMessage': 'Hai rifiutato il caricamento del widget Twitter. Puoi cambiare idea facendo clic sul pulsante qui sotto.',
                'acceptMessage': 'Hai consentito il caricamento del widget Twitter. Puoi cambiare idea facendo clic sul pulsante qui sotto.',
                'changeMind': 'Cambia idea',
                'loading': 'Caricamento del widget Twitter...',
                'blocked': 'Il widget Twitter è bloccato dal tuo browser web. Se vedi un\'icona come questa nel tuo browser, fai clic su di essa per sbloccarla.'
            },
            'nl': {
                'direction': 'ltr',
                'title': 'Wil je onze Twitter-feed weergeven?',
                'message': 'Er wordt een verbinding met Twitter gemaakt, deze verbinding kan enkele van uw persoonlijke gegevens delen met Twitter.',
                'accept': 'Accepteer en toon Twitter',
                'refuse': 'Weiger en verberg Twitter',
                'refuseMessage': 'Je hebt het laden van de Twitter-widget geweigerd. Je kunt van gedachten veranderen door op de onderstaande knop te klikken.',
                'acceptMessage': 'Je hebt het laden van de Twitter-widget toegestaan. Je kunt van gedachten veranderen door op de onderstaande knop te klikken.',
                'changeMind': 'Van gedachten veranderen',
                'loading': 'Twitter-widget wordt geladen...',
                'blocked': 'De Twitter-widget is geblokkeerd door je webbrowser. Als je een pictogram als dit in je browser ziet, klik er dan op om het te deblokkeren.'
            },
            'pt': {
                'direction': 'ltr',
                'title': 'Você quer mostrar nosso feed do Twitter?',
                'message': 'Uma conexão com o Twitter será estabelecida, essa conexão pode compartilhar alguns de seus dados pessoais com o Twitter.',
                'accept': 'Aceitar e mostrar o Twitter',
                'refuse': 'Recusar e ocultar o Twitter',
                'refuseMessage': 'Você recusou o carregamento do widget do Twitter. Você pode mudar de ideia clicando no botão abaixo.',
                'acceptMessage': 'Você permitiu o carregamento do widget do Twitter. Você pode mudar de ideia clicando no botão abaixo.',
                'changeMind': 'Mudar de ideia',
                'loading': 'Carregando o widget do Twitter...',
                'blocked': 'O widget do Twitter está bloqueado pelo seu navegador da Web. Se você vir um ícone como este no seu navegador, clique nele para desbloqueá-lo.'
            },
            'ru': {
                'direction': 'ltr',
                'title': 'Хотите отобразить нашу ленту Twitter?',
                'message': 'Будет установлено соединение с Twitter, это соединение может поделиться некоторыми из ваших личных данных с Twitter.',
                'accept': 'Принять и показать Twitter',
                'refuse': 'Отклонить и скрыть Twitter',
                'refuseMessage': 'Вы отказались от загрузки виджета Twitter. Вы можете передумать, нажав кнопку ниже.',
                'acceptMessage': 'Вы разрешили загрузку виджета Twitter. Вы можете передумать, нажав кнопку ниже.',
                'changeMind': 'Передумать',
                'loading': 'Загрузка виджета Twitter...',
                'blocked': 'Виджет Twitter заблокирован вашим веб-браузером. Если вы видите такую ​​иконку в своем браузере, нажмите на нее, чтобы разблокировать.'
            },  
            'uk': {
                'direction': 'ltr',
                'title': 'Хочете відобразити нашу стрічку Twitter?',
                'message': 'Буде встановлено з\'єднання з Twitter, це з\'єднання може поділитися деякими з ваших особистих даних з Twitter.',
                'accept': 'Прийняти і показати Twitter',
                'refuse': 'Відхилити і приховати Twitter',
                'refuseMessage': 'Ви відмовилися від завантаження віджета Twitter. Ви можете передумати, натиснувши кнопку нижче.',
                'acceptMessage': 'Ви дозволили завантаження віджета Twitter. Ви можете передумати, натиснувши кнопку нижче.',
                'changeMind': 'Передумати',
                'loading': 'Завантаження віджета Twitter...',
                'blocked': 'Віджет Twitter заблокований вашим веб-браузером. Якщо ви бачите таку ​​іконку у своєму браузері, натисніть на неї, щоб розблокувати.'
            },
            'tw': {
                'direction': 'ltr',
                'title': '您想顯示我們的 Twitter 動態嗎？',
                'message': '將會建立與 Twitter 的連線，此連線可能會與 Twitter 分享您的某些個人資料。',
                'accept': '接受並顯示 Twitter',
                'refuse': '拒絕並隱藏 Twitter',
                'refuseMessage': '您已拒絕載入 Twitter 小工具。您可以點擊下方按鈕改變主意。',
                'acceptMessage': '您已允許載入 Twitter 小工具。您可以點擊下方按鈕改變主意。',
                'changeMind': '改變主意',
                'loading': '正在載入 Twitter 小工具...',
                'blocked': '您的網頁瀏覽器已封鎖 Twitter 小工具。如果您在瀏覽器中看到像這樣的圖示，請點擊它以解除封鎖。'
            },
            'zh': {
                'direction': 'ltr',
                'title': '您想显示我们的 Twitter 动态吗？',
                'message': '将会建立与 Twitter 的连接，此连接可能会与 Twitter 分享您的某些个人资料。',
                'accept': '接受并显示 Twitter',
                'refuse': '拒绝并隐藏 Twitter',
                'refuseMessage': '您已拒绝载入 Twitter 小工具。您可以点击下方按钮改变主意。',
                'acceptMessage': '您已允许载入 Twitter 小工具。您可以点击下方按钮改变主意。',
                'changeMind': '改变主意',
                'loading': '正在载入 Twitter 小工具...',
                'blocked': '您的网页浏览器已封锁 Twitter 小工具。如果您在浏览器中看到像这样的图示，请点击它以解除封锁。'
            },
            'pl': {
                'direction': 'ltr',
                'title': 'Czy chcesz wyświetlić nasz kanał Twitter?',
                'message': 'Nawiązane zostanie połączenie z Twitterem, które może udostępnić niektóre z Twoich danych osobowych.',
                'accept': 'Akceptuj i pokaż Twitter',
                'refuse': 'Odrzuć i ukryj Twitter',
                'refuseMessage': 'Odmówiłeś załadowania widżetu Twittera. Możesz zmienić zdanie, klikając poniższy przycisk.',
                'acceptMessage': 'Zaakceptowałeś załadowanie widżetu Twittera. Możesz zmienić zdanie, klikając poniższy przycisk.',
                'changeMind': 'Zmień zdanie',
                'loading': 'Ładowanie widżetu Twittera...',
                'blocked': 'Widżet Twittera jest zablokowany przez przeglądarkę internetową. Jeśli widzisz taki ikonę w przeglądarce, kliknij ją, aby odblokować.'
            },
            'ca': {
                'direction': 'ltr',
                'title': 'Vols mostrar el nostre feed de Twitter?',
                'message': 'Es crearà una connexió amb Twitter, aquesta connexió pot compartir algunes de les seves dades personals amb Twitter.',
                'accept': 'Accepta i mostra Twitter',
                'refuse': 'Refusa i amaga Twitter',
                'refuseMessage': 'Heu rebutjat la càrrega del widget de Twitter. Podeu canviar d’opinió fent clic al botó de sota.',
                'acceptMessage': 'Heu permès la càrrega del widget de Twitter. Podeu canviar d’opinió fent clic al botó de sota.',
                'changeMind': 'Canvia d’opinió',
                'loading': 'Carregant el widget de Twitter...',
                'blocked': 'El widget de Twitter està bloquejat pel vostre navegador web. Si veieu un ícona com aquesta al vostre navegador, feu-hi clic per desbloquejar-lo.'
            },
            'eu': {
                'direction': 'ltr',
                'title': 'Erakutsi nahi duzu gure Twitter feed-a?',
                'message': 'Twitterrekin konexio bat sortuko da, eta konexio horrek zure datu pertsonal batzuk Twitterrekin partekatu ditzake.',
                'accept': 'Onartu eta erakutsi Twitter',
                'refuse': 'Ukatu eta ezkutatu Twitter',
                'refuseMessage': 'Twitter widget-a kargatzea ukatu duzu. Hurrengo botoia sakatuz aldatu dezakezu zure erabakiari buruz.',
                'acceptMessage': 'Twitter widget-a kargatzea onartu duzu. Hurrengo botoia sakatuz aldatu dezakezu zure erabakiari buruz.',
                'changeMind': 'Aldatu zure erabakiari buruz',
                'loading': 'Twitter widget-a kargatzen...',
                'blocked': 'Zure nabigatzaileak Twitter widget-a blokeatu du. Nabigatzailean ikusten duzun ikono baten antzekoa baduzu, sakatu ikonoa blokeoa kentzeko.'
            },
            'oc': {
                'direction': 'ltr',
                'title': 'Volètz mostrar nòstre fil Twitter ?',
                'message': 'Serà creat una connexion amb Twitter, aquesta connexion pòt partejar qualques de vòstras donadas personals amb Twitter.',
                'accept': 'Acceptar e mostrar Twitter',
                'refuse': 'Refusar e amagar Twitter',
                'refuseMessage': 'Avètz refusat lo widget Twitter. Podètz cambiar d’avi en clicar sul boton de jos.',
                'acceptMessage': 'Avètz acceptat lo widget Twitter. Podètz cambiar d’avi en clicar sul boton de jos.',
                'changeMind': 'Cambiar d’avi',
                'loading': 'Cargament del widget Twitter...',
                'blocked': 'Lo widget Twitter es blocat pel vòstre navigator web. Se veiretz un icona coma aquò sul vòstre navigator, clicatz dessús per desbloquètz.'
            },
            'ar': {
                'direction': 'rtl',
                'title': 'هل ترغب في عرض تغذيتنا على تويتر؟',
                'message': 'سيتم إنشاء اتصال مع تويتر، وقد يشارك هذا الاتصال بعض البيانات الشخصية مع تويتر.',
                'accept': 'قبول وعرض تويتر',
                'refuse': 'رفض وإخفاء تويتر',
                'refuseMessage': 'لقد رفضت تحميل ويدجيت تويتر. يمكنك تغيير رأيك عن طريق النقر على الزر أدناه.',
                'acceptMessage': 'لقد وافقت على تحميل ويدجيت تويتر. يمكنك تغيير رأيك عن طريق النقر على الزر أدناه.',
                'changeMind': 'تغيير رأيك',
                'loading': 'تحميل ويدجيت تويتر...',
                'blocked': 'ويدجيت تويتر محظور من قبل متصفح الويب الخاص بك. إذا رأيت رمزًا مثل هذا في متصفحك، فانقر فوقه لإلغاء الحظر.'
            },
            'he': {
                'direction': 'rtl',
                'title': 'האם ברצונך להציג את הפיד שלנו בטוויטר?',
                'message': 'יצירת חיבור עם טוויטר, חיבור זה יכול לשתף חלק מהנתונים האישיים שלך עם טוויטר.',
                'accept': 'אשר והצג את טוויטר',
                'refuse': 'דחה והסתר את טוויטר',
                'refuseMessage': 'דחית את טעינת וידג\'ט טוויטר. ניתן לשנות את דעתך על ידי לחיצה על הלחצן למטה.',
                'acceptMessage': 'אישרת טעינת וידג\'ט טוויטר. ניתן לשנות את דעתך על ידי לחיצה על הלחצן למטה.',
                'changeMind': 'שנה את דעתך',
                'loading': 'טעינת וידג\'ט טוויטר...',
                'blocked': 'וידג\'ט טוויטר חסום על ידי הדפדפן שלך. אם תראה סמל כזה בדפדפן שלך, לחץ עליו כדי לבטל את החסימה.'
            },
            'hi': {
                'direction': 'ltr',
                'title': 'क्या आप हमारे ट्विटर फ़ीड को दिखाना चाहते हैं?',
                'message': 'ट्विटर के साथ एक कनेक्शन बनाया जाएगा, यह कनेक्शन आपके कुछ निजी डेटा को ट्विटर के साथ साझा कर सकता है।',
                'accept': 'स्वीकार करें और ट्विटर दिखाएं',
                'refuse': 'इनकार करें और ट्विटर छिपाएं',
                'refuseMessage': 'आपने ट्विटर विजेट को लोड करने से इनकार कर दिया है। आप नीचे दिए गए बटन पर क्लिक करके अपने विचार को बदल सकते हैं।',
                'acceptMessage': 'आपने ट्विटर विजेट को लोड करने की स्वीकृति दी है। आप नीचे दिए गए बटन पर क्लिक करके अपने विचार को बदल सकते हैं।',
                'changeMind': 'अपने विचार को बदलें',
                'loading': 'ट्विटर विजेट लोड हो रहा है ...',
                'blocked': 'आपके वेब ब्राउज़र ने ट्विटर विजेट को ब्लॉक कर दिया है। यदि आप अपने ब्राउज़र में इस तरह का एक प्रतीक देखते हैं, तो उसे अनब्लॉक करने के लिए उस पर क्लिक करें।'
            },
            'ko': {
                'direction': 'ltr',
                'title': '트위터 위젯을 표시하시겠습니까?',
                'message': '트위터와 연결이 생성되며 이 연결은 일부 개인 데이터를 트위터와 공유할 수 있습니다.',
                'accept': '승인하고 트위터 표시',
                'refuse': '거절하고 트위터 숨기기',
                'refuseMessage': '트위터 위젯을 로드하는 것을 거부했습니다. 아래 버튼을 클릭하여 마음을 바꿀 수 있습니다.',
                'acceptMessage': '트위터 위젯을 로드하는 것을 승인했습니다. 아래 버튼을 클릭하여 마음을 바꿀 수 있습니다.',
                'changeMind': '마음을 바꾸다',
                'loading': '트위터 위젯 로드 중 ...',
                'blocked': '웹 브라우저가 트위터 위젯을 차단했습니다. 브라우저에서 이와 같은 기호를 보면 차단을 해제하려면 클릭하십시오.'
            },
            'gd': {
                'direction': 'ltr',
                'title': 'An eilbheiread Twitter a tha thu airson sealltainn?',
                'message': 'Bidh ceangal a \'dol a-mach le Twitter agus faodaidh an ceangal seo cuid de d\'fhiosrachadh prìobhaideach a roinn le Twitter.',
                'accept': 'Gabh ri agus seall Twitter',
                'refuse': 'Diùltadh agus cuir Twitter air falbh',
                'refuseMessage': 'Chuir thu d\'àireamh Twitter air falbh. Faodaidh tu do mheasgachadh atharrachadh le bhith a \'briogadh air an ìomhaigh gu h-ìosal.',
                'acceptMessage': 'Chuir thu d\'àireamh Twitter air falbh. Faodaidh tu do mheasgachadh atharrachadh le bhith a \'briogadh air an ìomhaigh gu h-ìosal.',
                'changeMind': 'Atharrachadh do mheasgachadh',
                'loading': 'A \'luchdadh Twitter widget ...',
                'blocked': 'Thug do bhrabhsair-lìn Twitter widget air falbh. Ma tha thu a \'faicinn comharra mar seo ann an do bhrabhsair-lìn, brùth air a \'chomharra seo gus a bhacadh.'
            },
        };
        if (twitteRgpd.getConfig(id, 'translations') && twitteRgpd.getConfig(id, 'translations')[language] && twitteRgpd.getConfig(id, 'translations')[language][key]) {
            return twitteRgpd.getConfig(id, 'translations')[language][key];
        }
        if (!translations[language]) {
            language = 'en';
        }
        return translations[language][key];
    }
}
