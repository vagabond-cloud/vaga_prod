import { calculateFee, GasPrice } from "@cosmjs/stargate";


export const getGasPrice = async (amount) => {
    const gasPrice = GasPrice.fromString('0.01uvaga');

    const fee = await calculateFee(
        !amount ? 2000 : amount,
        gasPrice
    )

    return fee
}

