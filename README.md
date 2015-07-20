# r-indonesia stylesheet

## Pre-development
Install the [BrowserSync Injector Chrome Extension](https://github.com/diagramatics/reddit-browsersync-injector) so the BrowserSync live reload can work.

After that generate a certificate (a .crt and .key) and place it on the root of the project directory. Import the certificate to the browser ([a guide for Chrome](http://stackoverflow.com/questions/7580508/getting-chrome-to-accept-self-signed-localhost-certificate)) to make sure the served files aren't being marked untrusted by Chrome. If this works properly BrowserSync should be active on Reddit.

https://www.flickr.com/photos/dtaylor28/4369918753/in/photolist-7E9YAM-8y4EsV-nmqCgx-6j5Jvk-5Hweo-nUKX4-6zYyZh-qcdc47-7ois5m-5nuyWo-5qBRTM-6zUqB2-88QpAu-dqKWVz-e1yJsM-2qghjo-5Gzni-5vRCum-ot93VT-JGtnY-86KoG5-6zUqYg-6zUuux-6qt6n2-boaks1-6zYBFY-88PYCm-6zYzKY-4DHGz5-6zUr82-7emVBY-ot8yHU-oEuajA-4CLHWd-kJy8xk-kJy5oK-7y9NT2-qFRz2P-88QeZo-cmdHxw-6AHoPa-a156p7-6o1G3q-88LRnp-88HUbg-6tdeww-5s3CQf-7nx5zM-88M4GD-88Qh6S

## Development

CSS is written on a desktop-first approach so overriding Reddit's CSS can be done as efficient as possible. Using mobile-first approach can result in multiple property declarations that rely heavily on Reddit's initial CSS property values that might change over time.
