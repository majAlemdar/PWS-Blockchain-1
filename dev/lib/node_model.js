import Blockchain from './blockchain.js';

const PORT = process.argv[process.argv.length - 1]; //verschilt per node, zie npm command
const currentNodeAddress = `http://localhost:${PORT}`; //unieke adres van deze node - bijv. 'http://localhost:3004'
// console.log(PORT);

const bascoin = new Blockchain(currentNodeAddress); //object maken uit de Blockchain class

export { bascoin, currentNodeAddress, PORT }; 