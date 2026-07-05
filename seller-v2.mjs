import http from 'http';
import { BatchFacilitatorClient } from '@circle-fin/x402-batching/server';

const PORT = process.env.PORT || 4021;

const ARC_TESTNET_NETWORK = 'eip155:5042002';
const ARC_TESTNET_USDC = '0x3600000000000000000000000000000000000000';
const ARC_TESTNET_GATEWAY_WALLET = '0x0077777d7EBA4688BDeF3E311b846F25870A19B9';

const sellerAddress = process.env.SELLER_ADDRESS;
const facilitator = new BatchFacilitatorClient({
  url: 'https://gateway-api-testnet.circle.com'
});

const SOURCES = {
  S1: {
    id: 'S1',
    price: 0.001,
    title: 'Creator Citation Nanopayments',
    author: 'Demo Creator A',
    content: 'AI agents can use nanopayments to pay creators when their work is selected and cited as evidence.'
  },
  S2: {
    id: 'S2',
    price: 0.02,
    title: 'Expensive General Payments Overview',
    author: 'Demo Creator B',
    content: 'A broad overview of payments, less specific to creator citation use cases.'
  },
  S3: {
    id: 'S3',
    price: 0.001,
    title: 'Secondary Creator Monetization Note',
    author: 'Demo Creator C',
    content: 'A secondary note about creator monetization, useful but less directly relevant.'
  }
};

function safeJson(obj) {
  return JSON.stringify(obj, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2);
}

function buildPaymentRequirements(priceUsd) {
  const amount = Math.round(priceUsd * 1_000_000);
  return {
    scheme: 'exact',
    network: ARC_TESTNET_NETWORK,
    asset: ARC_TESTNET_USDC,
    amount: amount.toString(),
    payTo: sellerAddress,
    maxTimeoutSeconds: 345600,
    extra: {
      name: 'GatewayWalletBatched',
      version: '1',
      verifyingContract: ARC_TESTNET_GATEWAY_WALLET,
    },
  };
}

const server = http.createServer(async (req, res) => {
  const match = req.url?.match(/^\/source\/(S[123])$/);
  if (!match) {
    res.writeHead(404);
    res.end('not found');
    return;
  }

  const sourceId = match[1];
  const source = SOURCES[sourceId];
  const endpoint = `http://localhost:${PORT}/source/${sourceId}`;
  const requirements = buildPaymentRequirements(source.price);
  const paymentSignature = req.headers['payment-signature'];

  console.log('\nREQUEST', req.method, req.url);
  console.log('requirements', safeJson(requirements));
  console.log('has payment-signature', Boolean(paymentSignature));

  if (!paymentSignature) {
    const paymentRequired = {
      x402Version: 2,
      resource: {
        url: endpoint,
        description: `Paid creator source ${sourceId}`,
        mimeType: 'application/json',
      },
      accepts: [requirements],
    };

    res.writeHead(402, {
      'Content-Type': 'application/json',
      'PAYMENT-REQUIRED': Buffer.from(JSON.stringify(paymentRequired)).toString('base64'),
    });
    res.end(JSON.stringify({ error: 'payment required', sourceId }));
    return;
  }

  try {
    const paymentPayload = JSON.parse(Buffer.from(paymentSignature, 'base64').toString('utf-8'));

    const verifyResult = await facilitator.verify(paymentPayload, requirements);
    console.log('verifyResult', safeJson(verifyResult));

    if (!verifyResult.isValid) {
      res.writeHead(402, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'payment verification failed', reason: verifyResult.invalidReason }));
      return;
    }

    const settleResult = await facilitator.settle(paymentPayload, requirements);
    console.log('settleResult', safeJson(settleResult));

    if (!settleResult.success) {
      res.writeHead(402, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'payment settlement failed', reason: settleResult.errorReason }));
      return;
    }

    const paymentResponse = {
      success: true,
      transaction: settleResult.transaction,
      network: requirements.network,
      payer: settleResult.payer ?? verifyResult.payer ?? 'unknown',
      sourceId
    };

    res.writeHead(200, {
      'Content-Type': 'application/json',
      'PAYMENT-RESPONSE': Buffer.from(JSON.stringify(paymentResponse)).toString('base64'),
    });
    res.end(JSON.stringify(source));
  } catch (err) {
    console.error('payment processing error', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'payment processing error', message: err.message }));
  }
});

server.listen(PORT, () => {
  console.log(`seller-v2 listening on http://localhost:${PORT}/source/S1`);
});
