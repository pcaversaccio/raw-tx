import * as dotenv from "dotenv";
import { ethers } from "ethers";
import { serialize } from "@ethersproject/transactions";

dotenv.config();

async function main() {
  const privateKey =
    process.env.PRIVATE_KEY !== undefined ? process.env.PRIVATE_KEY : ""; // Load your private key via a `.env` file
  const wallet = new ethers.Wallet(privateKey);

  console.log("Using wallet address " + wallet.address);

  // A submitted transaction includes the following information:
  //    - to?: string
  //    - nonce?: number
  //    - gasLimit?: BigNumberish
  //    - gasPrice?: BigNumberish
  //    - data?: BytesLike
  //    - value?: BigNumberish
  //    - chainId?: number
  //    - type?: number | null // EIP-2930; Type 1 & EIP-1559; Type 2
  //    - accessList?: AccessListish
  //    - maxPriorityFeePerGas?: BigNumberish // EIP-1559; Type 2
  //    - maxFeePerGas?: BigNumberish // EIP-1559; Type 2

  // Example payload - configure according to your needs
  const transaction = {
    to: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
    value: ethers.parseEther("0"),
    gasLimit: 0x33450,
    maxPriorityFeePerGas: 0x0121152080,
    maxFeePerGas: 0x0a0e7b58821f,
    data: "0x3593564c000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000006492c3ef00000000000000000000000000000000000000000000000000000000000000030a080c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000daaa024c61e0f979c81abe1df3e8916ee2562036000000000000000000000000ffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000064ba49eb00000000000000000000000000000000000000000000000000000000000000000000000000000000000000003fc91a3afd70395cd496c647d5a6cc9d4b2b7fad000000000000000000000000000000000000000000000000000000006492c3f300000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000004115dabf1e904bb46533fe8823abff9b1c98c3d41cadd8e697dbaba9fd6793b1a94cc45e1de8dc21d008b4dad4ec0f7761c0a2d95d15ba65fd5835c64118aa215a1c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000003623bc2a23f00000000000000000000000000000000000000000000000000a79af8cf8ae86800000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000daaa024c61e0f979c81abe1df3e8916ee2562036000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000a79af8cf8ae868",
    nonce: 0x0315,
    type: 2,
    chainId: 0x01,
  };

  // sign and serialise the transaction
  const rawTransaction = serialize(transaction);
  const rawTxHash = ethers.keccak256(rawTransaction);
  const signedRawTransaction = await wallet.signTransaction(transaction);

  // print the raw transaction details
  console.log("rawTx: " + rawTransaction);
  console.log();
  console.log("rawTxHash: " + rawTxHash);
  console.log();
  console.log("signedRawTransaction: " + signedRawTransaction);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
