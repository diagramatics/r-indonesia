# r-indonesia stylesheet

## Pre-development
Install the [BrowserSync Injector Chrome Extension](https://github.com/diagramatics/reddit-browsersync-injector) so the BrowserSync live reload can work.

After that generate a certificate (a .crt and .key) and place it on the root of the project directory. Import the certificate to the browser ([a guide for Chrome](http://stackoverflow.com/questions/7580508/getting-chrome-to-accept-self-signed-localhost-certificate)) to make sure the served files aren't being marked untrusted by Chrome. If this works properly BrowserSync should be active on Reddit.
