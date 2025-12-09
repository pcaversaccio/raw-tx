import * as fs from "fs";
import path from "path";
import * as dotenv from "dotenv";

import { JsonRpcProvider } from "ethers";
// import the serialised signed transaction generated via `sign.ts`, `sign-eip4844.ts`, or `sign-eip7702.ts`
import signedTx from "./out/signed_serialised_transaction.json";

dotenv.config({ quiet: true });

// colour codes for terminal prints
const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";

// the target directory for saving the transaction response/error
const dir = path.join(__dirname, "out");

export async function execute() {
  // load your RPC provider via a `.env` file
  const rpc =
    process.env.RPC_PROVIDER !== undefined ? process.env.RPC_PROVIDER : "";
  const provider = new JsonRpcProvider(rpc);
  try {
    // send the transaction
    const tx = await provider.broadcastTransaction(signedTx);
    console.log("Transaction hash: " + `${GREEN}${tx.hash}${RESET}`);
    const transactionReceipt = await tx.wait();

    // save the transaction receipt in a JSON file
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const saveDir = path.normalize(path.join(dir, "transaction_receipt.json"));
    fs.writeFileSync(saveDir, JSON.stringify(transactionReceipt));

    console.log(
      `\n${GREEN}Transaction has been successfully broadcasted!${RESET}`,
    );
    console.log(`Transaction details written to: ${GREEN}${saveDir}${RESET}\n`);
  } catch (err) {
    // save the transaction error in a JSON file
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const saveDir = path.normalize(path.join(dir, "transaction_error.json"));
    fs.writeFileSync(saveDir, JSON.stringify(err));

    console.log(`\n${RED}Transaction broadcasting failed!${RESET}`);
    console.log(`Error details written to: ${RED}${saveDir}${RESET}\n`);
  }
}

execute().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
