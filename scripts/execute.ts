import * as fs from "fs";
import path from "path";
import { ethers } from "ethers";
import transactionRequest from "./out/transaction_request.json"; // import the signed raw transaction

const dir = path.join(__dirname, "out");
// set your RPC provider here
const rpc = "https://rpc.ankr.com/eth";

export async function execute() {
  const provider = new ethers.JsonRpcProvider(rpc);
  // we create a new random HDNodeWallet because the private key does not matter for the broadcasting of a signed raw transaction
  const signer = ethers.Wallet.createRandom(provider);
  try {
    // send the transaction
    const response = await signer.sendTransaction(transactionRequest);
    await provider.waitForTransaction(response.hash);
    // save the transaction request as JSON file
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const saveDir = path.normalize(
      path.join(__dirname, "out", "transaction_request.json"),
    );
    fs.writeFileSync(saveDir, JSON.stringify(response));
  } catch (err) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    // save the transaction error as JSON file
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
