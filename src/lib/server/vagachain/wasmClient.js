import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";


const rpc = "https://rpc.vaga.network:443";

export const getSigningVagaWasmClient = async (wallet) => {

    const signingClient = await SigningCosmWasmClient.connectWithSigner(rpc, wallet);
    return signingClient;
}
