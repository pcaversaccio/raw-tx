# Ethereum Raw Transaction Signing Script

[![Sanity checks](https://github.com/pcaversaccio/raw-tx/actions/workflows/checks.yml/badge.svg)](https://github.com/pcaversaccio/raw-tx/actions/workflows/checks.yml)
[![License: WTFPL](https://img.shields.io/badge/License-WTFPL-blue.svg)](http://www.wtfpl.net/about)

A [script](./index.ts) to generate a signed raw transaction with [ethers](https://docs.ethers.org/v6).

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

Configure the placeholder payload in [script](./index.ts) according to your needs and run:

```console
yarn generate
```

This will print all raw transaction details to your terminal. Use the output `signedTx.serialized` to broadcast a transaction e.g. with services like [pushTx](https://etherscan.io/pushTx).
