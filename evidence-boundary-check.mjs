import fs from "fs";

const checks = [];
const failures = [];

function read(path) {
  return fs.existsSync(path) ? fs.readFileSync(path, "utf8") : "";
}

function pass(name, detail) {
  checks.push({ status: "PASS", name, detail });
}

function fail(name, detail) {
  checks.push({ status: "FAIL", name, detail });
  failures.push({ name, detail });
}

function json(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

// 1. Final evidence must remain Arc Testnet / LIVE_GATEWAY
try {
  const v3 = json("evidence/live-gateway-evidence-v3.json");
  if (v3.payment_mode === "LIVE_GATEWAY" && v3.network === "eip155:5042002") {
    pass("Arc Testnet LIVE_GATEWAY boundary", "Final V3 evidence is LIVE_GATEWAY on eip155:5042002.");
  } else {
    fail("Arc Testnet LIVE_GATEWAY boundary", `Unexpected payment/network: ${v3.payment_mode} / ${v3.network}`);
  }
} catch (e) {
  fail("Arc Testnet LIVE_GATEWAY boundary", e.message);
}

// 2. Browser page must not trigger live payment
const browserFiles = ["docs/index.html", "web/index.html"];
const forbiddenBrowserPatterns = [
  "BUYER_PRIVATE_KEY",
  "SELLER_PRIVATE_KEY",
  "GatewayClient",
  "gateway.pay",
  "payment-signature",
  "fetch(\"/pay",
  "fetch('/pay",
  "fetch(\"http://localhost:4021",
  "fetch('http://localhost:4021"
];

let browserUnsafe = [];
for (const file of browserFiles) {
  const content = read(file);
  for (const pattern of forbiddenBrowserPatterns) {
    if (content.includes(pattern)) {
      browserUnsafe.push(`${file}: ${pattern}`);
    }
  }
}

if (browserUnsafe.length === 0) {
  pass("No browser-based live payment UI", "docs/index.html and web/index.html are proof viewers only; no private keys, GatewayClient, or payment-triggering fetch calls found.");
} else {
  fail("No browser-based live payment UI", browserUnsafe.join("; "));
}

// 3. Seller-side receipt must be sanitized and honest
try {
  const receipt = json("evidence/settlement-receiving-proof.json");
  const hasCore =
    receipt.payment_mode === "LIVE_GATEWAY" &&
    receipt.network === "eip155:5042002" &&
    receipt.seller_address &&
    receipt.payer &&
    receipt.tx_ref &&
    receipt.amount_paid_usdc &&
    receipt.verify_is_valid === true &&
    receipt.settle_success === true;

  const hasHonestNulls =
    receipt.seller_balance_before === null &&
    receipt.seller_balance_after === null &&
    receipt.delta === null;

  const hasLimitation =
    Array.isArray(receipt.limitations) &&
    receipt.limitations.join(" ").toLowerCase().includes("does not claim a measured seller balance delta");

  if (hasCore && hasHonestNulls && hasLimitation) {
    pass("Seller-side receipt boundary", "Seller receipt proves payTo/payer/amount/tx/verify/settle and explicitly does not claim balance delta.");
  } else {
    fail("Seller-side receipt boundary", "Seller receipt is missing required fields, honest null balance fields, or limitation text.");
  }
} catch (e) {
  fail("Seller-side receipt boundary", e.message);
}

// 4. No production reliability claim
const claimFiles = [
  "README.md",
  "SUBMISSION.md",
  "TEST-EVIDENCE.md",
  "docs/index.html",
  "web/index.html"
];

const forbiddenClaimRegexes = [
  /\bproduction[- ]ready\b/i,
  /\bproduction[- ]grade\b/i,
  /\bmainnet[- ]ready\b/i,
  /\bguaranteed reliability\b/i,
  /\breliable in production\b/i,
  /\bmainnet settlement\b/i
];

function isNegatedMainnetLimitation(line) {
  const l = line.toLowerCase();
  return (
    l.includes("no mainnet settlement") ||
    l.includes("no mainnet claim") ||
    l.includes("does not claim mainnet") ||
    l.includes("not claim mainnet")
  );
}

let claimIssues = [];
for (const file of claimFiles) {
  const lines = read(file).split(/\r?\n/);
  for (const line of lines) {
    for (const rx of forbiddenClaimRegexes) {
      if (rx.test(line) && !isNegatedMainnetLimitation(line)) {
        claimIssues.push(`${file}: ${line.trim()}`);
      }
    }
  }
}

if (claimIssues.length === 0) {
  pass("No mainnet / production reliability overclaim", "No positive mainnet or production reliability claims found in submission-facing files. Negated limitation statements are allowed.");
} else {
  fail("No mainnet / production reliability overclaim", claimIssues.join("; "));
}

// 5. Required honest limitation phrases must exist publicly
const publicText = [
  read("README.md"),
  read("SUBMISSION.md"),
  read("TEST-EVIDENCE.md"),
  read("docs/index.html")
].join("\n").toLowerCase();

const requiredPhrases = [
  "testnet only",
  "no mainnet claim",
  "no browser-based live payment",
  "seller-side receipt is sanitized",
  "no production reliability claim"
];

let missingRequired = requiredPhrases.filter(p => !publicText.includes(p));

if (missingRequired.length === 0) {
  pass("Honest limitation visibility", "Required limitation phrases are present in public-facing docs/page.");
} else {
  fail("Honest limitation visibility", `Missing public limitation phrases: ${missingRequired.join(", ")}`);
}

// Write report
fs.mkdirSync("evidence", { recursive: true });

const md = [
  "# Evidence Boundary Check — CitePay Agent",
  "",
  `Status: ${failures.length === 0 ? "PASS" : "FAIL"}`,
  "",
  "This check enforces the evidence boundaries of the submission. It does not run a new payment.",
  "",
  "## Checks",
  "",
  ...checks.map(c => `- ${c.status}: ${c.name} — ${c.detail}`),
  "",
  "## Evidence boundaries enforced",
  "",
  "- LIVE means Arc Testnet LIVE_GATEWAY settlement.",
  "- Browser page is proof-viewer only, not a live payment trigger.",
  "- Seller-side receipt is sanitized and does not claim measured balance delta.",
  "- No mainnet settlement claim.",
  "- No production reliability claim.",
  ""
].join("\n");

fs.writeFileSync("evidence/EVIDENCE-BOUNDARY-CHECK.md", md);

console.log(md);

if (failures.length > 0) {
  process.exit(1);
}
