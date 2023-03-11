import { getWallet } from '../wallet'
import { getSigningVagaWasmClient } from '../wasmClient'

export const deployPass = async (mnemonic) => {
    const wallet = await getWallet(mnemonic)
    console.log(wallet)
    let client = await getSigningVagaWasmClient(wallet);
    console.log(client)
    const fee = {
        amount: [
            {
                denom: 'uvaga',
                amount: '20000',
            },
        ],
        gas: '1000000',
    }

    const accounts = await wallet.getAccounts()
    const address = accounts[0].address
    console.log(address)
    const instantiate = await client.instantiate(
        address,
        2,
        {
            name: "VagaProductPass",
            symbol: "VPASS",
            minter: {
                identifier: address
            }, // Minter is the users address
        },
        Math.random().toString(20).substr(2, 6), //random string
        fee
    )
    const contractAddress = instantiate.contractAddress
    return contractAddress

}