
import CryptoJS from 'crypto-js'
const { uuid } = require('uuidv4');
import { getVagaClient } from '@/lib/server/vagachain/connect'
import { getWallet } from '@/lib/server/vagachain/wallet'

export const gateway = async (blob) => {
    const session_id = uuid()

    const {
        type,
        account,
        to,
        amount,
        flag,
        node,
        memo,
    } = blob

    const gatewayURL = `${process.env.APP_URL}/gateway/${session_id}`
    const createdAt = new Date().setDate(new Date().getDate())
    const expiresAt = new Date().setDate(new Date().getDate() + 1)

    if (type === "signin") {
        const sessionBlob = {
            session_id,
            type,
            account,
            flag,
            node,
            createdAt,
            expiresAt,
            gatewayURL
        }
        return sessionBlob

    } else if (type === "payment") {

        const value = amount * 1000000

        const sessionBlob = {
            session_id,
            type,
            account,
            to,
            amount: value.toString(),
            flag,
            node,
            expiresAt,
            gatewayURL
        }

        return sessionBlob
    } else {
        return { error: "Invalid type" }
    }
}

export const signTransaction = async (mnemonic) => {
    const wallet = await getWallet(mnemonic)
    const client = await getVagaClient(wallet)

    const account = await client.signer.getAccounts()
    if (account) {
        return "_success"
    } else {
        return { error: "Invalid Signer" }
    }
}