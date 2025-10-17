export default class Blockchain {

    constructor(currentNodeAddress) {
        this.chain = [];   //keten
        this.mempool = []; //pool waarin de onbevestigde transacties zich bevinden
        this.currentNodeAddress = currentNodeAddress; //komt van networkNode.js
        this.networkNodes = []; //versimpelde P2P model - bekende nodes

        this.createNewBlock(0, '0', '0'); //genisisBlock
    }

    createNewBlock(nonce, prevBlockHash, hash, transactions = this.mempool) {
        const newBlock = {
            blockHeight: this.chain.length,
            timestamp: Date.now(),
            transactions: transactions,
            nonce: nonce,
            hash: hash,
            prevBlockHash: prevBlockHash
        };

        this.mempool = []; //mempool leeg maken
        this.chain.push(newBlock);
        return newBlock;
    }

    createNewTransaction(senderPublicKey, recipientPublicKey, amount){
        return {
            sender: senderPublicKey,
            recipient: recipientPublicKey,
            amount,
            timestamp: Date.now()
        }
    };

    addTransactionToMempool(transaction){
        this.mempool.push(transaction);
        return (this.getLastBlock()['blockHeight'] + 1) //index van het blok waarin de nieuwe transactie zich zal bevinden
    };
    
    getLastBlock() { return this.chain[this.chain.length - 1]; }
};