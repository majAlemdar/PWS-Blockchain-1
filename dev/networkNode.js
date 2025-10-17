import { bascoin, currentNodeAddress, PORT } from './lib/node_model.js';
import { startGossip, registerAndBroadcastNewNode, registerNode, registerNodesBulk } from './controllers/gossipControllers.js';
import { createAndBroadCastTransaction, processTransaction } from './controllers/transactionController.js';
import { consenus } from './controllers/consensusController.js';

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json()); //voor json data
app.use(express.urlencoded({ extended: true })); //voor form data
app.use(express.static(path.join(__dirname, 'public'))); //public dir static hosten

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'blockchain.html')); });
app.get('/explore/blockchain', (req, res) => { res.json(bascoin); });

//Gossip protocol voor het vinden van nieuwe nodes:
// STAP 1-2-3:
app.post('/gossip/register-and-broadcast-node', registerAndBroadcastNewNode);
app.post('/gossip/register-node', registerNode);
app.post('/gossip/register-nodes-bulk', registerNodesBulk);

//Neppe transacties:
app.post('/transaction/create-and-broadcast', createAndBroadCastTransaction);
app.post('/transaction/process-transaction', processTransaction);

//consensus van genesis block en mempool:
app.get('/consensus', consenus);

app.use((req, res) => { res.status(404).send('Pagina niet gevonden'); });

app.listen(PORT, async () => {
    console.log(`Luisteren - localhost:${PORT}`);
    await startGossip(currentNodeAddress);
});