import { currentNodeAddress } from "../lib/node_model.js";
import { startGossip } from "./gossipControllers.js";

export async function start() {
    // Verzoek naar de vaste node, zodat de nieuwe node het netwerk joint..
    await startGossip(currentNodeAddress);
};