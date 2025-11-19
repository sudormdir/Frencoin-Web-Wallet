# Frencoin Web Wallet

This repository contains a single–page, static web wallet for
[Frencoin](https://github.com/Apushii/Frencoin) built from the open‑source
Ravencoin PocketRaven web wallet concept.  The goal is to provide a
receive‑only wallet that can be hosted on any static site platform (GitHub
Pages, Netlify, IPFS, etc.) with zero server‑side dependencies.  The
wallet generates a BIP39 12‑word recovery phrase on the client side and
derives the first P2PKH receiving address using the appropriate
Frencoin network parameters.

## Features

* **Client‑side key generation** – all cryptography happens in the
  browser; keys are never sent to a server.
* **12‑word mnemonic** – using the `bip39` library the wallet
  generates a 128‑bit entropy seed, yielding a 12‑word recovery
  phrase.  This mnemonic can be used to restore the wallet in any
  compatible BIP39/BIP44 wallet implementation.
* **HD derivation** – the wallet uses `bitcoinjs‑lib` to derive the
  path `m/44'/42066'/0'/0/0` where 42066 is Frencoin’s BIP44 coin type.
* **Frencoin network parameters** – the Base58 prefixes and extended
  key prefixes are sourced from Frencoin’s `chainparams.cpp` file
  (pubKeyHash=35, scriptHash=95, WIF=128, BIP32 pub=0x0488b21e,
  BIP32 priv=0x0488ade4).  This ensures addresses and private keys
  conform to the official Frencoin specification【398813714615305†L260-L267】.
* **QR code generation** – a convenient QR code for the receiving
  address is rendered on page using the `qrcodejs` library.

## Usage

1. Open `index.html` in a modern web browser.  No build or server
   setup is required.
2. Click **“Generate New Wallet”**.  The app will display a 12‑word
   mnemonic, the corresponding Frencoin address, and the WIF private
   key.  A QR code for the address is also shown.
3. Write down the mnemonic and optionally the WIF private key.  Keep
   them safe—anyone with access to these values can spend your coins.

To deploy the wallet publicly, simply host `index.html` and this
`README.md` on a static web server.  Since there are no external
dependencies besides publicly available CDN libraries, there is no
backend infrastructure to maintain.

## Security considerations

While this wallet is convenient for receiving funds, it does **not**
connect to the Frencoin network to display balances or send
transactions.  For full wallet functionality (viewing UTXOs,
constructing and broadcasting transactions) additional RPC or API
endpoints would be required.  This design choice keeps the codebase
simple and ensures that novice users can immediately generate a safe
address and mnemonic without running a server or trusting a third
party.  Advanced users can import the mnemonic into a more feature‑rich
wallet when they need to spend their coins.