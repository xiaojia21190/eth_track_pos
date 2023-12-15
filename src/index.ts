import { createPublicClient, createWalletClient, http, parseGwei, toHex } from 'viem'
import { waitForTransactionReceipt } from 'viem/_types/actions/public/waitForTransactionReceipt';
import { sendRawTransaction } from 'viem/_types/actions/wallet/sendRawTransaction';
import { signTransaction } from 'viem/_types/actions/wallet/signTransaction';
import { privateKeyToAccount } from 'viem/accounts';
import { polygon } from "viem/chains";

const private_key = '0x46fc7158e670840c3b41bd8333056ab6b30614726023d7a4559554ff444c01d5'
// const recipient_address = '0xB73246B4761Be4F0E0194933f0291ad8C53DCd9b'
const rpc_map = {
  'mainnet': 'https://polygon-mainnet.infura.io/v3/023b357ce2254b6d980517baa9033ffb',
}

const get_transaction = async (text_data: string, priority_fee: string) => {
  const client = createPublicClient({
    key: private_key,
    chain: polygon,
    transport: http(rpc_map.mainnet)
  })

  const account = privateKeyToAccount(private_key);
  const value = parseGwei('0');
  const data_hex = toHex(text_data);
  const base_fee = (await client.getBlock()).baseFeePerGas || BigInt(0);

  const gas_estimate = await client.estimateGas({
    account,
    to: account.address,
    value: value,
    data: data_hex
  })


  const transaction = {
    account,
    to: account.address,
    value: value,
    gas: gas_estimate,
    data: data_hex,
    maxFeePerGas: parseGwei(priority_fee) + base_fee,
    maxPriorityFeePerGas: parseGwei(priority_fee),
  }
  const request = await client.prepareTransactionRequest(transaction)
  console.log(request);
  // const signed_transaction = await account.signTransaction({
  //   ...request,
  //   chainId: client.chain.id
  // })
  // const hash = await client.sendRawTransaction({ serializedTransaction: signed_transaction })
  // await waitForTransactionReceipt(client, {
  //   hash,
  // })

}


const main = async () => {
  const priority_fee = '190';
  const text_data = 'data:,{"a":"NextInscription","p":"oprc-20","op":"mint","tick":"anteater","amt":"100000000"}'
  // const text_data = 'data:,{"a":"NextInscription","p":"oprc-20","op":"mint","tick":"anteater","amt":"100000000"}'
  await get_transaction(text_data, priority_fee);
}


//运行50次
for (const [iter, index] of Array(1).entries()) {
  main();
}

