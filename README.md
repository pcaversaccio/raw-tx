# Ethereum Raw Transaction Signing Script

[![👮‍♂️ Sanity checks](https://github.com/pcaversaccio/raw-tx/actions/workflows/checks.yml/badge.svg)](https://github.com/pcaversaccio/raw-tx/actions/workflows/checks.yml)
[![License: WTFPL](https://img.shields.io/badge/License-WTFPL-blue.svg)](http://www.wtfpl.net/about)

Two scripts to [generate](./scripts/sign.ts) and [execute](./scripts/execute.ts) a signed raw transaction with [ethers](https://docs.ethers.org/v6).

## Installation

It is recommended to install [`pnpm`](https://pnpm.io) through the `npm` package manager, which comes bundled with [Node.js](https://nodejs.org/en) when you install it on your system. It is recommended to use a Node.js version `>= 18.0.0`.

Once you have `npm` installed, you can run the following both to install and upgrade `pnpm`:

```console
npm install -g pnpm
```

After having installed `pnpm`, simply run:

```console
pnpm install
```

## `.env` File

Create a `.env` file in the root directory and place the private key of your wallet used for signing in the variable `PRIVATE_KEY` and the RPC provider for the transaction in the variable `RPC_PROVIDER`. Example:

```txt
PRIVATE_KEY=abc123abc123abc123abc123abc123abc123abc123abc123abc123abc123abc1
RPC_PROVIDER=https://rpc.ankr.com/eth_goerli
```

## Generate a Signed Raw Transaction

Configure the placeholder payload in [`sign`](./scripts/sign.ts) according to your needs and run:

```console
pnpm generate
```

This will print all raw transaction details to your terminal. Use the output `signedTx.serialized` to broadcast a transaction e.g. with services like [pushTx](https://etherscan.io/pushTx). You can also use the automatically saved serialised signed transaction in `signed_serialised_transaction.json` (in the `scripts/out` directory) via `pnpm execute` as explained in the next section.

## Execute a Signed Raw Transaction

Configure your RPC provider in [`execute`](./scripts/execute.ts) according to your needs and run:

```console
pnpm execute
```

If the transaction is successful, it saves a file `transaction_receipt.json` or in case of a failure a file `transaction_error.json` in the `scripts/out` directory.
