import { SigningStargateClient, StargateClient } from "@cosmjs/stargate"

const rpc = 'https://rpc.vaga.network:443'

export const connect = async (wallet) => {
    const client = await StargateClient.connect(rpc, wallet)

    return client
}

export const getVagaClient = async (wallet) => {
    const client = await SigningStargateClient.connectWithSigner(rpc, wallet)

    return client
}