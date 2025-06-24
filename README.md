
# 🎰 SLNGUNBOX - NFT Lootbox Platform

An interactive lootbox/unbox web application built with Next.js, Tailwind CSS and Thirdweb for Web3 integration.

## ✨ Features

- 🎲 **Interactive Lootbox Carousel**: Horizontal carousel with weighted item selection
- 🎖️ **NFT Boost System**: Different NFT rarities (Uncommon, Epic, Legendary) with unique boosts
- 🎯 **Weighted Chances**: Fair RNG with visible drop rates
- 💰 **$SLANG Token System**: Earn and manage your tokens
- 🔗 **Web3 Integration**: Wallet connection via Thirdweb
- 📱 **Responsive Design**: Works perfectly on all devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- NPM or Yarn
- Thirdweb account (for wallet connection)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd slngunbox
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Thirdweb Client ID:
   ```env
   NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id_here
   ```

4. **Get Thirdweb Client ID**
   - Go to [Thirdweb Portal](https://portal.thirdweb.com/)
   - Create an account and new project
   - Copy your Client ID
   - Add it to your `.env.local` file

5. **Start development server**
   ```bash
   npm run dev
   ```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file:

**Required:**
```env
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id_here
```

**Optional (legacy support):**
```env
NEXT_PUBLIC_TEMPLATE_CLIENT_ID=your_thirdweb_client_id_here
```

To learn how to create a client ID, refer to the [client documentation](https://portal.thirdweb.com/typescript/v5/client).

## 🎮 NFT Boost System

### NFT Rarities & Boosts:

| NFT Rarity | Drop Boost | Rarity Boost | Color |
|------------|------------|--------------|-------|
| **Uncommon** 🔵 | +25% | +15% | Blue |
| **Epic** 🟣 | +50% | +35% | Purple |
| **Legendary** 🟡 | +100% | +60% | Gold |

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub** and make sure to set environment variables in Vercel
2. **Environment Variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_THIRDWEB_CLIENT_ID`
   - Deploy!

## 🐛 Troubleshooting

### Build Errors Fixed

**✅ "No client ID provided" - FIXED**
- Environment variable fallback added
- Graceful degradation during build process
- Placeholder client ID for development

## Run locally

Install dependencies

```bash
yarn
```

Start development server

```bash
yarn dev
```

## Resources

- [Documentation](https://portal.thirdweb.com/typescript/v5)
- [Templates](https://thirdweb.com/templates)

## Need help?

For help or feedback, please [visit our support site](https://thirdweb.com/support)

---

**🎮 Happy Gaming! Enjoy your lootbox adventures!** 🎲✨
