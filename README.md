# Solana Keygen Web

<div align="center">

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvvs-jkr%2Fsolana-keygen-web)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Rust](https://img.shields.io/badge/Rust-000000?logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![React](https://img.shields.io/badge/React_19-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)

**Browser-based Solana vanity address generator powered by Rust/WebAssembly**

All cryptography runs client-side — private keys never leave your browser.

</div>

---

## What it does

Generate a Solana keypair whose address starts or ends with any string you choose. The brute-force search runs inside a Web Worker so the UI stays responsive throughout.

| Prefix length | Expected attempts | ~Time in browser |
|:---:|---:|---:|
| 2 chars | ~3 300 | instant |
| 3 chars | ~195 000 | < 1 sec |
| 4 chars | ~11 300 000 | ~10 sec |
| 5 chars | ~656 000 000 | ~10 min |

## Why WASM?

Keypair search is pure CPU brute-force. Rust + WebAssembly gives a real speed advantage over JavaScript for this workload, while battle-tested crates (`ed25519-dalek`, `bs58`) handle the cryptography correctly.

## Tech stack

| Layer | Tools |
|---|---|
| UI | React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Feature-Sliced Design |
| Build | Vite, vite-plugin-wasm, vite-plugin-top-level-await |
| Crypto | Rust, wasm-pack, ed25519-dalek, bs58, rand |
| Workers | Web Workers API |
| Testing | Jest, ts-jest, @testing-library/react |
| Quality | ESLint, Prettier, Knip, Husky |
| Deploy | Vercel |

## Getting started

```bash
git clone https://github.com/vvs-jkr/solana-keygen-web.git
cd solana-keygen-web
yarn install
yarn dev          # http://localhost:3003
```

**Requirements:** Node.js 18+, Yarn 4

## Commands

```bash
yarn dev          # Dev server on port 3003
yarn build        # Type-check → Vite production build → dist/
yarn preview      # Preview the production build locally
yarn test         # Jest (ts-jest, jsdom)
yarn check        # lint + knip + test (runs automatically on pre-commit)
yarn typecheck    # tsc --noEmit
yarn lint         # ESLint flat config
yarn lint:fix     # ESLint auto-fix
yarn knip         # Dead code detection
yarn format       # Prettier
```

## Security

- Keypairs are generated with `ed25519-dalek` — a well-audited Rust crate
- The secret key is masked by default; reveal only when needed
- Zero network requests during key generation — works fully offline after initial load
- No telemetry, no analytics, no third-party scripts

## Rebuilding WASM from source

Pre-built artifacts are committed to `wasm/pkg/`. To recompile after modifying Rust code:

```bash
# Requires: rustup, wasm-pack
cd wasm
wasm-pack build --target bundler --release
```

## Project structure

```
├── wasm/                   Rust source + pre-built pkg/
│   └── src/
│       ├── lib.rs          WASM entry point
│       ├── vanity.rs       Keypair search (find_vanity_batch, validate_vanity_input, estimate_attempts)
│       └── data.rs         CSV parsing (legacy)
├── src/
│   ├── components/ui/      shadcn/ui components (auto-generated)
│   ├── features/
│   │   └── vanity-search/  Search hook + Form + Result UI
│   ├── entities/
│   │   └── solana-keypair/ TS types for keypair and search state
│   ├── shared/
│   │   ├── api/            wasm-loader, workerFactory
│   │   ├── lib/            useTheme
│   │   └── types/          WorkerRequest, WorkerMessage
│   └── worker.ts           Web Worker entry point
└── test/                   Unit tests
```

## License

MIT
