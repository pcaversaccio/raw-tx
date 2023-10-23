# Ethereum Raw Transaction Signing Script

[![Sanity checks](https://github.com/pcaversaccio/raw-tx/actions/workflows/checks.yml/badge.svg)](https://github.com/pcaversaccio/raw-tx/actions/workflows/checks.yml)
[![License: WTFPL](https://img.shields.io/badge/License-WTFPL-blue.svg)](http://www.wtfpl.net/about)

A script to [generate](./scripts/sign.ts) and [execute](./scripts/execute.ts) a signed raw transaction with [ethers](https://docs.ethers.org/v6).

## Installation

It is recommended to install [Yarn](https://classic.yarnpkg.com) through the `npm` package manager, which comes bundled with [Node.js](https://nodejs.org/en) when you install it on your system. It is recommended to use a Node.js version `>= 18.0.0`.

Once you have `npm` installed, you can run the following both to install and upgrade Yarn:

```console
npm install --global yarn
```

After having installed Yarn, simply run:

```console
yarn install
```

## Generate a Signed Raw Transaction

Configure the placeholder payload in [`sign`](./scripts/sign.ts) according to your needs and run:

```console
yarn generate
```

This will print all raw transaction details to your terminal. Use the output `signedTx.serialized` to broadcast a transaction e.g. with services like [pushTx](https://etherscan.io/pushTx). You can also use the automatically saved transaction request file `transaction_request.json` (in the `scripts/out` directory) via `yarn execute` as explained in the next section.

## Execute a Signed Raw Transaction

Configure your RPC provider in [`execute`](./scripts/execute.ts) according to your needs and run:

```console
yarn execute
```

If the transaction is successful, it saves a file `transaction_receipt.json` or in case of an failure a file `transaction_error.json` in the `scripts/out` directory.
