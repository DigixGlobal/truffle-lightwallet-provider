const Lightwallet = require('eth-lightwallet');

var options = {
  password: 'test',
  seedPhrase: 'dinner filter frozen verify mix alone mountain onion leisure physical tennis shuffle',
  hdPathString: "m/44'/60'/0'/0"
};

function GetKeystore (options) {
  return new Promise((resolve, reject) => {
    Lightwallet.keystore.createVault(options, (err, ks) => {
      if (err) {
        reject(err);
      } else {
        ks.keyFromPassword(options.password, function (err, pwDerivedKey) {
          if (err) reject(err);

          ks.generateNewAddress(pwDerivedKey, 0);
          resolve(ks);
        });
      }
    });
  });
}

GetKeystore(options).then(key => console.log(key.serialize()));
