# DFS-AI Setup Guide

## Stripe Integration

1. **Create Stripe Account**
   - Go to https://dashboard.stripe.com
   - Sign up (free)

2. **Get API Keys**
   - Developers → API keys
   - Copy **Secret Key** (starts with `sk_...`)
   - Add to `.env.local`: `STRIPE_SECRET_KEY=sk_...`

3. **Create Product**
   - Products → Create product
   - Name: "DFS-AI Full Bot"
   - Price: $29/month (recurring)
   - Copy the **price ID** (starts with `price_...`)

4. **Add Webhook** (for production)
   - Webhooks → Add endpoint
   - URL: `https://dfs-ai.vercel.app/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.deleted`

---

## Email Service (Beehiiv)

1. Create account at https://beehiiv.com
2. Get API key from Settings → API
3. Add to `.env.local`: `BEEHIIV_API_KEY=...`
4. Get publication ID and add: `BEEHIIV_PUBLICATION_ID=...`

---

## NFL Data APIs

### Primary: balldontlie.io
- Free tier: 1,000 API calls/day
- Sign up at https://balldontlie.io
- Get API key: `BALLDONTLIE_API_KEY=...`
- Provides: player stats, injuries, team data

### Secondary: ESPN API (free, undocumented)
- No auth needed
- Endpoint examples:
  - Injuries: `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/teams/{id}/injuries`
  - Stats: `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/{id}`

---

## Required Environment Variables

Create a `.env.local` file:

```bash
# Stripe (get from dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_...

# Beehiiv (get from beehiiv.com)
BEEHIIV_API_KEY=...
BEEHIIV_PUBLICATION_ID=...

# NFL Data
BALLDONTLIE_API_KEY=...

# App URL
NEXT_PUBLIC_URL=https://dfs-ai.vercel.app
```

---

## Deployment

```bash
cd /root/.openclaw/workspace/dfs-ai/web
git add .
git commit -m "add stripe setup + api routes"
git push origin main
```