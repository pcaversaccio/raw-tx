// `ethers.js` added EIP-4844 (https://eips.ethereum.org/EIPS/eip-4844) broadcast support
// via `v6.12.0` (https://github.com/ethers-io/ethers.js/releases/tag/v6.12.0)
// also, see https://github.com/ethers-io/ethers.js/issues/4650#issuecomment-2023747487
// note that KZG = Kate, Zaverucha, and Goldberg (https://www.iacr.org/archive/asiacrypt2010/6477178/6477178.pdf)

import * as fs from "fs";
import path from "path";
import * as dotenv from "dotenv";

import { ethers, Transaction } from "ethers";
import { loadKZG } from "kzg-wasm";

dotenv.config();

// colour codes for terminal prints
const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";

// the target directory for saving the transaction request
const dir = path.join(__dirname, "out");

export async function sign() {
  try {
    const privateKey =
      process.env.PRIVATE_KEY !== undefined ? process.env.PRIVATE_KEY : ""; // load your private key via a `.env` file
    const rpc =
      process.env.RPC_PROVIDER !== undefined ? process.env.RPC_PROVIDER : ""; // load your RPC provider via a `.env` file
    const provider = new ethers.JsonRpcProvider(rpc);
    const wallet = new ethers.Wallet(privateKey, provider);

    console.log(
      "Using wallet address: " + `${GREEN}${wallet.address}${RESET}\n`,
    );

    // you need this to generate the KZG commitments and proofs
    // if you have already computed these elsewhere, skip this step
    const kzg = await loadKZG();

    // get the best fee guesses
    const feeData = await provider.getFeeData();

    // example payload - configure according to your needs
    const tx = new Transaction();
    tx.to = "0x9F3f11d72d96910df008Cfe3aBA40F361D2EED03";
    tx.value = ethers.parseEther("0");
    tx.gasLimit = 50_000;
    tx.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
    tx.maxFeePerGas = feeData.maxFeePerGas;
    tx.data = "0x5468697320697320612074657374207472616e73616374696f6e21";
    tx.nonce = await provider.getTransactionCount(wallet.getAddress());
    tx.type = 3;
    tx.chainId = 11_155_111;
    tx.accessList = [
      {
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        storageKeys: [
          "0x0000000000000000000000000000000000000000000000000000000000000002",
          "0x0000000000000000000000000000000000000000000000000000000000000003",
        ],
      },
    ];
    tx.maxFeePerBlobGas = 400_000_000_000;
    // set the KZG library
    // you only need this if you don't specify already fully-valid BLOBs
    tx.kzg = kzg;
    // your BLOBs; these will get padded and use `kzg` to compute the commitments and proofs
    // if you already have the commitment and proofs, you can omit the `kzg` property below and
    // can pass in the `{ data, commitment, proof }` object
    tx.blobs = [ethers.toUtf8Bytes("Long live the BLOBs!")];
    // sign the transaction
    const signedTx = Transaction.from(await wallet.signTransaction(tx));

    // save the serialised signed transaction in a JSON file
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const saveDir = path.normalize(
      path.join(dir, "signed_serialised_transaction.json"),
    );
    fs.writeFileSync(saveDir, JSON.stringify(signedTx.serialized));

    console.log(`${GREEN}Signing attempt has been successful!${RESET}`);
    console.log(
      `Serialised signed transaction written to: ${GREEN}${saveDir}${RESET}\n`,
    );

    // print the raw transaction details
    console.log("Raw Transaction Details", "\n");
    console.log("----------------------------------", "\n");
    console.log("- from: " + `${GREEN}${signedTx.from}${RESET}`);
    console.log("- publicKey: " + `${GREEN}${signedTx.fromPublicKey}${RESET}`);
    console.log("- gasLimit: " + `${GREEN}${signedTx.gasLimit}${RESET}`);
    console.log("- gasPrice: " + `${GREEN}${signedTx.gasPrice}${RESET}`);
    console.log(
      "- maxFeePerGas: " + `${GREEN}${signedTx.maxFeePerGas}${RESET}`,
    );
    console.log(
      "- maxPriorityFeePerGas: " +
        `${GREEN}${signedTx.maxPriorityFeePerGas}${RESET}`,
    );
    console.log("- hash: " + `${GREEN}${signedTx.hash}${RESET}`);
    console.log(
      "- unsignedHash: " + `${GREEN}${signedTx.unsignedHash}${RESET}`,
    );
    console.log("- data: " + `${GREEN}${signedTx.data}${RESET}`);
    console.log("- nonce: " + `${GREEN}${signedTx.nonce}${RESET}`);
    console.log("- to: " + `${GREEN}${signedTx.to}${RESET}`);
    console.log("- value: " + `${GREEN}${signedTx.value}${RESET}`);
    console.log("- type: " + `${GREEN}${signedTx.type}${RESET}`);
    console.log("- typeName: " + `${GREEN}${signedTx.typeName}${RESET}`);
    if (signedTx.accessList != null && signedTx.accessList.length != 0) {
      console.log("- accessList:");
      console.log(signedTx.accessList);
    } else {
      console.log("- accessList: " + `${GREEN}${null}${RESET}`);
    }
    console.log("- chainId: " + `${GREEN}${signedTx.chainId}${RESET}`);
    console.log(
      "- maxFeePerBlobGas: " + `${GREEN}${signedTx.maxFeePerBlobGas}${RESET}`,
    );
    console.log(
      "- blobVersionedHashes: " +
        `${GREEN}${signedTx.blobVersionedHashes}${RESET}`,
    );
    if (signedTx.blobs != null && signedTx.blobs.length != 0) {
      console.log("- blobs:");
      for (let i = 0; i < signedTx.blobs.length; ++i) {
        console.log(signedTx.blobs[i]);
      }
    } else {
      console.log("- blobs: " + `${GREEN}${null}${RESET}`);
    }
    console.log("- serialised: " + `${GREEN}${signedTx.serialized}${RESET}`); // use this output to broadcast a raw transaction using e.g. Etherscan
    console.log(
      "- unsignedSerialised: " +
        `${GREEN}${signedTx.unsignedSerialized}${RESET}`,
    );
    console.log("- v: " + `${GREEN}${signedTx.signature?.v}${RESET}`);
    console.log("- r: " + `${GREEN}${signedTx.signature?.r}${RESET}`);
    console.log("- s: " + `${GREEN}${signedTx.signature?.s}${RESET}`);
  } catch (err) {
    // save the signing attempt error in a JSON file
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const saveDir = path.normalize(
      path.join(dir, "signing_attempt_error.json"),
    );
    fs.writeFileSync(saveDir, JSON.stringify(err));

    console.log(`${RED}Signing attempt failed!${RESET}`);
    console.log(`Error details written to: ${RED}${saveDir}${RESET}\n`);
  }
}

sign().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
