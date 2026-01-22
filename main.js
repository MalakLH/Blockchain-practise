const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index= index; //this is the number of the block in our chain
        this.timestamp= timestamp; //the exact time of our transaction
        this.data= data; //the data of our transaction
        this.previousHash= previousHash; //to verify the integrity of our block
        this.hash = this.calculateHash(); //contains the hush of our block and is to be calculated each time
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
} //this is a single block

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()]; //a chain is an array of blocks aka chains

    } //responsible for initializing our blockchain

    createGenesisBlock(){
        return new Block(0, "22/01/2026", "Genesis block","0");
    } //a chain starts by a genesis block
    //a genesis block is added manually

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    } //pretty simple as it just return the last block in the chain

    addBlock(newBlock){
        newBlock.previousHash= this.getLatestBlock().hash 
        //set the previousHash property
        // of the new block to the hash of the previous one

        newBlock.hash= newBlock.calculateHash(); 
        //we need to recalculate the hash of the new block
        //as any modification to the attributes of the block modifies the hash 
        
        this.chain.push(newBlock); 
        //in reality we shouldn't be able to add blocks
        // to our chain so easily cuz we need to have numerous 
        //checks in place to inhance security

    }

    isChainValid(){
        for (let i=1; i < this.chain.length ;i++ ){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            } //recalculate the hash of the bloc to verify its integrity

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            } //verify that the block points to the current previous block
        }

        return true;
    } //to verify the integrity of our chain
}

let newcoin = new Blockchain();

newcoin.addBlock(new Block(1, "24/01/2026", {amount: 4}));
newcoin.addBlock(new Block(2, "26/01/2026", {amount: 10}));

console.log('is blockchain valid? ' + newcoin.isChainValid());

newcoin.chain[1].data = { amount: 100};

// we need all this just to make the chain valid again

newcoin.chain[1].hash = newcoin.chain[1].calculateHash();
// calculate the new hush of bloc 1

newcoin.chain[2].previousHash = newcoin.chain[1].hash;
//modify the previous hash of block 2 to be the nexly calculated hush of block 1

newcoin.chain[2].hash = newcoin.chain[2].calculateHash();
//modify the current hash of block 2 cuz it contains the previous hash

console.log('is blockchain valid? ' + newcoin.isChainValid());

console.log(JSON.stringify(newcoin, null,4));