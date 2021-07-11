const HDWalletProvider = require("@truffle/hdwallet-provider");

const residents = {
  mayor: {
    privateKey: "0xb4d5e408e5d61f82b78f9d42e0eba7b4d2f888f6cb1c8b6f4a8e4c66c67cdb9d",
    address: "0xBF7cEf43C5e915004254C5Be9808ee9Bbe162260"
  },
  andy: {
    privateKey: "0x406ad3ce10a6e571455657ab7d725b0b2276d636ee7b8fef0d4b8aaab98214f9",
    address: "0x4ABe9F9f1BC4C2C1ECA98AEAB5d68f2762400d41"
  },
  shelly: {
    privateKey: "0xd53e71dbe2b32ada7a7b0a4b8d5dc1723ef8e22655490202f9b5c48dab04adb4",
    address: "0x4Ae28cC98303db701f72CC4439353d193f361b2E"
  },
  doggy: {
    privateKey: "0x7ad3ec542f425cb8e666952ffaac87b2e6a6915b34d809a5b263323ad2b11e79",
    address: "0x6886e60231243Bb036681600C4F90A38820dfA75"
  }
}
const provider = new HDWalletProvider([
    residents["mayor"].privateKey,
    residents["andy"].privateKey,
    residents["shelly"].privateKey,
    residents["doggy"].privateKey
  ],
  'http://127.0.0.1:8545',
  0,  // start at position 0
  4,  // and use 4 private keys
);

const fromAndy = { from: residents["andy"].address };
const fromShelly = { from: residents["shelly"].address };
const fromDoggy = { from: residents["doggy"].address };

exports.fromAndy = fromAndy;
exports.fromShelly = fromShelly;
exports.fromDoggy = fromDoggy;
exports.residents = residents;
exports.provider = provider;
