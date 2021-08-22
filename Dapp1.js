const SHA256 = require("crypto-js/sha256");

class Transaction
{
    constructor(fromaddress,toaddress,amount)
    {
        this.fromaddress = fromaddress;
        this.toaddress = toaddress;
        this.amount = amount;
    }
}

class Block
{
    constructor(timestamp,transactions,previousHash=' ')
    {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    calculateHash()
    {
        // Using SHA256 cryptographic hash function to generate the hash of the block.
        return SHA256(this.timestamp+this.previousHash+JSON.stringify(this.transactions)+this.nonce).toString();
    }
    mineNewBlock(difficulty)
    {
        while(this.hash.substring(0,difficulty) !== Array(difficulty+1).join("0"))
        {
            // difficulty=2 00xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("A new block was mined with hash "+this.hash);
    }

}

class BlockChain
{
    constructor()
    {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3;
        this.pendingTransactions = [];
        this.miningReward = 10;
    }
    createGenesisBlock()
    {
        return new Block(0,"01/01/2021","This is a genesis block.","0");
    }
    getLatestBlock()
    {
        return this.chain[this.chain.length-1];
    }
    minePendingTransactions(miningRewardAddress)
    {
        let block = new Block(Date.now(),this.pendingTransactions,this.getLatestBlock().hash);
        block.mineNewBlock(this.difficulty);
        console.log("Block mined successfully!");
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null,miningRewardAddress,this.miningReward)
        ];
    }
    createTransaction(transaction)
    {
        this.pendingTransactions.push(transaction);
    }
    getBalanceOfAddress(address)
    {
        let balance = 0;
        for(const block of this.chain)
        {
            for(const trans of block.transactions)
            {
                if(trans.fromaddress === address)
                {
                    balance = balance-trans.amount;
                }
                if(trans.toaddress === address)
                {
                    balance = balance + trans.amount;
                }
            }
        }
        return balance;
    }
    checkBlockChainValid()
    {
        // No need to check genesis block so i=1
        for(let i=1;i<this.chain.length;i++)
        {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash!==currentBlock.calculateHash())
            return false;
            if(currentBlock.previousHash!==previousBlock.hash)
            return false;
        }
        return true;
    }
}


// Create a cryptocurrency
let bittycoin = new BlockChain();

transaction1 = new Transaction("tom","jerry",100);
bittycoin.createTransaction(transaction1);

transaction2 = new Transaction("jerry","tom",30);
bittycoin.createTransaction(transaction2);

console.log("Started mining by the miner")
bittycoin.minePendingTransactions("gaurav");

console.log("Balance of Tom : "+bittycoin.getBalanceOfAddress("tom"));
console.log("Balance of Jerry : "+bittycoin.getBalanceOfAddress("jerry"));
console.log("Balance of miner Gaurav : "+bittycoin.getBalanceOfAddress("gaurav"));

console.log("Mine the reward which there in pendingTransactions");
bittycoin.minePendingTransactions("gaurav");

console.log("Balance of Tom : "+bittycoin.getBalanceOfAddress("tom"));
console.log("Balance of Jerry : "+bittycoin.getBalanceOfAddress("jerry"));
console.log("Balance of miner Gaurav : "+bittycoin.getBalanceOfAddress("gaurav"));

console.log("Mine the reward which there in pendingTransactions");
bittycoin.minePendingTransactions("gaurav");

// Gaurav can get profit for mining his own transaction as well.

console.log("Balance of Tom : "+bittycoin.getBalanceOfAddress("tom"));
console.log("Balance of Jerry : "+bittycoin.getBalanceOfAddress("jerry"));
console.log("Balance of miner Gaurav : "+bittycoin.getBalanceOfAddress("gaurav"));