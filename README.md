# FractionalEstate — Real Estate Tokenization Platform

[![Arbitrum](https://img.shields.io/badge/Arbitrum-Sepolia-12AAFF?style=for-the-badge)](https://arbitrum.io)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=for-the-badge)](https://soliditylang.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge)](https://nextjs.org)
[![IPFS](https://img.shields.io/badge/IPFS-Pinata-65C2CB?style=for-the-badge)](https://pinata.cloud)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge)](https://supabase.com)

> Business Applications of Blockchain  

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER (Browser + MetaMask)                │
└─────────────────┬──────────────────────┬────────────────────┘
                  │                      │
                  ▼                      ▼
┌─────────────────────────┐   ┌──────────────────────────────┐
│   Next.js Frontend      │   │      Arbitrum L2 (wagmi)     │
│   (React + wagmi)       │   │  • Purchase shares           │
└───────────┬─────────────┘   │  • Claim dividends           │
            │                 │  • Cast governance votes     │
            ▼                 └──────────────────────────────┘
┌─────────────────────────┐
│       Supabase          │ ──────────┐
│  • User profiles        │           │
│  • Property cache       │           ▼
│  • Search & filter      │   ┌──────────────────────────────┐
└─────────────────────────┘   │      Pinata (IPFS)           │
                              │  • Property images           │
                              │  • NFT metadata JSON         │
                              │  • Legal documents           │
                              └──────────────────────────────┘
```

| Layer | Technology | What It Stores |
|-------|------------|----------------|
| **On-Chain** | Arbitrum (EVM) | Token ownership, share balances, dividends, governance votes |
| **Decentralized Storage** | IPFS via Pinata | Property images, NFT metadata JSON, legal documents |
| **Relational Database** | Supabase (PostgreSQL) | User profiles, property cache, search/filter, KYC status |

---

## Prerequisites

Install these before starting. All steps in this guide use **VS Code and its built-in terminal**.

| Software | Download | How to Verify (in VS Code terminal) |
|----------|----------|-------------------------------------|
| **VS Code** | [code.visualstudio.com](https://code.visualstudio.com) | Open the app |
| **Node.js v18+** | [nodejs.org](https://nodejs.org) — download the **LTS** version | `node -v` → should show v18.x.x or higher |
| **Git** | [git-scm.com](https://git-scm.com) | `git --version` → should show a version number |
| **MetaMask** | [metamask.io](https://metamask.io) — browser extension | Icon appears in your browser toolbar |

> **How to open the VS Code terminal:** Launch VS Code → menu bar → **View > Terminal** (or press `Ctrl+`` ` on Windows/Linux, `Cmd+`` ` on macOS). All commands in this guide are run here.

---

## Step 1: Get the Project Files

Open VS Code and open the terminal (**View > Terminal**).

Navigate to your workspace folder:

```bash
# Mac / Linux:
cd ~/Documents/MIS2300

# Windows:
cd C:\Users\YourName\Documents\MIS2300
```

> If the folder does not exist, create it first: `mkdir ~/Documents/MIS2300` (Mac/Linux) or `mkdir C:\Users\YourName\Documents\MIS2300` (Windows). Replace `YourName` with your actual username.

Clone the repository:

```bash
git clone https://github.com/dtreku/fractionalestate-arbitrum.git
```

**What you should see:**
```
Cloning into 'fractionalestate-arbitrum'...
remote: Enumerating objects: 61, done.
Receiving objects: 100% (61/61), done.
```

Now open the project in VS Code:

1. Click **File > Open Folder** (Mac: **File > Open**)
2. Navigate to the `fractionalestate-arbitrum` folder you just cloned
3. Select it and click **Open**

**What you should see in the Explorer panel (left sidebar):**
- `blockchain/` — Smart contracts, Hardhat config, deploy scripts, tests
- `frontend/` — Next.js app, React components, Pinata and Supabase integration
- `database/` — Supabase SQL scripts
- `docs/` — Documentation folder

---

## Step 2: Install Dependencies

Open the VS Code terminal (**View > Terminal**) and run:

```bash
# Install blockchain dependencies
cd blockchain
npm install
```

**What you should see:** A list of added packages. No lines starting with `ERR!`. Warnings (lines starting with `WARN`) are normal — ignore them.

```bash
# Install frontend dependencies
cd ../frontend
npm install
```

**What you should see:** Same as above — added packages, no errors.

> **If npm install fails:**
> 1. Delete the failed install: `rm -rf node_modules package-lock.json` (Mac/Linux) or `rmdir /s /q node_modules & del package-lock.json` (Windows)
> 2. Try again: `npm install`
> 3. If you still see errors about peer dependencies: `npm install --legacy-peer-deps`

---

## Step 3: Create Your Free Accounts

You need five free accounts. Open each link in your browser, sign up, and save the credentials.

### 3.1 Tenderly (Development Blockchain — Free, No Gas Costs)

1. Go to [dashboard.tenderly.co](https://dashboard.tenderly.co) and sign up (use GitHub or email)
2. After login, click **"+ New Project"** in the top-left → Name: `FractionalEstate` → **Create**
3. In the left sidebar, click **Virtual TestNets**
4. Click **"Create Virtual TestNet"**
5. **Network to fork:** Select **Arbitrum Sepolia** from the dropdown
6. **Name:** `FractionalEstate-Dev`
7. Click **Create**
8. On the next screen, you will see an **RPC URL** — it looks like: `https://virtual.arbitrum-sepolia.rpc.tenderly.co/abc123...`
9. **Copy this URL and save it** — you will need it in Step 4

> **What is Tenderly?** It creates a free copy of the Arbitrum blockchain on their servers. You can deploy and test contracts without spending any real or testnet ETH. Think of it as a free practice environment.

### 3.2 Pinata (IPFS — Decentralized Image and Document Storage)

1. Go to [app.pinata.cloud](https://app.pinata.cloud) and sign up (email or Google)
2. After login, click **API Keys** in the left sidebar
3. Click **"+ New Key"**
4. Key name: `FractionalEstate`
5. Under Permissions, enable: **pinFileToIPFS**, **pinJSONToIPFS**, **unpin**
6. Click **Create Key**
7. A popup appears showing your **API Key** and **API Secret**
8. **COPY BOTH IMMEDIATELY and save them** — the Secret is shown only once. If you close this popup without copying, you must delete the key and create a new one.

> **What is Pinata/IPFS?** IPFS is a decentralized file storage network. Pinata is a service that stores your files on IPFS and keeps them available. You will upload property images and metadata JSON files here. Each file gets a unique content hash (CID) that never changes.

### 3.3 Supabase (PostgreSQL Database)

1. Go to [supabase.com](https://supabase.com) and sign up (use GitHub)
2. Click **"New Project"**
3. Project name: `fractionalestate`
4. Set a database password (save this password)
5. Region: **US East** (closest to WPI)
6. Click **"Create new project"** → wait about 60 seconds for setup

**Set up the database tables:**

7. In the left sidebar, click **SQL Editor**
8. Click **"+ New query"**
9. In VS Code, open the file `database/schema.sql` → select all text (`Ctrl+A` / `Cmd+A`) → copy (`Ctrl+C` / `Cmd+C`)
10. Go back to the Supabase SQL Editor → paste (`Ctrl+V` / `Cmd+V`) into the query box
11. Click **"Run"** (or press `Ctrl+Enter` / `Cmd+Enter`)
12. You should see: **"Success. No rows returned"** — this is correct for CREATE TABLE statements
13. Click **"+ New query"** again → repeat steps 9-12 for `database/policies.sql`
14. Click **"+ New query"** again → repeat for `database/seed.sql` → this one shows **"Seed data inserted"**

**Get your Supabase credentials:**

15. In the left sidebar, click the **gear icon** (Settings) at the bottom
16. Click **API** in the settings menu
17. Under **Project URL**: Copy the URL (format: `https://abcdefg.supabase.co`)
18. Under **Project API keys** → **anon (public)**: Copy this key (it starts with `eyJ...`)
19. **Save both values** — you will need them in Step 4

### 3.4 WalletConnect

1. Go to [cloud.walletconnect.com](https://cloud.walletconnect.com) and sign up
2. Click **"Create"** (new project)
3. Name: `FractionalEstate`
4. Copy the **Project ID** and save it

### 3.5 Arbiscan (Contract Verification)

1. Go to [arbiscan.io/register](https://arbiscan.io/register) and create an account
2. Verify your email
3. After login, go to the left sidebar → **API Keys** → **Add**
4. App name: `FractionalEstate` → Create
5. Copy the **API Key Token** and save it

---

## Step 4: Configure Environment Files

You need to create two files that tell the application where to find your services. These files contain your private keys, so they are **never committed to Git** (they are already listed in `.gitignore`).

### 4.1 Create blockchain/.env

In the VS Code terminal:

```bash
# Mac / Linux:
cp blockchain/.env.example blockchain/.env

# Windows:
copy blockchain\.env.example blockchain\.env
```

Now open `blockchain/.env` in VS Code (click on it in the Explorer panel) and replace each placeholder with your real values:

```env
TENDERLY_RPC_URL=https://virtual.arbitrum-sepolia.rpc.tenderly.co/YOUR_ACTUAL_ID
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
PRIVATE_KEY=your_actual_64_character_private_key
ARBISCAN_API_KEY=your_actual_arbiscan_api_key
```

**Where to get PRIVATE_KEY from MetaMask:**

1. Open MetaMask in your browser
2. Click the **three-dot menu (⋮)** next to your account name
3. Click **"Account details"**
4. Click **"Show private key"**
5. Enter your MetaMask password
6. Copy the 64-character hex string
7. Paste it as the PRIVATE_KEY value — **without** the `0x` prefix

> ⚠️ **Never share your private key with anyone.** Never commit it to GitHub. The `.env` file is already in `.gitignore` so it will not be uploaded.

### 4.2 Create frontend/.env.local

In the VS Code terminal:

```bash
# Mac / Linux:
cp frontend/.env.example frontend/.env.local

# Windows:
copy frontend\.env.example frontend\.env.local
```

Open `frontend/.env.local` in VS Code and fill in your values:

```env
# Network
NEXT_PUBLIC_CHAIN_ID=421614

# Contract Addresses — leave as 0x... for now, you will fill these in after Step 5
NEXT_PUBLIC_INVESTOR_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_FRACTIONALESTATE_ADDRESS=0x...
NEXT_PUBLIC_PROPERTY_GOVERNANCE_ADDRESS=0x...

# Pinata (from Step 3.2)
PINATA_API_KEY=your_actual_pinata_api_key
PINATA_SECRET_KEY=your_actual_pinata_secret_key
NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/

# Supabase (from Step 3.3)
NEXT_PUBLIC_SUPABASE_URL=https://abcdefg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# WalletConnect (from Step 3.4)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_actual_project_id
```

> ⚠️ **Important:** The three `NEXT_PUBLIC_..._ADDRESS` lines will remain as `0x...` until you deploy the contracts in Step 5. You will come back and fill them in.

---

## Step 5: Compile, Test, and Deploy Smart Contracts

All commands run in the VS Code terminal.

### 5.1 Compile

```bash
cd blockchain
npx hardhat compile
```

**What you should see:**
```
Compiled 3 Solidity files successfully
```

> **If this fails** with "Source not found" for OpenZeppelin: run `npm install @openzeppelin/contracts@latest` then try again.

### 5.2 Run Tests

```bash
npx hardhat test
```

**What you should see:**
```
  FractionalEstate
    Property Listing
      ✓ Should list a new property
      ✓ Should reject listing from non-manager
    Share Purchase
      ✓ Should allow verified investor to purchase shares
      ✓ Should reject unverified investor
    Dividends
      ✓ Should declare and claim dividend
    Governance
      ✓ Should create proposal and vote

  6 passing
```

### 5.3 Deploy to Tenderly (Free — No Gas Needed)

```bash
npx hardhat run scripts/deploy.ts --network tenderly
```

**What you should see:**
```
════════════════════════════════════════
FractionalEstate Deployment
════════════════════════════════════════
Network: tenderly

1. Deploying InvestorRegistry...
   ✓ InvestorRegistry: 0xAbCd...1234
2. Deploying FractionalEstate...
   ✓ FractionalEstate: 0xEfGh...5678
3. Deploying PropertyGovernance...
   ✓ PropertyGovernance: 0xiJkL...9012

📋 Copy to frontend/.env.local:
NEXT_PUBLIC_INVESTOR_REGISTRY_ADDRESS=0xAbCd...1234
NEXT_PUBLIC_FRACTIONALESTATE_ADDRESS=0xEfGh...5678
NEXT_PUBLIC_PROPERTY_GOVERNANCE_ADDRESS=0xiJkL...9012
```

### 5.4 ⚠️ IMPORTANT: Update frontend/.env.local with Contract Addresses

1. Open `frontend/.env.local` in VS Code
2. Replace the three `0x...` placeholder lines with the actual addresses from the deploy output
3. Save the file

> **If deploy fails with "could not detect network":** Your `TENDERLY_RPC_URL` in `blockchain/.env` is wrong or empty. Go back to Tenderly dashboard → Virtual TestNets → click your TestNet → copy the RPC URL again.

> **If deploy fails with "invalid value for private key":** Open `blockchain/.env` and check that `PRIVATE_KEY` is exactly 64 hex characters (0-9, a-f) with no `0x` prefix and no trailing spaces.

### 5.5 Deploy to Arbitrum Sepolia (Production — For Final Submission)

You need Arbitrum Sepolia testnet ETH for this step (about 0.01 ETH total):

1. Go to [faucet.quicknode.com/arbitrum/sepolia](https://faucet.quicknode.com/arbitrum/sepolia)
2. Enter your MetaMask wallet address and request ETH
3. If QuickNode is unavailable, use [alchemy.com/faucets/arbitrum-sepolia](https://www.alchemy.com/faucets/arbitrum-sepolia)
4. Wait 30 seconds for ETH to arrive in your wallet

Then deploy:

```bash
npx hardhat run scripts/deploy.ts --network arbitrumSepolia
```

### 5.6 Verify Contracts on Arbiscan

After deploying to Arbitrum Sepolia, the terminal prints verification commands. Run each one, waiting 30 seconds between them:

```bash
npx hardhat verify --network arbitrumSepolia INVESTOR_REGISTRY_ADDRESS
npx hardhat verify --network arbitrumSepolia FRACTIONALESTATE_ADDRESS "TREASURY_ADDRESS" "INVESTOR_REGISTRY_ADDRESS"
npx hardhat verify --network arbitrumSepolia GOVERNANCE_ADDRESS "FRACTIONALESTATE_ADDRESS"
```

To confirm verification worked, open: `https://sepolia.arbiscan.io/address/YOUR_CONTRACT_ADDRESS#code` — you should see a green checkmark next to "Contract Source Code Verified".

---

## Step 6: Add Arbitrum Sepolia to MetaMask

1. Open MetaMask in your browser
2. Click the network dropdown at the top (it probably says "Ethereum Mainnet")
3. Click **"Add network"** → **"Add a network manually"**
4. Fill in these values:

| Field | Value |
|-------|-------|
| Network Name | `Arbitrum Sepolia` |
| New RPC URL | `https://sepolia-rollup.arbitrum.io/rpc` |
| Chain ID | `421614` |
| Currency Symbol | `ETH` |
| Block Explorer URL | `https://sepolia.arbiscan.io` |

5. Click **"Save"**
6. MetaMask will switch to Arbitrum Sepolia

### Get Testnet ETH

- [QuickNode Faucet](https://faucet.quicknode.com/arbitrum/sepolia)
- [Alchemy Faucet](https://www.alchemy.com/faucets/arbitrum-sepolia)

---

## Step 7: Run the Application

In the VS Code terminal:

```bash
cd frontend
npm run dev
```

**What you should see in the terminal:**
```
  ▶ Next.js 14.x.x
  - Local:    http://localhost:3000
  - Ready in Xs
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**What you should see on each page:**

| Page | URL | What Should Appear |
|------|-----|--------------------|
| **Landing** | `/` | Blue gradient hero: "Invest in Real Estate Starting at $100". Three feature cards. "Connect Wallet" button top-right. |
| **Properties** | `/properties` | Three property cards from seed data (Downtown Boston Retail, Cambridge Tech Office, Beacon Hill Apartments). If this page is empty, Supabase is not connected — check your `.env.local` values. |
| **Dashboard** | `/dashboard` | "Connect Your Wallet" message (before connecting). After connecting MetaMask: four stat boxes showing zeros. |
| **Governance** | `/governance` | "No Active Proposals" with a vote icon. |

> **If the Properties page is empty:**
> 1. Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `frontend/.env.local`
> 2. Make sure you ran `database/seed.sql` in the Supabase SQL Editor (Step 3.3)
> 3. **Restart the dev server:** press `Ctrl+C` in the terminal to stop it, then run `npm run dev` again. Environment variable changes require a restart.

> **If port 3000 is already in use:** Run on a different port: `npx next dev -p 3001` and open http://localhost:3001 instead.

---

## Step 8: Deploy Frontend to Vercel (For Final Submission)

1. Push your code to GitHub (your team's fork or new repo)
2. Go to [vercel.com](https://vercel.com) → sign up with GitHub
3. Click **"Add New..."** → **"Project"**
4. Find your repository in the list → click **"Import"**
5. **Root Directory:** Click **"Edit"** → type `frontend` → click **"Continue"**
6. Expand **"Environment Variables"** and add every variable from your `frontend/.env.local` file (all 11 variables)
7. Click **"Deploy"** → wait 1-2 minutes
8. You will see a URL like `fractionalestate.vercel.app` — this is your live application

> ⚠️ Setting the Root Directory to `frontend` is critical. Without it, Vercel tries to build from the repo root and fails.

---

## Project Structure

```
fractionalestate-arbitrum/
├── blockchain/                    # Smart contracts (Hardhat)
│   ├── contracts/
│   │   ├── InvestorRegistry.sol   # KYC/AML verification
│   │   ├── FractionalEstate.sol   # ERC-1155 property tokens
│   │   └── PropertyGovernance.sol # Token-weighted voting
│   ├── scripts/deploy.ts         # Deployment script
│   ├── test/                     # Unit tests
│   ├── hardhat.config.ts         # Network configuration
│   ├── .env.example              # Environment template
│   └── package.json
│
├── frontend/                      # Next.js application
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── properties/page.tsx   # Property listing
│   │   ├── dashboard/page.tsx    # User portfolio
│   │   ├── governance/page.tsx   # Voting interface
│   │   └── api/pinata/route.ts   # IPFS upload API
│   ├── lib/
│   │   ├── supabase.ts           # Database client + helpers
│   │   ├── pinata.ts             # IPFS upload utilities
│   │   ├── contracts.ts          # Contract addresses + config
│   │   ├── utils.ts              # Formatting helpers
│   │   └── abis/                 # Contract ABIs (JSON)
│   ├── .env.example              # Environment template
│   └── package.json
│
├── database/                      # Supabase SQL
│   ├── schema.sql                # Table definitions (7 tables)
│   ├── policies.sql              # Row Level Security
│   └── seed.sql                  # Sample property data
│
├── docs/diagrams/                 # Your sequence diagrams go here
├── .gitignore
├── LICENSE
└── README.md                      # This file
```

---

## Smart Contracts

| Contract | Purpose |
|----------|---------|
| `InvestorRegistry.sol` | KYC/AML verification, accredited investor tracking, verification expiry |
| `FractionalEstate.sol` | ERC-1155 tokens for fractional ownership, property listing with IPFS metadata, share purchases with 2.5% platform fee, dividend declaration and claims |
| `PropertyGovernance.sol` | Proposal creation, token-weighted voting, 25% quorum, 51% approval threshold, 2-day timelock |

---

## Grading Rubric (100 Points)

| Category | Description | Points |
|----------|-------------|--------|
| Contract Deployment | Arbitrum Sepolia deployment, verified on Arbiscan | 20 |
| Functionality & Testing | All functions work, tests pass, security measures | 20 |
| IPFS + Database Integration | Pinata uploads working, Supabase CRUD, data sync | 20 |
| Code Quality | Clean code, comments, best practices | 10 |
| Documentation | Report, sequence diagrams (min 4), business case | 10 |
| Presentation | 12-min presentation, all members present, max 10 slides | 20 |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `npm install` fails with ERESOLVE | `npm install --legacy-peer-deps` |
| `npm install` gives EPERM (Windows) | Run VS Code as Administrator. Add project folder to antivirus exclusions. |
| `npx hardhat compile` — OpenZeppelin not found | `npm install @openzeppelin/contracts@latest` then `npx hardhat clean` and compile again |
| Deploy fails: "insufficient funds" | For Tenderly: check `TENDERLY_RPC_URL`. For Arbitrum Sepolia: get ETH from a faucet. |
| Deploy fails: "invalid private key" | Must be 64 hex characters, no `0x` prefix, no trailing spaces in `.env` |
| MetaMask won't connect | Make sure you are on Arbitrum Sepolia network (Chain ID: 421614) |
| Frontend: env vars undefined | File must be `.env.local` (not `.env`). Public vars must start with `NEXT_PUBLIC_`. Restart dev server after changes. |
| Properties page empty | 1) Check Supabase URL/key in `.env.local`. 2) Verify `seed.sql` was run. 3) Restart dev server. |
| Pinata upload fails (401) | API key needs `pinFileToIPFS` permission. Regenerate if secret was lost. |
| IPFS images not loading | Check `NEXT_PUBLIC_PINATA_GATEWAY` is set and ends with `/` |
| Arbiscan verify fails | Wait 60 seconds after deploy. Constructor args must match exactly. |
| Port 3000 in use | `npx next dev -p 3001` |

---

## Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Arbitrum Documentation](https://docs.arbitrum.io)
- [Pinata Documentation](https://docs.pinata.cloud)
- [Supabase Documentation](https://supabase.com/docs)
- [wagmi React Hooks](https://wagmi.sh)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [ERC-1155 Metadata Standard](https://eips.ethereum.org/EIPS/eip-1155#metadata)

---

## Contact

**Professor Daniel Treku**
WPI Business School


---

*Business Applications of Blockchain Technology*
