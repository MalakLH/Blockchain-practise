const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash = '', nonce = 0){
        this.index= index; //this is the number of the block in our chain
        this.timestamp= timestamp; //the exact time of our transaction
        this.data= data; //the data of our transaction
        this.previousHash= previousHash; //to verify the integrity of our block
        this.nonce = nonce;
        this.hash = '0'; //contains the hush of our block and is to be calculated each time
    } //initilize the block

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    } //calculate the hush

    mineBlock(difficulty) {
        const target = Array(difficulty + 1).join("0"); // Creates "0000" if difficulty is 4
        
        this.hash = this.calculateHash();
        
        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.calculateHash(); // Update the hash property directly
        }

        console.log(`Block Mined! Nonce: ${this.nonce}, Hash: ${this.hash}`);
        return this.hash;

    }//PoW by verifying if the hash starts with "0"xdifficulty

} //this is a single block

class Blockchain{
    constructor(){
        this.difficulty= 4; //now we need to set a difficulty level 
        this.chain = [this.createGenesisBlock()]; //a chain is an array of blocks aka chains

    } //responsible for initializing our blockchain

    createGenesisBlock(){
        let genesis =  new Block(0, "22/01/2026", "Genesis block","0"); //a chain starts by a genesis block
        genesis.mineBlock(this.difficulty); //genesis needs mining too 
        return genesis;
    } 
    //a genesis block is added manually

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    } //pretty simple as it just return the last block in the chain

    addBlock(newBlock){
        newBlock.previousHash= this.getLatestBlock().hash 
        //set the previousHash property
        //of the new block to the hash of the previous one

        newBlock.hash= newBlock.mineBlock(this.difficulty); 
        //we need to recalculate the hash of the new block
        //as any modification to the attributes of the block modifies the hash 
        //now we'll use the proof of work
        
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

console.log(JSON.stringify(newcoin, null, 4));
console.log('is blockchain valid? ' + newcoin.isChainValid());
