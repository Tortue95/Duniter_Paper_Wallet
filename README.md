# Duniter Paper Wallet

Duniter Paper Wallet is a web application (all-in-one HTML document with embedded
JavaScript/Css/Images) for generate cold wallet (public/private key) to saving your coins for the Duniter Protocol.

You can try a demo [Here](https://duniter.tednet.fr/paperwallet/)

## Instructions

- Download all-in-one HTML document `Generator.html`
- Put this HTML page on USB key.
- Boot your pc on linux live distribution. (ex: Tails)
- Remove all network connexion.
- Open a `Generator.html` file from the usbkey.
- Generate and Print multiple paper wallet.

### How to use paper wallet with [Silkaj Client](https://github.com/duniter/silkaj)

For transfet amount to the destination and put the back change to the new paper wallet:

`./silkaj transaction --auth-wif --amountDU=<amount> --output=<destination> --allSources --outputBackChange=<public key of new paper wallet>`

After that silkaj client will ask you the Wif or EWif adresse.

Exemple:

`./silkaj transaction --auth-wif --amountDU=10 --output=Com8rJukCozHZyFao6AheSsfDQdPApxQRnz7QYFf64mm:3ZE --allSources --outputBackChange=Hvrm4fZQWQ2M26wNczZcijce7cB8XQno2NPTwf5MovPa:5XP`
