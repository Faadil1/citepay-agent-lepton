#!/usr/bin/env node
// demo-backend.mjs — LOCAL_DEMO_BACKEND for CitePay Agent
//
// Binds 127.0.0.1 only. Spawns the UNMODIFIED agent-v3.mjs as a child
// process, each run isolated in its own runtime/run-<timestamp>/ directory
// (agent-v3.mjs writes evidence-log-v3.json relative to its cwd, so this
// isolation happens automatically without touching agent-v3.mjs at all).
// Frozen evidence/*.json files are never read or written by this backend.
// Responses are an explicit allowlist — no raw SDK objects, no secrets.

import http from 'node:http';
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, existsSync, copyFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = __dirname;
const AGENT_SCRIPT = path.join(REPO_ROOT, 'agent-v3.mjs');
const RUNTIME_DIR = path.join(REPO_ROOT, 'runtime');
const PORT = Number(process.env.DEMO_BACKEND_PORT) || 8787;
const RUN_TIMEOUT_MS = 45_000;

mkdirSync(RUNTIME_DIR, { recursive: true });

let busy = false;

function allowlist(evidence) {
  const selectedEvent = evidence.events?.find(e => e.event === 'source_selected');
  const rejectedEvent = evidence.events?.find(e => e.event === 'source_rejected');
  return {
    status: 'SUCCESS',
    payment_mode: evidence.payment_mode ?? null,
    network: evidence.network ?? null,
    query: evidence.query ?? null,
    relevance_method: evidence.relevance_method ?? null,
    selected_source_id: evidence.selected_source_id ?? null,
    selected: selectedEvent?.selected ?? null,
    rejected: rejectedEvent?.rejected ?? [],
    tx_ref: evidence.payment_evidence?.transaction ?? null,
    amount: evidence.payment_evidence?.amount ?? null,
    http_status: 200,
    final_citation: evidence.final_answer?.citations ?? [],
    final_answer_text: evidence.final_answer?.text ?? null,
  };
}

function runDemoOnce() {
  return new Promise((resolve) => {
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const runDir = path.join(RUNTIME_DIR, `run-${ts}`);
    mkdirSync(runDir, { recursive: true });

    const child = spawn('node', [`--env-file=${path.join(REPO_ROOT, '.env.local')}`, AGENT_SCRIPT], {
      cwd: runDir,        // isolates evidence-log-v3.json inside runDir only
      env: process.env,   // inherits existing .env.local vars, never printed/logged here
      timeout: RUN_TIMEOUT_MS,
    });

    let stderr = '';
    child.stderr.on('data', d => { stderr += d.toString(); });
    // stdout intentionally not forwarded to the HTTP response — only the
    // structured evidence file (via allowlist()) is ever returned.

    child.on('close', (code) => {
      const outPath = path.join(runDir, 'evidence-log-v3.json');
      if (code !== 0 || !existsSync(outPath)) {
        resolve({
          status: 'FAILED',
          reason: code === null ? 'timeout' : 'agent_exit_nonzero',
          exit_code: code,
          stderr_excerpt: stderr.slice(-500),
        });
        return;
      }
      try {
        const evidence = JSON.parse(readFileSync(outPath, 'utf-8'));
        copyFileSync(outPath, path.join(RUNTIME_DIR, `live-demo-run-${ts}.json`));
        copyFileSync(outPath, path.join(RUNTIME_DIR, 'live-demo-latest.json'));
        resolve(allowlist(evidence));
      } catch {
        resolve({ status: 'FAILED', reason: 'evidence_parse_error' });
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin || '';
  const isLocalOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  res.setHeader('Access-Control-Allow-Origin', isLocalOrigin ? origin : 'null');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  if (req.url === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'LOCAL_DEMO_BACKEND', busy }));
    return;
  }

  if (req.url === '/api/run-demo' && req.method === 'POST') {
    if (busy) {
      res.writeHead(409, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'BUSY', reason: 'a demo run is already in progress' }));
      return;
    }
    busy = true;
    try {
      const result = await runDemoOnce();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } finally {
      busy = false;
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'NOT_FOUND' }));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`LOCAL_DEMO_BACKEND listening on http://127.0.0.1:${PORT} (127.0.0.1 only)`);
});
