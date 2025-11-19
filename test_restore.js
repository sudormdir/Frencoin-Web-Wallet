const fs = require('fs');
const crypto = require('crypto');
const vm = require('vm');

// Setup global environment similar to browser
global.window = {};
global.navigator = {};
global.self = {};

// Load bitcoinjs into this context
const bitcoinjsCode = fs.readFileSync('frencoin_web_wallet/bitcoinjs.min.js', 'utf8');
vm.runInThisContext(bitcoinjsCode);

// Load english wordlist script
const englishScript = fs.readFileSync('frencoin_web_wallet/english.min.js', 'utf8');
vm.runInThisContext(englishScript);

// Access englishWordlist from global window
const wordlist = window.englishWordlist;
console.log('Wordlist loaded, length:', wordlist.length);

// BIP39 functions
function bytesToHex(buf) {
  return Buffer.from(buf).toString('hex');
}

async function mnemonicToSeed(mnemonic, passphrase = '') {
  // Use Node's pbkdf2Sync for synchronous derive
  const mnemonicNorm = mnemonic.normalize('NFKD');
  const passphraseNorm = passphrase.normalize('NFKD');
  const salt = 'mnemonic' + passphraseNorm;
  return crypto.pbkdf2Sync(Buffer.from(mnemonicNorm, 'utf8'), Buffer.from(salt, 'utf8'), 2048, 64, 'sha512');
}

async function deriveFromMnemonic(mnemonic) {
  const seed = await mnemonicToSeed(mnemonic);
  const frencoin = {
    messagePrefix: '\x18Fren Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 35,
    scriptHash: 95,
    wif: 128,
  };
  const root = bitcoinjs.bip32.fromSeed(seed, frencoin);
  const child = root.derivePath("m/44'/42066'/0'/0/0");
  const { address } = bitcoinjs.payments.p2pkh({ pubkey: child.publicKey, network: frencoin });
  const wif = child.toWIF();
  return { address, wif };
}

// Sample mnemonic from BIP39 test vectors (English) to test determinism
const testMnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
deriveFromMnemonic(testMnemonic).then((res) => {
  console.log('Test address:', res.address);
  console.log('Test WIF:', res.wif);
});
