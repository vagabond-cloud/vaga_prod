import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { stringToPath } from "@cosmjs/crypto";


export const createWallet = async () => {

    const wallet = await DirectSecp256k1HdWallet.generate(24, {
        hdPath: stringToPath("m/44'/856'/0'/0/0"),
        prefix: "vaga",
    });


    const [firstAccount] = await wallet.getAccounts();

    return {
        address: firstAccount.address,
        mnemonic: wallet.mnemonic,
        privateKey: wallet.privateKey
    }

}