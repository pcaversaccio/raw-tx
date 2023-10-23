import * as fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
import { ethers, Transaction } from "ethers";

dotenv.config();

// Colour codes for terminal prints
const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";

const dir = path.join(__dirname, "out");

export async function sign() {
  const privateKey =
    process.env.PRIVATE_KEY !== undefined ? process.env.PRIVATE_KEY : ""; // load your private key via a `.env` file
  const provider =
    process.env.PROVIDER !== undefined ? process.env.PROVIDER : ""; // load your provider via a `.env` file
  const wallet = new ethers.Wallet(
    privateKey,
    new ethers.JsonRpcProvider(provider),
  );

  console.log(
    "Using wallet address: " + `${GREEN}${wallet.address}${RESET}`,
    "\n",
  );

  // example payload - configure according to your needs
  const tx = new Transaction();
  tx.to = "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD";
  tx.value = ethers.parseEther("0");
  tx.gasLimit = 0x33450;
  tx.maxPriorityFeePerGas = 0x0121152080;
  tx.maxFeePerGas = 0x0a0e7b58821f;
  tx.data =
    "0x3593564c000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000006492c3ef00000000000000000000000000000000000000000000000000000000000000030a080c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000daaa024c61e0f979c81abe1df3e8916ee2562036000000000000000000000000ffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000064ba49eb00000000000000000000000000000000000000000000000000000000000000000000000000000000000000003fc91a3afd70395cd496c647d5a6cc9d4b2b7fad000000000000000000000000000000000000000000000000000000006492c3f300000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000004115dabf1e904bb46533fe8823abff9b1c98c3d41cadd8e697dbaba9fd6793b1a94cc45e1de8dc21d008b4dad4ec0f7761c0a2d95d15ba65fd5835c64118aa215a1c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000003623bc2a23f00000000000000000000000000000000000000000000000000a79af8cf8ae86800000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000daaa024c61e0f979c81abe1df3e8916ee2562036000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000a79af8cf8ae868";
  tx.nonce = 0x0315;
  tx.type = 2;
  tx.chainId = 0x01;

  // sign the transaction
  const signedTx = Transaction.from(await wallet.signTransaction(tx));

  // save the transaction request as JSON file
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const saveDir = path.normalize(
    path.join(__dirname, "out", "transaction_request.json"),
  );
  fs.writeFileSync(saveDir, JSON.stringify(signedTx));

  // print the raw transaction details
  console.log("Raw Transaction Details", "\n");
  console.log("----------------------------------", "\n");
  console.log("- from: " + `${GREEN}${signedTx.from}${RESET}`);
  console.log("- publicKey: " + `${GREEN}${signedTx.fromPublicKey}${RESET}`);
  console.log("- gasLimit: " + `${GREEN}${signedTx.gasLimit}${RESET}`);
  console.log("- gasPrice: " + `${GREEN}${signedTx.gasPrice}${RESET}`);
  console.log("- maxFeePerGas: " + `${GREEN}${signedTx.maxFeePerGas}${RESET}`);
  console.log(
    "- maxPriorityFeePerGas: " +
      `${GREEN}${signedTx.maxPriorityFeePerGas}${RESET}`,
  );
  console.log("- hash: " + `${GREEN}${signedTx.hash}${RESET}`);
  console.log("- unsignedHash: " + `${GREEN}${signedTx.unsignedHash}${RESET}`);
  console.log("- data: " + `${GREEN}${signedTx.data}${RESET}`);
  console.log("- nonce: " + `${GREEN}${signedTx.nonce}${RESET}`);
  console.log("- to: " + `${GREEN}${signedTx.to}${RESET}`);
  console.log("- value: " + `${GREEN}${signedTx.value}${RESET}`);
  console.log("- type: " + `${GREEN}${signedTx.type}${RESET}`);
  console.log("- typeName: " + `${GREEN}${signedTx.typeName}${RESET}`);
  console.log("- accessList: " + `${GREEN}${signedTx.accessList}${RESET}`);
  console.log("- chainId: " + `${GREEN}${signedTx.chainId}${RESET}`);
  console.log("- serialised: " + `${GREEN}${signedTx.serialized}${RESET}`); // use this output to broadcast a raw transaction using e.g. Etherscan
  console.log(
    "- unsignedSerialised: " + `${GREEN}${signedTx.unsignedSerialized}${RESET}`,
  );
  console.log("- v: " + `${GREEN}${signedTx.signature?.v}${RESET}`);
  console.log("- r: " + `${GREEN}${signedTx.signature?.r}${RESET}`);
  console.log("- s: " + `${GREEN}${signedTx.signature?.s}${RESET}`);
}

sign().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
