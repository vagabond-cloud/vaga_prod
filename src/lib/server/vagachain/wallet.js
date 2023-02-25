import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { stringToPath } from "@cosmjs/crypto";


const rpc = 'https://rpc.vaga.network:443'

export const getWallet = async (mnemonic) => {
    try {
        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
            mnemonic,
            {
                hdPath: stringToPath("m/44'/856'/0'/0/0"),
                prefix: "vaga"
            },
            { "Mainnet": rpc }
        );
        return wallet
    } catch (err) {
        console.log(err.message)
    }
}