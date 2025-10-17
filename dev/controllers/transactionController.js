import { bascoin } from '../lib/node_model.js';

export async function createAndBroadCastTransaction(req, res) {
    const { senderPublicKey, senderPrivateKey, recipientPublicKey, amount } = req.body;

    const newTransaction = bascoin.createNewTransaction(senderPublicKey, recipientPublicKey, amount);
    console.log(newTransaction);

    // tx toevoegen aan de mempool
    bascoin.addTransactionToMempool(newTransaction);

    if (bascoin.networkNodes.length >= 1) {
        // broadcasten naar de andere nodes
        const broadcastResults = bascoin.networkNodes.map(async (node) => {
            try {
                const response = await fetch(`${node}/transaction/process-transaction`, {
                    method: 'POST',
                    body: JSON.stringify({ newTransaction: newTransaction }),
                    headers: { 'Content-Type': 'application/json' }
                });
                const result = await response.json();
                return { node, status: "succes", result };
            } catch (error) {
                console.log(`Node ${node} faalt: ${error}`);
                return { node, status: 'fail', error };
            };
        });
        const results = await Promise.allSettled(broadcastResults);
        return res.json({ msg: "Tx is aangemaakt, geverifieerd, toegevoegd aan de mempool en broadcasted naar het hele netwerk. Zie blockchain mempool voor meer info.", success: true, newTransaction, results });
    }

    return res.json({ msg: 'Tx is aangemaakt en toegevoegd aan de mempool.', newTransaction, success: true });
};

export function processTransaction(req, res) {
    const { newTransaction } = req.body;

    //elk node voegt de tx in zijn blockchain mempool.
    const nextBlockIndex = bascoin.addTransactionToMempool(newTransaction);
    res.json({ msg: `Tx ontvangen. Zal in blok ${nextBlockIndex} worden opgenomen.` });
};