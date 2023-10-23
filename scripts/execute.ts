import * as fs from "fs";
import path from "path";
import * as dotenv from "dotenv";

import { ethers } from "ethers";
// import the serialised signed transaction generated via `sign.ts`
import signedTx from "./out/signed_serialised_transaction.json";

dotenv.config();

// colour codes for terminal prints
const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";

// the target directory for saving the transaction response/error
const dir = path.join(__dirname, "out");

export async function execute() {
  // load your RPC provider via a `.env` file
  const rpc =
    process.env.RPC_PROVIDER !== undefined ? process.env.RPC_PROVIDER : "";
  const provider = new ethers.JsonRpcProvider(rpc);
  try {
    // send the transaction
    const tx = await provider.broadcastTransaction(signedTx);
    console.log("Transaction hash: " + `${GREEN}${tx.hash}${RESET}`);
    const transactionReceipt = await tx.wait();

    // save the transaction receipt in a JSON file
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const saveDir = path.normalize(
      path.join(__dirname, "out", "transaction_receipt.json"),
    );
    fs.writeFileSync(saveDir, JSON.stringify(transactionReceipt));
  } catch (err) {
    // save the transaction error in a JSON file
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const saveDir = path.normalize(
      path.join(__dirname, "out", "transaction_error.json"),
    );
    fs.writeFileSync(saveDir, JSON.stringify(err));
  }
}

execute().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
