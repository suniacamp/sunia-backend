[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)

# sunia's google apps script backend
SUNIA's backend, built using TypeScript, Google Apps Script and [clasp](https://github.com/google/clasp).

## project structure

We're currently porting everything to TypeScript. The `\old` directory (aptly named) contains all deprecated JavaScript files. The `\src` directory contains all in-use files. There is currently only one branch `master` which is used directly in production. In future, we should add a development branch.

##  running on your machine

### requirements

- node, npm
- an internet connection

### setup

1. Run `npm install -g @google/clasp` to install clasp, Google's command line utility for working with apps script projects. In short, it slaps.
2. Use Chrome and add `registrar@sunia.ca` as an account. (We should have an IT/CTO account, but right now it's just an alias. Michael will talk to Andrew about this!)
3. Visit [this link](https://script.google.com/home/usersettings) and make sure the Google Apps Script API is turned on.
4. Run `clasp login` and `clasp create/clone` to get started. See the [documentation](https://github.com/google/clasp) for more information. (Of course when you run login, login to the registrar email!)


### help!

- Have no idea what a 'clasp' is? Try this [Codelab](https://codelabs.developers.google.com/codelabs/clasp/#0) from Google--it takes a much more hands-on approach than this readme!