const {Blockchain, transaction}= require('./Blockchain');
const EC = require('elliptic').ec;
const ec= new EC('secp256k1');

const mykey = ec.keyFromPrivate('ee9c67bc709c4c3555d739bffdae8a69e7741f5854862c94159e14286cb7ce16');
const myWalletAddress= mykey.getPublic('hex');

let newcoin = new Blockchain();

//testing with one transaction

const tr1 = new transaction(myWalletAddress,'public key of another person',10);

tr1.signTransaction(mykey);
newcoin.addTransaction(tr1);

console.log('\n Starting the mining');
newcoin.minePendingTransactions(myWalletAddress);

console.log('\n my balance', newcoin.getBalanceOfAddress(myWalletAddress));

//testing with a second transaction

const tr2 = new transaction(myWalletAddress,'public key of another person',30);

tr2.signTransaction(mykey);
newcoin.addTransaction(tr2);

console.log('\n Starting the mining');
newcoin.minePendingTransactions(myWalletAddress);

console.log('\n my balance', newcoin.getBalanceOfAddress(myWalletAddress));

//trying to tempor with the chain

console.log('Is chain valid?', newcoin.isChainValid());

newcoin.chain[2].transactions[1].amount= 3;
console.log('Is chain valid?', newcoin.isChainValid());